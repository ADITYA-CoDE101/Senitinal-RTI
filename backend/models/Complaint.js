const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  event: { type: String, required: true },
  status: { type: String, enum: ['submitted', 'pending', 'escalated', 'resolved'], default: 'submitted' },
}, { _id: false });

// Auto-assign authority based on category
const AUTHORITY_MAP = {
  'Road & Infrastructure': 'PWD Municipal Corporation',
  'Water & Sanitation': 'Water Supply & Sewerage Board',
  'Electricity & Power': 'State Electricity Distribution Company',
  'Municipal Services': 'Municipal Corporation',
  'Education': 'Department of Education',
  'Healthcare': 'Department of Health & Family Welfare',
  'Land & Property': 'Revenue & Land Records Department',
  'Public Transport': 'State Transport Corporation',
  'Environment': 'State Pollution Control Board',
  'Other': 'District Administration',
};

const complaintSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Road & Infrastructure', 'Water & Sanitation', 'Electricity & Power',
        'Municipal Services', 'Education', 'Healthcare',
        'Land & Property', 'Public Transport', 'Environment', 'Other',
      ],
      default: 'Other',
    },
    inputMode: {
      type: String,
      enum: ['text', 'image', 'voice', 'location'],
      default: 'text',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    geoCoords: {
      lat: { type: Number },
      lng: { type: Number },
    },
    imageUrl: {
      type: String,
      default: '',
    },
    voiceTranscript: {
      type: String,
      default: '',
    },
    legalDraft: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['submitted', 'pending', 'escalated', 'resolved'],
      default: 'submitted',
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    authority: {
      type: String,
      default: '',
    },
    timeline: {
      type: [timelineEventSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate tracking ID and assign authority before saving
complaintSchema.pre('validate', async function (next) {
  if (this.isNew) {
    // Generate tracking ID: SRT-YYYY-NNNN
    const year = new Date().getFullYear();
    const count = await mongoose.model('Complaint').countDocuments();
    this.trackingId = `SRT-${year}-${String(count + 1001).padStart(4, '0')}`;

    // Auto-assign authority
    this.authority = AUTHORITY_MAP[this.category] || AUTHORITY_MAP['Other'];

    // Auto-assess severity based on keywords
    const desc = (this.description || '').toLowerCase();
    if (desc.includes('accident') || desc.includes('danger') || desc.includes('emergency') || desc.includes('months') || desc.includes('years') || desc.includes('ignored')) {
      this.severity = 'HIGH';
    } else if (desc.includes('broken') || desc.includes('damaged') || desc.includes('weeks') || desc.includes('complaint')) {
      this.severity = 'MEDIUM';
    } else {
      this.severity = 'LOW';
    }

    // Add initial timeline event
    this.timeline = [{
      date: new Date(),
      event: 'Complaint Filed',
      status: 'submitted',
    }];
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
