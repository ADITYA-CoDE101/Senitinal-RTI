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
 * Submit a new complaint (supports text, image, voice, location)
 * Uses FormData for file upload support
 */
export async function submitComplaint({ description, category, location, inputMode, imageFile, voiceTranscript, geoLat, geoLng }) {
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

    const response = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      body: formData, // No Content-Type header — browser sets it with boundary
    });

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
