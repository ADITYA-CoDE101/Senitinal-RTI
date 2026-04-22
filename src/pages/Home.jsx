import React, { useEffect, useRef } from 'react'
import Icon from '../components/Icon'

/* ── DATA ─────────────────────────────────────────────────────── */
const TICKER_ITEMS = [
  '12,400+ Complaints Filed', '89% Resolution Rate', '340+ Authorities Covered',
  'RTI Act 2005 Compliant', 'AI Evidence Enhancement', '48hr Avg Response Time',
  'Free for All Citizens', 'Smart Auto-Routing',
]

const STATS = [
  { num: '12.4K+', label: 'Complaints Filed' },
  { num: '89%',    label: 'Resolution Rate'  },
  { num: '48hrs',  label: 'Avg Response'     },
  { num: '340+',   label: 'Authorities'      },
]

const WORKFLOW = [
  { num: '01', title: 'User Input',           icon: 'users',  tags: ['Text','Voice','Image','GPS'],               desc: 'Multi-modal complaint ingestion via text, voice, image uploads, or auto-detected GPS location.' },
  { num: '02', title: 'AI Processing',         icon: 'cpu',    tags: ['NLP','Classifier','Severity Scoring'],      desc: 'Deep learning classifies issue type, severity level, and jurisdiction via NLP extraction.' },
  { num: '03', title: 'Evidence Enhancer',     icon: 'zap',    tags: ['Timestamp','Geo-tag','Vision AI'],          desc: 'Auto-attaches timestamps, geolocation metadata, and runs AI image analysis on uploaded evidence.' },
  { num: '04', title: 'Legal RAG Engine',      icon: 'lock',   tags: ['RTI Act 2005','IPC Sections','Case Laws'],  desc: 'Retrieval-Augmented Generation fetches relevant RTI Act sections, IPC clauses, and case law precedents.' },
  { num: '05', title: 'Complaint Generation',  icon: 'file',   tags: ['RTI Draft','Legal Format','Evidence'],      desc: 'Generates a complete, legally accurate RTI or grievance letter with full evidence summary attached.' },
  { num: '06', title: 'Smart Routing',         icon: 'route',  tags: ['340+ Authorities','State + Central'],       desc: 'Identifies the correct government authority, department, and optimal submission platform automatically.' },
  { num: '07', title: 'Submission & Verify',   icon: 'send',   tags: ['Auto-fill','OTP Handling','Confirmation'],  desc: 'Auto-fills government portals, handles OTP verification, CAPTCHA resolution, and confirms submission.' },
  { num: '08', title: 'Track & Escalate',      icon: 'bell',   tags: ['Reminders','Auto-Appeals','CIC Escalation'],'desc': 'Lifecycle monitoring, automated reminders, appeal generation, and CIC escalation for overdue complaints.' },
]

/* ── TERMINAL CARD ────────────────────────────────────────────── */
function TerminalCard() {
  const lines = [
    { prompt: true,  parts: [{ c: 'cyan',  t: '$ ' }, { c: 'white', t: 'sentinel analyze --input "Road broken 14 months"' }] },
    { prompt: false, parts: [{ c: 'muted', t: '› ' }, { c: 'green', t: '✓ Issue: Road Infrastructure (Confidence 97%)' }] },
    { prompt: false, parts: [{ c: 'muted', t: '› ' }, { c: 'blue',  t: '  Authority → PWD Mumbai, Zone 4' }] },
    { prompt: false, parts: [{ c: 'muted', t: '› ' }, { c: 'amber', t: '  Severity: HIGH — SLA breached 14 months' }] },
    { prompt: false, parts: [{ c: 'muted', t: ' '  }] },
    { prompt: true,  parts: [{ c: 'cyan',  t: '$ ' }, { c: 'white', t: 'sentinel generate-rti --geo-tag --legal-refs' }] },
    { prompt: false, parts: [{ c: 'muted', t: '› ' }, { c: 'green', t: '✓ RTI Act §6, §7, §19 referenced' }] },
    { prompt: false, parts: [{ c: 'muted', t: '› ' }, { c: 'green', t: '✓ Evidence geo-tagged (19.0760°N, 72.8777°E)' }] },
    { prompt: false, parts: [{ c: 'muted', t: '› ' }, { c: 'green', t: '✓ Complaint #2847 generated' }] },
    { prompt: false, parts: [{ c: 'muted', t: ' '  }] },
    { prompt: true,  parts: [{ c: 'cyan',  t: '$ ' }, { c: 'white', t: 'sentinel submit --auto-route --track' }] },
    { prompt: false, parts: [{ c: 'muted', t: '› ' }, { c: 'green', t: '✓ Submitted to PWD Mumbai portal' }] },
    { cursor: true,  parts: [{ c: 'cyan',  t: '$ ' }] },
  ]

  const colorMap = {
    cyan: '#00c2e0', green: '#0ec98c', blue: '#7aa2f7',
    amber: '#f59e0b', muted: 'rgba(255,255,255,0.25)', white: 'rgba(255,255,255,0.85)',
  }

  return (
    <div style={{
      background: '#0d1117', borderRadius: 16,
      border: '1px solid rgba(26,86,232,0.35)',
      overflow: 'hidden',
      boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(26,86,232,0.15)',
      animation: 'float 4.5s ease-in-out infinite',
    }}>
      {/* Title bar */}
      <div style={{
        background: '#161b22', padding: '13px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ display: 'flex', gap: 7 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => (
            <div key={c} style={{ width: 13, height: 13, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.25)', marginLeft: 6 }}>
          sentinel-rti — ai-agent v2.4.1
        </span>
      </div>
      {/* Body */}
      <div style={{ padding: '22px', fontFamily: "'Space Mono', monospace", fontSize: 12, lineHeight: 2.1 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: 'flex', flexWrap: 'wrap' }}>
            {line.parts.map((p, j) => (
              <span key={j} style={{ color: colorMap[p.c] }}>{p.t}</span>
            ))}
            {line.cursor && (
              <span style={{
                display: 'inline-block', width: 9, height: 15,
                background: '#00c2e0', verticalAlign: 'middle',
                animation: 'blink 1.1s infinite', marginLeft: 2,
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── HOME PAGE ────────────────────────────────────────────────── */
export default function Home({ navigate }) {
  return (
    <div className="page-enter" style={{ background: '#07090f', minHeight: '100vh', color: 'white' }}>

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
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(26,86,232,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,232,0.06) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
          WebkitMaskImage: 'radial-gradient(ellipse at 35% 50%,black 20%,transparent 75%)',
          maskImage: 'radial-gradient(ellipse at 35% 50%,black 20%,transparent 75%)',
        }} />
        {/* Scanline */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2, pointerEvents: 'none',
          background: 'linear-gradient(90deg,transparent,rgba(0,194,224,0.5),transparent)',
          animation: 'scanline 5s linear infinite',
        }} />

        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '80px 48px',
          display: 'grid', gridTemplateColumns: '1fr 460px', gap: 64, alignItems: 'center',
          position: 'relative', zIndex: 1, width: '100%',
        }}>
          {/* Left */}
          <div>
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
              fontSize: 'clamp(46px, 6vw, 80px)', lineHeight: 1.04,
              letterSpacing: '-2.5px', color: '#fff', marginBottom: 24,
              animation: 'fadeUp 0.65s 0.1s ease both',
            }}>
              Civic Justice,<br />
              <span style={{
                display: 'block',
                background: 'linear-gradient(90deg, #1a56e8 0%, #00c2e0 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Automated.</span>
            </h1>

            <p style={{
              fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.85,
              maxWidth: 500, marginBottom: 36,
              animation: 'fadeUp 0.65s 0.2s ease both',
            }}>
              AI-powered RTI filing and grievance escalation for every Indian citizen.
              From complaint to resolution — every step tracked, legally accurate, and fully automated.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40, animation: 'fadeUp 0.65s 0.3s ease both' }}>
              <button onClick={() => navigate('contact')} style={{
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
              <button onClick={() => navigate('about')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                background: 'transparent', color: 'rgba(255,255,255,0.65)',
                padding: '14px 30px', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 15, transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
              >
                <Icon name="users" size={16} color="rgba(255,255,255,0.7)" /> Our Mission
              </button>
            </div>

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', animation: 'fadeUp 0.65s 0.4s ease both' }}>
              {['Free forever', 'No lawyer needed', 'Anonymous filing', 'RTI Act compliant'].map(t => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: "'Syne', sans-serif" }}>
                  <Icon name="check" size={13} color="#0ec98c" sw={2.5} /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Terminal */}
          <div style={{ animation: 'fadeUp 0.65s 0.2s ease both' }}>
            <TerminalCard />
          </div>
        </div>
      </section>

      {/* Stats band */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            padding: '40px 24px', textAlign: 'center',
            borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
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

      {/* Workflow */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 48px' }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#00c2e0',
            letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 12,
          }}>// System Workflow</span>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff',
          }}>8 Steps. Fully Automated.</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {WORKFLOW.map((step, i) => (
            <WorkflowRow key={i} step={step} />
          ))}
        </div>
      </div>

      {/* CTA Strip */}
      <div style={{
        margin: '0 48px 100px',
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
        <button onClick={() => navigate('contact')} style={{
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
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
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
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scanline { 0%{top:-5%} 100%{top:105%} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}

function WorkflowRow({ step }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid', gridTemplateColumns: '72px 1fr auto', gap: 28, alignItems: 'center',
        padding: hovered ? '22px 0 22px 10px' : '22px 0',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        transition: 'all 0.2s', cursor: 'default',
        background: hovered ? 'rgba(255,255,255,0.015)' : 'transparent',
      }}
    >
      <div style={{
        fontFamily: "'Space Mono', monospace", fontSize: 34, fontWeight: 700,
        color: hovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)',
        lineHeight: 1, textAlign: 'right', transition: 'color 0.2s',
      }}>{step.num}</div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 5 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(26,86,232,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name={step.icon} size={14} color="#00c2e0" sw={1.8} />
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: '#fff' }}>{step.title}</span>
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.65, marginBottom: 8 }}>{step.desc}</div>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {step.tags.map(t => (
            <span key={t} style={{
              fontFamily: "'Space Mono', monospace", fontSize: 10, padding: '3px 9px', borderRadius: 4,
              background: 'rgba(26,86,232,0.15)', color: '#00c2e0', border: '1px solid rgba(26,86,232,0.28)',
            }}>{t}</span>
          ))}
        </div>
      </div>

      <span style={{ fontSize: 20, color: hovered ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)', transition: 'all 0.2s', transform: hovered ? 'translateX(6px)' : 'none', flexShrink: 0 }}>→</span>
    </div>
  )
}
