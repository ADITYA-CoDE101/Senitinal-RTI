// ── API Service ──────────────────────────────────────────────────
// All communication between frontend and backend.
// The Vite proxy forwards /api/* to http://localhost:5000.

const API_BASE = '/api';

// ── AUTHENTICATION ────────────────────────────────────────────────
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    return data;
  } catch (error) {
    throw error;
  }
}

export async function registerUser({ name, email, password, phone, gender, address, pincode, state, isBPL }) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, phone, gender, address, pincode, state, isBPL }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Registration failed');
  return data;
}


// ── CONTACT FORM ────────────────────────────────────────────────
export async function submitContactForm(formData) {
  try {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        issueType: formData.issue,
        message: formData.message,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Something went wrong');
    return data;
  } catch (error) {
    throw error;
  }
}

// ── COMPLAINTS ──────────────────────────────────────────────────

/**
 * Run AI analysis on complaint data (pre-submit — no DB write)
 * Sends image if provided so Gemini Vision can analyze it
 */
export async function analyzeComplaint({ description, category, location, inputMode, voiceTranscript, geoLat, geoLng, imageFile }) {
  try {
    const formData = new FormData();
    formData.append('description', description || '');
    formData.append('category', category || 'Other');
    formData.append('location', location || '');
    formData.append('inputMode', inputMode || 'text');
    if (voiceTranscript) formData.append('voiceTranscript', voiceTranscript);
    if (geoLat) formData.append('geoLat', geoLat);
    if (geoLng) formData.append('geoLng', geoLng);
    if (imageFile) formData.append('image', imageFile); // send image for vision analysis

    const response = await fetch(`${API_BASE}/complaints/analyze`, { method: 'POST', body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'AI analysis failed');
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Submit a new complaint (supports text, image, voice, location)
 */
export async function submitComplaint({ description, category, location, inputMode, imageFile, voiceTranscript, geoLat, geoLng, legalDraft, otpVerified, captchaPassed }) {
  try {
    const formData = new FormData();
    formData.append('description', description || '');
    formData.append('category', category || 'Other');
    formData.append('location', location || '');
    formData.append('inputMode', inputMode || 'text');
    if (voiceTranscript) formData.append('voiceTranscript', voiceTranscript);
    if (geoLat) formData.append('geoLat', geoLat);
    if (geoLng) formData.append('geoLng', geoLng);
    if (imageFile) formData.append('image', imageFile);
    if (legalDraft) formData.append('legalDraft', legalDraft);
    formData.append('otpVerified', otpVerified ? 'true' : 'false');
    formData.append('captchaPassed', captchaPassed ? 'true' : 'false');

    const response = await fetch(`${API_BASE}/complaints`, { method: 'POST', body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to submit complaint');
    return data;
  } catch (error) {
    throw error;
  }
}


/**
 * Get all complaints (newest first)
 */
export async function getComplaints() {
  try {
    const response = await fetch(`${API_BASE}/complaints`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch complaints');
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Search complaint by tracking ID
 */
export async function searchComplaint(trackingId) {
  try {
    const response = await fetch(`${API_BASE}/complaints/search?trackingId=${encodeURIComponent(trackingId)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Complaint not found');
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Update complaint status
 */
export async function updateComplaintStatus(id, status, event) {
  try {
    const response = await fetch(`${API_BASE}/complaints/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, event }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update status');
    return data;
  } catch (error) {
    throw error;
  }
}

// ── DASHBOARD ───────────────────────────────────────────────────

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
  try {
    const response = await fetch(`${API_BASE}/dashboard/stats`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch stats');
    return data;
  } catch (error) {
    throw error;
  }
}

// ── HEALTH CHECK ────────────────────────────────────────────────
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return await response.json();
  } catch (error) {
    throw new Error('Backend is not reachable');
  }
}

// ── RTI PORTAL AUTOMATION ────────────────────────────────────────

/** Save/update RTI portal credentials for a user */
export async function saveRTICredentials(userId, rtiUsername, rtiPassword) {
  const response = await fetch(`${API_BASE}/rti-portal/credentials/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rtiUsername, rtiPassword }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to save credentials');
  return data;
}

/** Check if user has saved RTI portal credentials */
export async function hasRTICredentials(userId) {
  const response = await fetch(`${API_BASE}/rti-portal/credentials/${userId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error');
  return data;
}

/** Trigger Puppeteer RTI submission for a complaint */
export async function submitToRTIPortal(complaintId, payload) {
  const response = await fetch(`${API_BASE}/rti-portal/submit/${complaintId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to start submission');
  return data;
}

/** Poll RTI portal submission status */
export async function getRTISubmissionStatus(complaintId) {
  const response = await fetch(`${API_BASE}/rti-portal/status/${complaintId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error fetching status');
  return data;
}

/** After user pays, retrieve the RTI registration number */
export async function checkRTIRegistration(complaintId, regInputHint = '') {
  const response = await fetch(`${API_BASE}/rti-portal/check-registration/${complaintId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ regInputHint }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error');
  return data;
}

/** Get all RTI ministries (with optional category suggestion) */
export async function getRTIMinistries(category = '') {
  const url = category
    ? `${API_BASE}/rti-portal/ministries?category=${encodeURIComponent(category)}`
    : `${API_BASE}/rti-portal/ministries`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error');
  return data;
}

