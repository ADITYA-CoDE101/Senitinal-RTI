import React, { useState } from 'react'
import Icon from './Icon'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ navigate, currentPage }) {
  const [hovered, setHovered] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { logout, user } = useAuth()

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'fileComplaint', label: 'File Complaint' },
    { id: 'track', label: 'Track' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 80,
      background: 'rgba(7,9,15,0.85)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px',
    }}>
      {/* Brand */}
      <div 
        onClick={() => { navigate('home'); setMobileOpen(false) }}
        style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #1a56e8, #00c2e0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon name="shield" size={18} color="white" sw={2.5} />
        </div>
        <span style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: 18, letterSpacing: '-0.5px', color: '#fff'
        }}>
          Sentinel<span style={{ color: '#00c2e0' }}>-RTI</span>
        </span>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {navItems.map((item) => {
          const active = currentPage === item.id
          const isHovered = hovered === item.id
          return (
            <button
              key={item.id}
              onClick={() => { navigate(item.id); setMobileOpen(false) }}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none',
                background: active ? 'rgba(26,86,232,0.1)' : isHovered ? 'rgba(255,255,255,0.05)' : 'transparent',
                color: active ? '#00c2e0' : isHovered ? '#fff' : 'rgba(255,255,255,0.5)',
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
              }}
            >
              {item.label}
              {active && (
                <div style={{
                  position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: '50%', background: '#00c2e0'
                }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
         {user && (
           <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 8 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'right' }}>
                 <div style={{ color: '#fff', fontWeight: 700 }}>{user.name}</div>
                 <div>Personnel ID: SRT-882</div>
              </div>
              <button 
                onClick={logout}
                style={{ 
                  background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)',
                  padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer'
                }}
              >
                Logout
              </button>
           </div>
         )}
        <button
          onClick={() => navigate('fileComplaint')}
          style={{
            padding: '10px 24px', borderRadius: 10, border: 'none',
            background: '#1a56e8', color: '#fff',
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 4px 16px rgba(26,86,232,0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#3b74ff'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#1a56e8'
            e.currentTarget.style.transform = 'none'
          }}
        >
          File Complaint
        </button>
      </div>

      <style>{`
        @media(max-width: 900px) {
           nav { padding: 0 20px !important; }
           nav > div:nth-child(2) { display: none !important; }
           nav > div:nth-child(3) > div:first-child { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
