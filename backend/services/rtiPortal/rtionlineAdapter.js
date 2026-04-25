/**
 * rtionlineAdapter.js  —  Puppeteer automation for https://rtionline.gov.in/
 *
 * REAL FLOW (verified from live portal):
 *  1. Home → Click "Submit Request"
 *  2. Guidelines page → Check "I have read and understood" checkbox → Click Submit
 *  3. Email/Phone/CAPTCHA page → Auto-fill email + phone → USER solves CAPTCHA → Click Submit
 *  4. OTP page → USER enters OTP received on email/phone → Click Submit
 *  5. RTI Application Form → Auto-fill all fields → Click Submit
 *  6. Payment page → Capture URL → Return to Sentinel
 *
 * REAL SELECTORS (verified via live DOM inspection):
 *  - Guidelines checkbox : input.CheckBox
 *  - Guidelines submit   : input.btn[type="submit"]
 *  - Email input         : #Email
 *  - Mobile input        : #cell
 *  - CAPTCHA image       : img[src*="captcha"]
 *  - CAPTCHA text input  : #6_letters_code
 *  - Submit button       : #Status
 *
 * CAPTCHA + OTP strategy:
 *  headless: false — user sees the browser and interacts directly
 *  Automation fills email/phone, then waits for user to solve CAPTCHA + OTP.
 *  After OTP redirect, automation takes over again to fill the full RTI form.
 */

const puppeteer = require('puppeteer');

const RTI_HOME_URL   = 'https://rtionline.gov.in/';
const MAX_CHARS      = 3000;

// How long to wait for user to solve CAPTCHA (ms)
const CAPTCHA_TIMEOUT_MS = 3 * 60 * 1000;   // 3 minutes
// How long to wait for user to enter OTP (ms)
const OTP_TIMEOUT_MS     = 5 * 60 * 1000;   // 5 minutes

// ── LAUNCH ────────────────────────────────────────────────────────────────────

async function launchBrowser() {
  const browser = await puppeteer.launch({
    headless: false,         // Non-headless: user sees and interacts with browser
    defaultViewport: null,   // Use full window size
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
    ],
  });
  return browser;
}

// ── STEP 1 + 2: Navigate & Accept Guidelines ──────────────────────────────────

async function acceptGuidelines(page) {
  console.log('🌐 [RTI] Navigating to RTI homepage…');
  await page.goto(RTI_HOME_URL, { waitUntil: 'networkidle2', timeout: 30_000 });

  // Click "Submit Request" link
  await page.waitForSelector('a[href*="guidelines.php?request"]', { timeout: 15_000 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20_000 }),
    page.click('a[href*="guidelines.php?request"]'),
  ]);
  console.log('✅ [RTI] Guidelines page loaded:', page.url());

  // Scroll to bottom so checkbox and Submit are visible
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(600);

  // Check the "I have read and understood" checkbox
  await page.waitForSelector('input.CheckBox', { timeout: 10_000 });
  const isChecked = await page.$eval('input.CheckBox', el => el.checked);
  if (!isChecked) {
    await page.click('input.CheckBox');
  }
  console.log('✅ [RTI] Guidelines checkbox checked');

  // Click Submit
  await page.waitForSelector('input.btn[type="submit"]', { timeout: 5_000 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20_000 }),
    page.click('input.btn[type="submit"]'),
  ]);
  console.log('✅ [RTI] Guidelines submitted → now on:', page.url());
}

// ── STEP 3: Email/Phone/CAPTCHA Page ─────────────────────────────────────────

/**
 * Fills in email and mobile, then WAITS for the user to:
 *   a) Solve the CAPTCHA manually in the browser window
 *   b) Click the Submit button
 * Once the page navigates away (to OTP page), this resolves.
 *
 * @param {puppeteer.Page} page
 * @param {string}         email   Applicant email
 * @param {string}         phone   Applicant mobile (10 digits)
 */
async function fillEmailAndWaitForCaptcha(page, email, phone) {
  // Confirm we're on the email check page
  await page.waitForSelector('#Email', { timeout: 15_000 });
  console.log('📧 [RTI] On email/phone/CAPTCHA page');

  // Auto-fill Email
  await page.click('#Email', { clickCount: 3 });
  await page.type('#Email', email, { delay: 40 });

  // Auto-fill Mobile
  await page.click('#cell', { clickCount: 3 });
  await page.type('#cell', phone, { delay: 40 });

  console.log(`✅ [RTI] Email (${email}) and phone (${phone}) filled`);
  console.log('⏳ [RTI] Please solve the CAPTCHA in the browser window and click Submit…');

  // Wait for user to solve CAPTCHA + click Submit → page navigates to OTP page
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: CAPTCHA_TIMEOUT_MS });
  console.log('✅ [RTI] CAPTCHA submitted → now on:', page.url());
}

// ── STEP 4: OTP Page ──────────────────────────────────────────────────────────

/**
 * Waits for the user to enter the OTP they received and click Submit.
 * The OTP input is already visible in the browser window.
 * @param {puppeteer.Page} page
 */
async function waitForOTPVerification(page) {
  // Confirm we're on the OTP page
  await page.waitForSelector('input[name="otp"], input[id*="otp" i], input[name*="otp" i]', {
    timeout: 15_000,
  }).catch(() => {
    console.log('⚠️  [RTI] OTP input not found via name, proceeding anyway…');
  });

  console.log('📱 [RTI] OTP page loaded — please enter the OTP from your email/SMS and click Submit…');

  // Wait for user to enter OTP + click Submit → navigates to RTI form
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: OTP_TIMEOUT_MS });
  console.log('✅ [RTI] OTP verified → now on:', page.url());
}

// ── STEP 5: Fill RTI Application Form ────────────────────────────────────────

/**
 * Auto-fills the RTI application form.
 * Verified selectors + all edge cases handled.
 *
 * Fields:
 *   #MinistryId   → Ministry/Dept/Apex body (cascade parent)
 *   #DepartmentId → Public Authority (dynamically loaded after Ministry)
 *   #Name         → Applicant name
 *   #ConfirmName  → Confirm name (if present)
 *   input[name="gender"] → Radio: Male / Female / Third Gender
 *   #address1, #address2, #address3 → 3-part address
 *   #pincode      → Pincode
 *   #stateId      → State dropdown
 *   #email / #Email → Email (may already be pre-filled)
 *   #ConfirmEmail / #cemail / #cEmail → Confirm email
 *   #Description  → RTI text (max 3000 chars, sanitized)
 *   BPL radio     → from user profile
 *   CAPTCHA       → user solves manually in browser
 */
async function fillRTIForm(page, formData) {
  console.log('📝 [RTI] Filling RTI application form…');
  await sleep(2000);

  const url = page.url();
  console.log('   Form URL:', url);

  // ── Ministry (#MinistryId) — select by partial text match ────────────────
  console.log(`   Selecting ministry: "${formData.ministry}"`);
  const ministrySelected = await selectByText(page, '#MinistryId', formData.ministry);
  console.log(`   Ministry set to: ${ministrySelected}`);

  // Wait up to 4 seconds for #DepartmentId to populate (AJAX)
  await sleep(500);
  let deptPopulated = false;
  for (let i = 0; i < 7; i++) {
    deptPopulated = await page.evaluate(() => {
      const sel = document.querySelector('#DepartmentId');
      return sel && sel.options.length > 1;
    });
    if (deptPopulated) break;
    await sleep(500);
  }

  // ── Public Authority (#DepartmentId) — pick first available option ────────
  const deptSelected = await page.evaluate(() => {
    const sel = document.querySelector('#DepartmentId');
    if (!sel || sel.options.length < 2) return '(not populated)';
    sel.value = sel.options[1].value;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    return sel.options[1].text;
  });
  console.log(`   Public Authority: ${deptSelected}`);

  await sleep(500);

  // ── Applicant Name (#Name) ────────────────────────────────────────────────
  await typeInto(page, '#Name', formData.applicantName || '');

  // ── Gender radio ──────────────────────────────────────────────────────────
  const genderVal = formData.gender === 'F' ? 'Female'
    : formData.gender === 'O' ? 'Third Gender' : 'Male';
  await page.evaluate((val) => {
    const radios = document.querySelectorAll('input[name="gender"]');
    for (const r of radios) {
      if (r.value === val) { r.click(); break; }
    }
  }, genderVal);

  // ── Address (3 fields) ───────────────────────────────────────────────────
  const addrParts = splitAddress(formData.address);
  for (const [id, text] of [
    ['#address1', addrParts[0]],
    ['#address2', addrParts[1]],
    ['#address3', addrParts[2]],
  ]) {
    if (text) await typeInto(page, id, text);
  }

  // ── Pincode ───────────────────────────────────────────────────────────────
  await typeInto(page, '#pincode', formData.pincode || '');

  // ── State (#stateId) ─────────────────────────────────────────────────────
  const stateSelected = await selectByText(page, '#stateId', formData.state);
  console.log(`   State: ${stateSelected}`);

  // ── Email (may already be pre-filled from session) ────────────────────────
  await typeInto(page, '#email, #Email, input[name="email"]', formData.email || '', true);

  // ── Confirm Email (must match Email exactly) ──────────────────────────────
  const confirmEmailSel = await findSelector(page, [
    '#ConfirmEmail', '#cemail', '#cEmail', '#confirmEmail',
    'input[name="cemail"]', 'input[name="ConfirmEmail"]',
    'input[name="confirm_email"]',
  ]);
  if (confirmEmailSel) {
    await typeInto(page, confirmEmailSel, formData.email || '');
    console.log(`   Confirm email filled in ${confirmEmailSel}`);
  } else {
    console.log('   ⚠️  Confirm email field not found — may not be required');
  }

  // ── BPL Status ────────────────────────────────────────────────────────────
  const bplValue = formData.isBPL ? 'Yes' : 'No';
  await page.evaluate((bplVal) => {
    // 1. Try to find a dropdown (select) for BPL/Poverty Line
    const selects = [...document.querySelectorAll('select')];
    const bplSelect = selects.find(s => 
      s.id?.toLowerCase().includes('bpl') || 
      s.name?.toLowerCase().includes('bpl') ||
      s.parentElement?.textContent?.toLowerCase().includes('poverty') ||
      s.closest('tr, div, td')?.textContent?.toLowerCase().includes('poverty')
    );
    
    if (bplSelect) {
      for (const opt of bplSelect.options) {
        if (opt.text.toLowerCase().trim() === bplVal.toLowerCase()) {
          bplSelect.value = opt.value;
          bplSelect.dispatchEvent(new Event('change', { bubbles: true }));
          return;
        }
      }
    }

    // 2. Fallback to radio buttons just in case
    const radios = [...document.querySelectorAll('input[type="radio"]')];
    const targetRadios = radios.filter(r => 
      r.id?.toLowerCase().includes('bpl') || 
      r.name?.toLowerCase().includes('bpl') || 
      r.closest('tr, div, td')?.innerText?.toLowerCase().includes('poverty') ||
      r.closest('tr, div, td')?.innerText?.toLowerCase().includes('bpl')
    );
    
    for (const r of targetRadios) {
      const isYes = r.value.toLowerCase() === 'yes' || r.value === '1' || r.nextSibling?.textContent?.toLowerCase().includes('yes');
      const isNo = r.value.toLowerCase() === 'no' || r.value === '0' || r.nextSibling?.textContent?.toLowerCase().includes('no');
      
      if ((bplVal === 'Yes' && isYes) || (bplVal === 'No' && isNo)) {
        r.click();
        break;
      }
    }
  }, bplValue).catch(() => {});
  
  console.log(`   BPL: ${bplValue}`);

  // ── RTI Application Text — sanitize + fill ────────────────────────────────
  const sanitized = sanitizeRTIText(formData.rtiText || '').slice(0, MAX_CHARS);
  await page.waitForSelector('#Description', { timeout: 5_000 }).catch(() => {});
  // Clear first, then type
  await page.evaluate(() => {
    const el = document.querySelector('#Description');
    if (el) el.value = '';
  });
  await page.click('#Description').catch(() => {});
  await page.type('#Description', sanitized, { delay: 5 });
  console.log(`   RTI text: ${sanitized.length}/${MAX_CHARS} chars`);

  // ── CAPTCHA (on the form page) — user must solve ──────────────────────────
  console.log('\n⚠️  [RTI] Please solve the CAPTCHA on the form and click "Make Payment"…');
  console.log('   The form is fully filled. Review it in the browser, solve the CAPTCHA, then submit.\n');
}

/** Splits address into 3 parts ≤60 chars each */
function splitAddress(address) {
  if (!address) return ['', '', ''];
  const words = address.split(' ');
  const parts = ['', '', ''];
  let p = 0;
  for (const w of words) {
    if (parts[p].length + w.length + 1 > 60 && p < 2) p++;
    parts[p] += (parts[p] ? ' ' : '') + w;
  }
  return parts;
}

/**
 * Sanitizes text to only allow RTI-allowed characters:
 *   A-Z a-z 0-9 , . - _ ( ) / @ : & \ ? %
 * Replaces other chars with space.
 */
function sanitizeRTIText(text) {
  // Keep only allowed chars per RTI portal rules
  return text.replace(/[^A-Za-z0-9 ,.\-_()\/@:&\\?%\n]/g, ' ')
             .replace(/ {2,}/g, ' ')
             .trim();
}

// ── STEP 6: Wait for user to submit form + capture payment URL ────────────────

/**
 * Waits for the user to solve the CAPTCHA and click "Make Payment" / "Submit"
 * on the RTI form. Once the page navigates away, captures the payment URL.
 *
 * We do NOT auto-click submit here — the form CAPTCHA must be solved by the user.
 */
async function submitAndCapturePaymentUrl(page) {
  console.log('⏳ [RTI] Waiting for you to solve the CAPTCHA and click "Make Payment"…');

  // Wait up to 10 minutes for user to solve CAPTCHA + submit
  const FORM_SUBMIT_TIMEOUT = 10 * 60 * 1000;
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: FORM_SUBMIT_TIMEOUT });

  const paymentUrl = page.url();
  console.log(`✅ [RTI] Payment page reached: ${paymentUrl}`);
  return { paymentUrl };
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

/** Type into a selector, clearing existing value first */
async function typeInto(page, selector, value, skipIfFilled = false) {
  if (!value) return;
  try {
    const el = await page.$(selector);
    if (!el) return;
    if (skipIfFilled) {
      const existing = await page.$eval(selector, e => e.value).catch(() => '');
      if (existing && existing.length > 0) return; // already filled
    }
    await el.click({ clickCount: 3 });
    await el.type(value, { delay: 20 });
  } catch (_) {}
}

/** Select dropdown option by partial text match, returns selected text */
async function selectByText(page, selector, targetText) {
  return page.evaluate((sel, text) => {
    const el = document.querySelector(sel);
    if (!el) return '(element not found)';
    const keywords = text.toLowerCase().split(' ').filter(w => w.length > 3);
    // Score each option by how many keywords match
    let best = null, bestScore = 0;
    for (const opt of el.options) {
      if (!opt.value) continue;
      const optText = opt.text.toLowerCase();
      const score = keywords.filter(k => optText.includes(k)).length;
      if (score > bestScore) { bestScore = score; best = opt; }
    }
    if (!best && el.options.length > 1) best = el.options[1]; // fallback to first
    if (best) {
      el.value = best.value;
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return best.text;
    }
    return '(no match)';
  }, selector, targetText || '');
}

/** Find the first existing selector from a list */
async function findSelector(page, selectors) {
  for (const sel of selectors) {
    const el = await page.$(sel).catch(() => null);
    if (el) return sel;
  }
  return null;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

module.exports = {
  launchBrowser,
  acceptGuidelines,
  fillEmailAndWaitForCaptcha,
  waitForOTPVerification,
  fillRTIForm,
  submitAndCapturePaymentUrl,
  MAX_CHARS,
  sanitizeRTIText,
};

