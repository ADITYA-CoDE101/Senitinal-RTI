import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import FileComplaint from './pages/FileComplaint'
import Track from './pages/Track'
import Dashboard from './pages/Dashboard'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'

function App() {
  const [page, setPage] = useState('home')
  const { isAuthenticated, isLoading } = useAuth()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Show login page
    }
  }, [isAuthenticated, isLoading])

  if (isLoading) return <div style={{ background: '#07090f', height: '100vh' }} />

  // Show login if not authenticated
  if (!isAuthenticated) return <Login navigate={setPage} />

  const renderPage = () => {
    switch (page) {
      case 'home': return <Home navigate={setPage} />
      case 'fileComplaint': return <FileComplaint navigate={setPage} />
      case 'track': return <Track navigate={setPage} />
      case 'dashboard': return <Dashboard navigate={setPage} />
      case 'about': return <About navigate={setPage} />
      case 'contact': return <Contact navigate={setPage} />
      case 'login': return <Login navigate={setPage} />
      default: return <Home navigate={setPage} />
    }
  }

  return (
    <div className="App">
      <Navbar navigate={setPage} currentPage={page} />
      {renderPage()}
    </div>
  )
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
)
