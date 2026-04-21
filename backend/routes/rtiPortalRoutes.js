/**
 * rtiPortalRoutes.js
 * API routes for RTI portal automation.
 */

const express = require('express');
const router  = express.Router();

const {
  saveRTICredentials,
  hasRTICredentials,
  submitToRTIPortal,
  getSubmissionStatus,
  checkRegistration,
  getMinistries,
} = require('../controllers/rtiPortalController');

// Credentials management
router.post('/credentials/:userId', saveRTICredentials);
router.get('/credentials/:userId',  hasRTICredentials);

// Submission flow
router.post('/submit/:complaintId',            submitToRTIPortal);
router.get('/status/:complaintId',             getSubmissionStatus);
router.post('/check-registration/:complaintId', checkRegistration);

// Utility
router.get('/ministries', getMinistries);

module.exports = router;
