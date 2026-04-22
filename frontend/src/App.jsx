import React, { useState, useEffect, createContext, useContext } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import FileComplaint from './pages/FileComplaint'
import Track from './pages/Track'
import Dashboard from './pages/Dashboard'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'

export const ThemeContext = createContext(null)
export function useTheme() { return useContext(ThemeContext) }

function App() {
  const [page, setPage] = useState('home')
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div style={{ background: 'var(--bg-base)', height: '100vh' }} />
  if (!isAuthenticated) return <Login navigate={setPage} />
  const renderPage = () => {
    switch (page) {
      case 'home':          return <Home navigate={setPage} />
      case 'fileComplaint': return <FileComplaint navigate={setPage} />
      case 'track':         return <Track navigate={setPage} />
      case 'dashboard':     return <Dashboard navigate={setPage} />
      case 'about':         return <About navigate={setPage} />
      case 'contact':       return <Contact navigate={setPage} />
      case 'login':         return <Login navigate={setPage} />
      default:              return <Home navigate={setPage} />
    }
  }
  return <div className="App"><Navbar navigate={setPage} currentPage={page} />{renderPage()}</div>
}

export default function Root() {
  const [theme, setTheme] = useState('dark')
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  useEffect(() => {
    const r = document.documentElement
    if (theme === 'dark') {
      r.setAttribute('data-theme','dark')
      r.style.setProperty('--bg-base','#07090f'); r.style.setProperty('--bg-surface','#0d1117')
      r.style.setProperty('--bg-elevated','#111827'); r.style.setProperty('--bg-glass','rgba(255,255,255,0.04)')
      r.style.setProperty('--bg-glass-hover','rgba(255,255,255,0.07)'); r.style.setProperty('--border-dim','rgba(255,255,255,0.06)')
      r.style.setProperty('--border-base','rgba(255,255,255,0.10)'); r.style.setProperty('--text-primary','#ffffff')
      r.style.setProperty('--text-secondary','rgba(255,255,255,0.65)'); r.style.setProperty('--text-muted','rgba(255,255,255,0.40)')
      r.style.setProperty('--text-faint','rgba(255,255,255,0.18)'); r.style.setProperty('--card-bg','#0d1117')
      r.style.setProperty('--input-bg','rgba(255,255,255,0.03)'); r.style.setProperty('--nav-bg','rgba(7,9,15,0.88)')
      r.style.setProperty('--ticker-bg','rgba(255,255,255,0.025)'); r.style.setProperty('--ticker-border','rgba(255,255,255,0.07)')
      document.body.style.background='#07090f'; document.body.style.color='#ffffff'
    } else {
      r.setAttribute('data-theme','light')
      r.style.setProperty('--bg-base','#f0f4fa'); r.style.setProperty('--bg-surface','#ffffff')
      r.style.setProperty('--bg-elevated','#e8edf5'); r.style.setProperty('--bg-glass','rgba(0,0,0,0.03)')
      r.style.setProperty('--bg-glass-hover','rgba(0,0,0,0.06)'); r.style.setProperty('--border-dim','rgba(0,0,0,0.08)')
      r.style.setProperty('--border-base','rgba(0,0,0,0.14)'); r.style.setProperty('--text-primary','#0f172a')
      r.style.setProperty('--text-secondary','rgba(15,23,42,0.70)'); r.style.setProperty('--text-muted','rgba(15,23,42,0.50)')
      r.style.setProperty('--text-faint','rgba(15,23,42,0.28)'); r.style.setProperty('--card-bg','#ffffff')
      r.style.setProperty('--input-bg','rgba(0,0,0,0.03)'); r.style.setProperty('--nav-bg','rgba(240,244,250,0.92)')
      r.style.setProperty('--ticker-bg','rgba(0,0,0,0.03)'); r.style.setProperty('--ticker-border','rgba(0,0,0,0.07)')
      document.body.style.background='#f0f4fa'; document.body.style.color='#0f172a'
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthProvider><App /></AuthProvider>
    </ThemeContext.Provider>
  )
}
