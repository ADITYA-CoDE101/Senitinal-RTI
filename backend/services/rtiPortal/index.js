/**
 * index.js  —  RTI Portal Orchestrator (rtionline.gov.in)
 *
 * Real flow:
 *  1. Navigate home → accept guidelines
 *  2. Fill email + phone → user solves CAPTCHA
 *  3. User enters OTP
 *  4. Auto-fill RTI form
 *  5. Submit → capture payment URL
 *
 * No login/password credentials required — portal uses email+phone+OTP.
 */

const Complaint       = require('../../models/Complaint');
const { getMinistry } = require('./ministryMapper');
const adapter         = require('./rtionlineAdapter');

// Active browser sessions keyed by complaintId
const activeSessions = new Map();

// ── MAIN SUBMIT FUNCTION ──────────────────────────────────────────────────────

/**
 * @param {Object}  opts
 * @param {Object}  opts.complaint      Mongoose complaint document
 * @param {Object}  opts.user           User document (name, email)
 * @param {string}  [opts.ministry]     Override ministry name
 * @param {Object}  opts.applicantInfo  { phone, address, pincode, state, gender, isBPL }
 *
 * @returns {{ success: boolean, paymentUrl?: string, errorMessage?: string }}
 */
async function submitToRTIPortal({ complaint, user, ministry, applicantInfo }) {
  const complaintId      = complaint._id.toString();
  const selectedMinistry = ministry || getMinistry(complaint.category);
  const rtiText          = complaint.legalDraft || complaint.description || '';

  // Mark as in_progress
  await Complaint.findByIdAndUpdate(complaintId, {
    'rtiPortalSubmission.status':   'in_progress',
    'rtiPortalSubmission.ministry': selectedMinistry,
    'rtiPortalSubmission.portal':   'rtionline.gov.in',
  });

  let browser;
  try {
    console.log(`\n🚀 [RTI] Starting submission for ${complaint.trackingId}`);
    console.log(`   Ministry: ${selectedMinistry}`);
    console.log(`   Email:    ${user.email}`);
    console.log(`   Phone:    ${applicantInfo.phone}`);

    browser = await adapter.launchBrowser();
    const page = await browser.newPage();

    // Real user-agent to reduce bot detection
    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // ── Step 1 & 2: Navigate + accept guidelines ──────────────────────────
    await adapter.acceptGuidelines(page);

    // ── Step 3: Fill email/phone, wait for user to solve CAPTCHA ─────────
    await adapter.fillEmailAndWaitForCaptcha(
      page,
      user.email,
      applicantInfo.phone
    );

    // ── Step 4: Wait for user to enter OTP ───────────────────────────────
    await adapter.waitForOTPVerification(page);

    // ── Step 5: Auto-fill RTI application form ────────────────────────────
    await adapter.fillRTIForm(page, {
      ministry:       selectedMinistry,
      applicantName:  applicantInfo.name || user.name,
      gender:         applicantInfo.gender || 'M',
      address:        applicantInfo.address,
      pincode:        applicantInfo.pincode,
      state:          applicantInfo.state,
      phone:          applicantInfo.phone,
      email:          user.email,
      rtiText,
      isBPL:          applicantInfo.isBPL || false,
      attachmentPath: null, // TODO: pass PDF path if available
    });

    // ── Step 6: Submit → capture payment URL ─────────────────────────────
    const { paymentUrl } = await adapter.submitAndCapturePaymentUrl(page);

    // Store session for later registration number retrieval
    activeSessions.set(complaintId, { browser });

    // Update DB → pending_payment
    await Complaint.findByIdAndUpdate(complaintId, {
      'rtiPortalSubmission.status':      'pending_payment',
      'rtiPortalSubmission.paymentLink': paymentUrl,
      'rtiPortalSubmission.submittedAt': new Date(),
    });

    console.log(`✅ [RTI] ${complaint.trackingId} → pending_payment`);
    return { success: true, paymentUrl };

  } catch (error) {
    console.error(`❌ [RTI] Failed for ${complaint.trackingId}:`, error.message);

    await Complaint.findByIdAndUpdate(complaintId, {
      'rtiPortalSubmission.status':       'failed',
      'rtiPortalSubmission.errorMessage': error.message,
    });

    if (browser) await browser.close().catch(() => {});
    activeSessions.delete(complaintId);

    return { success: false, errorMessage: error.message };
  }
}

// ── CHECK REGISTRATION NUMBER (post-payment) ──────────────────────────────────

async function checkRegistrationNumber(complaintId, regInputHint) {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) return { success: false, errorMessage: 'Complaint not found' };

  // Try to find registration number on the RTI status page
  let browser;
  let ownsNewBrowser = false;
  const session = activeSessions.get(complaintId);

  if (session?.browser) {
    browser = session.browser;
  } else {
    browser = await adapter.launchBrowser();
    ownsNewBrowser = true;
  }

  try {
    const page = await browser.newPage();
    await page.goto('https://rtionline.gov.in/request/status.php', {
      waitUntil: 'networkidle2', timeout: 30_000,
    });

    let regNumber = null;

    if (regInputHint) {
      await page.type('input[name="reg_no"], input[name="registration_no"]', regInputHint)
        .catch(() => {});
      await page.click('input[type="submit"]').catch(() => {});
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15_000 }).catch(() => {});
    }

    // Scan page for RTI registration number pattern
    regNumber = await page.evaluate(() => {
      const text = document.body.innerText;
      const match = text.match(/[A-Z]{2,8}\/[A-Z]\/\d{4}\/\d{5,}/);
      return match ? match[0] : null;
    });

    await page.close();

    if (regNumber) {
      await Complaint.findByIdAndUpdate(complaintId, {
        'rtiPortalSubmission.status':             'submitted',
        'rtiPortalSubmission.registrationNumber': regNumber,
        'rtiPortalSubmission.lastCheckedAt':      new Date(),
        $push: {
          timeline: {
            date:   new Date(),
            event:  `RTI submitted to rtionline.gov.in — Reg: ${regNumber}`,
            status: 'submitted',
          },
        },
      });
    } else {
      await Complaint.findByIdAndUpdate(complaintId, {
        'rtiPortalSubmission.lastCheckedAt': new Date(),
      });
    }

    return { success: true, registrationNumber: regNumber };

  } finally {
    if (ownsNewBrowser) await browser.close().catch(() => {});
  }
}

// ── CLEANUP ───────────────────────────────────────────────────────────────────

async function cleanupAllSessions() {
  for (const [id, session] of activeSessions.entries()) {
    await session.browser?.close().catch(() => {});
    activeSessions.delete(id);
  }
}

module.exports = { submitToRTIPortal, checkRegistrationNumber, cleanupAllSessions };
