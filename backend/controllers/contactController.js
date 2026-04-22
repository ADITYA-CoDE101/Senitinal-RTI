const Contact = require('../models/Contact');

// @desc    Submit a new contact form message
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, issueType, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields (name, email, message)',
      });
    }

    // Create and save to database
    const contact = await Contact.create({
      name,
      email,
      issueType: issueType || 'Other',
      message,
    });

    console.log(`📩 New contact submission from: ${name} (${email})`);

    res.status(201).json({
      success: true,
      message: 'Your message has been received! We will respond within 24 hours.',
      data: contact,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }

    console.error('❌ Error submitting contact:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.',
    });
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Public (can be restricted later)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error('❌ Error fetching contacts:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.',
    });
  }
};

module.exports = { submitContact, getContacts };
