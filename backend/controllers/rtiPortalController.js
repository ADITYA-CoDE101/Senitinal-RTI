/**
 * rtiPortalController.js
 * Handles all API endpoints related to RTI portal automation.
 *
 * Routes:
 *   POST  /api/rti-portal/credentials/:userId       → saveRTICredentials
 *   GET   /api/rti-portal/credentials/:userId       → hasRTICredentials
 *   POST  /api/rti-portal/submit/:complaintId       → submitToRTIPortal
 *   GET   /api/rti-portal/status/:complaintId       → getSubmissionStatus
 *   POST  /api/rti-portal/check-registration/:complaintId → checkRegistration
 *   GET   /api/rti-portal/ministries               → getMinistries
 */

const User             = require('../models/User');
const Complaint        = require('../models/Complaint');
const { encrypt, decrypt } = require('../services/rtiPortal/credentialService');
const { getAllMinistries, getMinistry } = require('../services/rtiPortal/ministryMapper');
const rtiPortalService = require('../services/rtiPortal');

// ── SAVE RTI CREDENTIALS ──────────────────────────────────────────────────────

/**
 * Encrypts and saves the user's RTI portal credentials to their profile.
 * @route POST /api/rti-portal/credentials/:userId
 * @body  { rtiUsername, rtiPassword }
 */
const saveRTICredentials = async (req, res) => {
  try {
    const { userId }      = req.params;
    const { rtiUsername, rtiPassword } = req.body;

    if (!rtiUsername || !rtiPassword) {
      return res.status(400).json({ success: false, error: 'RTI username and password are required.' });
    }

    await User.findByIdAndUpdate(userId, {
      'rtiPortalCredentials.username': encrypt(rtiUsername),
      'rtiPortalCredentials.password': encrypt(rtiPassword),
      'rtiPortalCredentials.savedAt':  new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'RTI portal credentials saved securely.',
    });
  } catch (error) {
    console.error('❌ saveRTICredentials error:', error.message);
    res.status(500).json({ success: false, error: 'Server error saving credentials.' });
  }
};

// ── HAS RTI CREDENTIALS ───────────────────────────────────────────────────────

/**
 * Checks if the user has RTI portal credentials saved (without returning them).
 * @route GET /api/rti-portal/credentials/:userId
 */
const hasRTICredentials = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('+rtiPortalCredentials.username +rtiPortalCredentials.savedAt');

    const hasCreds = !!(user?.rtiPortalCredentials?.username);

    res.status(200).json({
      success: true,
      hasCredentials: hasCreds,
      savedAt: user?.rtiPortalCredentials?.savedAt || null,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// ── SUBMIT TO RTI PORTAL ──────────────────────────────────────────────────────

/**
 * Triggers the Puppeteer automation to submit a complaint to rtionline.gov.in.
 *
 * @route POST /api/rti-portal/submit/:complaintId
 * @body  {
 *   userId,
 *   ministry?,       // override ministry, otherwise auto-mapped from category
 *   applicantName?,  // defaults to user.name
 *   gender?,         // 'M' | 'F' | 'O'  (default: 'M')
 *   address,
 *   pincode,
 *   state,
 *   phone,
 *   isBPL?           // boolean, default false
 * }
 */
const submitToRTIPortal = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { userId, ministry } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required.' });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found.' });
    }

    if (!complaint.legalDraft) {
      return res.status(400).json({ success: false, error: 'Complaint has no RTI draft. Generate a draft first.' });
    }

    if (['in_progress', 'pending_payment', 'submitted'].includes(complaint.rtiPortalSubmission?.status)) {
      return res.status(409).json({
        success: false,
        error: `Submission already ${complaint.rtiPortalSubmission.status}.`,
        data: { status: complaint.rtiPortalSubmission.status },
      });
    }

    // Load user — profile fields are used to auto-fill RTI form
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    // Validate that profile is complete enough for RTI submission
    const missing = [];
    if (!user.phone)   missing.push('phone');
    if (!user.address) missing.push('address');
    if (!user.pincode) missing.push('pincode');
    if (!user.state)   missing.push('state');

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Your profile is incomplete. Please update: ${missing.join(', ')}. You can edit your profile in account settings.`,
      });
    }

    // Respond immediately — automation runs async (browser may take several minutes)
    res.status(202).json({
      success: true,
      message: 'RTI submission started. A browser window will open — solve the CAPTCHA and enter the OTP to continue.',
      trackingId: complaint.trackingId,
    });

    // Fire-and-forget: run automation in background
    rtiPortalService.submitToRTIPortal({
      complaint,
      user,
      ministry: ministry || getMinistry(complaint.category),
      applicantInfo: {
        name:    user.name,
        gender:  user.gender  || 'M',
        address: user.address,
        pincode: user.pincode,
        state:   user.state,
        phone:   user.phone,
        email:   user.email,
        isBPL:   user.isBPL  || false,
      },
    }).then(result => {
      if (!result.success) {
        console.error(`❌ [RTI] Background submission failed: ${result.errorMessage}`);
      }
    });

  } catch (error) {
    console.error('❌ submitToRTIPortal error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Server error starting submission.' });
    }
  }
};


// ── GET SUBMISSION STATUS ─────────────────────────────────────────────────────

/**
 * Returns the current RTI portal submission status for a complaint.
 * @route GET /api/rti-portal/status/:complaintId
 */
const getSubmissionStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId)
      .select('trackingId rtiPortalSubmission');

    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found.' });
    }

    res.status(200).json({
      success: true,
      trackingId: complaint.trackingId,
      rtiPortalSubmission: complaint.rtiPortalSubmission,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// ── CHECK REGISTRATION NUMBER ─────────────────────────────────────────────────

/**
 * After user completes payment, call this to retrieve the RTI registration number.
 * @route POST /api/rti-portal/check-registration/:complaintId
 * @body  { regInputHint? }   Optional: transaction/reference number entered by user
 */
const checkRegistration = async (req, res) => {
  try {
    const { complaintId }   = req.params;
    const { regInputHint }  = req.body;

    const result = await rtiPortalService.checkRegistrationNumber(complaintId, regInputHint);

    res.status(200).json({
      success: result.success,
      registrationNumber: result.registrationNumber || null,
      message: result.registrationNumber
        ? `RTI Registration Number: ${result.registrationNumber}`
        : 'Registration number not yet available. Payment may still be processing (try again in 10 minutes).',
    });
  } catch (error) {
    console.error('❌ checkRegistration error:', error.message);
    res.status(500).json({ success: false, error: 'Server error checking registration.' });
  }
};

// ── GET ALL MINISTRIES ────────────────────────────────────────────────────────

/**
 * Returns all available RTI ministry options.
 * @route GET /api/rti-portal/ministries
 */
const getMinistries = async (req, res) => {
  try {
    const { category } = req.query;
    res.status(200).json({
      success: true,
      suggested: category ? getMinistry(category) : null,
      ministries: getAllMinistries(),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

module.exports = {
  saveRTICredentials,
  hasRTICredentials,
  submitToRTIPortal,
  getSubmissionStatus,
  checkRegistration,
  getMinistries,
};
