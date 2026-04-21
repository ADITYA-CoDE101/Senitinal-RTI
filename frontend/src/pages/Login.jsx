import React, { useState } from 'react'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'
import { loginUser, registerUser } from '../services/api'

const BG   = '#07090f'
const SURF = '#0d1117'
const BDIM = 'rgba(255,255,255,0.06)'

const INPUT_STYLE = {
  width: '100%', padding: '12px 14px', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10, color: '#fff', outline: 'none', fontSize: 13,
  fontFamily: "'DM Sans', sans-serif",
}
const LABEL_STYLE = {
  display: 'block', fontSize: 10, fontWeight: 700,
  color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6,
}

export default function Login({ navigate }) {
  const [tab, setTab]       = useState('login')   // 'login' | 'register'
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login }           = useAuth()

  /* ── Login form state ── */
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  /* ── Register form state ── */
  const [regForm, setRegForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', gender: 'M', address: '', pincode: '', state: '', isBPL: false,
  })
  const updReg = (k, v) => setRegForm(f => ({ ...f, [k]: v }))

  /* ── Handlers ── */
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await loginUser(loginForm.email, loginForm.password)
      login(res.user, res.token)
      navigate('home')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    }
    setLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (regForm.password !== regForm.confirmPassword) {
      return setError('Passwords do not match')
    }
    if (!regForm.phone || !regForm.address || !regForm.pincode || !regForm.state) {
      return setError('Please fill in all required fields')
    }
    setLoading(true)
    try {
      const res = await registerUser({
        name:     regForm.name,
        email:    regForm.email,
        password: regForm.password,
        phone:    regForm.phone,
        gender:   regForm.gender,
        address:  regForm.address,
        pincode:  regForm.pincode,
        state:    regForm.state,
        isBPL:    regForm.isBPL,
      })
      login(res.user, res.token)
      navigate('home')
    } catch (err) {
      setError(err.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="page-enter" style={{
      background: BG, minHeight: '100vh', width: '100vw',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'fixed', top: 0, left: 0, zIndex: 9999, overflowY: 'auto', padding: '40px 16px',
    }}>
      {/* Background decor */}
      <div style={{ position: 'fixed', top: '10%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,232,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,194,224,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: tab === 'register' ? 560 : 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(26,86,232,0.1)', border: '1px solid rgba(26,86,232,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="shield" size={22} color="#1a56e8" />
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: '-1px', color: '#fff' }}>
              Sentinel<span style={{ color: '#00c2e0' }}>-RTI</span>
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
            {tab === 'login' ? 'Sign in to manage your RTI filings' : 'Create your account to get started'}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: SURF, borderRadius: 12, padding: 4, border: `1px solid ${BDIM}`, marginBottom: 20 }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError('') }} style={{
              flex: 1, padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: tab === t ? '#1a56e8' : 'transparent',
              color: tab === t ? '#fff' : 'rgba(255,255,255,0.35)',
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
              transition: 'all 0.2s',
            }}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <div style={{ background: SURF, padding: 32, borderRadius: 20, border: `1px solid ${BDIM}`, boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
          {error && (
            <div style={{ marginBottom: 18, padding: '11px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, color: '#ef4444', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="alertCircle" size={14} color="#ef4444" /> {error}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 16 }}>
                <label style={LABEL_STYLE}>Email Address</label>
                <input type="email" required style={INPUT_STYLE} placeholder="admin@sentinel.com"
                  value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={LABEL_STYLE}>Password</label>
                <input type="password" required style={INPUT_STYLE} placeholder="••••••••"
                  value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px', background: '#1a56e8', color: '#fff', border: 'none', borderRadius: 11,
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(26,86,232,0.3)', opacity: loading ? 0.7 : 1,
              }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <div style={{ marginTop: 24, textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: 14, borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 6 }}>TEST CREDENTIALS</div>
                <div style={{ fontSize: 12, color: '#1a56e8', fontFamily: "'Space Mono', monospace" }}>admin@sentinel.com</div>
                <div style={{ fontSize: 12, color: '#0ec98c', fontFamily: "'Space Mono', monospace" }}>admin123</div>
              </div>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              {/* Section: Account */}
              <SectionLabel label="Account Details" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={LABEL_STYLE}>Full Name *</label>
                  <input required style={INPUT_STYLE} placeholder="Your full name"
                    value={regForm.name} onChange={e => updReg('name', e.target.value)} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={LABEL_STYLE}>Email Address *</label>
                  <input type="email" required style={INPUT_STYLE} placeholder="you@email.com"
                    value={regForm.email} onChange={e => updReg('email', e.target.value)} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Password *</label>
                  <input type="password" required style={INPUT_STYLE} placeholder="Min 6 chars"
                    value={regForm.password} onChange={e => updReg('password', e.target.value)} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Confirm Password *</label>
                  <input type="password" required style={INPUT_STYLE} placeholder="Repeat password"
                    value={regForm.confirmPassword} onChange={e => updReg('confirmPassword', e.target.value)} />
                </div>
              </div>

              {/* Section: RTI Profile */}
              <SectionLabel label="RTI Profile (used to auto-fill RTI submissions)" accent />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div>
                  <label style={LABEL_STYLE}>Phone Number *</label>
                  <input required style={INPUT_STYLE} placeholder="10-digit mobile" maxLength={10}
                    value={regForm.phone} onChange={e => updReg('phone', e.target.value)} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Gender *</label>
                  <select required style={{ ...INPUT_STYLE }} value={regForm.gender} onChange={e => updReg('gender', e.target.value)}>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other / Third Gender</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={LABEL_STYLE}>Residential Address *</label>
                  <input required style={INPUT_STYLE} placeholder="House/Flat No., Street, Colony"
                    value={regForm.address} onChange={e => updReg('address', e.target.value)} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Pincode *</label>
                  <input required style={INPUT_STYLE} placeholder="6-digit pincode" maxLength={6}
                    value={regForm.pincode} onChange={e => updReg('pincode', e.target.value)} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>State *</label>
                  <input required style={INPUT_STYLE} placeholder="e.g. Delhi"
                    value={regForm.state} onChange={e => updReg('state', e.target.value)} />
                </div>
              </div>

              {/* BPL Checkbox */}
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <input
                  type="checkbox" id="reg-bpl"
                  checked={regForm.isBPL}
                  onChange={e => updReg('isBPL', e.target.checked)}
                  style={{ marginTop: 2, width: 16, height: 16, cursor: 'pointer', accentColor: '#a78bfa', flexShrink: 0 }}
                />
                <label htmlFor="reg-bpl" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', lineHeight: 1.5 }}>
                  I am Below Poverty Line (BPL)
                  <span style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>
                    No RTI fee required — you'll need to attach a BPL certificate
                  </span>
                </label>
              </div>

              <div style={{ marginBottom: 20, padding: '10px 14px', background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: 9 }}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                  ℹ️ Your phone, gender, address, pincode, state and BPL status are stored securely and used only to auto-fill RTI portal submission forms on your behalf.
                </p>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px',
                background: 'linear-gradient(135deg,#1a56e8,#7c3aed)',
                color: '#fff', border: 'none', borderRadius: 11,
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(26,86,232,0.25)', opacity: loading ? 0.7 : 1,
              }}>
                {loading ? 'Creating account...' : 'Create Account & Sign In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ label, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, marginTop: 8 }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: accent ? '#a78bfa' : 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
    </div>
  )
}
