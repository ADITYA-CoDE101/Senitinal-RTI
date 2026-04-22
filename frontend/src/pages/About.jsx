import React from 'react'
import Icon from '../components/Icon'
import { useTheme } from '../App'

/* ── DATA (unchanged) ─────────────────────────────────────────── */
const TEAM = [
  { initials: 'A', name: 'Aditya',color: '#3b74ff', bg: 'rgba(59,116,255,0.12)',  bio: 'Full-stack developer leading backend architecture, system design, and core integrations. Played a key role in shaping the overall functionality and execution of the project.' },
  { initials: 'TC', name: 'Tanmay Kanchan', color: '#1a56e8', bg: 'rgba(26,86,232,0.12)',  bio: 'Worked across frontend and backend development, contributing to UI implementation, API integration, and database handling throughout the project.' },
  { initials: 'DG', name: 'Diksha Gupta',  color: '#3b74ff', bg: 'rgba(59,116,255,0.12)',   bio: 'Focused on presentation, documentation, and pitch development, ensuring clear communication of the product\'s vision and structure.' },
  { initials: 'RV', name: 'Ekansh Mishra', color: '#1a56e8', bg: 'rgba(26,86,232,0.12)',  bio: 'Led frontend presentation and interface design, focusing on user experience, visual consistency, and overall usability of the platform.' },
]

const VALUES = [
  { num: '01', title: 'Radical Transparency', icon: 'trending', color: '#3b74ff', desc: 'Every step of your complaint journey is visible, tracked, and auditable. Governments must be held accountable — so must we. Full audit trails for every action taken.' },
  { num: '02', title: 'Legal Precision',       icon: 'lock',     color: '#1a56e8', desc: 'AI-generated complaints are legally accurate, jurisdiction-specific, and formatted to comply with the RTI Act 2005, CrPC, and relevant state acts. No guesswork — only precedent.' },
  { num: '03', title: 'Citizen First',         icon: 'heart',    color: '#3b74ff', desc: 'No legal knowledge required. No fees. No barriers. We believe every Indian citizen deserves equal access to civic justice — from rural villages to urban metros.' },
]

const MILESTONES = [
  { year: 'Early April', title: 'The Idea',            desc: 'Started as a college project to simplify how citizens file RTI complaints. The goal was to reduce manual effort and make the process more accessible and structured.' },
  { year: 'April', title: 'Initial Development',         desc: 'Core frontend and backend setup completed, including basic complaint flow, UI structure, and initial database integration.' },
  { year: 'Mid April', title: 'Feature building',       desc: 'Added key features like complaint generation flow, structured input handling, and improved UI/UX for better usability.' },
  { year: 'Late april', title: 'Refinement',        desc: 'Focused on improving design consistency, optimizing workflows, and preparing the platform for demonstration and presentation.' },
  { year: 'Present', title: 'Ongoing', desc: ' Continuously improving the platform with better interface design, feature enhancements, and scalability for future use.' },
]

const PRESS   = ['The Hindu', 'Economic Times', 'NDTV', 'LiveMint', 'The Wire', 'Scroll.in']
const HERO_STATS = [
  { num: '12K+', label: 'Complaints Filed' },
  { num: '89%',  label: 'Resolution Rate'  },
  { num: '18',   label: 'States Covered'   },
]

/* ── VALUE CARD ───────────────────────────────────────────────── */
function ValueCard({ v, last, dark }) {
  const [hovered, setHovered] = React.useState(false)
  const bdim = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const txtPri = dark ? '#fff' : '#0f172a'
  const txtMut = dark ? 'rgba(255,255,255,0.5)' : 'rgba(15,23,42,0.55)'
  const glass = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
  const ghover = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '40px 36px',
        borderRight: last ? 'none' : `1px solid ${bdim}`,
        background: hovered ? ghover : glass,
        transition: 'all 0.25s', position: 'relative', overflow: 'hidden',
        borderTop: hovered ? `2px solid ${v.color}` : '2px solid transparent',
      }}
    >
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
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 20, color: txtPri, marginBottom: 12, transition: 'color 0.35s' }}>{v.title}</div>
      <div style={{ fontSize: 14, color: txtMut, lineHeight: 1.8, transition: 'color 0.35s' }}>{v.desc}</div>
    </div>
  )
}

/* ── TEAM CARD ────────────────────────────────────────────────── */
function TeamCard({ m, dark }) {
  const [hovered] = React.useState(false)
  const bdim = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const txtPri = dark ? '#fff' : '#0f172a'
  const txtMut = dark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.5)'
  const glass = dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
  const ghover = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
  const [isHovered, setIsHovered] = React.useState(false)
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '36px 28px',
        borderRight: `1px solid ${bdim}`,
        borderBottom: `1px solid ${bdim}`,
        background: isHovered ? ghover : glass,
        transition: 'background 0.25s',
      }}
    >
      <div style={{
        width: 60, height: 60, borderRadius: 14, marginBottom: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20,
        background: m.bg, color: m.color,
        border: `1.5px solid ${m.color}40`,
        transition: 'all 0.25s',
      }}>{m.initials}</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, color: txtPri, marginBottom: 4, transition: 'color 0.35s' }}>{m.name}</div>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: m.color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{m.role}</div>
      <div style={{ fontSize: 13, color: txtMut, lineHeight: 1.75, transition: 'color 0.35s' }}>{m.bio}</div>
    </div>
  )
}

/* ── TIMELINE ITEM ────────────────────────────────────────────── */
function TimelineItem({ m, last, dark }) {
  const [hovered, setHovered] = React.useState(false)
  const bg = dark ? '#07090f' : '#f0f4fa'
  const txtPri = dark ? '#fff' : '#0f172a'
  const txtMut = dark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.5)'
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'grid', gridTemplateColumns: '80px 1px 1fr', gap: 36, paddingBottom: last ? 0 : 52, alignItems: 'start' }}
    >
      <div style={{
        fontFamily: "'Space Mono',monospace", fontWeight: 700,
        fontSize: 'clamp(22px, 2.5vw, 32px)',
        color: hovered ? '#3b74ff' : (dark ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.2)'),
        textAlign: 'right', lineHeight: 1, paddingTop: 4, transition: 'color 0.25s',
      }}>{m.year}</div>

      <div style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
          width: 12, height: 12, borderRadius: '50%',
          background: hovered ? '#3b74ff' : '#1a56e8',
          border: `2px solid ${bg}`,
          transition: 'all 0.25s',
        }} />
      </div>

      <div style={{ paddingTop: 2 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 19, color: txtPri, marginBottom: 8, transition: 'color 0.35s' }}>{m.title}</div>
        <div style={{ fontSize: 14, color: txtMut, lineHeight: 1.8, transition: 'color 0.35s' }}>{m.desc}</div>
      </div>
    </div>
  )
}

/* ── PRESS LOGO ───────────────────────────────────────────────── */
function PressLogo({ name, dark }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16,
        color: hovered ? (dark ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.7)') : (dark ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.25)'),
        cursor: 'default', transition: 'color 0.2s',
      }}
    >{name}</span>
  )
}

/* ── ABOUT PAGE ───────────────────────────────────────────────── */
export default function About({ navigate }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const bg = dark ? '#07090f' : '#f0f4fa'
  const surf = dark ? '#0d1117' : '#ffffff'
  const bdim = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const txtPri = dark ? '#fff' : '#0f172a'
  const txtMut = dark ? 'rgba(255,255,255,0.55)' : 'rgba(15,23,42,0.55)'
  const txtFaint = dark ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.28)'
  const glass = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
  const bblue = 'rgba(26,86,232,0.30)'

  const gridBg = {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: `linear-gradient(rgba(26,86,232,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,232,0.05) 1px,transparent 1px)`,
    backgroundSize: '64px 64px',
  }

  return (
    <div className="page-enter" style={{ background: bg, minHeight: '100vh', color: txtPri, paddingTop: 72, transition: 'background 0.35s, color 0.35s' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '96px 48px 80px' }}>
        <div style={gridBg} />
        {/* Glow orbs — hero only */}
        <div style={{ position: 'absolute', top: -120, left: -120, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,232,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Hero grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            {/* Left – headline */}
            <div>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(42px,5.5vw,68px)', lineHeight: 1.06, letterSpacing: '-2px', color: txtPri, marginBottom: 24, animation: 'fadeUp 0.65s 0.1s ease both', transition: 'color 0.35s' }}>
                We Give Citizens<br />
                Their <span style={{ background: 'linear-gradient(90deg,#1a56e8,#3b74ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Voice</span> Back.
              </h1>
              <p style={{ fontSize: 17, color: txtMut, lineHeight: 1.8, marginBottom: 36, animation: 'fadeUp 0.65s 0.2s ease both', transition: 'color 0.35s' }}>
                "Sentinel-RTI was built on one belief: navigating government bureaucracy should not require a law degree, money, or connections."
              </p>
              <div style={{ display: 'flex', gap: 12, animation: 'fadeUp 0.65s 0.3s ease both' }}>
                <button onClick={() => navigate('contact')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1a56e8', color: '#fff', padding: '13px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, boxShadow: '0 6px 24px rgba(26,86,232,0.4)', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#3b74ff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#1a56e8'; e.currentTarget.style.transform = '' }}>
                  <Icon name="file" size={15} color="white" /> File a Complaint
                </button>
                <button onClick={() => navigate('home')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', color: txtMut, padding: '13px 28px', borderRadius: 10, border: `1px solid ${bdim}`, cursor: 'pointer', fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 14, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)'; e.currentTarget.style.color = txtPri }}
                  onMouseLeave={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = txtMut }}>
                  <Icon name="arrow" size={15} color="currentColor" /> How It Works
                </button>
              </div>
            </div>

            {/* Right – mission card + stats */}
            <div style={{ animation: 'fadeUp 0.65s 0.2s ease both' }}>
              <div style={{ background: surf, border: `1px solid ${bblue}`, borderRadius: 16, padding: '32px 36px', boxShadow: dark ? '0 8px 40px rgba(0,0,0,0.4)' : '0 8px 40px rgba(0,0,0,0.08)', marginBottom: 20, transition: 'background 0.35s' }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#3b74ff', letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>Our Mission</span>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 'clamp(16px,2vw,20px)', color: txtPri, lineHeight: 1.55, transition: 'color 0.35s' }}>
                  "Democratise access to civic accountability — so <em style={{ fontStyle: 'italic', color: '#3b74ff' }}>every Indian</em>, regardless of literacy, income, or status, can exercise their constitutional right to information."
                </p>
              </div>
              {/* Stat pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {HERO_STATS.map(s => (
                  <div key={s.label} style={{ background: glass, border: `1px solid ${bdim}`, borderRadius: 12, padding: '18px 16px', textAlign: 'center', transition: 'all 0.35s' }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 28, color: '#1a56e8', lineHeight: 1 }}>{s.num}</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, color: txtFaint, marginTop: 6, letterSpacing: 1, textTransform: 'uppercase', transition: 'color 0.35s' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRESS BAR ── */}
      <div style={{ borderTop: `1px solid ${bdim}`, borderBottom: `1px solid ${bdim}`, padding: '20px 48px', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 3, color: txtFaint, textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0, transition: 'color 0.35s' }}>As seen in</span>
        <div style={{ display: 'flex', gap: 36, alignItems: 'center', flexWrap: 'wrap' }}>
          {PRESS.map(p => <PressLogo key={p} name={p} dark={dark} />)}
        </div>
      </div>

      {/* ── VALUES ── */}
      <section style={{ padding: '96px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: txtPri, marginBottom: 40, transition: 'color 0.35s' }}>Our Principles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', border: `1px solid ${bdim}`, borderRadius: 16, overflow: 'hidden' }}>
            {VALUES.map((v, i) => <ValueCard key={i} v={v} last={i === VALUES.length - 1} dark={dark} />)}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ background: surf, borderTop: `1px solid ${bdim}`, borderBottom: `1px solid ${bdim}`, padding: '96px 48px', transition: 'background 0.35s' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: txtPri, marginBottom: 40, transition: 'color 0.35s' }}>The People Behind Sentinel-RTI</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', border: `1px solid ${bdim}`, borderRadius: 16, overflow: 'hidden' }}>
            {TEAM.map(m => <TeamCard key={m.name} m={m} dark={dark} />)}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section style={{ padding: '96px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 15, color: txtMut, marginBottom: 40, transition: 'color 0.35s' }}>Our Story</p>
          <div>
            {MILESTONES.map((m, i) => <TimelineItem key={i} m={m} last={i === MILESTONES.length - 1} dark={dark} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '0 48px 96px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ background: dark ? 'rgba(26,86,232,0.10)' : 'rgba(26,86,232,0.05)', border: `1px solid ${bblue}`, borderRadius: 20, padding: '60px 52px', textAlign: 'center', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(28px,4vw,48px)', color: txtPri, marginBottom: 14, letterSpacing: '-1px', transition: 'color 0.35s' }}>Your Voice Deserves to Be Heard.</h2>
              <p style={{ fontSize: 16, color: txtMut, marginBottom: 32, transition: 'color 0.35s' }}>File your first complaint today — free, anonymous, and legally precise.</p>
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
      <footer style={{ borderTop: `1px solid ${bdim}`, padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: txtPri, transition: 'color 0.35s' }}>Sentinel<span style={{ color: '#3b74ff' }}>-RTI</span></span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Home','About','Contact','RTI Act','GitHub'].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: txtFaint, fontFamily: "'Syne',sans-serif", transition: 'color 0.2s', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = '#3b74ff'}
              onMouseLeave={e => e.target.style.color = txtFaint}>{l}</a>
          ))}
        </div>
        <span style={{ fontSize: 12, color: txtFaint, transition: 'color 0.35s' }}>© 2026 Sentinel-RTI — Open Source MIT</span>
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
