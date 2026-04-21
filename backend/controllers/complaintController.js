const Complaint = require('../models/Complaint');
const { geminiAnalysis, generateRTIDraft } = require('../services/aiService');

const CATEGORY_QUESTIONS = {
  'Road & Infrastructure': [
    'Please provide the current status of the above-mentioned road/infrastructure issue.',
    'Provide copies of any field reports, engineering assessments, or inspection notes related to this site conducted in the last 12 months.',
    'Provide details of the budget allocated and expenses incurred for maintenance at this location during the current financial year.',
    'Provide the names and designations of the officers responsible for the maintenance and oversight of this specific area.'
  ],
  'Water & Sanitation': [
    'Provide the latest water quality test reports or sewer inspection logs for this locality.',
    'Detail the scheduled frequency of maintenance for the water/sanitation infrastructure in this area.',
    'Provide information on any pending work orders or sanctions for repairs at this location.',
    'Provide the names and designations of the junior engineers and contractors responsible for this ward.'
  ],
  'Electricity & Power': [
    'Provide a record of power outages and voltage fluctuations logged for this area in the past 6 months.',
    'Provide details of any pending transformer upgrades or cable maintenance approved for this locality.',
    'Status of street light maintenance requests logged for this specific lane in the last 90 days.',
    'Provide the contact details and designations of the local assistant engineer (Power).'
  ],
  'Healthcare': [
    'Provide details of the stock of essential medicines available at the local primary health center.',
    'Provide the duty roster of doctors and paramedical staff assigned to this facility for the current month.',
    'Provide information on the budget allocated for equipment maintenance at this health center.',
    "Provide the status of the Citizen's Charter and grievance redressal mechanism at this facility."
  ],
  'Education': [
    'Provide information on the teacher-student ratio at the specified government educational institution.',
    'Provide the details of funds received and utilized under Samagra Shiksha or other schemes for this school.',
    'Provide a copy of the latest infrastructure audit or building safety report for this school.',
    'Details of the midday meal provision and quality audits conducted in the current quarter.'
  ],
  'Municipal Services': [
    'Provide records of garbage collection frequency and schedule for this ward.',
    'Provide the details of the sanitation staff assigned to this area and their attendance logs.',
    'Status of any complaints filed with the municipality for this specific issue in the last 6 months.',
    'Provide details of the budget allocated for cleanliness and sanitation in this ward.'
  ],
  'Land & Property': [
    'Provide a certified copy of the land records / revenue records for the property in question.',
    'Provide details of any pending litigation or encumbrance on the said property.',
    'Details of any notices issued to or by the Revenue Department regarding this property.',
    'Provide the name and designation of the revenue officer responsible for this area.'
  ],
  'Public Transport': [
    'Provide the official timetable and route details for the transport service mentioned.',
    'Provide records of complaints lodged about this transport service in the last 3 months.',
    'Provide details of the officer responsible for monitoring this transport route.',
    'Status of any pending improvements or sanctions for this transport service.'
  ],
  'Environment': [
    'Provide copies of any pollution monitoring reports for this area in the last 6 months.',
    'Provide details of any notices issued to polluting entities in this vicinity.',
    'Status of any action taken by the Pollution Control Board regarding this complaint.',
    'Provide the name and designation of the inspector responsible for this area.'
  ],
};

// ── GENERATE LEGAL DRAFT ─────────────────────────────────────────────────────

// ── SCHEDULE FOLLOW-UPS ──────────────────────────────────────────────────────
function scheduleFollowUps(filedDate) {
  const base = new Date(filedDate);
  return [
    { type: 'reminder',   scheduledAt: new Date(base.getTime() + 7  * 24 * 60 * 60 * 1000), status: 'pending' },
    { type: 'reminder',   scheduledAt: new Date(base.getTime() + 15 * 24 * 60 * 60 * 1000), status: 'pending' },
    { type: 'appeal',     scheduledAt: new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000), status: 'pending' },
    { type: 'escalation', scheduledAt: new Date(base.getTime() + 60 * 24 * 60 * 60 * 1000), status: 'pending' },
  ];
}

// ── ANALYZE (Pre-submit AI endpoint) ────────────────────────────────────────
// @route POST /api/complaints/analyze
const analyzeComplaint = async (req, res) => {
  try {
    const { description, category, location, inputMode, voiceTranscript, geoLat, geoLng } = req.body;
    if (!description && !voiceTranscript) {
      return res.status(400).json({ success: false, error: 'Please provide a description or voice input.' });
    }
    const data = {
      description: description || voiceTranscript || '',
      voiceTranscript: voiceTranscript || '',
      category: category || 'Other',
      location: location || '',
      inputMode: inputMode || 'text',
      geoLat, geoLng,
      imagePath: req.file ? req.file.path : null,
    };
    const ai = await geminiAnalysis(data);
    res.status(200).json({ success: true, data: ai });
  } catch (error) {
    console.error('❌ AI analysis error:', error.message);
    res.status(500).json({ success: false, error: 'AI processing failed.' });
  }
};

// ── SUBMIT COMPLAINT ─────────────────────────────────────────────────────────
// @route POST /api/complaints
const submitComplaint = async (req, res) => {
  try {
    const { description, category, location, inputMode, voiceTranscript, geoLat, geoLng, email, legalDraft, otpVerified, captchaPassed } = req.body;

    if (!description && !voiceTranscript) {
      return res.status(400).json({ success: false, error: 'Please provide a description or voice input.' });
    }

    const data = {
      description: description || voiceTranscript || '',
      voiceTranscript: voiceTranscript || '',
      category: category || 'Other',
      location: location || '',
      inputMode: inputMode || 'text',
      geoLat, geoLng, email,
      imageUrl:  req.file ? `/uploads/${req.file.filename}` : '',
      imagePath: req.file ? req.file.path : null,  // full disk path for vision analysis
    };

    // Run AI analysis
    const ai = await geminiAnalysis(data);

    const filedDate = new Date();

    const complaintData = {
      description: data.description,
      category: ai.category || data.category,
      location: data.location,
      inputMode: data.inputMode,
      voiceTranscript: data.voiceTranscript,
      imageUrl: data.imageUrl,
      aiProcessing: {
        ...ai,
        processedAt: new Date(),
      },
      followUps: scheduleFollowUps(filedDate),
      submissionVerification: {
        otpVerified: otpVerified === 'true' || otpVerified === true,
        captchaPassed: captchaPassed === 'true' || captchaPassed === true,
        verifiedAt: new Date(),
      },
    };

    if (geoLat && geoLng) {
      complaintData.geoCoords = { lat: parseFloat(geoLat), lng: parseFloat(geoLng) };
    }

    // Generate human-like RTI draft via Gemini (falls back to rule-based template if quota exhausted)
    complaintData.legalDraft = legalDraft || await generateRTIDraft(data, ai);

    const complaint = await Complaint.create(complaintData);

    console.log(`📋 New complaint filed: ${complaint.trackingId} (${complaint.category})`);
    console.log(`   AI Severity: ${ai.severity} | Confidence: ${ai.confidence}% | Model: ${ai.model}`);
    console.log(`   Authority: ${complaint.authority}`);

    res.status(201).json({
      success: true,
      message: 'Complaint filed successfully!',
      data: {
        trackingId: complaint.trackingId,
        status: complaint.status,
        severity: complaint.severity,
        authority: complaint.authority,
        category: complaint.category,
        aiProcessing: complaint.aiProcessing,
        followUps: complaint.followUps,
        createdAt: complaint.createdAt,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    console.error('❌ Error submitting complaint:', error.message);
    res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
};

// ── GET ALL COMPLAINTS ───────────────────────────────────────────────────────
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    console.error('❌ Error fetching complaints:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// ── SEARCH COMPLAINT ─────────────────────────────────────────────────────────
const searchComplaint = async (req, res) => {
  try {
    const { trackingId } = req.query;
    if (!trackingId) return res.status(400).json({ success: false, error: 'Please provide a tracking ID.' });
    const complaint = await Complaint.findOne({ trackingId: { $regex: trackingId, $options: 'i' } });
    if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found.' });
    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    console.error('❌ Error searching complaint:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// ── GET COMPLAINT BY ID ──────────────────────────────────────────────────────
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found.' });
    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    console.error('❌ Error fetching complaint:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// ── UPDATE COMPLAINT STATUS ──────────────────────────────────────────────────
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, event } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found.' });
    complaint.status = status;
    complaint.timeline.push({ date: new Date(), event: event || `Status changed to ${status}`, status });
    await complaint.save();
    console.log(`🔄 Complaint ${complaint.trackingId} status → ${status}`);
    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    console.error('❌ Error updating status:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

module.exports = { analyzeComplaint, submitComplaint, getComplaints, searchComplaint, getComplaintById, updateComplaintStatus };
