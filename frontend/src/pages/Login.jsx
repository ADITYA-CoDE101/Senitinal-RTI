import React, { useState } from 'react'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../services/api'

const BG   = '#07090f'
const SURF = '#0d1117'
const BDIM = 'rgba(255,255,255,0.06)'

export default function Login({ navigate }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await loginUser(form.email, form.password)
      login(res.user, res.token)
      navigate('home')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div className="page-enter" style={{ 
      background: BG, height: '100vh', width: '100vw', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'fixed', top: 0, left: 0, zIndex: 9999
    }}>
      {/* Background Decor */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,232,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,194,224,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(26,86,232,0.1)', border: '1px solid rgba(26,86,232,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Icon name="shield" size={24} color="#1a56e8" />
              </div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, letterSpacing: '-1px', color: '#fff' }}>
                Sentinel<span style={{ color: '#00c2e0' }}>-RTI</span>
              </span>
           </div>
           <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 10 }}>Secure Personnel Portal</h2>
           <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Authorized access only. Please login to manage RTI filings.</p>
        </div>

        <form onSubmit={handleLogin} style={{ background: SURF, padding: 40, borderRadius: 24, border: `1px solid ${BDIM}`, boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
           {error && (
             <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#ef4444', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="alertCircle" size={14} color="#ef4444" /> {error}
             </div>
           )}

           <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Email Address</label>
              <input 
                type="email" required
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', outline: 'none', transition: 'border-color 0.2s' }}
                placeholder="admin@sentinel.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              />
           </div>

           <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Password</label>
              <input 
                type="password" required
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', outline: 'none', transition: 'border-color 0.2s' }}
                placeholder="••••••••"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              />
           </div>

           <button type="submit" disabled={loading} style={{
             width: '100%', padding: '16px', background: '#1a56e8', color: '#fff', border: 'none', borderRadius: 12,
             fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, cursor: 'pointer',
             boxShadow: '0 8px 24px rgba(26,86,232,0.3)', transition: 'all 0.2s', opacity: loading ? 0.7 : 1
           }}>
             {loading ? 'Authenticating...' : 'Sign In'}
           </button>

           <div style={{ marginTop: 32, textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>DEFAULT TEST CREDENTIALS</div>
              <div style={{ fontSize: 12, color: '#1a56e8', fontFamily: "'Space Mono', monospace" }}>admin@sentinel.com</div>
              <div style={{ fontSize: 12, color: '#0ec98c', fontFamily: "'Space Mono', monospace" }}>admin123</div>
           </div>
        </form>
      </div>
    </div>
  )
}
