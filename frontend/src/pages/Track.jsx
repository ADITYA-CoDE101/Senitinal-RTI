import React, { useState, useEffect, useCallback } from 'react'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'
import { searchComplaint, getComplaints, saveRTICredentials, submitToRTIPortal, getRTISubmissionStatus, checkRTIRegistration, getRTIMinistries } from '../services/api'

/* ── TOKENS ──────────────────────────────────────────────────── */
const BG   = '#07090f'
const SURF = '#0d1117'
const BDIM = 'rgba(255,255,255,0.06)'

/* ── STATUS PIPELINE ─────────────────────────────────────────── */
const STATUSES = [
  { key: 'submitted', label: 'Submitted', color: '#3b74ff' },
  { key: 'pending',   label: 'Pending',   color: '#f59e0b' },
  { key: 'escalated', label: 'Escalated', color: '#ef4444' },
  { key: 'resolved',  label: 'Resolved',  color: '#0ec98c' },
]

const FOLLOW_UP_FEATURES = [
  { icon: 'clock',       title: 'Automated Reminders',  color: '#3b74ff', desc: 'System sends follow-up reminders to authorities at 7, 15, and 30 days. No manual intervention needed.' },
  { icon: 'file',        title: 'Appeal Generation',    color: '#f59e0b', desc: 'If no response within 30 days, the system automatically generates and files a first appeal under RTI Act Section 19.' },
  { icon: 'alertCircle', title: 'CIC Escalation',       color: '#ef4444', desc: 'Non-compliance is escalated to the State Chief Information Commission with complete case documentation.' },
]

/* ── STATUS PILL ──────────────────────────────────────────────── */
function StatusPill({ status }) {
  const s = STATUSES.find(st => st.key === status) || STATUSES[0]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
      padding: '4px 12px', borderRadius: 6, letterSpacing: 1, textTransform: 'uppercase',
      background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}30`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
      {s.label}
    </span>
  )
}

/* ── RTI PORTAL STATUS BADGE ─────────────────────────────────── */
const RTI_STATUS_CONFIG = {
  not_submitted:   { label: 'Not Submitted',  color: '#64748b' },
  in_progress:     { label: 'In Progress…',   color: '#f59e0b' },
  pending_payment: { label: 'Pending Payment', color: '#a78bfa' },
  submitted:       { label: 'Submitted ✓',    color: '#0ec98c' },
  failed:          { label: 'Failed',          color: '#ef4444' },
}

function RTIStatusBadge({ status }) {
  const cfg = RTI_STATUS_CONFIG[status] || RTI_STATUS_CONFIG.not_submitted
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700,
      padding: '3px 10px', borderRadius: 5, letterSpacing: 1, textTransform: 'uppercase',
      background: `${cfg.color}18`, color: cfg.color, border: `1px solid ${cfg.color}30`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, animation: status === 'in_progress' ? 'pulse 1.4s infinite' : 'none' }} />
      RTI: {cfg.label}
    </span>
  )
}

/* ── RTI SUBMIT PANEL ────────────────────────────────────────── */
// Hardcoded demo userId — replace with auth context in production
const DEMO_USER_ID = 'demo_user'

function RTISubmitPanel({ complaint }) {
  const { user } = useAuth()
  const [phase, setPhase]           = useState('idle')   // idle | setup | form | submitting
  const [ministries, setMinistries] = useState([])
  const [suggested, setSuggested]   = useState('')
  const [selectedMinistry, setSelectedMinistry] = useState('')
  const [rtiStatus, setRtiStatus]   = useState(complaint.rtiPortalSubmission?.status || 'not_submitted')
  const [regNum, setRegNum]         = useState(complaint.rtiPortalSubmission?.registrationNumber || '')
  const [payLink, setPayLink]       = useState(complaint.rtiPortalSubmission?.paymentLink || '')
  const [error, setError]           = useState('')
  const [checkingReg, setCheckingReg] = useState(false)
  const [regHint, setRegHint]       = useState('')

  // Check if user profile is complete for RTI
  const profileComplete = user && user.phone && user.address && user.pincode && user.state

  // Sync RTI status from DB every 8s when in_progress
  useEffect(() => {
    if (rtiStatus !== 'in_progress') return
    const iv = setInterval(async () => {
      try {
        const res = await getRTISubmissionStatus(complaint._id)
        const s = res.rtiPortalSubmission
        setRtiStatus(s.status)
        if (s.paymentLink) setPayLink(s.paymentLink)
        if (s.status !== 'in_progress') clearInterval(iv)
      } catch (_) {}
    }, 8000)
    return () => clearInterval(iv)
  }, [rtiStatus, complaint._id])

  // Load ministries on first open
  const loadMinistries = useCallback(async () => {
    try {
      const res = await getRTIMinistries(complaint.category)
      setMinistries(res.ministries)
      setSuggested(res.suggested || '')
      setSelectedMinistry(res.suggested || res.ministries[0] || '')
    } catch (_) {}
  }, [complaint.category])

  // Already submitted — just show status
  if (rtiStatus === 'submitted' || rtiStatus === 'pending_payment') {
    return (
      <div style={panelStyle}>
        <div style={panelHeader}>
          <RTIStatusBadge status={rtiStatus} />
          {complaint.rtiPortalSubmission?.ministry && (
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginLeft: 8 }}>
              → {complaint.rtiPortalSubmission.ministry}
            </span>
          )}
        </div>

        {rtiStatus === 'pending_payment' && payLink && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
              A browser window opened for submission. Complete the ₹10 payment to finalise your RTI.
            </p>
            <a href={payLink} target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, background: '#a78bfa', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
              <Icon name="externalLink" size={14} color="#fff" sw={2} /> Open Payment Page
            </a>
            <div style={{ marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 16 }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>After payment, enter your transaction reference to retrieve your RTI number:</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={regHint} onChange={e => setRegHint(e.target.value)}
                  placeholder="Transaction / reg number (optional)"
                  style={inputStyle}
                />
                <button disabled={checkingReg} onClick={async () => {
                  setCheckingReg(true)
                  try {
                    const res = await checkRTIRegistration(complaint._id, regHint)
                    if (res.registrationNumber) { setRegNum(res.registrationNumber); setRtiStatus('submitted') }
                    else setError('Not available yet — try again in 10 minutes.')
                  } catch (e) { setError(e.message) }
                  setCheckingReg(false)
                }} style={btnPrimary}>{checkingReg ? 'Checking…' : 'Check'}</button>
              </div>
              {error && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 8 }}>{error}</p>}
            </div>
          </div>
        )}

        {rtiStatus === 'submitted' && regNum && (
          <div style={{ marginTop: 14, padding: '12px 16px', background: '#0ec98c12', border: '1px solid #0ec98c30', borderRadius: 10 }}>
            <p style={{ fontSize: 12, color: '#0ec98c', fontFamily: "'Space Mono', monospace" }}>
              RTI Registration: <strong>{regNum}</strong>
            </p>
          </div>
        )}
      </div>
    )
  }

  // ── IDLE phase — show button ──────────────────────────────────
  if (phase === 'idle') {
    if (!complaint.legalDraft) return null // no draft = no button
    return (
      <div style={panelStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>Submit to RTI Online Portal</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Auto-fill and submit your RTI draft to rtionline.gov.in</div>
          </div>
          <button onClick={() => { setPhase('form'); loadMinistries() }} style={btnPrimary}>
            <Icon name="send" size={14} color="#fff" sw={2} /> Submit RTI
          </button>
        </div>
        {!profileComplete && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(245,158,11,0.08)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.2)' }}>
            <p style={{ fontSize: 12, color: '#f59e0b' }}>⚠ Your profile is incomplete. Please update phone, address, pincode and state in your account settings for auto-fill to work.</p>
          </div>
        )}
        {rtiStatus === 'failed' && <p style={{ marginTop: 12, fontSize: 12, color: '#ef4444' }}>Previous attempt failed. You can retry.</p>}
      </div>
    )
  }

  // ── FORM — ministry selection only (profile data auto-fills rest) ──────
  if (phase === 'form') {
    return (
      <div style={panelStyle}>
        <div style={{ ...panelHeader, marginBottom: 16 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: '#fff' }}>Confirm Submission Details</span>
          <button onClick={() => setPhase('idle')} style={btnGhost}>✕ Cancel</button>
        </div>

        {/* Profile summary — pulled from user account */}
        <div style={{ marginBottom: 16, padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>From Your Profile</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 12 }}>
            <ProfileRow label="Name"    value={user?.name} />
            <ProfileRow label="Email"   value={user?.email} />
            <ProfileRow label="Phone"   value={user?.phone} />
            <ProfileRow label="Gender"  value={{ M: 'Male', F: 'Female', O: 'Other' }[user?.gender] || user?.gender} />
            <ProfileRow label="Address" value={user?.address} span />
            <ProfileRow label="Pincode" value={user?.pincode} />
            <ProfileRow label="State"   value={user?.state} />
            <ProfileRow label="BPL"     value={user?.isBPL ? 'Yes (no fee)' : 'No'} />
          </div>
        </div>

        {/* Ministry selector */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Ministry / Public Authority *</label>
          <select value={selectedMinistry} onChange={e => setSelectedMinistry(e.target.value)} style={inputStyle}>
            <option value="">— Select Ministry —</option>
            {ministries.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {suggested && <p style={{ fontSize: 11, color: '#a78bfa', marginTop: 4 }}>Suggested for {complaint.category}: {suggested}</p>}
        </div>

        <div style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(167,139,250,0.07)', borderRadius: 8, border: '1px solid rgba(167,139,250,0.15)' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
            ⚠️ A browser window will open. Solve the CAPTCHA, enter the OTP sent to your phone/email, and the form will be auto-filled. Pay ₹10 to complete.
          </p>
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 8 }}>{error}</p>}

        <button disabled={!selectedMinistry} onClick={async () => {
          setPhase('submitting'); setError('')
          try {
            await submitToRTIPortal(complaint._id, {
              userId: user?._id || user?.id || DEMO_USER_ID,
              ministry: selectedMinistry,
            })
            setRtiStatus('in_progress')
            setPhase('idle')
          } catch (e) { setError(e.message); setPhase('form') }
        }} style={{ ...btnPrimary, opacity: !selectedMinistry ? 0.5 : 1 }}>
          <Icon name="send" size={14} color="#fff" sw={2} /> Launch RTI Submission
        </button>
      </div>
    )
  }

  if (phase === 'submitting') {
    return (
      <div style={{ ...panelStyle, textAlign: 'center', padding: '32px' }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', animation: 'pulse 1.5s infinite' }}>🤖 Opening browser & logging in to RTI portal…</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>Please solve the CAPTCHA in the window that appears.</div>
      </div>
    )
  }

  return null
}

// ── Panel micro-styles ────────────────────────────────────────────
const panelStyle = {
  marginTop: 20, padding: '20px 24px',
  background: 'rgba(167,139,250,0.05)', borderRadius: 14,
  border: '1px solid rgba(167,139,250,0.15)',
}
const panelHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }
const inputStyle = {
  width: '100%', padding: '9px 13px', borderRadius: 8,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: 13, outline: 'none', fontFamily: "'DM Sans', sans-serif",
  boxSizing: 'border-box',
}
const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: 7,
  padding: '9px 18px', borderRadius: 9, border: 'none',
  background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
  color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
  fontFamily: "'Syne', sans-serif",
}
const btnGhost = {
  padding: '8px 14px', borderRadius: 8,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer',
}
const labelStyle = { display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 5, fontWeight: 600, letterSpacing: 0.5 }

function ProfileRow({ label, value, span }) {
  return (
    <div style={{ gridColumn: span ? '1/-1' : undefined }}>
      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{label}: </span>
      <span style={{ color: value ? '#fff' : '#ef4444', fontWeight: 500 }}>{value || '⚠ Not set'}</span>
    </div>
  )
}

/* ── COMPLAINT CARD ──────────────────────────────────────────── */
function ComplaintCard({ complaint, isOpen, onToggle }) {
  const [hovered, setHovered] = useState(false)
  const statusInfo = STATUSES.find(s => s.key === complaint.status) || STATUSES[0]
  const statusIndex = STATUSES.findIndex(s => s.key === complaint.status)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.035)' : SURF,
        border: `1px solid ${isOpen ? 'rgba(26,86,232,0.35)' : BDIM}`,
        borderRadius: 16, overflow: 'hidden', transition: 'all 0.25s',
        boxShadow: isOpen ? '0 8px 32px rgba(26,86,232,0.1)' : 'none',
        marginBottom: 12
      }}
    >
      <button onClick={onToggle} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 28px', background: 'none', border: 'none', cursor: 'pointer',
        gap: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11, flexShrink: 0,
            background: `${statusInfo.color}15`, border: `1px solid ${statusInfo.color}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={complaint.status === 'resolved' ? 'check' : complaint.status === 'escalated' ? 'bell' : 'clock'} size={18} color={statusInfo.color} sw={2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: '#fff' }}>{complaint.trackingId}</span>
              <StatusPill status={complaint.status} />
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{complaint.category} → {complaint.authority || 'Assigning...'}</div>
          </div>
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          border: `2px solid ${isOpen ? '#1a56e8' : 'rgba(255,255,255,0.12)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          background: isOpen ? '#1a56e8' : 'transparent',
          transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'all 0.3s',
        }}>
          <Icon name="chevronRight" size={14} color="#fff" sw={2.5} />
        </div>
      </button>

      <div style={{
        maxHeight: isOpen ? 1000 : 0, overflow: 'hidden',
        transition: 'max-height 0.35s ease',
      }}>
        <div style={{ padding: '0 28px 28px', borderTop: `1px solid ${BDIM}` }}>
          <div style={{ padding: '20px 0', borderBottom: `1px solid ${BDIM}` }}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 12 }}>
              {complaint.description}
            </p>
            {complaint.imageUrl && (
              <div style={{ marginTop: 16, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                 <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', padding: '8px 12px', background: 'rgba(255,255,255,0.03)' }}> EVIDENCE ATTACHED </p>
                 <img src={complaint.imageUrl} alt="Evidence" style={{ width: '100%', maxHeight: 300, objectFit: 'contain', background: '#000' }} />
              </div>
            )}
          </div>

          {/* Legal Draft View */}
          {complaint.legalDraft && (
            <div style={{ marginTop: 24, padding: 24, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 9, fontFamily: "'Space Mono', monospace", color: '#64748b', fontWeight: 800 }}>FORMAL RTI DOCUMENT</div>
              <div style={{ 
                fontFamily: "'Courier Prime', 'Courier New', monospace", fontSize: 13, 
                color: '#1e293b', lineHeight: 1.5, maxHeight: 300, overflowY: 'auto',
                whiteSpace: 'pre-wrap', paddingRight: 8
              }}>
                {complaint.legalDraft}
              </div>
              <button 
                onClick={() => {
                  const blob = new Blob([complaint.legalDraft], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `RTI_${complaint.trackingId}.txt`;
                  a.click();
                }}
                style={{ marginTop: 16, width: '100%', padding: '10px', background: '#334155', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
              >
                Download Formal .TXT Document
              </button>
            </div>
          )}

          {/* ── RTI Portal Submit Panel ── */}
          <RTISubmitPanel complaint={complaint} />

          {/* Status pipeline */}
          <div style={{ padding: '24px 0' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 20 }}>Current Lifecycle Stage</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {STATUSES.map((s, i) => {
                const reached = i <= statusIndex
                return (
                  <div key={s.key} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: reached ? `${s.color}25` : 'rgba(255,255,255,0.05)',
                        border: `2px solid ${reached ? s.color : 'rgba(255,255,255,0.1)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s',
                      }}>
                        {reached && <Icon name="check" size={13} color={s.color} sw={2.5} />}
                      </div>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: reached ? s.color : 'rgba(255,255,255,0.2)', letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</span>
                    </div>
                    {i < STATUSES.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: reached && i < statusIndex ? s.color : 'rgba(255,255,255,0.08)', margin: '0 8px', marginBottom: 20, transition: 'background 0.3s' }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timeline */}
          {complaint.timeline && complaint.timeline.length > 0 && (
            <>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>Activity Timeline</div>
              {complaint.timeline.map((t, i) => {
                const tStatus = STATUSES.find(s => s.key === t.status) || STATUSES[0]
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '10px 0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: tStatus.color, flexShrink: 0, border: `2px solid ${BG}` }} />
                      {i < complaint.timeline.length - 1 && <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.08)' }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: '#fff', fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>{t.event}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono', monospace" }}>{new Date(t.date).toLocaleString()}</div>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── TRACK PAGE ──────────────────────────────────────────────── */
export default function Track({ navigate }) {
  const [searchId, setSearchId] = useState('')
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [openCard, setOpenCard] = useState(-1)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLatestComplaints()
  }, [])

  const fetchLatestComplaints = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getComplaints()
      setComplaints(res.data)
    } catch (err) {
      setError('Failed to fetch complaints')
    }
    setLoading(false)
  }

  const handleSearch = async (e) => {
    if (e) e.preventDefault()
    if (!searchId.trim()) {
      fetchLatestComplaints()
      return
    }
    setSearching(true)
    setError('')
    try {
      const res = await searchComplaint(searchId)
      setComplaints([res.data])
      setOpenCard(0)
    } catch (err) {
      setError(err.message || 'Complaint not found')
      setComplaints([])
    }
    setSearching(false)
  }

  return (
    <div className="page-enter" style={{ background: BG, minHeight: '100vh', color: '#fff' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '64px 48px 48px' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(26,86,232,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,232,0.04) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,194,224,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
            color: '#f59e0b', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', animation: 'pulse 1.6s infinite' }} />
            Lifecycle Tracking
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.08,
            letterSpacing: '-2px', color: '#fff', marginBottom: 14,
          }}>
            Track Your <span style={{ background: 'linear-gradient(90deg,#f59e0b,#0ec98c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Complaints</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 540, lineHeight: 1.7 }}>
            Monitor every complaint through its lifecycle — from submission to resolution.
          </p>
        </div>
      </section>

      {/* ── SEARCH ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 24px' }}>
        <form onSubmit={handleSearch} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: SURF, borderRadius: 14, border: `1px solid ${BDIM}`,
          padding: '6px 6px 6px 20px', maxWidth: 600,
        }}>
          <Icon name="search" size={18} color="rgba(255,255,255,0.3)" />
          <input
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#fff', padding: '10px 0' }}
            placeholder="Enter tracking ID (e.g. SRT-2026-1001)"
            value={searchId} onChange={e => setSearchId(e.target.value)}
          />
          <button disabled={searching} type="submit" style={{
            padding: '10px 20px', borderRadius: 10, border: 'none',
            background: '#1a56e8', color: '#fff', cursor: 'pointer',
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
            boxShadow: '0 4px 12px rgba(26,86,232,0.3)',
            opacity: searching ? 0.7 : 1
          }}>
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </section>

      {/* ── COMPLAINT LIST ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 11,
          letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 16,
        }}>
          {searchId && complaints.length > 0 ? 'Search Result' : 'Recent Complaints'}
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading complaints from server...</div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>
        ) : complaints.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No complaints found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {complaints.map((c, i) => (
              <ComplaintCard key={c._id} complaint={c} isOpen={openCard === i} onToggle={() => setOpenCard(openCard === i ? -1 : i)} />
            ))}
          </div>
        )}
      </section>

      {/* ── AUTOMATED FOLLOW-UPS & ESCALATION ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 44 }}>
          <div style={{ flex: 1, height: 1, background: BDIM }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: '#fff', whiteSpace: 'nowrap' }}>System Automation</span>
          <div style={{ flex: 1, height: 1, background: BDIM }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {FOLLOW_UP_FEATURES.map((f, i) => (
            <FollowUpCard key={i} feature={f} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${BDIM}`, padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: '#fff' }}>Sentinel<span style={{ color: '#00c2e0' }}>-RTI</span></span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2026 Sentinel-RTI. Open Source MIT.</span>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}

function FollowUpCard({ feature }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '32px 28px', borderRadius: 16,
        background: hovered ? 'rgba(255,255,255,0.05)' : SURF,
        border: `1px solid ${hovered ? `${feature.color}35` : BDIM}`,
        transition: 'all 0.25s', cursor: 'default',
        transform: hovered ? 'translateY(-3px)' : 'none',
        borderTop: `2px solid ${hovered ? feature.color : 'transparent'}`,
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12, marginBottom: 20,
        background: `${feature.color}15`, border: `1px solid ${feature.color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={feature.icon} size={22} color={feature.color} sw={1.8} />
      </div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 10 }}>{feature.title}</div>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75 }}>{feature.desc}</p>
    </div>
  )
}
