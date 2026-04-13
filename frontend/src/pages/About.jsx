import React from 'react'
import Icon from '../components/Icon'

/* ── DATA (unchanged) ─────────────────────────────────────────── */
const TEAM = [
  { initials: 'PS', name: 'Priya Sharma',  role: 'Founder & CEO',           color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  bio: 'Former IAS officer with 15 years in civic governance and RTI advocacy across Maharashtra and Delhi.' },
  { initials: 'AM', name: 'Arjun Mehta',   role: 'Chief Technology Officer', color: '#3b74ff', bg: 'rgba(59,116,255,0.12)',  bio: 'AI/ML engineer specialising in legal NLP, document intelligence, and retrieval-augmented generation systems.' },
  { initials: 'FZ', name: 'Fatima Zaidi',  role: 'Legal Director',           color: '#00c2e0', bg: 'rgba(0,194,224,0.12)',   bio: 'Advocate specialising in RTI law, whistleblower protection, PIL litigation, and administrative law reform.' },
  { initials: 'RV', name: 'Rohan Verma',   role: 'Head of Growth',           color: '#0ec98c', bg: 'rgba(14,201,140,0.12)',  bio: 'Civic-tech strategist previously at Janaagraha and Accountability Initiative. Expert in government partnerships.' },
]

const VALUES = [
  { num: '01', title: 'Radical Transparency', icon: 'trending', color: '#00c2e0', desc: 'Every step of your complaint journey is visible, tracked, and auditable. Governments must be held accountable — so must we. Full audit trails for every action taken.' },
  { num: '02', title: 'Legal Precision',       icon: 'lock',     color: '#3b74ff', desc: 'AI-generated complaints are legally accurate, jurisdiction-specific, and formatted to comply with the RTI Act 2005, CrPC, and relevant state acts. No guesswork — only precedent.' },
  { num: '03', title: 'Citizen First',         icon: 'heart',    color: '#0ec98c', desc: 'No legal knowledge required. No fees. No barriers. We believe every Indian citizen deserves equal access to civic justice — from rural villages to urban metros.' },
]

const MILESTONES = [
  { year: '2021', title: 'The Idea',            desc: 'Founded after Priya Sharma filed 40+ RTI applications manually over two years and saw the systemic barriers ordinary citizens face.' },
  { year: '2022', title: 'MVP Launched',         desc: 'First version deployed in Mumbai — 200 complaints filed in month one. 73% received responses within 30 days. 10× growth from media coverage.' },
  { year: '2023', title: 'AI Integration',       desc: 'Legal RAG engine built with 50,000+ Indian law documents. Evidence enhancement and auto-routing launched. Resolution rate jumped to 81%.' },
  { year: '2024', title: 'National Scale',        desc: 'Expanded to 18 states. 340+ government authorities integrated. Voice input added in 6 regional languages. Partnership with National RTI Forum.' },
  { year: '2025', title: 'Open Source & Beyond', desc: 'Platform open-sourced under MIT License. 12,400+ complaints filed. 89% resolution rate. Featured in TIME100 Most Influential Companies.' },
]

const PRESS   = ['The Hindu', 'Economic Times', 'NDTV', 'LiveMint', 'The Wire', 'Scroll.in']
const HERO_STATS = [
  { num: '12K+', label: 'Complaints Filed' },
  { num: '89%',  label: 'Resolution Rate'  },
  { num: '18',   label: 'States Covered'   },
]

/* ── SHARED DARK STYLES ────────────────────────────────────────── */
const BG     = '#07090f'
const SURF   = '#0d1117'
const GLASS  = 'rgba(255,255,255,0.04)'
const GHOVER = 'rgba(255,255,255,0.07)'
const BDIM   = 'rgba(255,255,255,0.06)'
const BBASE  = 'rgba(255,255,255,0.10)'
const BBLUE  = 'rgba(26,86,232,0.30)'

/* ── VALUE CARD ───────────────────────────────────────────────── */
function ValueCard({ v, last }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '40px 36px',
        borderRight: last ? 'none' : `1px solid ${BDIM}`,
        background: hovered ? GHOVER : GLASS,
        transition: 'all 0.25s', position: 'relative', overflow: 'hidden',
        borderTop: hovered ? `2px solid ${v.color}` : '2px solid transparent',
      }}
    >
      {/* glow accent */}
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%',
        background: `radial-gradient(circle, ${v.color}22 0%, transparent 70%)`,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
      }} />
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: `${v.color}18`, border: `1px solid ${v.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
      }}>
        <Icon name={v.icon} size={22} color={v.color} sw={1.8} />
      </div>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: v.color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>
        {v.num}
      </div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 12 }}>{v.title}</div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>{v.desc}</div>
    </div>
  )
}

/* ── TEAM CARD ────────────────────────────────────────────────── */
function TeamCard({ m }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '36px 28px',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: hovered ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
        transition: 'background 0.25s',
      }}
    >
      <div style={{
        width: 60, height: 60, borderRadius: 14, marginBottom: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20,
        background: m.bg, color: m.color,
        border: `1.5px solid ${m.color}40`,
        boxShadow: hovered ? `0 0 20px ${m.color}30` : 'none',
        transition: 'box-shadow 0.25s',
      }}>{m.initials}</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, color: '#fff', marginBottom: 4 }}>{m.name}</div>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: m.color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{m.role}</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75 }}>{m.bio}</div>
    </div>
  )
}

/* ── TIMELINE ITEM ────────────────────────────────────────────── */
function TimelineItem({ m, last }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'grid', gridTemplateColumns: '80px 1px 1fr', gap: 36, paddingBottom: last ? 0 : 52, alignItems: 'start' }}
    >
      <div style={{
        fontFamily: "'Space Mono',monospace", fontWeight: 700,
        fontSize: 'clamp(22px, 2.5vw, 32px)',
        color: hovered ? '#00c2e0' : 'rgba(255,255,255,0.2)',
        textAlign: 'right', lineHeight: 1, paddingTop: 4, transition: 'color 0.25s',
      }}>{m.year}</div>

      <div style={{ background: 'rgba(255,255,255,0.08)', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
          width: 12, height: 12, borderRadius: '50%',
          background: hovered ? '#00c2e0' : '#1a56e8',
          border: `2px solid ${BG}`,
          boxShadow: hovered ? '0 0 12px rgba(0,194,224,0.6)' : 'none',
          transition: 'all 0.25s',
        }} />
      </div>

      <div style={{ paddingTop: 2 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 19, color: '#fff', marginBottom: 8 }}>{m.title}</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>{m.desc}</div>
      </div>
    </div>
  )
}

/* ── PRESS LOGO ───────────────────────────────────────────────── */
function PressLogo({ name }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16,
        color: hovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
        cursor: 'default', transition: 'color 0.2s',
      }}
    >{name}</span>
  )
}

/* ── SECTION RULE ─────────────────────────────────────────────── */
function SectionRule({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 56 }}>
      <div style={{ flex: 1, height: 1, background: BDIM }} />
      <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: '#fff', whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: BDIM }} />
    </div>
  )
}

/* ── ABOUT PAGE ───────────────────────────────────────────────── */
export default function About({ navigate }) {
  const gridBg = {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: 'linear-gradient(rgba(26,86,232,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,232,0.05) 1px,transparent 1px)',
    backgroundSize: '64px 64px',
  }

  return (
    <div className="page-enter" style={{ background: BG, minHeight: '100vh', color: '#fff' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '96px 48px 80px' }}>
        <div style={gridBg} />
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: -120, left: -120, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,232,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -60, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,194,224,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: "'Space Mono',monospace", fontSize: 10, fontWeight: 700, color: '#00c2e0', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24, animation: 'fadeUp 0.65s ease both' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00c2e0', animation: 'pulse 1.6s infinite' }} />
            About Sentinel-RTI
          </div>

          {/* Hero grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            {/* Left – headline */}
            <div>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(42px,5.5vw,68px)', lineHeight: 1.06, letterSpacing: '-2px', color: '#fff', marginBottom: 24, animation: 'fadeUp 0.65s 0.1s ease both' }}>
                We Give Citizens<br />
                Their <span style={{ background: 'linear-gradient(90deg,#1a56e8,#00c2e0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Voice</span> Back.
              </h1>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 36, animation: 'fadeUp 0.65s 0.2s ease both' }}>
                "Sentinel-RTI was built on one belief: navigating government bureaucracy should not require a law degree, money, or connections."
              </p>
              <div style={{ display: 'flex', gap: 12, animation: 'fadeUp 0.65s 0.3s ease both' }}>
                <button onClick={() => navigate('contact')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1a56e8', color: '#fff', padding: '13px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, boxShadow: '0 6px 24px rgba(26,86,232,0.4)', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#3b74ff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#1a56e8'; e.currentTarget.style.transform = '' }}>
                  <Icon name="file" size={15} color="white" /> File a Complaint
                </button>
                <button onClick={() => navigate('home')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)', padding: '13px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 14, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}>
                  <Icon name="arrow" size={15} color="currentColor" /> How It Works
                </button>
              </div>
            </div>

            {/* Right – mission card + stats */}
            <div style={{ animation: 'fadeUp 0.65s 0.2s ease both' }}>
              <div style={{ background: SURF, border: `1px solid ${BBLUE}`, borderRadius: 16, padding: '32px 36px', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', marginBottom: 20 }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#00c2e0', letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>Our Mission</span>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 'clamp(16px,2vw,20px)', color: '#fff', lineHeight: 1.55 }}>
                  "Democratise access to civic accountability — so <em style={{ fontStyle: 'italic', color: '#00c2e0' }}>every Indian</em>, regardless of literacy, income, or status, can exercise their constitutional right to information."
                </p>
              </div>
              {/* Stat pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {HERO_STATS.map(s => (
                  <div key={s.label} style={{ background: GLASS, border: `1px solid ${BDIM}`, borderRadius: 12, padding: '18px 16px', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 28, background: 'linear-gradient(180deg,#fff,rgba(255,255,255,0.5))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>{s.num}</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 6, letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRESS BAR ── */}
      <div style={{ borderTop: `1px solid ${BDIM}`, borderBottom: `1px solid ${BDIM}`, padding: '20px 48px', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 3, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 }}>As seen in</span>
        <div style={{ display: 'flex', gap: 36, alignItems: 'center', flexWrap: 'wrap' }}>
          {PRESS.map(p => <PressLogo key={p} name={p} />)}
        </div>
      </div>

      {/* ── VALUES ── */}
      <section style={{ padding: '96px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionRule label="Our Principles" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', border: `1px solid ${BDIM}`, borderRadius: 16, overflow: 'hidden' }}>
            {VALUES.map((v, i) => <ValueCard key={i} v={v} last={i === VALUES.length - 1} />)}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ background: SURF, borderTop: `1px solid ${BDIM}`, borderBottom: `1px solid ${BDIM}`, padding: '96px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionRule label="The People Behind Sentinel-RTI" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', border: `1px solid ${BDIM}`, borderRadius: 16, overflow: 'hidden' }}>
            {TEAM.map(m => <TeamCard key={m.name} m={m} />)}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section style={{ padding: '96px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionRule label="Our Story" />
          <div>
            {MILESTONES.map((m, i) => <TimelineItem key={i} m={m} last={i === MILESTONES.length - 1} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '0 48px 96px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg,rgba(26,86,232,0.18) 0%,rgba(0,194,224,0.08) 100%)', border: `1px solid ${BBLUE}`, borderRadius: 20, padding: '60px 52px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -80, top: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,194,224,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#00c2e0', marginBottom: 16, display: 'block' }}>Join the Movement</span>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(28px,4vw,48px)', color: '#fff', marginBottom: 14, letterSpacing: '-1px' }}>Your Voice Deserves to Be Heard.</h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>File your first complaint today — free, anonymous, and legally precise.</p>
              <button onClick={() => navigate('contact')} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#1a56e8', color: '#fff', padding: '14px 34px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, boxShadow: '0 6px 24px rgba(26,86,232,0.45)', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#3b74ff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1a56e8'; e.currentTarget.style.transform = '' }}>
                <Icon name="arrow" size={16} color="white" /> File a Complaint
              </button>
            </div>
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
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2026 Sentinel-RTI — Open Source MIT</span>
      </footer>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media(max-width:900px) {
          section > div > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns:1fr !important; }
          section > div > div[style*="repeat(3,1fr)"] { grid-template-columns:1fr !important; }
          section > div > div[style*="repeat(4,1fr)"] { grid-template-columns:1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}
