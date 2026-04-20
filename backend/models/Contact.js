const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    issueType: {
      type: String,
      required: [true, 'Issue type is required'],
      enum: [
        'RTI Filing Assistance',
        'Complaint Escalation',
        'Technical Support',
        'Legal Query',
        'Partnership Inquiry',
        'Media / Press',
        'Other',
      ],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Contact', contactSchema);
