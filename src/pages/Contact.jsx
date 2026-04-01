import React, { useState } from 'react'
import Icon from '../components/Icon'

const FAQS = [
  { q: 'Is Sentinel-RTI completely free to use?',          a: 'Yes, always. We are a civic-tech nonprofit and all complaint filing, tracking, and escalation features are permanently free for all Indian citizens. No hidden charges, no premium tiers for core features.' },
  { q: 'How long does it take to file a complaint?',       a: 'Typically under 5 minutes. Our AI handles the legal formatting, authority routing, and form submission automatically once you describe your issue. Voice input takes even less time.' },
  { q: 'Will my identity be protected?',                   a: 'We offer anonymous filing by default. Your personal details are only shared with the relevant authority if required by the RTI Act, and are protected under end-to-end encryption.' },
  { q: "What if the authority doesn't respond in time?",   a: 'Our automated escalation engine sends follow-up reminders at 7, 15, and 30 days. If no response within the statutory 30 days, a first appeal is automatically filed. Non-compliance escalates to the State Chief Information Commissioner.' },
  { q: 'Can I track multiple complaints simultaneously?',  a: 'Yes. Your dashboard shows all complaints with real-time status updates, lifecycle timelines, upcoming automated actions, and resolution history — all in one place.' },
  { q: 'Which states and authorities are supported?',      a: 'We currently cover 18 states with 340+ government authorities integrated — including municipal corporations, state PWD, water boards, electricity departments, and central government ministries.' },
]

const CONTACT_METHODS = [
  { type: 'Email',        value: 'support@sentinel-rti.in',                icon: 'mail'  },
  { type: 'Helpline',     value: '1800-RTI-HELP (Mon–Fri 9AM–6PM IST)',    icon: 'phone' },
  { type: 'Legal Aid',    value: 'legal@sentinel-rti.in',                  icon: 'scale' },
  { type: 'Headquarters', value: 'Mumbai, Maharashtra, India',             icon: 'map'   },
]

const ISSUE_TYPES = [
  'RTI Filing Assistance', 'Complaint Escalation', 'Technical Support',
  'Legal Query', 'Partnership Inquiry', 'Media / Press', 'Other',
]

const OFFICES = [
  { city: 'Mumbai',    role: 'Headquarters',     addr: 'Bandra Kurla Complex,\nMumbai 400051, Maharashtra' },
  { city: 'Delhi',     role: 'Legal Operations', addr: 'Connaught Place,\nNew Delhi 110001, Delhi' },
  { city: 'Bengaluru', role: 'Tech & Engineering', addr: 'Koramangala,\nBengaluru 560034, Karnataka' },
]

/* ── FIELD ────────────────────────────────────────────────────── */
function Field({ label, children, half = false }) {
  const [focused, setFocused] = useState(false)
  return (
    <div
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        borderBottom: `2px solid ${focused ? '#1a56e8' : '#e5e8f0'}`,
        transition: 'border-color 0.2s',
        ...(half ? {} : {}),
      }}
    >
      <label style={{
        display: 'block', padding: '18px 0 4px',
        fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 10,
        letterSpacing: 2, textTransform: 'uppercase',
        color: focused ? '#1a56e8' : '#c0c8d8', transition: 'color 0.2s',
      }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', border: 'none', outline: 'none', padding: '4px 0 16px',
  fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: '#0c0e14',
  background: 'transparent',
}

/* ── FAQ ITEM ─────────────────────────────────────────────────── */
function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom: '1px solid #e5e8f0' }}>
      <button onClick={onToggle} style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
        padding: '22px 0', width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 15, color: isOpen ? '#1a56e8' : '#0c0e14',
        textAlign: 'left', transition: 'color 0.2s',
      }}>
        <span>{faq.q}</span>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          border: `2px solid ${isOpen ? '#1a56e8' : '#e5e8f0'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 18, color: '#1a56e8', lineHeight: 1,
          background: isOpen ? '#1a56e8' : 'transparent',
          transform: isOpen ? 'rotate(45deg)' : 'none',
          transition: 'all 0.3s',
          fontFamily: "'Syne', sans-serif",
        }}>
          <span style={{ color: isOpen ? 'white' : '#1a56e8', lineHeight: 1, display: 'block', marginTop: -1 }}>+</span>
        </div>
      </button>
      <div style={{
        fontSize: 14, color: '#8b93ab', lineHeight: 1.8,
        maxHeight: isOpen ? 200 : 0, overflow: 'hidden',
        paddingBottom: isOpen ? 22 : 0,
        transition: 'max-height 0.35s ease, padding 0.35s',
      }}>
        {faq.a}
      </div>
    </div>
  )
}

/* ── CONTACT METHOD ROW ───────────────────────────────────────── */
function MethodRow({ m }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 18,
        padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingLeft: hovered ? 8 : 0, transition: 'padding 0.2s',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: hovered ? '#1a56e8' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${hovered ? '#1a56e8' : 'rgba(255,255,255,0.1)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }}>
        <Icon name={m.icon} size={18} color="rgba(255,255,255,0.6)" sw={1.8} />
      </div>
      <div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 3 }}>{m.type}</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>{m.value}</div>
      </div>
    </div>
  )
}

/* ── CONTACT PAGE ─────────────────────────────────────────────── */
export default function Contact({ navigate }) {
  const [form, setForm] = useState({ name: '', email: '', issue: ISSUE_TYPES[0], message: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const handle = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: false }))
  }

  const submit = () => {
    const newErrors = {}
    if (!form.name.trim())    newErrors.name = true
    if (!form.email.trim())   newErrors.email = true
    if (!form.message.trim()) newErrors.message = true
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }

    setSending(true)
    setTimeout(() => { setSending(false); setSent(true) }, 2200)
  }

  return (
    <div className="page-enter" style={{ background: '#fff', minHeight: '100vh' }}>

      {/* Main split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 64px)' }}>

        {/* LEFT — Dark */}
        <div style={{ background: '#0c0e14', padding: '72px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          {/* Swiss dot grid */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(255,255,255,0.025) 80px),repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(255,255,255,0.025) 80px)',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(90px,12vw,140px)', color: 'rgba(255,255,255,0.03)', lineHeight: 1, letterSpacing: -6, marginBottom: -28, userSelect: 'none' }}>RTI</div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(40px,5.5vw,64px)', color: '#fff', lineHeight: 1.08, letterSpacing: '-2px', marginBottom: 20, position: 'relative', zIndex: 1 }}>
              Talk to<br /><span style={{ color: '#00c2e0' }}>us.</span>
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, position: 'relative', zIndex: 1, maxWidth: 380 }}>
              Have a complaint, question, or partnership inquiry? We respond to every message within 24 hours.
            </p>

            <div style={{ marginTop: 48, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {CONTACT_METHODS.map(m => <MethodRow key={m.type} m={m} />)}
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 14 }}>Connect with us</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {['TW', 'GH', 'LI', 'YT', 'IN'].map(s => <SocialBtn key={s} label={s} />)}
            </div>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div style={{ background: '#fff', padding: '72px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', animation: 'fadeUp 0.5s ease' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#d1fae5', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
                <Icon name="check" size={36} color="#0ec98c" sw={2.5} />
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: '#0c0e14', marginBottom: 10 }}>Message Sent!</div>
              <p style={{ fontSize: 15, color: '#8b93ab', lineHeight: 1.7, marginBottom: 28 }}>We've received your message and will respond within 24 hours. Check your email for a confirmation.</p>
              <button onClick={() => navigate('home')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#1a56e8', color: '#fff', padding: '12px 28px', borderRadius: 9,
                border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                boxShadow: '0 4px 16px rgba(26,86,232,0.3)',
              }}>
                <Icon name="arrow" size={14} color="white" /> Back to Home
              </button>
            </div>
          ) : (
            <>
              {/* Form header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#1a56e8' }}>Send a Message</span>
                <div style={{ flex: 1, height: 1, background: '#e5e8f0' }} />
              </div>

              {/* Two-col row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div style={{ borderBottom: `2px solid ${errors.name ? '#ef4444' : '#e5e8f0'}`, borderRight: '2px solid #e5e8f0', transition: 'border-color 0.2s' }}
                  onFocus={e => e.currentTarget.style.borderBottomColor = '#1a56e8'}
                  onBlur={e => e.currentTarget.style.borderBottomColor = errors.name ? '#ef4444' : '#e5e8f0'}
                >
                  <label style={{ display: 'block', padding: '18px 0 4px', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: errors.name ? '#ef4444' : '#c0c8d8' }}>Full Name</label>
                  <input style={inputStyle} placeholder="Your name" value={form.name} onChange={e => handle('name', e.target.value)} />
                </div>
                <div style={{ borderBottom: `2px solid ${errors.email ? '#ef4444' : '#e5e8f0'}`, paddingLeft: 0, transition: 'border-color 0.2s' }}
                  onFocus={e => e.currentTarget.style.borderBottomColor = '#1a56e8'}
                  onBlur={e => e.currentTarget.style.borderBottomColor = errors.email ? '#ef4444' : '#e5e8f0'}
                >
                  <label style={{ display: 'block', padding: '18px 0 4px 16px', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: errors.email ? '#ef4444' : '#c0c8d8' }}>Email Address</label>
                  <input style={{ ...inputStyle, paddingLeft: 16 }} type="email" placeholder="you@email.com" value={form.email} onChange={e => handle('email', e.target.value)} />
                </div>
              </div>

              <Field label="Issue Type">
                <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} value={form.issue} onChange={e => handle('issue', e.target.value)}>
                  {ISSUE_TYPES.map(o => <option key={o}>{o}</option>)}
                </select>
              </Field>

              <div style={{ borderBottom: `2px solid ${errors.message ? '#ef4444' : '#e5e8f0'}`, transition: 'border-color 0.2s' }}
                onFocus={e => e.currentTarget.style.borderBottomColor = '#1a56e8'}
                onBlur={e => e.currentTarget.style.borderBottomColor = errors.message ? '#ef4444' : '#e5e8f0'}
              >
                <label style={{ display: 'block', padding: '18px 0 4px', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: errors.message ? '#ef4444' : '#c0c8d8' }}>Your Message</label>
                <textarea style={{ ...inputStyle, resize: 'none', minHeight: 88, lineHeight: 1.7 }} placeholder="Describe your issue or question..." value={form.message} onChange={e => handle('message', e.target.value)} rows={4} />
              </div>

              <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <button onClick={submit} disabled={sending} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: '#1a56e8', color: '#fff', border: 'none', cursor: sending ? 'not-allowed' : 'pointer',
                  padding: '15px 34px', borderRadius: 10,
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14,
                  boxShadow: '0 6px 24px rgba(26,86,232,0.3)', transition: 'all 0.2s',
                  opacity: sending ? 0.7 : 1,
                }}
                onMouseEnter={e => { if (!sending) e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => e.currentTarget.style.transform = ''}
                >
                  {sending
                    ? <><div style={{ width: 17, height: 17, border: '2.5px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Sending...</>
                    : <><Icon name="send" size={15} color="white" /> Send Message</>
                  }
                </button>
                <p style={{ fontSize: 12, color: '#8b93ab', lineHeight: 1.65, maxWidth: 220 }}>
                  By submitting, you agree to our <a href="#" style={{ color: '#1a56e8', textDecoration: 'none' }}>Privacy Policy</a>. We never share your data.
                </p>
              </div>

              {/* Quick action cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 32 }}>
                {[
                  { icon: 'file',  label: 'File a Complaint', sub: 'Takes under 5 minutes',    bg: '#eaf0ff', ic: '#1a56e8' },
                  { icon: 'clock', label: 'Track Status',      sub: 'Real-time updates',         bg: '#d1fae5', ic: '#0ec98c' },
                  { icon: 'bell',  label: 'Escalate Appeal',   sub: 'Auto-appeal filing',        bg: '#fef3c7', ic: '#f59e0b' },
                  { icon: 'lock',  label: 'Legal Library',     sub: 'RTI Act & case laws',       bg: '#ede9fe', ic: '#7c3aed' },
                ].map(a => <QuickCard key={a.label} a={a} />)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Map */}
      <div style={{ height: 320, background: 'linear-gradient(140deg,#eef2ff 0%,#f0f7ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', borderTop: '1px solid #e5e8f0' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(26,86,232,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,232,0.07) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#1a56e8', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(26,86,232,0.45)', position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', border: '2px solid #1a56e8', animation: 'circleOut 2s ease-out infinite' }} />
          <div style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', border: '2px solid #1a56e8', animation: 'circleOut 2s 0.7s ease-out infinite' }} />
          <Icon name="map" size={26} color="white" sw={2} />
        </div>
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '10px 22px', borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.1)', whiteSpace: 'nowrap', fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, color: '#0c0e14', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="map" size={14} color="#1a56e8" sw={2} />
          Sentinel-RTI HQ — Mumbai, Maharashtra, India
        </div>
      </div>

      {/* FAQ */}
      <section style={{ background: '#f7f8fc', padding: '80px 0' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 44, flexWrap: 'wrap', gap: 16 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(26px,4vw,36px)', color: '#0c0e14' }}>Frequently Asked Questions</h2>
            <a href="#" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, color: '#1a56e8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              View all docs <Icon name="arrow" size={14} color="#1a56e8" />
            </a>
          </div>
          {FAQS.map((faq, i) => (
            <FaqItem key={i} faq={faq} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
          ))}

          {/* Office grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid #e5e8f0', marginTop: 64 }}>
            {OFFICES.map((o, i) => <OfficeCard key={i} o={o} last={i === OFFICES.length - 1} />)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0c0e14', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: '#fff' }}>
          Sentinel<span style={{ color: '#00c2e0' }}>-RTI</span>
        </span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'RTI Act', 'GitHub'].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontFamily: "'Syne', sans-serif", transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#00c2e0'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
            >{l}</a>
          ))}
        </div>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2026 Sentinel-RTI. Open Source MIT.</span>
      </footer>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes scaleIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes circleOut { from{transform:scale(1);opacity:.6} to{transform:scale(2.6);opacity:0} }
      `}</style>
    </div>
  )
}

function SocialBtn({ label }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 42, height: 42, borderRadius: 8,
        background: hovered ? '#1a56e8' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${hovered ? '#1a56e8' : 'rgba(255,255,255,0.1)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Space Mono', monospace", fontSize: 11, color: hovered ? '#fff' : 'rgba(255,255,255,0.35)',
        cursor: 'pointer', transition: 'all 0.2s', transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >{label}</div>
  )
}

function QuickCard({ a }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '16px 18px', borderRadius: 12,
        border: `1px solid ${hovered ? '#1a56e8' : '#e5e8f0'}`,
        cursor: 'pointer', transition: 'all 0.2s',
        boxShadow: hovered ? '0 4px 20px rgba(26,86,232,0.1)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={a.icon} size={18} color={a.ic} sw={1.8} />
      </div>
      <div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: '#0c0e14' }}>{a.label}</div>
        <div style={{ fontSize: 12, color: '#8b93ab', marginTop: 2 }}>{a.sub}</div>
      </div>
    </div>
  )
}

function OfficeCard({ o, last }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '32px 28px',
        borderRight: last ? 'none' : '1px solid #e5e8f0',
        background: hovered ? '#fff' : 'transparent', transition: 'background 0.2s',
      }}
    >
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: '#0c0e14', marginBottom: 4 }}>{o.city}</div>
      <div style={{ fontSize: 11, color: '#1a56e8', fontWeight: 600, fontFamily: "'Syne', sans-serif", letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 14 }}>{o.role}</div>
      <div style={{ fontSize: 13, color: '#8b93ab', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{o.addr}</div>
    </div>
  )
}
