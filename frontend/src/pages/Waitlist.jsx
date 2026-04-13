import React, { useState } from 'react';
import Icon from '../components/Icon';

export default function Waitlist({ navigate }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    rtiComplain: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.phoneNumber || !formData.rtiComplain) return;

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Successfully joined the waitlist!');
        setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', rtiComplain: '' });
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to join waitlist.');
      }
    } catch (error) {
      console.error('Waitlist error:', error);
      setStatus('error');
      setMessage('Server error. Ensure the backend is running.');
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 18px', paddingLeft: 42,
    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, color: 'white', fontSize: 14, fontFamily: "'Inter', sans-serif",
    outline: 'none', transition: 'border-color 0.2s', marginBottom: 12
  };

  return (
    <div className="page-enter" style={{ background: '#07090f', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '40px 0' }}>
      
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(26,86,232,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,232,0.06) 1px,transparent 1px)',
        backgroundSize: '64px 64px',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%,black 20%,transparent 75%)',
        maskImage: 'radial-gradient(ellipse at 50% 50%,black 20%,transparent 75%)',
      }} />

      <div style={{
        width: '100%', maxWidth: 550, padding: '40px', position: 'relative', zIndex: 1,
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 24, backdropFilter: 'blur(10px)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(26,86,232,0.15)',
        animation: 'fadeUp 0.65s ease both',
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(26,86,232,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="bell" size={24} color="#00c2e0" />
          </div>
        </div>

        <h2 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: 'clamp(26px, 4vw, 32px)', textAlign: 'center',
          background: 'linear-gradient(90deg, #1a56e8 0%, #00c2e0 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: 10,
        }}>Join the Waitlist</h2>
        
        <p style={{
          fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6,
          textAlign: 'center', marginBottom: 28, fontFamily: "'Inter', sans-serif"
        }}>
          Register your interest and tell us about your RTI needs.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input type="text" name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleChange} required disabled={status === 'loading' || status === 'success'} style={inputStyle} onFocus={e => e.target.style.borderColor = '#00c2e0'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              <div style={{ position: 'absolute', left: 16, top: 12, opacity: 0.5 }}><Icon name="user" size={16} color="white" /></div>
            </div>
            <div style={{ position: 'relative', flex: 1 }}>
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} disabled={status === 'loading' || status === 'success'} style={inputStyle} onFocus={e => e.target.style.borderColor = '#00c2e0'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              <div style={{ position: 'absolute', left: 16, top: 12, opacity: 0.5 }}><Icon name="user" size={16} color="white" /></div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} required disabled={status === 'loading' || status === 'success'} style={inputStyle} onFocus={e => e.target.style.borderColor = '#00c2e0'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
            <div style={{ position: 'absolute', left: 16, top: 12, opacity: 0.5 }}><Icon name="mail" size={16} color="white" /></div>
          </div>

          <div style={{ position: 'relative' }}>
            <input type="tel" name="phoneNumber" placeholder="Phone Number *" value={formData.phoneNumber} onChange={handleChange} required disabled={status === 'loading' || status === 'success'} style={inputStyle} onFocus={e => e.target.style.borderColor = '#00c2e0'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
            <div style={{ position: 'absolute', left: 16, top: 12, opacity: 0.5 }}><Icon name="phone" size={16} color="white" /></div>
          </div>

          <div style={{ position: 'relative' }}>
            <textarea name="rtiComplain" placeholder="Briefly describe your RTI Complaint *" value={formData.rtiComplain} onChange={handleChange} required disabled={status === 'loading' || status === 'success'} style={{ ...inputStyle, minHeight: 90, paddingTop: 14 }} onFocus={e => e.target.style.borderColor = '#00c2e0'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
            <div style={{ position: 'absolute', left: 16, top: 16, opacity: 0.5 }}><Icon name="file" size={16} color="white" /></div>
          </div>

          <button 
            type="submit" 
            disabled={status === 'loading' || status === 'success'}
            style={{
              marginTop: 8, width: '100%', padding: '16px', borderRadius: 12, border: 'none',
              background: status === 'success' ? '#0ec98c' : '#1a56e8', 
              color: 'white', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
              cursor: (status === 'loading' || status === 'success') ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: status === 'success' ? '0 6px 24px rgba(14,201,140,0.45)' : '0 6px 24px rgba(26,86,232,0.45)',
              transition: 'all 0.2s', opacity: status === 'loading' ? 0.7 : 1
            }}
          >
            {status === 'loading' ? 'Joining...' : status === 'success' ? 'Joined Successfully!' : 'Join Waitlist'}
            {status !== 'loading' && status !== 'success' && <Icon name="arrow" size={16} color="white" />}
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: 20, padding: 12, borderRadius: 8, textAlign: 'center', fontSize: 13,
            background: status === 'error' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(14, 201, 140, 0.1)',
            color: status === 'error' ? '#f59e0b' : '#0ec98c', border: `1px solid ${status === 'error' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(14, 201, 140, 0.2)'}`
          }}>
            {message}
          </div>
        )}

        <button 
          onClick={() => navigate('home')} 
          style={{
            marginTop: 20, width: '100%', background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif", fontSize: 13,
            cursor: 'pointer', transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.target.style.color = '#fff'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
        >
          ← Return to Home
        </button>
      </div>

    </div>
  );
}
