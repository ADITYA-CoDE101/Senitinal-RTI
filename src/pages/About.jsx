import React from 'react'
import Icon from '../components/Icon'

const TEAM = [
  { initials: 'PS', name: 'Priya Sharma',  role: 'Founder & CEO',            color: '#d4a028', bg: 'rgba(212,160,40,0.12)',  bio: 'Former IAS officer with 15 years in civic governance and RTI advocacy across Maharashtra and Delhi.' },
  { initials: 'AM', name: 'Arjun Mehta',   role: 'Chief Technology Officer',  color: '#7aa2f7', bg: 'rgba(122,162,247,0.12)', bio: 'AI/ML engineer specialising in legal NLP, document intelligence, and retrieval-augmented generation systems.' },
  { initials: 'FZ', name: 'Fatima Zaidi',  role: 'Legal Director',            color: '#f7a8d4', bg: 'rgba(247,168,212,0.12)', bio: 'Advocate specialising in RTI law, whistleblower protection, PIL litigation, and administrative law reform.' },
  { initials: 'RV', name: 'Rohan Verma',   role: 'Head of Growth',            color: '#7adaa0', bg: 'rgba(122,218,160,0.12)', bio: 'Civic-tech strategist previously at Janaagraha and Accountability Initiative. Expert in government partnerships.' },
]

const VALUES = [
  { num: '01', title: 'Radical Transparency', desc: 'Every step of your complaint journey is visible, tracked, and auditable. Governments must be held accountable — so must we. Full audit trails for every action taken.' },
  { num: '02', title: 'Legal Precision',       desc: 'AI-generated complaints are legally accurate, jurisdiction-specific, and formatted to comply with the RTI Act 2005, CrPC, and relevant state acts. No guesswork — only precedent.' },
  { num: '03', title: 'Citizen First',         desc: 'No legal knowledge required. No fees. No barriers. We believe every Indian citizen deserves equal access to civic justice — from rural villages to urban metros.' },
]

const MILESTONES = [
  { year: '2021', title: 'The Idea',             desc: 'Founded after Priya Sharma filed 40+ RTI applications manually over two years and saw the systemic barriers ordinary citizens face.' },
  { year: '2022', title: 'MVP Launched',          desc: 'First version deployed in Mumbai — 200 complaints filed in month one. 73% received responses within 30 days. 10× growth from media coverage.' },
  { year: '2023', title: 'AI Integration',        desc: 'Legal RAG engine built with 50,000+ Indian law documents. Evidence enhancement and auto-routing launched. Resolution rate jumped to 81%.' },
  { year: '2024', title: 'National Scale',         desc: 'Expanded to 18 states. 340+ government authorities integrated. Voice input added in 6 regional languages. Partnership with National RTI Forum.' },
  { year: '2025', title: 'Open Source & Beyond',  desc: 'Platform open-sourced under MIT License. 12,400+ complaints filed. 89% resolution rate. Featured in TIME100 Most Influential Companies.' },
]

const PRESS = ['The Hindu', 'Economic Times', 'NDTV', 'LiveMint', 'The Wire', 'Scroll.in']

/* ── SECTION RULE ─────────────────────────────────────────────── */
function SectionRule({ label, light = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
      <div style={{ flex: 1, height: 1, background: light ? 'rgba(255,255,255,0.10)' : '#e0d4c0' }} />
      <span style={{
        fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 24,
        color: light ? '#fdf8f2' : '#1a0a00', whiteSpace: 'nowrap', padding: '0 8px',
      }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: light ? 'rgba(255,255,255,0.10)' : '#e0d4c0' }} />
    </div>
  )
}

/* ── VALUE CARD ───────────────────────────────────────────────── */
function ValueCard({ v, last }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '48px 40px',
        borderRight: last ? 'none' : '1px solid #e0d4c0',
        background: hovered ? '#fff5e6' : 'transparent',
        transition: 'background 0.3s', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#d4a028',
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.4s ease',
      }} />
      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 64, color: '#e0d4c0', lineHeight: 1, marginBottom: 20 }}>{v.num}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 24, color: '#1a0a00', marginBottom: 14 }}>{v.title}</div>
      <div style={{ fontSize: 14, color: '#8b7060', lineHeight: 1.85 }}>{v.desc}</div>
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
        padding: '40px 32px',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: hovered ? 'rgba(255,255,255,0.04)' : '#1a0a00',
        transition: 'background 0.3s',
      }}
    >
      <div style={{
        width: 64, height: 64, borderRadius: 0, marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 22,
        background: m.bg, color: m.color, border: `2px solid ${m.color}`,
      }}>{m.initials}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 19, color: '#fdf8f2', marginBottom: 4 }}>{m.name}</div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#d4a028', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>{m.role}</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75 }}>{m.bio}</div>
    </div>
  )
}

/* ── ABOUT PAGE ───────────────────────────────────────────────── */
export default function About({ navigate }) {
  return (
    <div className="page-enter" style={{ background: '#fdf8f2', minHeight: '100vh', color: '#1a0a00' }}>

      {/* Hero editorial split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '3px solid #1a0a00', minHeight: '88vh' }}>

        {/* Left dark */}
        <div style={{ background: '#1a0a00', padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#d4a028' }} />
          <div style={{ position: 'absolute', bottom: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(212,160,40,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, textTransform: 'uppercase', animation: 'fadeUp 0.7s ease both' }}>
              <span style={{ width: 36, height: 1, background: '#d4a028', flexShrink: 0 }} />
              Issue No. 2026 — Civic Edition
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic',
              fontSize: 'clamp(52px, 6vw, 80px)', color: '#fdf8f2', lineHeight: 1.04,
              letterSpacing: '-1px', margin: '32px 0',
              animation: 'fadeUp 0.7s 0.1s ease both',
            }}>
              We Give<br />Citizens<br />Their<br /><span style={{ color: '#d4a028', fontStyle: 'normal' }}>Voice</span> Back.
            </h1>
            <p style={{
              fontFamily: "'Playfair Display', serif", fontSize: 17, fontStyle: 'italic',
              color: 'rgba(255,255,255,0.55)', lineHeight: 1.75,
              borderLeft: '3px solid #d4a028', paddingLeft: 20,
              animation: 'fadeUp 0.7s 0.2s ease both',
            }}>
              "Sentinel-RTI was built on one belief: navigating government bureaucracy should not require a law degree, money, or connections."
            </p>
          </div>

          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            {[{ num: '12K+', label: 'Complaints Filed' }, { num: '89%', label: 'Resolution Rate' }, { num: '18', label: 'States Covered' }].map(s => (
              <div key={s.label} style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 14 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 36, color: '#d4a028', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right cream */}
        <div style={{ background: '#fdf8f2', padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '1px solid #e0d4c0' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: '#8b6914', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20, display: 'block' }}>Our Mission</span>
          <p style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 700,
            fontSize: 'clamp(20px, 2.5vw, 30px)', color: '#1a0a00', lineHeight: 1.5, marginBottom: 36,
            animation: 'fadeUp 0.7s ease both',
          }}>
            "Democratise access to civic accountability — so <em style={{ fontStyle: 'italic', color: '#8b6914' }}>every Indian</em>, regardless of literacy, income, or status, can exercise their constitutional right to information."
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, animation: 'fadeUp 0.7s 0.2s ease both' }}>
            {[{ num: '12', unit: 'K+', label: 'Complaints Filed' }, { num: '89', unit: '%', label: 'Resolution Rate' }, { num: '18', unit: '', label: 'States Coverage' }, { num: '340', unit: '+', label: 'Authorities' }].map(s => (
              <div key={s.label} style={{ borderTop: '2px solid #1a0a00', paddingTop: 16 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 52, color: '#1a0a00', lineHeight: 1 }}>
                  {s.num}<span style={{ fontSize: 28, color: '#d4a028' }}>{s.unit}</span>
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#8b7060', letterSpacing: 2, textTransform: 'uppercase', marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Press bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 40, padding: '28px 64px', borderBottom: '1px solid #e0d4c0', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, color: '#8b7060', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 }}>As seen in</span>
        <div style={{ display: 'flex', gap: 36, alignItems: 'center', flexWrap: 'wrap' }}>
          {PRESS.map(p => (
            <PressLogo key={p} name={p} />
          ))}
        </div>
      </div>

      {/* Values */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ padding: '0 64px', marginBottom: 56 }}><SectionRule label="Our Principles" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid #e0d4c0', margin: '0 64px' }}>
          {VALUES.map((v, i) => <ValueCard key={i} v={v} last={i === VALUES.length - 1} />)}
        </div>
      </section>

      {/* Team */}
      <section style={{ background: '#1a0a00', padding: '80px 0' }}>
        <div style={{ padding: '0 64px', marginBottom: 56 }}><SectionRule label="The People Behind Sentinel-RTI" light /></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid rgba(255,255,255,0.06)', borderLeft: '1px solid rgba(255,255,255,0.06)', margin: '0 64px' }}>
          {TEAM.map(m => <TeamCard key={m.name} m={m} />)}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '80px 64px' }}>
        <div style={{ marginBottom: 56 }}><SectionRule label="Our Story" /></div>
        <div>
          {MILESTONES.map((m, i) => (
            <TimelineItem key={i} m={m} last={i === MILESTONES.length - 1} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ background: '#1a0a00', padding: '80px 64px', textAlign: 'center' }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#d4a028', marginBottom: 20, display: 'block' }}>Join the Movement</span>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', fontSize: 'clamp(32px, 5vw, 60px)', color: '#fdf8f2', marginBottom: 16, lineHeight: 1.1 }}>
          Your Voice Deserves<br />to Be Heard.
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', marginBottom: 36 }}>File your first complaint today — free, anonymous, and legally precise.</p>
        <button onClick={() => navigate('contact')} style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: '#d4a028', color: '#1a0a00', border: 'none', cursor: 'pointer',
          padding: '16px 40px', fontFamily: "'Space Mono', monospace", fontWeight: 700,
          fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#e8c060'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#d4a028'; e.currentTarget.style.transform = '' }}
        >
          File a Complaint →
        </button>
      </div>

      {/* Footer */}
      <footer style={{ background: '#1a0a00', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '28px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 17, color: '#fdf8f2' }}>
          Sentinel<span style={{ color: '#d4a028' }}>-RTI</span>
        </span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'RTI Act', 'GitHub'].map(l => (
            <a key={l} href="#" style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 1, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#d4a028'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
            >{l}</a>
          ))}
        </div>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>© 2026 Sentinel-RTI — Open Source MIT</span>
      </footer>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}

function PressLogo({ name }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: hovered ? '#1a0a00' : '#c0a888', cursor: 'default', transition: 'color 0.2s' }}
    >{name}</span>
  )
}

function TimelineItem({ m, last }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'grid', gridTemplateColumns: '100px 1px 1fr', gap: 40, paddingBottom: last ? 0 : 56, alignItems: 'start' }}
    >
      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(28px, 3vw, 40px)', color: hovered ? '#d4a028' : '#e0d4c0', textAlign: 'right', lineHeight: 1, paddingTop: 4, transition: 'color 0.2s' }}>{m.year}</div>
      <div style={{ background: '#e0d4c0', position: 'relative' }}>
        <div style={{ content: '', position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: '#d4a028', border: '3px solid #fdf8f2', boxShadow: '0 0 0 2px #d4a028' }} />
      </div>
      <div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, color: '#1a0a00', marginBottom: 10 }}>{m.title}</div>
        <div style={{ fontSize: 14, color: '#8b7060', lineHeight: 1.85 }}>{m.desc}</div>
      </div>
    </div>
  )
}
