import React, { useState, useEffect } from 'react'
import Icon from '../components/Icon'

const API_URL = 'http://localhost:5000/api'

function EditableField({ label, value, onChange, type = 'text', required = false, options = null, placeholder = '' }) {
  const [focused, setFocused] = useState(false)
  const [localValue, setLocalValue] = useState(value || '')

  useEffect(() => {
    if (value !== undefined) setLocalValue(value)
  }, [value])

  const handleChange = (val) => {
    setLocalValue(val)
    onChange(val)
  }

  return (
    <div style={{
      borderBottom: `2px solid ${focused ? '#1a56e8' : '#e5e8f0'}`,
      padding: '8px 0', transition: 'border-color 0.2s',
    }}>
      <label style={{
        display: 'block', padding: '8px 0 4px',
        fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 10,
        letterSpacing: 2, textTransform: 'uppercase',
        color: focused ? '#1a56e8' : '#c0c8d8',
      }}>{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>
      
      {options ? (
        <select
          style={{
            width: '100%', border: 'none', outline: 'none',
            padding: '4px 0 8px', fontSize: 15,
            fontFamily: "'DM Sans', sans-serif", color: '#0c0e14',
            background: 'transparent', cursor: 'pointer',
          }}
          value={localValue}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={localValue}
          placeholder={placeholder}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', border: 'none', outline: 'none',
            padding: '4px 0 8px', fontSize: 15,
            fontFamily: "'DM Sans', sans-serif", color: '#0c0e14',
            background: 'transparent',
          }}
        />
      )}
    </div>
  )
}

function SectionCard({ title, icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div style={{
      border: '1px solid #e5e8f0', borderRadius: 12, overflow: 'hidden',
      marginBottom: 16, background: '#fff',
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
          color: '#0c0e14', textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(26,86,232,0.1)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={icon} size={16} color="#1a56e8" sw={1.8} />
          </div>
          {title}
        </div>
        <Icon 
          name="chevron" 
          size={18} 
          color="#8b93ab" 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} 
        />
      </button>
      
      <div style={{
        maxHeight: isOpen ? '2000px' : 0,
        overflow: 'hidden', transition: 'max-height 0.35s ease',
      }}>
        <div style={{ padding: '0 20px 20px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Verify({ navigate }) {
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [complaint, setComplaint] = useState(null)
  const [trackingIdInput, setTrackingIdInput] = useState('')
  
  const [isEditing, setIsEditing] = useState(false)
  
  const [applicant, setApplicant] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'M',
    address: '',
    pincode: '',
    state: '',
    isBPL: false,
  })

  const handleApplicantChange = (field, value) => {
    setApplicant(prev => ({ ...prev, [field]: value }))
  }

  const fetchComplaint = async () => {
    if (!trackingIdInput.trim()) {
      setError('Please enter a Tracking ID')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`${API_URL}/complaints/search?trackingId=${trackingIdInput.trim()}`)
      const data = await response.json()
      
      if (data.success) {
        setComplaint(data.data)
        localStorage.setItem('pendingTrackingId', data.data.trackingId)
      } else {
        setError(data.error || 'Complaint not found')
        setComplaint(null)
      }
    } catch (err) {
      setError('Failed to connect to server')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const saveChanges = () => {
    setIsEditing(false)
  }

  if (!complaint) {
    return (
      <div style={{ background: '#f7f8fc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes spin { to{transform:rotate(360deg)} }
        `}</style>

        <div style={{
          background: '#fff', borderBottom: '1px solid #e5e8f0',
          padding: '20px 48px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button
            onClick={() => navigate('home')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#8b93ab', fontSize: 13, fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
            }}
          >
            <Icon name="arrow" size={14} /> Back
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div style={{
            textAlign: 'center', maxWidth: 420, width: '100%',
            background: '#fff', padding: 48, borderRadius: 16,
            border: '1px solid #e5e8f0', animation: 'fadeUp 0.5s ease',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(26,86,232,0.1)', margin: '0 auto 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="search" size={28} color="#1a56e8" sw={2} />
            </div>
            
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 24, color: '#0c0e14', marginBottom: 8,
            }}>Find Your Complaint</h2>
            
            <p style={{
              fontSize: 14, color: '#8b93ab', lineHeight: 1.7,
              marginBottom: 28,
            }}>Enter your Tracking ID to view the RTI draft and verify your information before submission.</p>

            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 8, padding: '12px 16px', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Icon name="alert" size={16} color="#ef4444" />
                <span style={{ fontSize: 13, color: '#ef4444' }}>{error}</span>
              </div>
            )}

            <div style={{
              display: 'flex', gap: 12, marginBottom: 24,
            }}>
              <input
                type="text"
                value={trackingIdInput}
                onChange={e => setTrackingIdInput(e.target.value)}
                placeholder="e.g., SRT-2026-1001"
                onKeyDown={e => e.key === 'Enter' && fetchComplaint()}
                style={{
                  flex: 1, padding: '14px 18px', borderRadius: 10,
                  border: '2px solid #e5e8f0', fontSize: 15,
                  fontFamily: "'Space Mono', monospace",
                  outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#1a56e8'}
                onBlur={e => e.currentTarget.style.borderColor = '#e5e8f0'}
              />
              <button
                onClick={fetchComplaint}
                disabled={loading}
                style={{
                  background: '#1a56e8', color: '#fff',
                  padding: '14px 24px', borderRadius: 10,
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: "'Syne', sans-serif", fontWeight: 700,
                  fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 16px rgba(26,86,232,0.3)',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <div style={{
                    width: 16, height: 16, border: '2px solid rgba(255,255,255,0.25)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                ) : (
                  <Icon name="search" size={14} color="white" />
                )}
                Find
              </button>
            </div>
          </div>
        </div>

        <footer style={{
          background: '#fff', borderTop: '1px solid #e5e8f0',
          padding: '24px 48px', textAlign: 'center',
        }}>
          <span style={{ fontSize: 12, color: '#8b93ab' }}>
            © 2026 Sentinel-RTI. All rights reserved.
          </span>
        </footer>
      </div>
    )
  }

  return (
    <div style={{ background: '#f7f8fc', minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <div style={{
        background: '#fff', borderBottom: '1px solid #e5e8f0',
        padding: '20px 48px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <button
            onClick={() => { setComplaint(null); setTrackingIdInput('') }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#8b93ab', fontSize: 13, fontFamily: "'Syne', sans-serif",
              fontWeight: 600, marginBottom: 4,
            }}
          >
            <Icon name="arrow" size={14} /> Back
          </button>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 24, color: '#0c0e14', margin: 0,
          }}>Verify & Draft</h1>
        </div>
        
        <div style={{
          background: 'rgba(26,86,232,0.1)', padding: '10px 18px',
          borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Icon name="tag" size={14} color="#1a56e8" />
          <span style={{
            fontFamily: "'Space Mono', monospace", fontWeight: 700,
            fontSize: 14, color: '#1a56e8',
          }}>{complaint.trackingId}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 48px' }}>
        
        {success && (
          <div style={{
            textAlign: 'center', padding: '60px 40px',
            background: '#fff', borderRadius: 16, border: '1px solid #e5e8f0',
            animation: 'fadeUp 0.5s ease',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: '#d1fae5', margin: '0 auto 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="check" size={36} color="#0ec98c" sw={2.5} />
            </div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 28, color: '#0c0e14', marginBottom: 12,
            }}>Verification Complete!</h2>
            <p style={{
              fontSize: 15, color: '#8b93ab', lineHeight: 1.7,
              marginBottom: 24, maxWidth: 420, margin: '0 auto',
            }}>
              Your application details have been saved. Click Submit to proceed with the RTI portal submission.
            </p>
            <button
              onClick={() => setSuccess(false)}
              style={{
                background: '#1a56e8', color: '#fff',
                padding: '14px 28px', borderRadius: 10,
                border: 'none', cursor: 'pointer',
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(26,86,232,0.3)',
              }}
            >
              <Icon name="edit" size={14} color="white" /> Edit Information
            </button>
          </div>
        )}

        {!success && (
          <>
            <SectionCard title="RTI Application Draft" icon="file">
              {complaint?.legalDraft ? (
                <div style={{
                  background: '#f7f8fc', padding: 18, borderRadius: 10,
                  fontSize: 14, lineHeight: 1.8, color: '#0c0e14',
                  whiteSpace: 'pre-wrap', fontFamily: "'DM Sans', sans-serif",
                  maxHeight: 400, overflowY: 'auto',
                }}>
                  {complaint.legalDraft}
                </div>
              ) : (
                <div style={{
                  background: '#f7f8fc', padding: 18, borderRadius: 10,
                  fontSize: 14, color: '#8b93ab', textAlign: 'center',
                }}>
                  No draft available for this complaint.
                </div>
              )}
            </SectionCard>

            {complaint && (
              <SectionCard title="Complaint Details" icon="info">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#8b93ab', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Category</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#0c0e14' }}>{complaint.category}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#8b93ab', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Severity</div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '4px 10px', borderRadius: 6,
                      background: complaint.severity === 'HIGH' ? '#fef2f2' : complaint.severity === 'MEDIUM' ? '#fff7ed' : '#f0fdf4',
                      color: complaint.severity === 'HIGH' ? '#dc2626' : complaint.severity === 'MEDIUM' ? '#ea580c' : '#16a34a',
                      fontSize: 12, fontWeight: 700,
                    }}>
                      {complaint.severity}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#8b93ab', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Authority</div>
                    <div style={{ fontSize: 14, color: '#0c0e14' }}>{complaint.authority}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#8b93ab', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Status</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a56e8' }}>{complaint.status}</div>
                  </div>
                </div>
              </SectionCard>
            )}

            <SectionCard title="Applicant Information" icon="user">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <EditableField
                  label="Full Name"
                  value={applicant.name}
                  onChange={val => handleApplicantChange('name', val)}
                  required
                  placeholder="Enter your full name"
                />
                <EditableField
                  label="Email"
                  type="email"
                  value={applicant.email}
                  onChange={val => handleApplicantChange('email', val)}
                  required
                  placeholder="your@email.com"
                />
                <EditableField
                  label="Phone Number"
                  type="tel"
                  value={applicant.phone}
                  onChange={val => handleApplicantChange('phone', val)}
                  required
                  placeholder="10-digit phone number"
                />
                <EditableField
                  label="Gender"
                  value={applicant.gender}
                  onChange={val => handleApplicantChange('gender', val)}
                  options={[
                    { value: 'M', label: 'Male' },
                    { value: 'F', label: 'Female' },
                    { value: 'O', label: 'Other' },
                  ]}
                />
              </div>
              
              <div style={{ marginTop: 8 }}>
                <EditableField
                  label="Address"
                  value={applicant.address}
                  onChange={val => handleApplicantChange('address', val)}
                  required
                  placeholder="Your complete address for RTI form"
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 8 }}>
                <EditableField
                  label="Pincode"
                  type="text"
                  value={applicant.pincode}
                  onChange={val => handleApplicantChange('pincode', val)}
                  required
                  placeholder="6-digit pincode"
                />
                <EditableField
                  label="State"
                  value={applicant.state}
                  onChange={val => handleApplicantChange('state', val)}
                  required
                  placeholder="Your state"
                />
              </div>

              <div style={{
                marginTop: 16, padding: 12, background: '#f7f8fc',
                borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <input
                  type="checkbox"
                  id="bpl"
                  checked={applicant.isBPL}
                  onChange={e => handleApplicantChange('isBPL', e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                <label htmlFor="bpl" style={{ fontSize: 14, color: '#0c0e14', cursor: 'pointer' }}>
                  I belong to Below Poverty Line (BPL) - Eligible for fee exemption
                </label>
              </div>

              <div style={{
                display: 'flex', gap: 12, marginTop: 24, paddingTop: 20,
                borderTop: '1px solid #e5e8f0',
              }}>
                {isEditing ? (
                  <>
                    <button
                      onClick={saveChanges}
                      style={{
                        background: '#1a56e8', color: '#fff',
                        padding: '12px 24px', borderRadius: 10,
                        border: 'none', cursor: 'pointer',
                        fontFamily: "'Syne', sans-serif", fontWeight: 700,
                        fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
                        boxShadow: '0 4px 16px rgba(26,86,232,0.3)',
                      }}
                    >
                      <Icon name="check" size={14} color="white" /> Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      style={{
                        background: 'transparent', color: '#8b93ab',
                        padding: '12px 24px', borderRadius: 10,
                        border: '1px solid #e5e8f0', cursor: 'pointer',
                        fontFamily: "'Syne', sans-serif", fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      background: 'transparent', color: '#1a56e8',
                      padding: '12px 24px', borderRadius: 10,
                      border: '1px solid #1a56e8', cursor: 'pointer',
                      fontFamily: "'Syne', sans-serif", fontWeight: 700,
                      fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    <Icon name="edit" size={14} color="#1a56e8" /> Edit Information
                  </button>
                )}
              </div>
            </SectionCard>

            <div style={{
              marginTop: 24, padding: 24, background: '#fff',
              borderRadius: 12, border: '1px solid #e5e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 16,
            }}>
              <div>
                <div style={{ fontSize: 14, color: '#8b93ab', marginBottom: 4 }}>
                  Ready to submit to rtionline.gov.in?
                </div>
                <div style={{ fontSize: 13, color: '#0c0e14' }}>
                  Click submit to proceed with automated form filing.
                </div>
              </div>
              <button
                onClick={() => {
                  setSuccess(true)
                }}
                disabled={submitting || !complaint}
                style={{
                  background: submitting || !complaint ? '#94a3b8' : '#1a56e8',
                  color: '#fff', padding: '14px 32px', borderRadius: 10,
                  border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: "'Syne', sans-serif", fontWeight: 700,
                  fontSize: 15, display: 'flex', alignItems: 'center', gap: 10,
                  boxShadow: submitting ? 'none' : '0 4px 16px rgba(26,86,232,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                {submitting ? (
                  <>
                    <div style={{
                      width: 16, height: 16, border: '2px solid rgba(255,255,255,0.25)',
                      borderTopColor: '#fff', borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                    }} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Icon name="send" size={16} color="white" /> Submit to RTI Portal
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      <footer style={{
        background: '#fff', borderTop: '1px solid #e5e8f0',
        padding: '24px 48px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
      }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: '#0c0e14' }}>
          Sentinel<span style={{ color: '#00c2e0' }}>-RTI</span>
        </span>
        <span style={{ fontSize: 12, color: '#8b93ab' }}>© 2026 Sentinel-RTI. All rights reserved.</span>
      </footer>
    </div>
  )
}