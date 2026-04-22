import React, { useState, useEffect, useRef } from 'react'
import Icon from '../components/Icon'
import { useTheme } from '../App'

const PIPELINE = [
  { id:1, title:'User Input',               icon:'users',  color:'#3b74ff', items:['Text Input','Image Upload','Voice Input','Geo Location'] },
  { id:2, title:'AI Processing',            icon:'cpu',    color:'#1a56e8', items:['Issue Detection & Classification','AI Evidence Enhancer','Timestamp','Geo-Tag','Severity Analysis'] },
  { id:3, title:'Complaint Generation',     icon:'file',   color:'#3b74ff', items:['Draft RTI Complaint','Legal Sections','Evidence Summary'] },
  { id:4, title:'Smart Routing',            icon:'route',  color:'#1a56e8', items:['Identify Correct Authority','Select Submission Platform'] },
  { id:5, title:'Submission & Verification',icon:'send',   color:'#3b74ff', items:['Auto-Fill Form','OTP & CAPTCHA','User Verification'] },
]

const POST_SUBMISSION = [
  { title:'Lifecycle Tracking',   icon:'eye',     color:'#3b74ff', desc:'Track every complaint through its full lifecycle — Submitted to Pending to Escalated to Resolved. Real-time status updates with full transparency.',      tags:['Submitted','Pending','Escalated','Resolved'] },
  { title:'Analytics Dashboard',  icon:'chart',   color:'#1a56e8', desc:'Comprehensive analytics with resolution metrics, authority response times, geographic coverage maps, and complaint trend analysis.',                    tags:['Charts','Maps','Metrics','Trends'] },
  { title:'Automated Follow-Ups', icon:'refresh', color:'#3b74ff', desc:'Intelligent system sends automated reminders at 7, 15, and 30 days. Generates appeals and escalation notices when deadlines are breached.',            tags:['Reminders','Appeals','Escalations'] },
  { title:'Escalation Engine',    icon:'bell',    color:'#1a56e8', desc:'When authorities fail to respond, the system automatically files first appeals and escalates to the State Chief Information Commission.',                tags:['Reminders','Appeals','Escalations'] },
]

const STATS = [
  { num:'12.4K+', label:'Complaints Filed' },
  { num:'89%',    label:'Resolution Rate'  },
  { num:'48hrs',  label:'Avg Response'     },
  { num:'340+',   label:'Authorities'      },
]

const TICKER_ITEMS = [
  '12,400+ Complaints Filed','89% Resolution Rate','340+ Authorities Covered',
  'RTI Act 2005 Compliant','AI Evidence Enhancement','48hr Avg Response Time',
  'Free for All Citizens','Smart Auto-Routing',
]

const FEATURES = [
  { num:'01', title:'Multi-Modal Complaint Input',      icon:'users', color:'#3b74ff', desc:'File complaints your way — type a description, upload photo evidence, use voice input in 6 regional languages, or auto-detect your GPS location. The system accepts all input formats and combines them into a single comprehensive complaint.', details:[{icon:'file',label:'Text Input',sub:'Describe the issue in plain language'},{icon:'image',label:'Image Upload',sub:'Upload photo/video evidence'},{icon:'mic',label:'Voice Input',sub:'6 regional languages supported'},{icon:'map',label:'Geo Location',sub:'Auto-detect complaint location'}] },
  { num:'02', title:'AI-Powered Processing Engine',     icon:'cpu',   color:'#1a56e8', desc:'Deep learning models classify the issue type, assess severity, identify jurisdiction, and enhance evidence. The system auto-attaches timestamps, geolocation metadata, and runs AI image analysis on uploaded evidence.',                                 details:[{icon:'target',label:'Issue Detection',sub:'97% classification accuracy'},{icon:'zap',label:'Evidence Enhancer',sub:'Timestamps, geo-tags, vision AI'},{icon:'layers',label:'Severity Scoring',sub:'SLA breach detection'},{icon:'lock',label:'Legal RAG Engine',sub:'RTI Act sections, IPC clauses'}] },
  { num:'03', title:'Smart Routing & Submission',       icon:'route', color:'#3b74ff', desc:'Generates a legally accurate RTI complaint, identifies the correct government authority from 340+ integrated departments, auto-fills submission portals, handles OTP verification, and confirms submission with tracking ID.',                            details:[{icon:'file',label:'RTI Draft',sub:'Legally formatted complaint'},{icon:'compass',label:'Authority Routing',sub:'340+ authorities mapped'},{icon:'send',label:'Auto-Submit',sub:'Portal auto-fill + OTP handling'},{icon:'check',label:'Verification',sub:'Confirmation + tracking ID'}] },
  { num:'04', title:'Lifecycle Tracking & Escalation',  icon:'bell',  color:'#1a56e8', desc:'Every complaint is monitored through its full lifecycle. Automated reminders go out at 7, 15, and 30 days. If no response within the statutory period, first appeals are auto-filed and non-compliance escalates to the State CIC.',                  details:[{icon:'eye',label:'Status Tracking',sub:'Real-time lifecycle updates'},{icon:'clock',label:'Auto-Reminders',sub:'At 7, 15, and 30 days'},{icon:'alertCircle',label:'Appeal Filing',sub:'Automatic first appeals'},{icon:'trending',label:'CIC Escalation',sub:'State commission escalation'}] },
]

/* ── SCROLL-LOCKED WORKFLOW SECTION ── */
function WorkflowSection() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // progress from 0 → 1
      const raw = (windowHeight - rect.top) / (windowHeight + rect.height)
      const clamped = Math.min(Math.max(raw, 0), 1)

      setProgress(clamped)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 🔥 smooth step interpolation
 const totalSteps = PIPELINE.length

// 🔥 Add padding zones
const startOffset = 0.12   // delay first step switch
const endOffset   = 0.88   // bring last step earlier

// normalize progress into usable range
const adjustedProgress = Math.min(
  Math.max((progress - startOffset) / (endOffset - startOffset), 0),
  1
)

// smoother step distribution
const stepIndex = Math.floor(adjustedProgress * totalSteps)

const activeStep = Math.min(stepIndex, totalSteps - 1)

  const step = PIPELINE[activeStep]

  const bg = dark ? '#07090f' : '#f0f4fa'
  const surf = dark ? '#0d1117' : '#ffffff'
  const bdim = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
  const txtPri = dark ? '#ffffff' : '#0f172a'
  const txtMut = dark ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.45)'

  return (
    <section
      ref={sectionRef}
      style={{
        height: '200vh', // 🔥 gives scroll space
        background: bg,
      }}
    >
      {/* STICKY CENTER CONTAINER */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderTop: `1px solid ${bdim}`,
          borderBottom: `1px solid ${bdim}`,
        }}
      >
        <div style={{ width: '100%', maxWidth: 1200, padding: '0 48px' }}>
          
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{
              fontFamily:"'Syne',sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(28px,4vw,42px)',
              color: txtPri
            }}>
              Sentinel-RTI Workflow
            </h2>

            <p style={{
              fontSize: 14,
              color: txtMut,
              marginTop: 10
            }}>
              From complaint to resolution — smooth, intelligent automation.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center'
          }}>
            
            {/* LEFT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {PIPELINE.map((s, i) => {
                const isActive = i === activeStep

                return (
                  <div
                    key={s.id}
                    style={{
                      padding: '20px 24px',
                      borderRadius: 16,
                      border: `1px solid ${isActive ? s.color+'40' : bdim}`,
                      background: isActive ? `${s.color}12` : 'transparent',
                      transform: isActive ? 'translateX(10px)' : 'none',
                      transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
                      opacity: i <= activeStep ? 1 : 0.4
                    }}
                  >
                    <div style={{
                      fontSize: 10,
                      letterSpacing: 2,
                      color: isActive ? s.color : txtMut,
                      marginBottom: 6
                    }}>
                      STEP 0{s.id}
                    </div>

                    <div style={{
                      fontFamily:"'Syne',sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      color: txtPri
                    }}>
                      {s.title}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* RIGHT */}
<div
  style={{
    width: '100%',
    maxWidth: 520,
    aspectRatio: '1 / 1',
    borderRadius: 24,
    border: `1px solid ${bdim}`,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: `0 20px 60px ${step.color}20`,
    transform: `scale(${0.96 + progress * 0.04})`,
    transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
  }}
>
  <video
    src="/videos/workflow.mp4"
    autoPlay
    loop
    muted
    playsInline
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }}
  />

</div>
            </div>

          </div>
        </div>
    </section>
  )
}

/* ── POST CARD ── */
function PostCard({ item }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [hovered, setHovered] = useState(false)
  const bdim  = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
  const txtPri = dark ? '#fff' : '#0f172a'
  const txtMut = dark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.5)'
  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? 'var(--bg-glass-hover)' : 'var(--bg-glass)', border: `1px solid ${hovered ? item.color+'40' : bdim}`, borderRadius: 16, padding: '28px 24px', transition: 'all 0.3s', cursor: 'default', transform: hovered ? 'translateY(-3px)' : 'none', boxShadow: hovered ? `0 8px 24px ${item.color}15` : 'none', borderTop: `2px solid ${hovered ? item.color : 'transparent'}` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: `${item.color}15`, border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={item.icon} size={19} color={item.color} sw={1.8} />
        </div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: txtPri, transition: 'color 0.35s' }}>{item.title}</div>
      </div>
      <p style={{ fontSize: 13, color: txtMut, lineHeight: 1.75, marginBottom: 14, transition: 'color 0.35s' }}>{item.desc}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {item.tags.map(t => <span key={t} style={{ fontFamily:"'Space Mono',monospace", fontSize: 10, padding: '3px 9px', borderRadius: 5, background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}28` }}>{t}</span>)}
      </div>
    </div>
  )
}

/* ── FEATURE SECTION ── */
function FeatureSection({ feature, index }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [hovered, setHovered] = useState(false)
  const isEven = index % 2 === 0
  const bdim  = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'
  const txtPri = dark ? '#fff' : '#0f172a'
  const txtMut = dark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.5)'
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center', padding: '72px 0', borderBottom: `1px solid ${bdim}` }}>
      <div style={{ order: isEven ? 1 : 2 }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize: 10, fontWeight: 700, color: feature.color, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>{feature.num}</div>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(22px,2.8vw,32px)', color: txtPri, marginBottom: 14, letterSpacing: '-0.5px', lineHeight: 1.2, transition: 'color 0.35s' }}>{feature.title}</h3>
        <p style={{ fontSize: 14, color: txtMut, lineHeight: 1.85, marginBottom: 24, transition: 'color 0.35s' }}>{feature.desc}</p>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {['Free forever','No lawyer needed','RTI Act compliant'].map(t => (
            <span key={t} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:txtMut, fontFamily:"'Syne',sans-serif", transition:'color 0.35s' }}>
              <Icon name="check" size={12} color="#3b74ff" sw={2.5} /> {t}
            </span>
          ))}
        </div>
      </div>
      <div style={{ order: isEven ? 2 : 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {feature.details.map((d, i) => (
          <div key={i} onMouseEnter={() => setHovered(d.label)} onMouseLeave={() => setHovered(false)}
            style={{ padding: '18px 16px', borderRadius: 13, background: hovered === d.label ? `${feature.color}10` : 'var(--bg-glass)', border: `1px solid ${hovered === d.label ? feature.color+'38' : bdim}`, transition: 'all 0.25s', cursor: 'default', transform: hovered === d.label ? 'translateY(-2px)' : 'none' }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 8, background: `${feature.color}15`, border: `1px solid ${feature.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Icon name={d.icon} size={15} color={feature.color} sw={1.8} />
            </div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: txtPri, marginBottom: 3, transition: 'color 0.35s' }}>{d.label}</div>
            <div style={{ fontSize: 11, color: txtMut, lineHeight: 1.5, transition: 'color 0.35s' }}>{d.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── HOME PAGE ── */
export default function Home({ navigate }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const bg   = dark ? '#07090f' : '#f0f4fa'
  const surf = dark ? '#0d1117' : '#ffffff'
  const bdim = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const txtPri  = dark ? '#fff' : '#0f172a'
  const txtMut  = dark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.5)'
  const txtFaint= dark ? 'rgba(255,255,255,0.28)' : 'rgba(15,23,42,0.3)'

  return (
    <div className="page-enter" style={{ background: bg, minHeight: '100vh', color: txtPri, paddingTop: 72, transition: 'background 0.35s, color 0.35s' }}>

      {/* Ticker */}
      <div style={{ background: 'var(--ticker-bg)', borderBottom: `1px solid var(--ticker-border)`, overflow: 'hidden', padding: '10px 0', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', gap: 56, animation: 'marquee 28s linear infinite', fontFamily:"'Space Mono',monospace", fontSize: 11, color: txtFaint }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b74ff', display: 'inline-block', flexShrink: 0 }} />{t}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '72px 48px 52px' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(${dark ? 'rgba(26,86,232,0.06)' : 'rgba(26,86,232,0.04)'} 1px,transparent 1px),linear-gradient(90deg,${dark ? 'rgba(26,86,232,0.06)' : 'rgba(26,86,232,0.04)'} 1px,transparent 1px)`, backgroundSize: '64px 64px', WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%,black 20%,transparent 75%)', maskImage: 'radial-gradient(ellipse at 50% 40%,black 20%,transparent 75%)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, height: 2, pointerEvents: 'none', background: 'linear-gradient(90deg,transparent,rgba(26,86,232,0.5),transparent)', animation: 'scanline 5s linear infinite' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily:"'Space Mono',monospace", fontSize: 10, fontWeight: 700, color: '#3b74ff', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20, animation: 'fadeUp 0.65s ease both' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b74ff', animation: 'pulse 1.6s infinite' }} />
            v2.4 — Live System Active
          </div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(38px,5.5vw,68px)', lineHeight: 1.08, letterSpacing: '-2px', color: txtPri, marginBottom: 18, animation: 'fadeUp 0.65s 0.1s ease both', transition: 'color 0.35s' }}>
            Civic Justice,<br />
            <span style={{ background: 'linear-gradient(90deg,#1a56e8,#3b74ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Fully Automated.</span>
          </h1>
          <p style={{ fontSize: 16, color: txtMut, lineHeight: 1.85, maxWidth: 560, margin: '0 auto 32px', animation: 'fadeUp 0.65s 0.2s ease both', transition: 'color 0.35s' }}>
            From User Input → AI Processing → Complaint Generation → Smart Routing → Submission — every step tracked, legally accurate, and fully automated.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28, animation: 'fadeUp 0.65s 0.3s ease both' }}>
            <button onClick={() => navigate('fileComplaint')} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#1a56e8', color: '#fff', padding: '13px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily:"'Syne',sans-serif", fontWeight: 700, fontSize: 14, boxShadow: '0 6px 24px rgba(26,86,232,0.4)', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 36px rgba(26,86,232,0.55)' }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 6px 24px rgba(26,86,232,0.4)' }}
            ><Icon name="file" size={15} color="white" /> File a Complaint</button>
            <button onClick={() => navigate('track')} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'transparent', color: txtMut, padding: '13px 28px', borderRadius: 10, border: `1px solid ${bdim}`, cursor: 'pointer', fontFamily:"'Syne',sans-serif", fontWeight: 600, fontSize: 14, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(26,86,232,0.4)'; e.currentTarget.style.color=txtPri }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=bdim; e.currentTarget.style.color=txtMut }}
            ><Icon name="eye" size={15} color={txtMut} /> Track Complaint</button>
          </div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeUp 0.65s 0.4s ease both' }}>
            {['Free forever','No lawyer needed','Anonymous filing','RTI Act compliant'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: txtFaint, fontFamily:"'Syne',sans-serif", transition: 'color 0.35s' }}>
                <Icon name="check" size={12} color="#3b74ff" sw={2.5} /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band — solid color, no gradient */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: `1px solid ${bdim}`, borderBottom: `1px solid ${bdim}` }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ padding: '36px 24px', textAlign: 'center', borderRight: i < 3 ? `1px solid ${bdim}` : 'none', transition: 'background 0.2s, color 0.35s' }}
            onMouseEnter={e => e.currentTarget.style.background='var(--bg-glass-hover)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            <span style={{ fontFamily:"'Space Mono',monospace", fontWeight: 700, fontSize: 'clamp(24px,3.5vw,40px)', color: '#1a56e8', display: 'block', lineHeight: 1 }}>{s.num}</span>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: txtFaint, marginTop: 8, transition: 'color 0.35s' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll-locked workflow */}
      <WorkflowSection />

      {/* Post-submission grid */}
      <section style={{ padding: '80px 48px', background: bg, transition: 'background 0.35s' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(24px,3.5vw,36px)', color: txtPri, transition: 'color 0.35s' }}>What Happens After You File</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
            {POST_SUBMISSION.map((item, i) => <PostCard key={i} item={item} />)}
          </div>
        </div>
      </section>

      {/* Feature breakdowns */}
      <section style={{ background: surf, borderTop: `1px solid ${bdim}`, transition: 'background 0.35s' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ textAlign: 'center', padding: '72px 0 0' }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(24px,3.5vw,36px)', color: txtPri, transition: 'color 0.35s' }}>How Each Step Works</h2>
          </div>
          {FEATURES.map((f, i) => <FeatureSection key={i} feature={f} index={i} />)}
        </div>
      </section>

      {/* CTA Strip */}
      <div style={{ margin: '72px 48px', background: dark ? 'rgba(26,86,232,0.08)' : 'rgba(26,86,232,0.04)', border: `1px solid rgba(26,86,232,0.20)`, borderRadius: 20, padding: '48px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 28, flexWrap: 'wrap', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(20px,2.8vw,28px)', color: txtPri, transition: 'color 0.35s' }}>Ready to file your first complaint?</div>
          <div style={{ fontSize: 13, color: txtMut, marginTop: 6, transition: 'color 0.35s' }}>Free, anonymous, legally accurate. No lawyer required.</div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('fileComplaint')} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#1a56e8', color: '#fff', padding: '13px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily:"'Syne',sans-serif", fontWeight: 700, fontSize: 14, boxShadow: '0 6px 24px rgba(26,86,232,0.4)', transition: 'all 0.2s', position: 'relative', zIndex: 1 }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform=''}
          ><Icon name="arrow" size={15} color="white" /> Get Started Free</button>
          <button onClick={() => navigate('dashboard')} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--bg-glass)', color: txtMut, padding: '13px 28px', borderRadius: 10, border: `1px solid ${bdim}`, cursor: 'pointer', fontFamily:"'Syne',sans-serif", fontWeight: 600, fontSize: 14, transition: 'all 0.2s', position: 'relative', zIndex: 1 }}
            onMouseEnter={e => { e.currentTarget.style.color=txtPri; e.currentTarget.style.borderColor='rgba(26,86,232,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.color=txtMut; e.currentTarget.style.borderColor=bdim }}
          ><Icon name="chart" size={15} color={txtMut} /> View Dashboard</button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${bdim}`, padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: txtPri, transition: 'color 0.35s' }}>Sentinel<span style={{ color: '#3b74ff' }}>-RTI</span></span>
        <div style={{ display: 'flex', gap: 22 }}>
          {['Privacy','Terms','RTI Act','GitHub'].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: txtFaint, textDecoration: 'none', fontFamily:"'Syne',sans-serif", transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color='#3b74ff'} onMouseLeave={e => e.target.style.color=txtFaint}
            >{l}</a>
          ))}
        </div>
        <span style={{ fontSize: 12, color: txtFaint, transition: 'color 0.35s' }}>© 2026 Sentinel-RTI. Open Source MIT.</span>
      </footer>

      <style>{`
        @keyframes scanline { 0%{top:-5%} 100%{top:105%} }
        @keyframes marquee  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @media(max-width:900px) {
          div[style*="repeat(2,1fr)"] { grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  )
}
