import React, { useState, useEffect } from 'react'
import Icon from '../components/Icon'
import { searchComplaint, getComplaints } from '../services/api'
import { useTheme } from '../App'

/* ── STATUS PIPELINE ─────────────────────────────────────────── */
const STATUSES = [
  { key: 'submitted', label: 'Submitted', color: '#3b74ff' },
  { key: 'pending',   label: 'Pending',   color: '#1a56e8' },
  { key: 'escalated', label: 'Escalated', color: '#ef4444' },
  { key: 'resolved',  label: 'Resolved',  color: '#1a56e8' },
]

const FOLLOW_UP_FEATURES = [
  { icon: 'clock',       title: 'Automated Reminders',  color: '#3b74ff', desc: 'System sends follow-up reminders to authorities at 7, 15, and 30 days. No manual intervention needed.' },
  { icon: 'file',        title: 'Appeal Generation',    color: '#1a56e8', desc: 'If no response within 30 days, the system automatically generates and files a first appeal under RTI Act Section 19.' },
  { icon: 'alertCircle', title: 'CIC Escalation',       color: '#3b74ff', desc: 'Non-compliance is escalated to the State Chief Information Commission with complete case documentation.' },
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

/* ── COMPLAINT CARD ──────────────────────────────────────────── */
function ComplaintCard({ complaint, isOpen, onToggle, dark }) {
  const [hovered, setHovered] = useState(false)
  const statusInfo = STATUSES.find(s => s.key === complaint.status) || STATUSES[0]
  const statusIndex = STATUSES.findIndex(s => s.key === complaint.status)

  const bg = dark ? '#07090f' : '#f0f4fa'
  const surf = dark ? '#0d1117' : '#ffffff'
  const bdim = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const txtPri = dark ? '#fff' : '#0f172a'
  const txtMut = dark ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.45)'
  const txtFaint = dark ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.28)'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? (dark ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.02)') : surf,
        border: `1px solid ${isOpen ? 'rgba(26,86,232,0.35)' : bdim}`,
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
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: txtPri, transition: 'color 0.35s' }}>{complaint.trackingId}</span>
              <StatusPill status={complaint.status} />
            </div>
            <div style={{ fontSize: 13, color: txtMut, transition: 'color 0.35s' }}>{complaint.category} → {complaint.authority || 'Assigning...'}</div>
          </div>
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          border: `2px solid ${isOpen ? '#1a56e8' : bdim}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          background: isOpen ? '#1a56e8' : 'transparent',
          transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'all 0.3s',
        }}>
          <Icon name="chevronRight" size={14} color={isOpen ? '#fff' : txtMut} sw={2.5} />
        </div>
      </button>

      <div style={{
        maxHeight: isOpen ? 1000 : 0, overflow: 'hidden',
        transition: 'max-height 0.35s ease',
      }}>
        <div style={{ padding: '0 28px 28px', borderTop: `1px solid ${bdim}` }}>
          <div style={{ padding: '20px 0', borderBottom: `1px solid ${bdim}` }}>
            <p style={{ fontSize: 14, color: dark ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.7)', lineHeight: 1.7, marginBottom: 12, transition: 'color 0.35s' }}>
              {complaint.description}
            </p>
            {complaint.imageUrl && (
              <div style={{ marginTop: 16, borderRadius: 12, overflow: 'hidden', border: `1px solid ${bdim}` }}>
                 <p style={{ fontSize: 11, color: txtFaint, padding: '8px 12px', background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}> EVIDENCE ATTACHED </p>
                 <img src={complaint.imageUrl} alt="Evidence" style={{ width: '100%', maxHeight: 300, objectFit: 'contain', background: dark ? '#000' : '#f8f8f8' }} />
              </div>
            )}
          </div>

          {/* Legal Draft View */}
          {complaint.legalDraft && (
            <div style={{ marginTop: 24, padding: 24, background: dark ? '#111827' : '#f8fafc', borderRadius: 12, border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 9, fontFamily: "'Space Mono', monospace", color: txtMut, fontWeight: 800 }}>FORMAL RTI DOCUMENT</div>
              <div style={{ 
                fontFamily: "'Courier Prime', 'Courier New', monospace", fontSize: 13, 
                color: dark ? 'rgba(255,255,255,0.8)' : '#1e293b', lineHeight: 1.5, maxHeight: 300, overflowY: 'auto',
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
                style={{ marginTop: 16, width: '100%', padding: '10px', background: '#1a56e8', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
              >
                Download Formal .TXT Document
              </button>
            </div>
          )}

          {/* Status pipeline */}
          <div style={{ padding: '24px 0' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: txtFaint, marginBottom: 20 }}>Current Lifecycle Stage</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {STATUSES.map((s, i) => {
                const reached = i <= statusIndex
                return (
                  <div key={s.key} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: reached ? `${s.color}25` : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                        border: `2px solid ${reached ? s.color : bdim}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s',
                      }}>
                        {reached && <Icon name="check" size={13} color={s.color} sw={2.5} />}
                      </div>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: reached ? s.color : txtFaint, letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</span>
                    </div>
                    {i < STATUSES.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: reached && i < statusIndex ? s.color : (dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'), margin: '0 8px', marginBottom: 20, transition: 'background 0.3s' }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timeline */}
          {complaint.timeline && complaint.timeline.length > 0 && (
            <>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: txtFaint, marginBottom: 16 }}>Activity Timeline</div>
              {complaint.timeline.map((t, i) => {
                const tStatus = STATUSES.find(s => s.key === t.status) || STATUSES[0]
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '10px 0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: tStatus.color, flexShrink: 0, border: `2px solid ${bg}` }} />
                      {i < complaint.timeline.length - 1 && <div style={{ width: 1, height: 28, background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: txtPri, fontFamily: "'Syne', sans-serif", fontWeight: 600, transition: 'color 0.35s' }}>{t.event}</div>
                      <div style={{ fontSize: 11, color: txtFaint, fontFamily: "'Space Mono', monospace" }}>{new Date(t.date).toLocaleString()}</div>
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
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const bg   = dark ? '#07090f' : '#f0f4fa'
  const surf = dark ? '#0d1117' : '#ffffff'
  const bdim = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const txtPri = dark ? '#fff' : '#0f172a'
  const txtMut = dark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.5)'
  const txtFaint = dark ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.25)'

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
    <div className="page-enter" style={{ background: bg, minHeight: '100vh', color: txtPri, paddingTop: 72, transition: 'background 0.35s, color 0.35s' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '64px 48px 48px' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(rgba(26,86,232,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,232,0.04) 1px,transparent 1px)`, backgroundSize: '64px 64px' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.08,
            letterSpacing: '-2px', color: txtPri, marginBottom: 14,
            transition: 'color 0.35s',
          }}>
            Track Your <span style={{ background: 'linear-gradient(90deg,#1a56e8,#3b74ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Complaints</span>
          </h1>
          <p style={{ fontSize: 16, color: txtMut, maxWidth: 540, lineHeight: 1.7, transition: 'color 0.35s' }}>
            Monitor every complaint through its lifecycle — from submission to resolution.
          </p>
        </div>
      </section>

      {/* ── SEARCH ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 24px' }}>
        <form onSubmit={handleSearch} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: surf, borderRadius: 14, border: `1px solid ${bdim}`,
          padding: '6px 6px 6px 20px', maxWidth: 600,
          transition: 'background 0.35s',
        }}>
          <Icon name="search" size={18} color={txtFaint} />
          <input
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: txtPri, padding: '10px 0' }}
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
          letterSpacing: 2, textTransform: 'uppercase', color: txtFaint, marginBottom: 16,
        }}>
          {searchId && complaints.length > 0 ? 'Search Result' : 'Recent Complaints'}
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: txtFaint }}>Loading complaints from server...</div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>
        ) : complaints.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: txtFaint }}>No complaints found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {complaints.map((c, i) => (
              <ComplaintCard key={c._id} complaint={c} isOpen={openCard === i} onToggle={() => setOpenCard(openCard === i ? -1 : i)} dark={dark} />
            ))}
          </div>
        )}
      </section>

      {/* ── AUTOMATED FOLLOW-UPS & ESCALATION ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 48px' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: txtPri, marginBottom: 32, transition: 'color 0.35s' }}>System Automation</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {FOLLOW_UP_FEATURES.map((f, i) => (
            <FollowUpCard key={i} feature={f} dark={dark} surf={surf} bdim={bdim} txtPri={txtPri} txtMut={txtMut} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${bdim}`, padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: txtPri, transition: 'color 0.35s' }}>Sentinel<span style={{ color: '#3b74ff' }}>-RTI</span></span>
        <span style={{ fontSize: 12, color: txtFaint, transition: 'color 0.35s' }}>© 2026 Sentinel-RTI. Open Source MIT.</span>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: ${txtFaint}; }
      `}</style>
    </div>
  )
}

function FollowUpCard({ feature, dark, surf, bdim, txtPri, txtMut }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '32px 28px', borderRadius: 16,
        background: hovered ? (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)') : surf,
        border: `1px solid ${hovered ? `${feature.color}35` : bdim}`,
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
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: txtPri, marginBottom: 10, transition: 'color 0.35s' }}>{feature.title}</div>
      <p style={{ fontSize: 14, color: txtMut, lineHeight: 1.75, transition: 'color 0.35s' }}>{feature.desc}</p>
    </div>
  )
}
