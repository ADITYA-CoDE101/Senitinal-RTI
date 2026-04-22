import React, { useState } from 'react'
import Icon from '../components/Icon'

/* ── WORKFLOW DATA — matches the diagram exactly ─────────────── */
const PIPELINE = [
  { id: 1, title: 'User Input',               icon: 'users',  color: '#00c2e0', items: ['Text Input', 'Image Upload', 'Voice Input', 'Geo Location'] },
  { id: 2, title: 'AI Processing',            icon: 'cpu',    color: '#3b74ff', items: ['Issue Detection & Classification', 'AI Evidence Enhancer', 'Timestamp', 'Geo-Tag', 'Severity Analysis'] },
  { id: 3, title: 'Complaint Generation',     icon: 'file',   color: '#f59e0b', items: ['Draft RTI Complaint', 'Legal Sections', 'Evidence Summary'] },
  { id: 4, title: 'Smart Routing',            icon: 'route',  color: '#0ec98c', items: ['Identify Correct Authority', 'Select Submission Platform'] },
  { id: 5, title: 'Submission & Verification', icon: 'send',  color: '#e04dff', items: ['Auto-Fill Form', 'OTP & CAPTCHA', 'User Verification'] },
]

const POST_SUBMISSION = [
  { title: 'Lifecycle Tracking',  icon: 'eye',      color: '#3b74ff', desc: 'Track every complaint through its full lifecycle — from Submitted to Pending to Escalated to Resolved. Real-time status updates with full transparency.', tags: ['Submitted', 'Pending', 'Escalated', 'Resolved'] },
  { title: 'Analytics Dashboard', icon: 'chart',    color: '#0ec98c', desc: 'Comprehensive analytics with resolution metrics, authority response times, geographic coverage maps, and complaint trend analysis.', tags: ['Charts', 'Maps', 'Metrics', 'Trends'] },
  { title: 'Automated Follow-Ups', icon: 'refresh', color: '#f59e0b', desc: 'Intelligent system sends automated reminders at 7, 15, and 30 days. Generates appeals and escalation notices when deadlines are breached.', tags: ['Reminders', 'Appeals', 'Escalations'] },
  { title: 'Escalation Engine',   icon: 'bell',     color: '#ef4444', desc: 'When authorities fail to respond, the system automatically files first appeals and escalates to the State Chief Information Commission.', tags: ['Reminders', 'Appeals', 'Escalations'] },
]

const STATS = [
  { num: '12.4K+', label: 'Complaints Filed' },
  { num: '89%',    label: 'Resolution Rate'  },
  { num: '48hrs',  label: 'Avg Response'     },
  { num: '340+',   label: 'Authorities'      },
]

const TICKER_ITEMS = [
  '12,400+ Complaints Filed', '89% Resolution Rate', '340+ Authorities Covered',
  'RTI Act 2005 Compliant', 'AI Evidence Enhancement', '48hr Avg Response Time',
  'Free for All Citizens', 'Smart Auto-Routing',
]

/* ── TOKENS ──────────────────────────────────────────────────── */
const BG   = '#07090f'
const SURF = '#0d1117'
const BDIM = 'rgba(255,255,255,0.06)'

/* ── PIPELINE STEP CARD ──────────────────────────────────────── */
function PipelineCard({ step, isLast }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          flex: 1, minWidth: 0,
          background: hovered ? `${step.color}12` : 'rgba(255,255,255,0.03)',
          border: `1px solid ${hovered ? `${step.color}50` : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 16, padding: '28px 24px', position: 'relative', overflow: 'hidden',
          transition: 'all 0.3s', cursor: 'default',
          transform: hovered ? 'translateY(-4px)' : 'none',
          boxShadow: hovered ? `0 12px 32px ${step.color}20` : 'none',
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%',
          background: `radial-gradient(circle, ${step.color}15 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none',
        }} />

        {/* Step number */}
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
          color: step.color, letterSpacing: 2, marginBottom: 14,
        }}>STEP 0{step.id}</div>

        {/* Icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: `${step.color}18`, border: `1px solid ${step.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name={step.icon} size={19} color={step.color} sw={1.8} />
          </div>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: '#fff',
          }}>{step.title}</div>
        </div>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {step.items.map(item => (
            <div key={item} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 12, color: 'rgba(255,255,255,0.5)',
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                background: hovered ? step.color : 'rgba(255,255,255,0.2)',
                transition: 'background 0.3s',
              }} />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Arrow connector */}
      {!isLast && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 36, flexShrink: 0,
        }}>
          <div style={{
            width: 20, height: 2, background: 'linear-gradient(90deg, rgba(255,255,255,0.15), rgba(26,86,232,0.5))',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', right: -4, top: -3, width: 0, height: 0,
              borderLeft: '6px solid rgba(26,86,232,0.5)',
              borderTop: '4px solid transparent', borderBottom: '4px solid transparent',
            }} />
          </div>
        </div>
      )}
    </div>
  )
}

/* ── POST-SUBMISSION CARD ────────────────────────────────────── */
function PostCard({ item }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hovered ? `${item.color}40` : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 16, padding: '32px 28px', transition: 'all 0.3s', cursor: 'default',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? `0 8px 24px ${item.color}15` : 'none',
        borderTop: `2px solid ${hovered ? item.color : 'transparent'}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12,
          background: `${item.color}15`, border: `1px solid ${item.color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={item.icon} size={21} color={item.color} sw={1.8} />
        </div>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: '#fff',
        }}>{item.title}</div>
      </div>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 16 }}>
        {item.desc}
      </p>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {item.tags.map(t => (
          <span key={t} style={{
            fontFamily: "'Space Mono', monospace", fontSize: 10, padding: '4px 10px', borderRadius: 5,
            background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}28`,
          }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

/* ── FEATURE ROW — detailed breakdown of each pipeline step ── */
const FEATURES = [
  {
    num: '01', title: 'Multi-Modal Complaint Input', icon: 'users', color: '#00c2e0',
    desc: 'File complaints your way — type a description, upload photo evidence, use voice input in 6 regional languages, or auto-detect your GPS location. The system accepts all input formats and combines them into a single comprehensive complaint.',
    details: [
      { icon: 'file', label: 'Text Input', sub: 'Describe the issue in plain language' },
      { icon: 'image', label: 'Image Upload', sub: 'Upload photo/video evidence' },
      { icon: 'mic', label: 'Voice Input', sub: '6 regional languages supported' },
      { icon: 'map', label: 'Geo Location', sub: 'Auto-detect complaint location' },
    ],
  },
  {
    num: '02', title: 'AI-Powered Processing Engine', icon: 'cpu', color: '#3b74ff',
    desc: 'Deep learning models classify the issue type, assess severity, identify jurisdiction, and enhance evidence. The system auto-attaches timestamps, geolocation metadata, and runs AI image analysis on uploaded evidence.',
    details: [
      { icon: 'target', label: 'Issue Detection', sub: '97% classification accuracy' },
      { icon: 'zap', label: 'Evidence Enhancer', sub: 'Timestamps, geo-tags, vision AI' },
      { icon: 'layers', label: 'Severity Scoring', sub: 'SLA breach detection' },
      { icon: 'lock', label: 'Legal RAG Engine', sub: 'RTI Act sections, IPC clauses' },
    ],
  },
  {
    num: '03', title: 'Smart Routing & Submission', icon: 'route', color: '#0ec98c',
    desc: 'Generates a legally accurate RTI complaint, identifies the correct government authority from 340+ integrated departments, auto-fills submission portals, handles OTP verification, and confirms submission with tracking ID.',
    details: [
      { icon: 'file', label: 'RTI Draft', sub: 'Legally formatted complaint' },
      { icon: 'compass', label: 'Authority Routing', sub: '340+ authorities mapped' },
      { icon: 'send', label: 'Auto-Submit', sub: 'Portal auto-fill + OTP handling' },
      { icon: 'check', label: 'Verification', sub: 'Confirmation + tracking ID' },
    ],
  },
  {
    num: '04', title: 'Lifecycle Tracking & Escalation', icon: 'bell', color: '#f59e0b',
    desc: 'Every complaint is monitored through its full lifecycle. Automated reminders go out at 7, 15, and 30 days. If no response within the statutory period, first appeals are auto-filed and non-compliance escalates to the State CIC.',
    details: [
      { icon: 'eye', label: 'Status Tracking', sub: 'Real-time lifecycle updates' },
      { icon: 'clock', label: 'Auto-Reminders', sub: 'At 7, 15, and 30 days' },
      { icon: 'alertCircle', label: 'Appeal Filing', sub: 'Automatic first appeals' },
      { icon: 'trending', label: 'CIC Escalation', sub: 'State commission escalation' },
    ],
  },
]

function FeatureSection({ feature, index }) {
  const [hovered, setHovered] = useState(false)
  const isEven = index % 2 === 0
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: isEven ? '1fr 1fr' : '1fr 1fr',
      gap: 64, alignItems: 'center', padding: '80px 0',
      borderBottom: `1px solid ${BDIM}`,
    }}>
      {/* Text side */}
      <div style={{ order: isEven ? 1 : 2 }}>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
          color: feature.color, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16,
        }}>// Step {feature.num}</div>
        <h3 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: 'clamp(26px, 3vw, 36px)', color: '#fff', marginBottom: 16,
          letterSpacing: '-1px', lineHeight: 1.15,
        }}>{feature.title}</h3>
        <p style={{
          fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.85, marginBottom: 28,
        }}>{feature.desc}</p>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {['Free forever', 'No lawyer needed', 'RTI Act compliant'].map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: "'Syne', sans-serif" }}>
              <Icon name="check" size={13} color="#0ec98c" sw={2.5} /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* Cards side */}
      <div style={{ order: isEven ? 2 : 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {feature.details.map((d, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(d.label)}
            onMouseLeave={() => setHovered(false)}
            style={{
              padding: '20px 18px', borderRadius: 14,
              background: hovered === d.label ? `${feature.color}12` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${hovered === d.label ? `${feature.color}40` : 'rgba(255,255,255,0.07)'}`,
              transition: 'all 0.25s', cursor: 'default',
              transform: hovered === d.label ? 'translateY(-2px)' : 'none',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: `${feature.color}15`, border: `1px solid ${feature.color}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
            }}>
              <Icon name={d.icon} size={16} color={feature.color} sw={1.8} />
            </div>
            <div style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 4,
            }}>{d.label}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{d.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── HOME PAGE ────────────────────────────────────────────────── */
export default function Home({ navigate }) {
  return (
    <div className="page-enter" style={{ background: BG, minHeight: '100vh', color: 'white' }}>

      {/* Ticker */}
      <div style={{
        background: 'rgba(255,255,255,0.025)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        overflow: 'hidden', padding: '11px 0', whiteSpace: 'nowrap',
      }}>
        <div style={{
          display: 'inline-flex', gap: 56,
          animation: 'marquee 28s linear infinite',
          fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)',
        }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00c2e0', display: 'inline-block', flexShrink: 0 }} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 48px 60px' }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(26,86,232,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,232,0.06) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%,black 20%,transparent 75%)',
          maskImage: 'radial-gradient(ellipse at 50% 40%,black 20%,transparent 75%)',
        }} />
        {/* Scanline */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2, pointerEvents: 'none',
          background: 'linear-gradient(90deg,transparent,rgba(0,194,224,0.5),transparent)',
          animation: 'scanline 5s linear infinite',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
            color: '#00c2e0', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 22,
            animation: 'fadeUp 0.65s ease both',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00c2e0', animation: 'pulse 1.6s infinite' }} />
            v2.4 — Live System Active
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 'clamp(42px, 6vw, 76px)', lineHeight: 1.06,
            letterSpacing: '-2.5px', color: '#fff', marginBottom: 20,
            animation: 'fadeUp 0.65s 0.1s ease both',
          }}>
            Civic Justice,<br />
            <span style={{
              background: 'linear-gradient(90deg, #1a56e8, #00c2e0)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Fully Automated.</span>
          </h1>

          <p style={{
            fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.85,
            maxWidth: 600, margin: '0 auto 36px', animation: 'fadeUp 0.65s 0.2s ease both',
          }}>
            From User Input → AI Processing → Complaint Generation → Smart Routing →
            Submission — every step tracked, legally accurate, and fully automated.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32, animation: 'fadeUp 0.65s 0.3s ease both' }}>
            <button onClick={() => navigate('fileComplaint')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              background: '#1a56e8', color: '#fff', padding: '14px 30px', borderRadius: 10,
              border: 'none', cursor: 'pointer',
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
              boxShadow: '0 6px 24px rgba(26,86,232,0.45)', transition: 'all 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 36px rgba(26,86,232,0.55)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 24px rgba(26,86,232,0.45)' }}
            >
              <Icon name="file" size={16} color="white" /> File a Complaint
            </button>
            <button onClick={() => navigate('track')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              background: 'transparent', color: 'rgba(255,255,255,0.65)',
              padding: '14px 30px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
              fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 15, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
            >
              <Icon name="eye" size={16} color="rgba(255,255,255,0.7)" /> Track Complaint
            </button>
          </div>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeUp 0.65s 0.4s ease both' }}>
            {['Free forever', 'No lawyer needed', 'Anonymous filing', 'RTI Act compliant'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: "'Syne', sans-serif" }}>
                <Icon name="check" size={13} color="#0ec98c" sw={2.5} /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        borderTop: `1px solid ${BDIM}`, borderBottom: `1px solid ${BDIM}`,
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            padding: '40px 24px', textAlign: 'center',
            borderRight: i < 3 ? `1px solid ${BDIM}` : 'none',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{
              fontFamily: "'Space Mono', monospace", fontWeight: 700,
              fontSize: 'clamp(28px, 4vw, 46px)',
              background: 'linear-gradient(180deg,#fff 30%,rgba(255,255,255,0.3))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', display: 'block', lineHeight: 1,
            }}>{s.num}</span>
            <div style={{
              fontFamily: "'Syne', sans-serif", fontSize: 11, letterSpacing: '1.5px',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: 8,
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── WORKFLOW PIPELINE SECTION ── */}
      <section style={{ padding: '96px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#00c2e0',
              letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 14,
            }}>// System Workflow Pipeline</span>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff', marginBottom: 12,
            }}>Sentinel-RTI Workflow</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', maxWidth: 540, margin: '0 auto' }}>
              From complaint to resolution — 5 automated steps powering India's most advanced civic justice platform.
            </p>
          </div>

          {/* Horizontal pipeline */}
          <div style={{
            display: 'flex', alignItems: 'stretch', gap: 0,
            padding: '24px 0', overflowX: 'auto',
          }}>
            {PIPELINE.map((step, i) => (
              <PipelineCard key={step.id} step={step} isLast={i === PIPELINE.length - 1} />
            ))}
          </div>

          {/* Down arrow */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
            <div style={{
              width: 2, height: 48,
              background: 'linear-gradient(180deg, rgba(26,86,232,0.5), rgba(255,255,255,0.1))',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', bottom: -5, left: -3, width: 0, height: 0,
                borderTop: '6px solid rgba(26,86,232,0.5)',
                borderLeft: '4px solid transparent', borderRight: '4px solid transparent',
              }} />
            </div>
          </div>

          {/* Post-submission grid */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#f59e0b',
              letterSpacing: 3, textTransform: 'uppercase',
            }}>// Post-Submission Automation</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {POST_SUBMISSION.map((item, i) => <PostCard key={i} item={item} />)}
          </div>
        </div>
      </section>

      {/* ── DETAILED FEATURE BREAKDOWNS ── */}
      <section style={{ background: SURF, borderTop: `1px solid ${BDIM}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ textAlign: 'center', padding: '80px 0 0' }}>
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#00c2e0',
              letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 14,
            }}>// Deep Dive</span>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff',
            }}>How Each Step Works</h2>
          </div>
          {FEATURES.map((f, i) => <FeatureSection key={i} feature={f} index={i} />)}
        </div>
      </section>

      {/* CTA Strip */}
      <div style={{
        margin: '80px 48px',
        background: 'linear-gradient(135deg, rgba(26,86,232,0.18) 0%, rgba(0,194,224,0.08) 100%)',
        border: '1px solid rgba(26,86,232,0.3)', borderRadius: 20,
        padding: '56px 52px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', gap: 32, flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -80, top: -80, width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(0,194,224,0.18) 0%,transparent 70%)', pointerEvents: 'none',
        }} />
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(22px,3vw,32px)', color: '#fff' }}>
            Ready to file your first complaint?
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
            Free, anonymous, legally accurate. No lawyer required.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('fileComplaint')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 9,
            background: '#1a56e8', color: '#fff', padding: '14px 30px', borderRadius: 10,
            border: 'none', cursor: 'pointer',
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
            boxShadow: '0 6px 24px rgba(26,86,232,0.45)', transition: 'all 0.2s', position: 'relative', zIndex: 1,
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = ''}
          >
            <Icon name="arrow" size={16} color="white" /> Get Started Free
          </button>
          <button onClick={() => navigate('dashboard')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 9,
            background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', padding: '14px 30px', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
            fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 15, transition: 'all 0.2s', position: 'relative', zIndex: 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
          >
            <Icon name="chart" size={16} color="rgba(255,255,255,0.7)" /> View Dashboard
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${BDIM}`,
        padding: '28px 48px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
      }}>
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
        @keyframes scanline { 0%{top:-5%} 100%{top:105%} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @media(max-width:900px) {
          div[style*="repeat(4, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="repeat(4,1fr)"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}
