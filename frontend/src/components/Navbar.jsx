import React, { useState } from 'react'
import Icon from './Icon'

// Single unified dark theme for ALL pages
const NAV_STYLE = {
  bg:              'rgba(7, 9, 15, 0.92)',
  border:          '1px solid rgba(255,255,255,0.07)',
  logoColor:       '#ffffff',
  linkColor:       'rgba(255,255,255,0.5)',
  linkHover:       '#ffffff',
  linkActiveBg:    'rgba(0,194,224,0.10)',
  linkActiveColor: '#00c2e0',
  menuIconColor:   'rgba(255,255,255,0.7)',
  mobileBg:        '#0d1117',
  mobileBorder:    'rgba(255,255,255,0.08)',
  mobileLinkColor: 'rgba(255,255,255,0.75)',
}

export default function Navbar({ page, navigate }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const s = NAV_STYLE

  const links = [
    { id: 'home',    label: 'Home'    },
    { id: 'about',   label: 'About'   },
    { id: 'contact', label: 'Contact' },
    { id: 'waitlist', label: 'Waitlist' },
  ]

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 200,
      height: 64, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 48px',
      background: s.bg, borderBottom: s.border,
      backdropFilter: 'blur(20px)',
    }}>
      {/* Logo */}
      <button
        onClick={() => { navigate('home'); setMobileOpen(false) }}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 19,
          color: s.logoColor, padding: 0,
        }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: 'linear-gradient(135deg, #1a56e8, #00c2e0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="shield" size={17} color="white" sw={2.2} />
        </div>
        Sentinel<span style={{ color: '#00c2e0' }}>-RTI</span>
      </button>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: 4 }}>
        {links.map(l => {
          const isActive = l.id === page
          return (
            <button
              key={l.id}
              onClick={() => { navigate(l.id); setMobileOpen(false) }}
              style={{
                padding: '7px 16px', borderRadius: 8, border: 'none',
                background: isActive ? s.linkActiveBg : 'transparent',
                color: isActive ? s.linkActiveColor : s.linkColor,
                fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = s.linkHover; e.currentTarget.style.background = isActive ? s.linkActiveBg : 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.color = isActive ? s.linkActiveColor : s.linkColor; e.currentTarget.style.background = isActive ? s.linkActiveBg : 'transparent' }}
            >
              {l.label}
            </button>
          )
        })}
      </div>

      {/* CTA + mobile */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          onClick={() => navigate('contact')}
          style={{
            background: '#1a56e8', color: '#fff', border: 'none', cursor: 'pointer',
            padding: '9px 22px', borderRadius: 9,
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 14px rgba(26,86,232,0.4)', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#3b74ff'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#1a56e8'; e.currentTarget.style.transform = '' }}
        >
          <Icon name="file" size={13} color="white" />
          File Complaint
        </button>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-menu-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'none' }}
        >
          <Icon name={mobileOpen ? 'x' : 'menu'} size={22} color={s.menuIconColor} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: 64, left: 0, right: 0,
          background: s.mobileBg, borderBottom: `1px solid ${s.mobileBorder}`,
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 4, zIndex: 300,
        }}>
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => { navigate(l.id); setMobileOpen(false) }}
              style={{
                background: l.id === page ? 'rgba(0,194,224,0.08)' : 'none',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                padding: '11px 14px', borderRadius: 8,
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
                color: l.id === page ? '#00c2e0' : s.mobileLinkColor,
              }}
            >
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
