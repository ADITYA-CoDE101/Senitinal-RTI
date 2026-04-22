import React, { useState } from 'react'
import Icon from './Icon'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../App'

export default function Navbar({ navigate, currentPage }) {
  const [hovered, setHovered] = useState(null)
  const { logout, user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const dark = theme === 'dark'

  const navItems = [
    { id: 'home',          label: 'Home' },
    { id: 'fileComplaint', label: 'File Complaint' },
    { id: 'track',         label: 'Track' },
    { id: 'dashboard',     label: 'Dashboard' },
    { id: 'about',         label: 'About' },
    { id: 'contact',       label: 'Contact' },
  ]

  const textPrimary   = 'var(--text-primary)'
  const textMuted     = 'var(--text-muted)'
  const borderDim     = 'var(--border-dim)'

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 72,
      background: 'var(--nav-bg)', backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${borderDim}`, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', transition: 'background 0.35s',
    }}>
      {/* Brand */}
      <div onClick={() => navigate('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#1a56e8,#3b74ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="shield" size={16} color="white" sw={2.5} />
        </div>
        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: '-0.5px', color: textPrimary, transition: 'color 0.3s' }}>
          Sentinel<span style={{ color: '#3b74ff' }}>-RTI</span>
        </span>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {navItems.map(item => {
          const active = currentPage === item.id
          const isHov = hovered === item.id
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '7px 14px', borderRadius: 8, border: 'none',
                background: active ? 'rgba(26,86,232,0.12)' : isHov ? 'var(--bg-glass)' : 'transparent',
                color: active ? '#3b74ff' : isHov ? textPrimary : textMuted,
                fontFamily:"'Syne',sans-serif", fontWeight: 700, fontSize: 13,
                cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
              }}
            >
              {item.label}
              {active && <div style={{ position:'absolute', bottom:-10, left:'50%', transform:'translateX(-50%)', width:4, height:4, borderRadius:'50%', background:'#3b74ff' }} />}
            </button>
          )
        })}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          style={{
            width: 36, height: 36, borderRadius: 9, border: `1px solid ${borderDim}`,
            background: 'var(--bg-glass)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(26,86,232,0.4)'; e.currentTarget.style.background='rgba(26,86,232,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor=borderDim; e.currentTarget.style.background='var(--bg-glass)' }}
        >
          {dark
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a56e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          }
        </button>

        {/* User info + logout */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 11, color: textMuted, textAlign: 'right' }}>
              <div style={{ color: textPrimary, fontWeight: 700, transition:'color 0.3s' }}>{user.name}</div>
              <div>Personnel ID: SRT-882</div>
            </div>
            <button onClick={logout} style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.2)', padding:'7px 12px', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer' }}>
              Logout
            </button>
          </div>
        )}

        <button onClick={() => navigate('fileComplaint')} style={{ padding:'9px 20px', borderRadius:9, border:'none', background:'#1a56e8', color:'#fff', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.2s', boxShadow:'0 4px 16px rgba(26,86,232,0.3)' }}
          onMouseEnter={e => { e.currentTarget.style.background='#3b74ff'; e.currentTarget.style.transform='translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background='#1a56e8'; e.currentTarget.style.transform='none' }}
        >File Complaint</button>
      </div>

      <style>{`
        @media(max-width:900px) {
          nav { padding: 0 20px !important; }
          nav > div:nth-child(2) { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
