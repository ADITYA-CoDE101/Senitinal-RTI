const express = require('express');
const router = express.Router();
const { submitContact, getContacts } = require('../controllers/contactController');

// POST /api/contact — submit a contact form
router.post('/', submitContact);

// GET /api/contact — get all submissions
router.get('/', getContacts);

module.exports = router;
