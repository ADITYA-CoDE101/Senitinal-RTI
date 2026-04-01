import React, { useState } from 'react'
import Icon from './Icon'

const styles = {
  home: {
    bg: 'rgba(7,9,15,0.90)',
    border: '1px solid rgba(255,255,255,0.07)',
    logoColor: '#ffffff',
    linkColor: 'rgba(255,255,255,0.5)',
    linkHover: '#ffffff',
    linkActiveBg: 'rgba(0,194,224,0.10)',
    linkActiveColor: '#00c2e0',
    menuIconColor: 'rgba(255,255,255,0.7)',
    mobileBg: '#0d1117',
    mobileBorder: 'rgba(255,255,255,0.08)',
    mobileLinkColor: 'rgba(255,255,255,0.75)',
  },
  about: {
    bg: 'rgba(253,248,242,0.95)',
    border: '2px solid #1a0a00',
    logoColor: '#1a0a00',
    linkColor: '#8b7060',
    linkHover: '#1a0a00',
    linkActiveBg: '#fff5e6',
    linkActiveColor: '#1a0a00',
    menuIconColor: '#1a0a00',
    mobileBg: '#fdf8f2',
    mobileBorder: '#e0d4c0',
    mobileLinkColor: '#1a0a00',
  },
  contact: {
    bg: 'rgba(255,255,255,0.95)',
    border: '1px solid #e5e8f0',
    logoColor: '#0c0e14',
    linkColor: '#8b93ab',
    linkHover: '#1a56e8',
    linkActiveBg: 'rgba(26,86,232,0.08)',
    linkActiveColor: '#1a56e8',
    menuIconColor: '#555',
    mobileBg: '#ffffff',
    mobileBorder: '#e5e8f0',
    mobileLinkColor: '#2c3655',
  },
}

export default function Navbar({ page, navigate }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const s = styles[page]

  const links = [
    { id: 'home',    label: 'Home' },
    { id: 'about',   label: 'About' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 200,
      height: 64, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 48px',
      background: s.bg, borderBottom: s.border,
      backdropFilter: 'blur(18px)',
      transition: 'all 0.3s',
    }}>
      {/* Logo */}
      <button onClick={() => { navigate('home'); setMobileOpen(false) }} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: page === 'about' ? "'Playfair Display', serif" : "'Syne', sans-serif",
        fontWeight: 900, fontSize: 19, color: s.logoColor,
        padding: 0,
      }}>
        <div style={{
          width: 34, height: 34,
          borderRadius: page === 'about' ? 0 : 9,
          background: page === 'about' ? '#d4a028' : 'linear-gradient(135deg,#1a56e8,#00c2e0)',
          border: page === 'about' ? '2px solid #1a0a00' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name="shield" size={17} color={page === 'about' ? '#1a0a00' : 'white'} sw={2.2} />
        </div>
        Sentinel<span style={{ color: page === 'about' ? '#d4a028' : '#00c2e0' }}>-RTI</span>
      </button>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: 4 }}>
        {links.map(l => (
          <button key={l.id} onClick={() => { navigate(l.id); setMobileOpen(false) }} style={{
            padding: '7px 16px', borderRadius: page === 'about' ? 0 : 8,
            border: page === 'about' ? '1px solid transparent' : 'none',
            borderBottom: page === 'about' && l.id === page ? '3px solid #d4a028' : page === 'about' ? '3px solid transparent' : 'none',
            background: l.id === page ? s.linkActiveBg : 'transparent',
            color: l.id === page ? s.linkActiveColor : s.linkColor,
            fontFamily: page === 'about' ? "'Space Mono', monospace" : "'Syne', sans-serif",
            fontWeight: page === 'about' ? 700 : 600,
            fontSize: page === 'about' ? 10 : 13,
            letterSpacing: page === 'about' ? '1.5px' : 0,
            textTransform: page === 'about' ? 'uppercase' : 'none',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { if (l.id !== page) e.target.style.color = s.linkHover }}
          onMouseLeave={e => { if (l.id !== page) e.target.style.color = s.linkColor }}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {/* CTA Button */}
        <button onClick={() => navigate('contact')} style={{
          background: page === 'about' ? '#1a0a00' : '#1a56e8',
          color: page === 'about' ? '#fdf8f2' : 'white',
          border: 'none', cursor: 'pointer',
          padding: '9px 22px',
          borderRadius: page === 'about' ? 0 : 9,
          fontFamily: page === 'about' ? "'Space Mono', monospace" : "'Syne', sans-serif",
          fontWeight: 700, fontSize: page === 'about' ? 10 : 13,
          letterSpacing: page === 'about' ? '1.5px' : 0,
          textTransform: page === 'about' ? 'uppercase' : 'none',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: page === 'about' ? 'none' : '0 4px 14px rgba(26,86,232,0.35)',
          transition: 'all 0.2s',
        }}>
          <Icon name="file" size={13} color={page === 'about' ? '#fdf8f2' : 'white'} />
          File Complaint
        </button>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 4,
          display: 'none',
        }} className="mobile-menu-btn">
          <Icon name={mobileOpen ? 'x' : 'menu'} size={22} color={s.menuIconColor} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: 64, left: 0, right: 0,
          background: s.mobileBg,
          borderBottom: `1px solid ${s.mobileBorder}`,
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 4, zIndex: 300,
        }}>
          {links.map(l => (
            <button key={l.id} onClick={() => { navigate(l.id); setMobileOpen(false) }} style={{
              background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              padding: '11px 14px', borderRadius: 8,
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
              color: l.id === page ? '#1a56e8' : s.mobileLinkColor,
            }}>
              {l.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width: 700px) {
          nav > div:nth-child(2) { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          nav { padding: 0 20px !important; }
        }
      `}</style>
    </nav>
  )
}
