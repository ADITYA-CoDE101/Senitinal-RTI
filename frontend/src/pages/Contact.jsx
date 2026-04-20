import React, { useState } from 'react'
import Icon from '../components/Icon'
import { submitContactForm } from '../services/api'

/* ── DATA (unchanged) ─────────────────────────────────────────── */
const FAQS = [
  { q: 'Is Sentinel-RTI completely free to use?',         a: 'Yes, always. We are a civic-tech nonprofit and all complaint filing, tracking, and escalation features are permanently free for all Indian citizens. No hidden charges, no premium tiers for core features.' },
  { q: 'How long does it take to file a complaint?',      a: 'Typically under 5 minutes. Our AI handles the legal formatting, authority routing, and form submission automatically once you describe your issue. Voice input takes even less time.' },
  { q: 'Will my identity be protected?',                  a: 'We offer anonymous filing by default. Your personal details are only shared with the relevant authority if required by the RTI Act, and are protected under end-to-end encryption.' },
  { q: "What if the authority doesn't respond in time?",  a: 'Our automated escalation engine sends follow-up reminders at 7, 15, and 30 days. If no response within the statutory 30 days, a first appeal is automatically filed. Non-compliance escalates to the State CIC.' },
  { q: 'Can I track multiple complaints simultaneously?', a: 'Yes. Your dashboard shows all complaints with real-time status updates, lifecycle timelines, upcoming automated actions, and resolution history — all in one place.' },
  { q: 'Which states and authorities are supported?',     a: 'We currently cover 18 states with 340+ government authorities integrated — including municipal corporations, state PWD, water boards, electricity departments, and central government ministries.' },
]

const CONTACT_METHODS = [
  { type: 'Email',        value: 'support@sentinel-rti.in',              icon: 'mail'  },
  { type: 'Helpline',     value: '1800-RTI-HELP (Mon–Fri 9AM–6PM IST)', icon: 'phone' },
  { type: 'Legal Aid',    value: 'legal@sentinel-rti.in',                icon: 'scale' },
  { type: 'Headquarters', value: 'Mumbai, Maharashtra, India',           icon: 'map'   },
]

const ISSUE_TYPES = [
  'RTI Filing Assistance', 'Complaint Escalation', 'Technical Support',
  'Legal Query', 'Partnership Inquiry', 'Media / Press', 'Other',
]

const OFFICES = [
  { city: 'Mumbai',    role: 'Headquarters',      addr: 'Bandra Kurla Complex, Mumbai 400051, Maharashtra' },
  { city: 'Delhi',     role: 'Legal Operations',  addr: 'Connaught Place, New Delhi 110001, Delhi' },
  { city: 'Bengaluru', role: 'Tech & Engineering', addr: 'Koramangala, Bengaluru 560034, Karnataka' },
]

const QUICK_ACTIONS = [
  { icon: 'file',     label: 'File a Complaint', sub: 'Takes under 5 minutes', color: '#1a56e8', bg: 'rgba(26,86,232,0.12)'  },
  { icon: 'clock',    label: 'Track Status',      sub: 'Real-time updates',    color: '#0ec98c', bg: 'rgba(14,201,140,0.12)' },
  { icon: 'bell',     label: 'Escalate Appeal',   sub: 'Auto-appeal filing',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { icon: 'lock',     label: 'Legal Library',     sub: 'RTI Act & case laws',  color: '#00c2e0', bg: 'rgba(0,194,224,0.12)'  },
]

/* ── DARK TOKENS ──────────────────────────────────────────────── */
const BG    = '#07090f'
const SURF  = '#0d1117'
const GLASS = 'rgba(255,255,255,0.04)'
const BDIM  = 'rgba(255,255,255,0.06)'
const BBASE = 'rgba(255,255,255,0.10)'
const BBLUE = 'rgba(26,86,232,0.30)'

/* ── DARK INPUT FIELD ─────────────────────────────────────────── */
function DarkField({ label, error, children }) {
  const [focused, setFocused] = useState(false)
  return (
    <div
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        borderBottom: `2px solid ${focused ? '#1a56e8' : error ? '#ef4444' : 'rgba(255,255,255,0.10)'}`,
        transition: 'border-color 0.2s', paddingBottom: 0,
      }}
    >
      <label style={{
        display: 'block', padding: '16px 0 6px',
        fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 10,
        letterSpacing: 2, textTransform: 'uppercase',
        color: focused ? '#00c2e0' : error ? '#ef4444' : 'rgba(255,255,255,0.25)',
        transition: 'color 0.2s',
      }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', border: 'none', outline: 'none', padding: '4px 0 14px',
  fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#fff',
  background: 'transparent',
}

/* ── CONTACT METHOD ROW ───────────────────────────────────────── */
function MethodRow({ m }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 0', borderBottom: `1px solid ${BDIM}`,
        paddingLeft: hovered ? 8 : 0, transition: 'padding 0.2s',
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 10, flexShrink: 0,
        background: hovered ? '#1a56e8' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${hovered ? '#1a56e8' : BBASE}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
        boxShadow: hovered ? '0 4px 16px rgba(26,86,232,0.4)' : 'none',
      }}>
        <Icon name={m.icon} size={17} color="rgba(255,255,255,0.65)" sw={1.8} />
      </div>
      <div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 3 }}>{m.type}</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>{m.value}</div>
      </div>
    </div>
  )
}

/* ── FAQ ITEM ─────────────────────────────────────────────────── */
function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom: `1px solid ${BDIM}` }}>
      <button onClick={onToggle} style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
        padding: '20px 0', width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 15,
        color: isOpen ? '#00c2e0' : 'rgba(255,255,255,0.8)',
        textAlign: 'left', transition: 'color 0.2s',
      }}>
        <span>{faq.q}</span>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          border: `2px solid ${isOpen ? '#1a56e8' : 'rgba(255,255,255,0.12)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          background: isOpen ? '#1a56e8' : 'transparent',
          transform: isOpen ? 'rotate(45deg)' : 'none',
          transition: 'all 0.3s', fontFamily: "'Syne',sans-serif", lineHeight: 1,
        }}>
          <span style={{ color: '#fff', lineHeight: 1, display: 'block', marginTop: -1, fontSize: 18 }}>+</span>
        </div>
      </button>
      <div style={{
        fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8,
        maxHeight: isOpen ? 200 : 0, overflow: 'hidden',
        paddingBottom: isOpen ? 20 : 0, transition: 'max-height 0.35s ease, padding 0.35s',
      }}>{faq.a}</div>
    </div>
  )
}

/* ── QUICK CARD ───────────────────────────────────────────────── */
function QuickCard({ a }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
        borderRadius: 12, border: `1px solid ${hovered ? BBLUE : BDIM}`,
        background: hovered ? 'rgba(26,86,232,0.06)' : GLASS,
        cursor: 'pointer', transition: 'all 0.2s',
        boxShadow: hovered ? '0 4px 20px rgba(26,86,232,0.15)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${a.color}25` }}>
        <Icon name={a.icon} size={17} color={a.color} sw={1.8} />
      </div>
      <div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff' }}>{a.label}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{a.sub}</div>
      </div>
    </div>
  )
}

/* ── OFFICE CARD ──────────────────────────────────────────────── */
function OfficeCard({ o, last }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '28px 24px',
        borderRight: last ? 'none' : `1px solid ${BDIM}`,
        background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        transition: 'background 0.2s',
      }}
    >
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', marginBottom: 4 }}>{o.city}</div>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#00c2e0', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>{o.role}</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.75 }}>{o.addr}</div>
    </div>
  )
}

/* ── SOCIAL BTN ───────────────────────────────────────────────── */
function SocialBtn({ label }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 40, height: 40, borderRadius: 8,
        background: hovered ? '#1a56e8' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${hovered ? '#1a56e8' : BBASE}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Space Mono',monospace", fontSize: 10, color: hovered ? '#fff' : 'rgba(255,255,255,0.35)',
        cursor: 'pointer', transition: 'all 0.2s',
        boxShadow: hovered ? '0 4px 14px rgba(26,86,232,0.4)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >{label}</div>
  )
}

/* ── CONTACT PAGE ─────────────────────────────────────────────── */
export default function Contact({ navigate }) {
  const [form, setForm]       = useState({ name: '', email: '', issue: ISSUE_TYPES[0], message: '' })
  const [errors, setErrors]   = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)
  const [apiError, setApiError] = useState('')
  const [openFaq, setOpenFaq] = useState(null)

  const handle = (key, val) => { setForm(f => ({ ...f, [key]: val })); if (errors[key]) setErrors(e => ({ ...e, [key]: false })); setApiError('') }

  const submit = async () => {
    const errs = {}
    if (!form.name.trim())    errs.name = true
    if (!form.email.trim())   errs.email = true
    if (!form.message.trim()) errs.message = true
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSending(true)
    setApiError('')
    try {
      await submitContactForm(form)
      setSending(false)
      setSent(true)
    } catch (error) {
      setSending(false)
      setApiError(error.message || 'Failed to send message. Please try again.')
    }
  }

  const gridBg = {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(255,255,255,0.025) 80px),repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(255,255,255,0.025) 80px)',
  }

  return (
    <div className="page-enter" style={{ background: BG, minHeight: '100vh', color: '#fff' }}>

      {/* ── HERO SPLIT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 64px)' }}>

        {/* LEFT DARK PANE */}
        <div style={{ background: SURF, padding: '72px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', borderRight: `1px solid ${BDIM}` }}>
          <div style={gridBg} />
          {/* Glow orbs */}
          <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,232,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(80px,12vw,130px)', color: 'rgba(255,255,255,0.03)', lineHeight: 1, letterSpacing: -6, marginBottom: -24, userSelect: 'none' }}>RTI</div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(38px,5vw,60px)', color: '#fff', lineHeight: 1.08, letterSpacing: '-2px', marginBottom: 16, position: 'relative', zIndex: 1 }}>
              Talk to<br /><span style={{ color: '#00c2e0' }}>us.</span>
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, position: 'relative', zIndex: 1, maxWidth: 360 }}>
              Have a complaint, question, or partnership inquiry? We respond to every message within 24 hours.
            </p>

            <div style={{ marginTop: 40, borderTop: `1px solid ${BDIM}` }}>
              {CONTACT_METHODS.map(m => <MethodRow key={m.type} m={m} />)}
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 14 }}>Connect with us</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {['TW', 'GH', 'LI', 'YT', 'IN'].map(s => <SocialBtn key={s} label={s} />)}
            </div>
          </div>
        </div>

        {/* RIGHT FORM PANE */}
        <div style={{ background: BG, padding: '72px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', animation: 'fadeUp 0.5s ease' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(14,201,140,0.15)', border: '2px solid rgba(14,201,140,0.3)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)', boxShadow: '0 0 32px rgba(14,201,140,0.25)' }}>
                <Icon name="check" size={36} color="#0ec98c" sw={2.5} />
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 28, color: '#fff', marginBottom: 10 }}>Message Sent!</div>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 28 }}>We've received your message and will respond within 24 hours.</p>
              <button onClick={() => navigate('home')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1a56e8', color: '#fff', padding: '12px 28px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, boxShadow: '0 4px 16px rgba(26,86,232,0.4)' }}>
                <Icon name="arrow" size={14} color="white" /> Back to Home
              </button>
            </div>
          ) : (
            <>
              {/* Form header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#00c2e0' }}>Send a Message</span>
                <div style={{ flex: 1, height: 1, background: BDIM }} />
              </div>

              {/* Two-col row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <DarkField label="Full Name" error={errors.name}>
                  <input style={{ ...inputStyle, paddingRight: 16 }} placeholder="Your name" value={form.name} onChange={e => handle('name', e.target.value)} />
                </DarkField>
                <DarkField label="Email Address" error={errors.email}>
                  <input style={{ ...inputStyle, paddingLeft: 16 }} type="email" placeholder="you@email.com" value={form.email} onChange={e => handle('email', e.target.value)} />
                </DarkField>
              </div>

              <DarkField label="Issue Type">
                <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} value={form.issue} onChange={e => handle('issue', e.target.value)}>
                  {ISSUE_TYPES.map(o => <option key={o} style={{ background: SURF }}>{o}</option>)}
                </select>
              </DarkField>

              <DarkField label="Your Message" error={errors.message}>
                <textarea style={{ ...inputStyle, resize: 'none', minHeight: 88, lineHeight: 1.7 }} placeholder="Describe your issue or question..." value={form.message} onChange={e => handle('message', e.target.value)} rows={4} />
              </DarkField>

              {/* Submit row */}
              <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <button onClick={submit} disabled={sending} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9,
                  background: '#1a56e8', color: '#fff', border: 'none',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  padding: '14px 32px', borderRadius: 10,
                  fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14,
                  boxShadow: '0 6px 24px rgba(26,86,232,0.35)', transition: 'all 0.2s',
                  opacity: sending ? 0.7 : 1,
                }}
                onMouseEnter={e => { if (!sending) { e.currentTarget.style.background = '#3b74ff'; e.currentTarget.style.transform = 'translateY(-2px)' } }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1a56e8'; e.currentTarget.style.transform = '' }}
                >
                  {sending
                    ? <><div style={{ width: 17, height: 17, border: '2.5px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Sending...</>
                    : <><Icon name="send" size={15} color="white" /> Send Message</>
                  }
                </button>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.65 }}>
                  We never share your data.<br />
                  <a href="#" style={{ color: '#1a56e8' }}>Privacy Policy</a>
                </p>
              </div>

              {/* Error message from backend */}
              {apiError && (
                <div style={{
                  marginTop: 16, padding: '12px 18px', borderRadius: 10,
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#ef4444', fontSize: 13, fontFamily: "'DM Sans',sans-serif",
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 16 }}>⚠</span> {apiError}
                </div>
              )}

              {/* Quick actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 28 }}>
                {QUICK_ACTIONS.map(a => <QuickCard key={a.label} a={a} />)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── MAP ── */}
      <div style={{ height: 280, background: 'linear-gradient(140deg,#0a0f1e 0%,#07090f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', borderTop: `1px solid ${BDIM}` }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(26,86,232,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,232,0.07) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center,rgba(26,86,232,0.12) 0%,transparent 60%)' }} />
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#1a56e8', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 32px rgba(26,86,232,0.6)', position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', border: '2px solid rgba(26,86,232,0.6)', animation: 'circleOut 2s ease-out infinite' }} />
          <div style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', border: '2px solid rgba(26,86,232,0.6)', animation: 'circleOut 2s 0.7s ease-out infinite' }} />
          <Icon name="map" size={26} color="white" sw={2} />
        </div>
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: SURF, padding: '10px 22px', borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.5)', whiteSpace: 'nowrap', fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${BDIM}` }}>
          <Icon name="map" size={14} color="#1a56e8" sw={2} />
          Sentinel-RTI HQ — Mumbai, Maharashtra, India
        </div>
      </div>

      {/* ── FAQ ── */}
      <section style={{ background: SURF, borderTop: `1px solid ${BDIM}`, padding: '80px 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 44, flexWrap: 'wrap', gap: 16 }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(24px,4vw,34px)', color: '#fff' }}>Frequently Asked Questions</h2>
            <a href="#" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13, color: '#1a56e8', display: 'flex', alignItems: 'center', gap: 6 }}>
              View all docs <Icon name="arrow" size={14} color="#1a56e8" />
            </a>
          </div>

          {FAQS.map((faq, i) => <FaqItem key={i} faq={faq} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />)}

          {/* Offices */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', border: `1px solid ${BDIM}`, borderRadius: 12, overflow: 'hidden', marginTop: 56 }}>
            {OFFICES.map((o, i) => <OfficeCard key={i} o={o} last={i === OFFICES.length - 1} />)}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${BDIM}`, padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: '#fff' }}>Sentinel<span style={{ color: '#00c2e0' }}>-RTI</span></span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Home','About','Contact','RTI Act','GitHub'].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: "'Syne',sans-serif", transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#00c2e0'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}>{l}</a>
          ))}
        </div>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2026 Sentinel-RTI. Open Source MIT.</span>
      </footer>

      <style>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes scaleIn   { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes circleOut { from{transform:scale(1);opacity:.6} to{transform:scale(2.6);opacity:0} }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        input, textarea, select { color-scheme: dark; }
        @media(max-width:900px) {
          div[style*="grid-template-columns: 1fr 1fr"]:first-of-type { grid-template-columns:1fr !important; min-height:auto !important; }
          div[style*="grid-template-columns: repeat(3,1fr)"] { grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  )
}
