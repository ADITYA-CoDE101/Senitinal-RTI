import React, { useState, useRef } from 'react'
import Icon from '../components/Icon'
import { submitComplaint } from '../services/api'

/* ── TOKENS ──────────────────────────────────────────────────── */
const BG   = '#07090f'
const SURF = '#0d1117'
const BDIM = 'rgba(255,255,255,0.06)'

const ISSUE_CATEGORIES = [
  'Road & Infrastructure', 'Water & Sanitation', 'Electricity & Power',
  'Municipal Services', 'Education', 'Healthcare',
  'Land & Property', 'Public Transport', 'Environment', 'Other',
]

const PIPELINE_PREVIEW = [
  { icon: 'cpu',   label: 'AI Processing',        color: '#3b74ff', sub: 'Auto-classification & severity scoring' },
  { icon: 'file',  label: 'Complaint Generation',  color: '#f59e0b', sub: 'Legal RTI draft with evidence' },
  { icon: 'route', label: 'Smart Routing',          color: '#0ec98c', sub: 'Auto-identifies correct authority' },
  { icon: 'send',  label: 'Submission',             color: '#e04dff', sub: 'Portal auto-fill & verification' },
]

const CATEGORY_QUESTIONS = {
  'Road & Infrastructure': [
    'Please provide the current status of the above-mentioned road/infrastructure issue.',
    'Provide copies of any field reports, engineering assessments, or inspection notes related to this site conducted in the last 12 months.',
    'Provide details of the budget allocated and expenses incurred for maintenance at this location during the current financial year.',
    'Provide the names and designations of the officers responsible for the maintenance and oversight of this specific area.'
  ],
  'Water & Sanitation': [
    'Provide the latest water quality test reports or sewer inspection logs for this locality.',
    'Detail the scheduled frequency of maintenance for the water/sanitation infrastructure in this area.',
    'Provide information on any pending work orders or sanctions for repairs at this location.',
    'Provide the names and designations of the junior engineers and contractors responsible for this ward.'
  ],
  'Electricity & Power': [
    'Provide a record of power outages and voltage fluctuations logged for this area in the past 6 months.',
    'Provide details of any pending transformer upgrades or cable maintenance approved for this locality.',
    'Status of street light maintenance requests logged for this specific lane in the last 90 days.',
    'Provide the contact details and designations of the local assistant engineer (Power).'
  ],
  'Healthcare': [
    'Provide details of the stock of essential medicines available at the local primary health center.',
    'Provide the duty roster of doctors and paramedical staff assigned to this facility for the current month.',
    'Provide information on the budget allocated for equipment maintenance at this health center.',
    'Provide the status of the Citizen' + "'" + 's Charter and grievance redressal mechanism at this facility.'
  ],
  'Education': [
    'Provide information on the teacher-student ratio at the specified government educational institution.',
    'Provide the details of funds received and utilized under Samagra Shiksha or other schemes for this school.',
    'Provide a copy of the latest infrastructure audit or building safety report for this school.',
    'Details of the midday meal provision and quality audits conducted in the current quarter.'
  ]
}

/* ── CATEGORY CHIP ───────────────────────────────────────────── */
function CategoryChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px', borderRadius: 10,
        background: active ? 'rgba(26,86,232,0.2)' : 'rgba(255,255,255,0.03)',
        color: active ? '#00c2e0' : 'rgba(255,255,255,0.4)',
        border: `1px solid ${active ? '#1a56e8' : 'rgba(255,255,255,0.08)'}`,
        cursor: 'pointer', fontSize: 11, fontWeight: 700, transition: 'all 0.25s',
        fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: 0.5
      }}
    >
      {label}
    </button>
  )
}

/* ── INPUT MODE TAB ──────────────────────────────────────────── */
function ModeTab({ icon, label, active, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        padding: '20px 16px', borderRadius: 14, cursor: 'pointer',
        background: active ? 'rgba(26,86,232,0.15)' : hovered ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.025)',
        border: `1.5px solid ${active ? 'rgba(26,86,232,0.5)' : hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.25s',
        transform: active ? 'translateY(-2px)' : 'none',
        boxShadow: active ? '0 6px 20px rgba(26,86,232,0.2)' : 'none',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 11,
        background: active ? 'rgba(26,86,232,0.25)' : 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s',
      }}>
        <Icon name={icon} size={20} color={active ? '#00c2e0' : 'rgba(255,255,255,0.4)'} sw={1.8} />
      </div>
      <span style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12,
        color: active ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'color 0.2s',
      }}>{label}</span>
    </button>
  )
}

/* ── FILE COMPLAINT PAGE ─────────────────────────────────────── */
export default function FileComplaint({ navigate }) {
  const [mode, setMode] = useState('text')
  const [form, setForm] = useState({ description: '', category: ISSUE_CATEGORIES[0], location: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [apiError, setApiError] = useState('')
  const [result, setResult] = useState(null)
  const [showLegalReview, setShowLegalReview] = useState(false)
  const [legalDraft, setLegalDraft] = useState('')

  // Image upload state
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  // Voice state
  const [isRecording, setIsRecording] = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const recognitionRef = useRef(null)

  // Geo state
  const [geoCoords, setGeoCoords] = useState(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState('')

  const handle = (key, val) => { setForm(f => ({ ...f, [key]: val })); setApiError('') }

  // ── LEGAL DRAFT GENERATOR ──
  const generatePreviewDraft = () => {
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const content = mode === 'voice' ? voiceTranscript : form.description;
    
    return `APPLICATION FOR INFORMATION UNDER THE RTI ACT, 2005

To,
The Public Information Officer (PIO),
[Concerned Authority for ${form.category}],
Government of India / State Government.

Date: ${date}

Subject: Request for Information under the Right to Information Act, 2005 - Regarding ${form.category} at ${form.location || '[Specified Location]'}.

Respected Sir/Madam,

I, the undersigned, am a citizen of India. I require information and formal redressal regarding the following matter under the RTI Act, 2005:

1. DESCRIPTION OF MATTER:
   ${content}

2. SPECIFIC INFORMATION REQUIRED:
${(CATEGORY_QUESTIONS[form.category] || CATEGORY_QUESTIONS['Road & Infrastructure']).map((q, i) => `   (${String.fromCharCode(97 + i)}) ${q}`).join('\n')}

3. DURATION:
   The information required pertains to the period from ${new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toLocaleDateString()} to ${date}.

DECLARATION:
I state that the information sought does not fall within the restrictions contained in Section 8 and 9 of the RTI Act and to the best of my knowledge it pertains to your office.

FEE DETAILS:
I am attaching the requisite RTI application fee. (Note: System-automated digital payment reference included).

Yours faithfully,
[Digitally Signed via Sentinel-RTI]
Contact: Registered User
`;
  }

  // ── PREVIEW LEGAL DRAFT ──
  const previewLegalDraft = () => {
    if (mode === 'text' && !form.description.trim()) { setApiError('Please describe your issue.'); return }
    if (mode === 'image' && !imageFile) { setApiError('Please upload an image.'); return }
    if (mode === 'voice' && !voiceTranscript.trim()) { setApiError('Please record your complaint.'); return }
    if (mode === 'location' && !geoCoords) { setApiError('Please detect location first.'); return }

    setLegalDraft(generatePreviewDraft())
    setShowLegalReview(true)
  }

  // ── IMAGE HANDLERS ──
  const handleImageSelect = (file) => {
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
    if (!form.description) handle('description', `Evidence image uploaded: ${file.name}`)
    // Auto-enable geo-tagging for images
    if (!geoCoords) detectLocation()
  }

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) handleImageSelect(file) }

  // ── VOICE HANDLERS ──
  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { setApiError('Speech recognition not supported.'); return }
    const recognition = new SpeechRecognition()
    recognition.continuous = true; recognition.interimResults = true; recognition.lang = 'en-IN'
    let finalTranscript = voiceTranscript
    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) finalTranscript += transcript + ' '; else interim += transcript
      }
      setVoiceTranscript(finalTranscript + interim)
    }
    recognition.onerror = () => setIsRecording(false)
    recognition.onend = () => setIsRecording(false)
    recognitionRef.current = recognition; recognition.start(); setIsRecording(true); setApiError('')
  }
  const stopRecording = () => { if (recognitionRef.current) { recognitionRef.current.stop(); setIsRecording(false) } }

  // ── GEO HANDLER ──
  const detectLocation = () => {
    if (!navigator.geolocation) { setGeoError('Geolocation not supported.'); return }
    setGeoLoading(true); setGeoError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => { const { latitude, longitude } = pos.coords; setGeoCoords({ lat: latitude, lng: longitude }); handle('location', `${latitude.toFixed(6)}°N, ${longitude.toFixed(6)}°E`); setGeoLoading(false) },
      (err) => { setGeoError(err.message); setGeoLoading(false) },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // ── SUBMIT ──
  const submit = async () => {
    setSubmitting(true)
    setApiError('')
    try {
      const payload = {
        description: mode === 'voice' ? voiceTranscript : form.description,
        category: form.category,
        location: form.location,
        inputMode: mode,
        imageFile: mode === 'image' ? imageFile : null,
        voiceTranscript: mode === 'voice' ? voiceTranscript : '',
        geoLat: geoCoords?.lat,
        geoLng: geoCoords?.lng,
        legalDraft: legalDraft, // Send the approved draft to backend
      }
      const res = await submitComplaint(payload)
      setResult(res.data)
      setSubmitted(true)
    } catch (error) {
      setApiError(error.message || 'Failed to submit.')
    }
    setSubmitting(false)
  }

  return (
    <div className="page-enter" style={{ background: BG, minHeight: '100vh', color: '#fff' }}>

      {/* Hero Section */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '64px 48px 48px' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(26,86,232,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,232,0.04) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: '#00c2e0', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00c2e0', animation: 'pulse 1.6s infinite' }} />
            Legal Conversion Pipeline
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.08, letterSpacing: '-2px', marginBottom: 14 }}>
            {showLegalReview ? 'Legal Draft ' : 'File Your '} 
            <span style={{ background: 'linear-gradient(90deg,#1a56e8,#00c2e0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {showLegalReview ? 'Approval' : 'Complaint'}
            </span>
          </h1>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>

          {/* LEFT CONTENT */}
          <div>
            {submitted ? (
              <div style={{ background: SURF, borderRadius: 20, border: `1px solid ${BDIM}`, padding: '64px 48px', textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px', background: 'rgba(14,201,140,0.15)', border: '2px solid rgba(14,201,140,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check" size={36} color="#0ec98c" sw={2.5} />
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 12 }}>Legally Submitted!</h2>
                <div style={{ background: 'rgba(26,86,232,0.08)', border: '1px solid rgba(26,86,232,0.2)', borderRadius: 14, padding: '20px 28px', marginBottom: 24, textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Tracking ID</span>
                    <span style={{ color: '#00c2e0', fontWeight: 700 }}>{result?.trackingId}</span>
                  </div>
                </div>
                <button onClick={() => navigate('track')} style={{ background: '#1a56e8', color: '#fff', padding: '12px 24px', borderRadius: 9, border: 'none', cursor: 'pointer', fontWeight: 700 }}>Track Status</button>
              </div>
            ) : showLegalReview ? (
              <div style={{ background: SURF, borderRadius: 20, border: `1px solid ${BDIM}`, padding: 40 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                   <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>RTI Draft Preview</div>
                   <button onClick={() => setShowLegalReview(false)} style={{ background: 'transparent', color: 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', fontSize: 13 }}>← Back to Edit</button>
                </div>
                <div style={{ 
                  background: '#f8fafc', color: '#1e293b', padding: 40, borderRadius: 12, 
                  fontFamily: "'Courier Prime', 'Courier New', monospace", fontSize: 14, 
                  lineHeight: 1.6, whiteSpace: 'pre-wrap', border: '1px solid #e2e8f0',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)', marginBottom: 32
                }}>
                  {legalDraft}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={submit} disabled={submitting} style={{ 
                    flex: 1, padding: 16, background: '#0ec98c', color: '#fff', border: 'none', 
                    borderRadius: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 20px rgba(14,201,140,0.3)'
                  }}>
                    {submitting ? 'Submitting Formally...' : 'Confirm & Submit Legal Document'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: SURF, borderRadius: 20, border: `1px solid ${BDIM}`, padding: '24px' }}>
                <div style={{ marginBottom: 24 }}>
                   <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Select Department</div>
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {ISSUE_CATEGORIES.map(cat => (
                        <CategoryChip key={cat} label={cat} active={form.category === cat} onClick={() => handle('category', cat)} />
                      ))}
                   </div>
                </div>

                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Input Method</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
                  <ModeTab icon="file"  label="Text" active={mode === 'text'} onClick={() => setMode('text')} />
                  <ModeTab icon="image" label="Image" active={mode === 'image'} onClick={() => setMode('image')} />
                  <ModeTab icon="mic"   label="Voice" active={mode === 'voice'} onClick={() => setMode('voice')} />
                  <ModeTab icon="map"   label="Location" active={mode === 'location'} onClick={() => setMode('location')} />
                </div>
                
                {mode === 'text' && <textarea style={{ width: '100%', minHeight: 140, padding: 16, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BDIM}`, borderRadius: 12, color: '#fff', outline: 'none' }} placeholder="..." value={form.description} onChange={e => handle('description', e.target.value)} />}
                {mode === 'image' && <div onClick={() => fileInputRef.current?.click()} style={{ border: `2px dashed ${BDIM}`, padding: 60, textAlign: 'center', borderRadius: 16, cursor: 'pointer' }}>{imagePreview ? <img src={imagePreview} style={{ width: 120 }} /> : 'Upload Image'} <input ref={fileInputRef} type="file" onChange={e => handleImageSelect(e.target.files[0])} style={{ display: 'none' }} /></div>}
                {mode === 'voice' && <div style={{ textAlign: 'center', padding: 40 }}><button onClick={isRecording ? stopRecording : startRecording} style={{ width: 80, height: 80, borderRadius: '50%', background: isRecording ? '#ef4444' : '#1a56e8', border: 'none', cursor: 'pointer' }}><Icon name="mic" size={32} color="white" /></button><p style={{ marginTop: 16 }}>{isRecording ? 'Listening...' : 'Record Voice'}</p></div>}
                {mode === 'location' && <div style={{ textAlign: 'center', padding: 40 }}><button onClick={detectLocation} style={{ padding: '12px 24px', background: '#1a56e8', color: '#fff', borderRadius: 9, border: 'none' }}>Detect Location</button><p style={{ marginTop: 16 }}>{form.location || 'Click to detect'}</p></div>}

                {apiError && <div style={{ color: '#ef4444', marginTop: 12 }}>{apiError}</div>}
                <button onClick={previewLegalDraft} style={{ width: '100%', marginTop: 24, padding: 16, background: '#1a56e8', color: '#fff', borderRadius: 12, fontWeight: 700, border: 'none' }}>Generate Legal RTI Draft →</button>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ position: 'sticky', top: 88 }}>
             {PIPELINE_PREVIEW.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 12px', borderBottom: i < 3 ? '1px solid ${BDIM}' : 'none' }}>
                   <div style={{ width: 38, height: 38, borderRadius: 9, background: `${s.color}15`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={s.icon} size={16} color={s.color} />
                   </div>
                   <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.sub}</div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>
      
      <style>{`
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
        .page-enter { animation: fade 0.5s ease; }
        @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  )
}
