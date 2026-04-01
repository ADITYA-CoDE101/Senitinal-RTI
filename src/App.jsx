import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'

export default function App() {
  const [page, setPage] = useState('home')

  const navigate = (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Navbar page={page} navigate={navigate} />
      {page === 'home'    && <Home navigate={navigate} />}
      {page === 'about'   && <About navigate={navigate} />}
      {page === 'contact' && <Contact navigate={navigate} />}
    </>
  )
}
