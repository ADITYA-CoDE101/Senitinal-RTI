const Complaint = require('../models/Complaint');

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
    'Provide the status of the Citizen\'s Charter and grievance redressal mechanism at this facility.'
  ],
  'Education': [
    'Provide information on the teacher-student ratio at the specified government educational institution.',
    'Provide the details of funds received and utilized under Samagra Shiksha or other schemes for this school.',
    'Provide a copy of the latest infrastructure audit or building safety report for this school.',
    'Details of the midday meal provision and quality audits conducted in the current quarter.'
  ]
};

const generateLegalDraft = (data) => {
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const category = data.category || 'Road & Infrastructure';
  const location = data.location || '[Specified Location]';
  const description = data.description || data.voiceTranscript || '';

  const questions = CATEGORY_QUESTIONS[category] || CATEGORY_QUESTIONS['Road & Infrastructure'];

  return `APPLICATION FOR INFORMATION UNDER THE RTI ACT, 2005

To,
The Public Information Officer (PIO),
${data.authority || 'Concerned Public Authority'},
Government of India / State Government.

Date: ${date}

Subject: Request for Information under the Right to Information Act, 2005 - Regarding ${category} at ${location}.

Respected Sir/Madam,

I, the undersigned, am a citizen of India. I require information and formal redressal regarding the following matter under the RTI Act, 2005:

1. DESCRIPTION OF MATTER:
   ${description}

2. SPECIFIC INFORMATION REQUIRED:
${questions.map((q, i) => `   (${String.fromCharCode(97 + i)}) ${q}`).join('\n')}

3. DURATION:
   The information required pertains to the period from ${new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toLocaleDateString()} to ${date}.

DECLARATION:
I state that the information sought does not fall within the restrictions contained in Section 8 and 9 of the RTI Act and to the best of my knowledge it pertains to your office.

FEE DETAILS:
I am attaching the requisite RTI application fee. (Note: System-automated digital payment reference included).

Yours faithfully,
[Digitally Signed via Sentinel-RTI]
Contact: ${data.email || 'Registered User'}
`;
};

// @desc    Submit a new complaint (with optional file upload)
// @route   POST /api/complaints
// @access  Public
const submitComplaint = async (req, res) => {
  try {
    const { description, category, location, inputMode, voiceTranscript, geoLat, geoLng, email, legalDraft } = req.body;

    if (!description && !voiceTranscript) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a description or voice input.',
      });
    }

    const complaintData = {
      description: description || voiceTranscript || '',
      category: category || 'Other',
      location: location || '',
      inputMode: inputMode || 'text',
      voiceTranscript: voiceTranscript || '',
      email: email || 'user@sentinel.com', // Optional: link to logged in user
    };

    // Use provided draft or generate one
    if (legalDraft) {
      complaintData.legalDraft = legalDraft;
    } else {
      // We'll need the authority for the fallback draft
      // We can use a simplified version or just wait for pre-save, 
      // but the model's pre-save doesn't have access to all fields easily if we're not careful.
      // complaintData.legalDraft will be updated after we know the authority if needed.
      complaintData.legalDraft = generateLegalDraft(complaintData);
    }

    // Handle geo coordinates
    if (geoLat && geoLng) {
      complaintData.geoCoords = { lat: parseFloat(geoLat), lng: parseFloat(geoLng) };
    }

    // Handle image upload
    if (req.file) {
      complaintData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const complaint = await Complaint.create(complaintData);

    console.log(`📋 New complaint filed: ${complaint.trackingId} (${complaint.category}) — Severity: ${complaint.severity}`);
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
        createdAt: complaint.createdAt,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    console.error('❌ Error submitting complaint:', error.message);
    res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
};

// @desc    Get all complaints (newest first)
// @route   GET /api/complaints
// @access  Public
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    console.error('❌ Error fetching complaints:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// @desc    Search complaint by tracking ID
// @route   GET /api/complaints/search?trackingId=SRT-2026-1001
// @access  Public
const searchComplaint = async (req, res) => {
  try {
    const { trackingId } = req.query;
    if (!trackingId) {
      return res.status(400).json({ success: false, error: 'Please provide a tracking ID.' });
    }

    const complaint = await Complaint.findOne({
      trackingId: { $regex: trackingId, $options: 'i' }
    });

    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found.' });
    }

    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    console.error('❌ Error searching complaint:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// @desc    Get a single complaint by ID
// @route   GET /api/complaints/:id
// @access  Public
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found.' });
    }
    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    console.error('❌ Error fetching complaint:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
// @access  Public
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, event } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found.' });
    }

    complaint.status = status;
    complaint.timeline.push({
      date: new Date(),
      event: event || `Status changed to ${status}`,
      status: status,
    });

    await complaint.save();

    console.log(`🔄 Complaint ${complaint.trackingId} status updated to: ${status}`);

    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    console.error('❌ Error updating status:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

module.exports = { submitComplaint, getComplaints, searchComplaint, getComplaintById, updateComplaintStatus };
