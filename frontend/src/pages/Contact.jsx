import React, { useState } from 'react'
import Icon from '../components/Icon'
import { submitContactForm } from '../services/api'
import { useTheme } from '../App'

const FAQS = [
  { q: 'Is Sentinel-RTI completely free to use?',         a: 'Yes, always. We are a civic-tech initiative and all complaint filing, tracking, and escalation features are permanently free for all Indian citizens. No hidden charges, no premium tiers for core features.' },
  { q: 'How long does it take to file a complaint?',      a: 'Typically under 5 minutes. Our AI handles the legal formatting, authority routing, and form submission automatically once you describe your issue. Voice input takes even less time.' },
  { q: 'Will my identity be protected?',                  a: 'We offer anonymous filing by default. Your personal details are only shared with the relevant authority if required by the RTI Act, and are protected under end-to-end encryption.' },
  { q: "What if the authority doesn't respond in time?",  a: 'Our automated escalation engine sends follow-up reminders at 7, 15, and 30 days. If no response within the statutory 30 days, a first appeal is automatically filed. Non-compliance escalates to the State CIC.' },
  { q: 'Can I track multiple complaints simultaneously?', a: 'Yes. Your dashboard shows all complaints with real-time status updates, lifecycle timelines, upcoming automated actions, and resolution history — all in one place.' },
  { q: 'Which states and authorities are supported?',     a: 'We currently cover 18 states with 340+ government authorities integrated — including municipal corporations, state PWD, water boards, electricity departments, and central government ministries.' },
]

const CONTACT_METHODS = [
  { type: 'Email',     value: 'support@sentinel-rti.in',               icon: 'mail'  },
  { type: 'Helpline',  value: '1800-RTI-HELP (Mon–Fri 9AM–6PM IST)',  icon: 'phone' },
  { type: 'Legal Aid', value: 'legal@sentinel-rti.in',                 icon: 'scale' },
  { type: 'Platform',  value: 'Built for Indian citizens, nationwide', icon: 'map'   },
]

const ISSUE_TYPES = [
  'RTI Filing Assistance','Complaint Escalation','Technical Support',
  'Legal Query','Partnership Inquiry','Media / Press','Other',
]

const QUICK_ACTIONS = [
  { icon:'file',  label:'File a Complaint', sub:'Takes under 5 minutes', color:'#1a56e8', bg:'rgba(26,86,232,0.12)'  },
  { icon:'clock', label:'Track Status',     sub:'Real-time updates',     color:'#1a56e8', bg:'rgba(26,86,232,0.12)' },
  { icon:'bell',  label:'Escalate Appeal',  sub:'Auto-appeal filing',    color:'#3b74ff', bg:'rgba(59,116,255,0.12)' },
  { icon:'lock',  label:'Legal Library',    sub:'RTI Act & case laws',   color:'#1a56e8', bg:'rgba(26,86,232,0.12)'  },
]

const SUPPORT_PILLARS = [
  { title: 'Citizens Served',  value: '12,400+',    desc: 'RTI complaints filed and tracked across India.' },
  { title: 'Response Rate',    value: '89%',         desc: 'Successful authority responses within 30 days.' },
  { title: 'States Covered',   value: '18 States',   desc: 'Government departments integrated nationwide.' },
]

function FaqItem({ faq, isOpen, onToggle, txtPri, txtMut, bdim }) {
  return (
    <div style={{ borderBottom: `1px solid ${bdim}` }}>
      <button onClick={onToggle} style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
        padding: '20px 0', width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        fontFamily:"'Syne',sans-serif", fontWeight: 600, fontSize: 15,
        color: isOpen ? '#3b74ff' : txtPri, textAlign: 'left', transition: 'color 0.2s',
      }}>
        <span>{faq.q}</span>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          border: `2px solid ${isOpen ? '#1a56e8' : bdim}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isOpen ? '#1a56e8' : 'transparent',
          transition: 'all 0.3s',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>
      <div style={{
        fontSize: 14, color: txtMut, lineHeight: 1.8,
        maxHeight: isOpen ? 240 : 0, overflow: 'hidden',
        paddingBottom: isOpen ? 20 : 0, transition: 'max-height 0.38s ease, padding 0.38s',
      }}>{faq.a}</div>
    </div>
  )
}

function MethodRow({ m, hoverStyle }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: `1px solid ${hoverStyle.bdim}`, paddingLeft: hovered ? 8 : 0, transition: 'padding 0.2s' }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: hovered ? '#1a56e8' : hoverStyle.glass, border: `1px solid ${hovered ? '#1a56e8' : hoverStyle.bdim}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: hovered ? '0 4px 16px rgba(26,86,232,0.35)' : 'none' }}>
        <Icon name={m.icon} size={16} color={hovered ? 'white' : hoverStyle.txtMut} sw={1.8} />
      </div>
      <div>
        <div style={{ fontFamily:"'Space Mono',monospace", fontWeight: 700, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: hoverStyle.txtFaint, marginBottom: 3 }}>{m.type}</div>
        <div style={{ fontSize: 14, color: hoverStyle.txtPri }}>{m.value}</div>
      </div>
    </div>
  )
}



function QuickCard({ a, bdim, txtPri, txtMut }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, border: `1px solid ${hovered ? 'rgba(26,86,232,0.3)' : bdim}`, background: hovered ? 'rgba(26,86,232,0.06)' : 'var(--bg-glass)', cursor: 'pointer', transition: 'all 0.2s', boxShadow: hovered ? '0 4px 20px rgba(26,86,232,0.12)' : 'none', transform: hovered ? 'translateY(-2px)' : 'none' }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 10, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${a.color}25` }}>
        <Icon name={a.icon} size={16} color={a.color} sw={1.8} />
      </div>
      <div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: txtPri }}>{a.label}</div>
        <div style={{ fontSize: 11, color: txtMut, marginTop: 2 }}>{a.sub}</div>
      </div>
    </div>
  )
}

export default function Contact({ navigate }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [form, setForm]       = useState({ name:'', email:'', issue:ISSUE_TYPES[0], message:'' })
  const [errors, setErrors]   = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)
  const [apiError, setApiError] = useState('')
  const [openFaq, setOpenFaq] = useState(null)

  const bg      = dark ? '#07090f' : '#f0f4fa'
  const surf    = dark ? '#0d1117' : '#ffffff'
  const bdim    = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const glass   = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
  const txtPri  = dark ? '#ffffff' : '#0f172a'
  const txtMut  = dark ? 'rgba(255,255,255,0.50)' : 'rgba(15,23,42,0.55)'
  const txtFaint= dark ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.32)'
  const inputTxt= dark ? '#fff' : '#0f172a'

  const handle = (key, val) => { setForm(f => ({ ...f, [key]: val })); if (errors[key]) setErrors(e => ({ ...e, [key]: false })); setApiError('') }

  const submit = async () => {
    const errs = {}
    if (!form.name.trim())    errs.name = true
    if (!form.email.trim())   errs.email = true
    if (!form.message.trim()) errs.message = true
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSending(true); setApiError('')
    try {
      await submitContactForm(form)
      setSending(false); setSent(true)
    } catch (err) {
      setSending(false); setApiError(err.message || 'Failed to send message. Please try again.')
    }
  }

  const [focusedField, setFocusedField] = useState(null)
  const fieldBorder = (key) => `2px solid ${focusedField === key ? '#1a56e8' : errors[key] ? '#ef4444' : bdim}`

  const inputStyle = { width: '100%', border: 'none', outline: 'none', padding: '4px 0 14px', fontFamily:"'DM Sans',sans-serif", fontSize: 15, color: inputTxt, background: 'transparent' }
  const labelStyle = (key) => ({ display:'block', padding:'16px 0 6px', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:10, letterSpacing:2, textTransform:'uppercase', color: focusedField===key ? '#3b74ff' : errors[key] ? '#ef4444' : txtFaint, transition:'color 0.2s' })

  const gridBg = { position:'absolute', inset:0, pointerEvents:'none', backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 79px,${dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'} 80px),repeating-linear-gradient(90deg,transparent,transparent 79px,${dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'} 80px)` }
  const hs = { bdim, glass, txtPri, txtMut, txtFaint }

  return (
    <div className="page-enter" style={{ background: bg, minHeight:'100vh', color:txtPri, paddingTop:72, transition:'background 0.35s,color 0.35s' }}>

      {/* Hero split */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'calc(100vh - 72px)' }}>

        {/* Left pane */}
        <div style={{ background:surf, padding:'64px 52px', display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative', overflow:'hidden', borderRight:`1px solid ${bdim}`, transition:'background 0.35s' }}>
          <div style={gridBg} />

          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'clamp(72px,11vw,118px)', color: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)', lineHeight:1, letterSpacing:-6, marginBottom:-20, userSelect:'none' }}>RTI</div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'clamp(34px,4.5vw,54px)', color:txtPri, lineHeight:1.1, letterSpacing:'-1.5px', marginBottom:14, position:'relative', zIndex:1, transition:'color 0.35s' }}>
              Talk to<br /><span style={{ color:'#3b74ff' }}>us.</span>
            </h1>
            <p style={{ fontSize:14, color:txtMut, lineHeight:1.8, position:'relative', zIndex:1, maxWidth:340, transition:'color 0.35s' }}>
              Have a complaint, question, or partnership inquiry? We respond to every message within 24 hours.
            </p>
            <div style={{ marginTop:36, borderTop:`1px solid ${bdim}` }}>
              {CONTACT_METHODS.map(m => <MethodRow key={m.type} m={m} hoverStyle={hs} />)}
            </div>
          </div>

        </div>

        {/* Right form pane */}
        <div style={{ background:bg, padding:'64px 52px', display:'flex', flexDirection:'column', justifyContent:'center', transition:'background 0.35s' }}>
          {sent ? (
            <div style={{ textAlign:'center', padding:'40px 20px', animation:'fadeUp 0.5s ease' }}>
              <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(14,201,140,0.15)', border:'2px solid rgba(14,201,140,0.3)', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 28px rgba(14,201,140,0.2)' }}>
                <Icon name="check" size={32} color="#1a56e8" sw={2.5} />
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:26, color:txtPri, marginBottom:10 }}>Message Sent!</div>
              <p style={{ fontSize:14, color:txtMut, lineHeight:1.7, marginBottom:24 }}>We've received your message and will respond within 24 hours.</p>
              <button onClick={() => navigate('home')} style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#1a56e8', color:'#fff', padding:'11px 24px', borderRadius:9, border:'none', cursor:'pointer', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13 }}>
                <Icon name="arrow" size={13} color="white" /> Back to Home
              </button>
            </div>
          ) : (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
                <span style={{ fontFamily:"'Space Mono',monospace", fontWeight:700, fontSize:10, letterSpacing:'2.5px', textTransform:'uppercase', color:'#3b74ff' }}>Send a Message</span>
                <div style={{ flex:1, height:1, background:bdim }} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }}>
                <div style={{ borderBottom: fieldBorder('name'), transition:'border-color 0.2s', paddingBottom:0 }} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}>
                  <label style={labelStyle('name')}>Full Name</label>
                  <input style={{ ...inputStyle, paddingRight:16 }} placeholder="Your name" value={form.name} onChange={e => handle('name', e.target.value)} />
                </div>
                <div style={{ borderBottom: fieldBorder('email'), transition:'border-color 0.2s', paddingBottom:0 }} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}>
                  <label style={labelStyle('email')}>Email Address</label>
                  <input style={{ ...inputStyle, paddingLeft:16 }} type="email" placeholder="you@email.com" value={form.email} onChange={e => handle('email', e.target.value)} />
                </div>
              </div>
              <div style={{ borderBottom:`2px solid ${bdim}`, paddingBottom:0 }}>
                <label style={labelStyle('issue')}>Issue Type</label>
                <select style={{ ...inputStyle, appearance:'none', cursor:'pointer', colorScheme: dark ? 'dark' : 'light' }} value={form.issue} onChange={e => handle('issue', e.target.value)}>
                  {ISSUE_TYPES.map(o => <option key={o} style={{ background:surf }}>{o}</option>)}
                </select>
              </div>
              <div style={{ borderBottom: fieldBorder('message'), paddingBottom:0 }} onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)}>
                <label style={labelStyle('message')}>Your Message</label>
                <textarea style={{ ...inputStyle, resize:'none', minHeight:80, lineHeight:1.7 }} placeholder="Describe your issue or question..." value={form.message} onChange={e => handle('message', e.target.value)} rows={4} />
              </div>
              <div style={{ marginTop:24, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
                <button onClick={submit} disabled={sending} style={{ display:'inline-flex', alignItems:'center', gap:9, background:'#1a56e8', color:'#fff', border:'none', cursor: sending ? 'not-allowed' : 'pointer', padding:'13px 28px', borderRadius:10, fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, boxShadow:'0 6px 24px rgba(26,86,232,0.35)', transition:'all 0.2s', opacity: sending ? 0.7 : 1 }}
                  onMouseEnter={e => { if (!sending) { e.currentTarget.style.background='#3b74ff'; e.currentTarget.style.transform='translateY(-2px)' } }}
                  onMouseLeave={e => { e.currentTarget.style.background='#1a56e8'; e.currentTarget.style.transform='' }}
                >
                  {sending ? <><div style={{ width:16, height:16, border:'2.5px solid rgba(255,255,255,0.25)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} /> Sending...</> : <><Icon name="send" size={14} color="white" /> Send Message</>}
                </button>
                <p style={{ fontSize:12, color:txtFaint, lineHeight:1.65 }}>We never share your data.<br /><a href="#" style={{ color:'#1a56e8' }}>Privacy Policy</a></p>
              </div>
              {apiError && <div style={{ marginTop:14, padding:'11px 16px', borderRadius:10, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#ef4444', fontSize:13, display:'flex', alignItems:'center', gap:8 }}><span>⚠</span> {apiError}</div>}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:24 }}>
                {QUICK_ACTIONS.map(a => <QuickCard key={a.label} a={a} bdim={bdim} txtPri={txtPri} txtMut={txtMut} />)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats row — replaces the map + office cards */}
      <div style={{ background: surf, borderTop:`1px solid ${bdim}`, borderBottom:`1px solid ${bdim}`, display:'grid', gridTemplateColumns:'repeat(3,1fr)', transition:'background 0.35s' }}>
        {SUPPORT_PILLARS.map((p, i) => (
          <div key={i} style={{ padding:'40px 36px', textAlign:'center', borderRight: i < 2 ? `1px solid ${bdim}` : 'none' }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontWeight:700, fontSize:'clamp(22px,3vw,34px)', color:'#1a56e8', marginBottom:6 }}>{p.value}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:txtPri, marginBottom:6, transition:'color 0.35s' }}>{p.title}</div>
            <div style={{ fontSize:13, color:txtMut, lineHeight:1.6, transition:'color 0.35s' }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <section style={{ background:surf, padding:'72px 0', transition:'background 0.35s' }}>
        <div style={{ maxWidth:760, margin:'0 auto', padding:'0 48px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:40, flexWrap:'wrap', gap:14 }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'clamp(22px,3.5vw,30px)', color:txtPri, transition:'color 0.35s' }}>Frequently Asked Questions</h2>
            <a href="#" style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:13, color:'#1a56e8', display:'flex', alignItems:'center', gap:6 }}>
              View all docs <Icon name="arrow" size={13} color="#1a56e8" />
            </a>
          </div>
          {FAQS.map((faq, i) => <FaqItem key={i} faq={faq} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} txtPri={txtPri} txtMut={txtMut} bdim={bdim} />)}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:`1px solid ${bdim}`, padding:'24px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:14 }}>
        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:txtPri, transition:'color 0.35s' }}>Sentinel<span style={{ color:'#3b74ff' }}>-RTI</span></span>
        <div style={{ display:'flex', gap:22 }}>
          {['Home','About','Contact','RTI Act','GitHub'].map(l => (
            <a key={l} href="#" style={{ fontSize:12, color:txtFaint, fontFamily:"'Syne',sans-serif", transition:'color 0.2s', textDecoration:'none' }}
              onMouseEnter={e => e.target.style.color='#3b74ff'} onMouseLeave={e => e.target.style.color=txtFaint}>{l}</a>
          ))}
        </div>
        <span style={{ fontSize:12, color:txtFaint, transition:'color 0.35s' }}>© 2026 Sentinel-RTI. Open Source MIT.</span>
      </footer>

      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes scaleIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        input::placeholder, textarea::placeholder { color: ${txtFaint}; }
        @media(max-width:900px) {
          div[style*="grid-template-columns: 1fr 1fr"]:first-of-type { grid-template-columns:1fr !important; min-height:auto !important; }
          div[style*="repeat(3,1fr)"] { grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  )
}
