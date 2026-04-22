import React, { useState, useRef } from 'react'
import Icon from '../components/Icon'
import { submitComplaint } from '../services/api'
import { useTheme } from '../App'

const ISSUE_CATEGORIES = [
  'Road & Infrastructure','Water & Sanitation','Electricity & Power',
  'Municipal Services','Education','Healthcare',
  'Land & Property','Public Transport','Environment','Other',
]

const PIPELINE_PREVIEW = [
  { icon:'cpu',   label:'AI Processing',        color:'#3b74ff', sub:'Auto-classification & severity scoring' },
  { icon:'file',  label:'Complaint Generation',  color:'#1a56e8', sub:'Legal RTI draft with evidence' },
  { icon:'route', label:'Smart Routing',          color:'#3b74ff', sub:'Auto-identifies correct authority' },
  { icon:'send',  label:'Submission',             color:'#1a56e8', sub:'Portal auto-fill & verification' },
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
    "Provide the status of the Citizen's Charter and grievance redressal mechanism at this facility."
  ],
  'Education': [
    'Provide information on the teacher-student ratio at the specified government educational institution.',
    'Provide the details of funds received and utilized under Samagra Shiksha or other schemes for this school.',
    'Provide a copy of the latest infrastructure audit or building safety report for this school.',
    'Details of the midday meal provision and quality audits conducted in the current quarter.'
  ]
}

function ModeTab({ icon, label, active, onClick, txtMut, bdim }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'18px 14px', borderRadius:13, cursor:'pointer', background: active ? 'rgba(26,86,232,0.14)' : hovered ? 'var(--bg-glass-hover)' : 'var(--bg-glass)', border:`1.5px solid ${active ? 'rgba(26,86,232,0.5)' : hovered ? 'rgba(26,86,232,0.2)' : bdim}`, transition:'all 0.25s', transform: active ? 'translateY(-2px)' : 'none', boxShadow: active ? '0 6px 20px rgba(26,86,232,0.18)' : 'none' }}
    >
      <div style={{ width:42, height:42, borderRadius:10, background: active ? 'rgba(26,86,232,0.22)' : 'var(--bg-glass)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.25s' }}>
        <Icon name={icon} size={19} color={active ? '#3b74ff' : txtMut} sw={1.8} />
      </div>
      <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color: active ? 'var(--text-primary)' : txtMut, transition:'color 0.2s' }}>{label}</span>
    </button>
  )
}

export default function FileComplaint({ navigate }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [mode, setMode]                 = useState('text')
  const [form, setForm]                 = useState({ description:'', category:ISSUE_CATEGORIES[0], location:'' })
  const [submitting, setSubmitting]     = useState(false)
  const [submitted, setSubmitted]       = useState(false)
  const [apiError, setApiError]         = useState('')
  const [result, setResult]             = useState(null)
  const [showLegalReview, setShowLegalReview] = useState(false)
  const [legalDraft, setLegalDraft]     = useState('')
  const [catOpen, setCatOpen]           = useState(false)
  const [imageFile, setImageFile]       = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isRecording, setIsRecording]   = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [geoCoords, setGeoCoords]       = useState(null)
  const [geoLoading, setGeoLoading]     = useState(false)
  const [geoError, setGeoError]         = useState('')
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)

  const bg    = dark ? '#07090f' : '#f0f4fa'
  const surf  = dark ? '#0d1117' : '#ffffff'
  const bdim  = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const txtPri  = dark ? '#fff' : '#0f172a'
  const txtMut  = dark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.5)'
  const txtFaint= dark ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.32)'

  const handle = (key, val) => { setForm(f => ({ ...f, [key]: val })); setApiError('') }

  const generatePreviewDraft = () => {
    const date = new Date().toLocaleDateString('en-IN',{ day:'numeric', month:'long', year:'numeric' })
    const content = mode === 'voice' ? voiceTranscript : form.description
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
${(CATEGORY_QUESTIONS[form.category] || CATEGORY_QUESTIONS['Road & Infrastructure']).map((q,i) => `   (${String.fromCharCode(97+i)}) ${q}`).join('\n')}

3. DURATION:
   The information required pertains to the period from ${new Date(new Date().setFullYear(new Date().getFullYear()-1)).toLocaleDateString()} to ${date}.

DECLARATION:
I state that the information sought does not fall within the restrictions contained in Section 8 and 9 of the RTI Act and to the best of my knowledge it pertains to your office.

FEE DETAILS:
I am attaching the requisite RTI application fee. (Note: System-automated digital payment reference included).

Yours faithfully,
[Digitally Signed via Sentinel-RTI]
Contact: Registered User
`
  }

  const previewLegalDraft = () => {
    if (mode === 'text'     && !form.description.trim()) { setApiError('Please describe your issue.'); return }
    if (mode === 'image'    && !imageFile)               { setApiError('Please upload an image.'); return }
    if (mode === 'voice'    && !voiceTranscript.trim())  { setApiError('Please record your complaint.'); return }
    if (mode === 'location' && !geoCoords)               { setApiError('Please detect location first.'); return }
    setLegalDraft(generatePreviewDraft()); setShowLegalReview(true)
  }

  const handleImageSelect = (file) => {
    if (!file) return; setImageFile(file)
    const reader = new FileReader(); reader.onload = e => setImagePreview(e.target.result); reader.readAsDataURL(file)
    if (!form.description) handle('description', `Evidence image uploaded: ${file.name}`)
    if (!geoCoords) detectLocation()
  }

  const startRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setApiError('Speech recognition not supported.'); return }
    const r = new SR(); r.continuous = true; r.interimResults = true; r.lang = 'en-IN'
    let final = voiceTranscript
    r.onresult = e => { let interim = ''; for (let i = e.resultIndex; i < e.results.length; i++) { const t = e.results[i][0].transcript; if (e.results[i].isFinal) final += t + ' '; else interim += t } setVoiceTranscript(final + interim) }
    r.onerror = () => setIsRecording(false); r.onend = () => setIsRecording(false)
    recognitionRef.current = r; r.start(); setIsRecording(true); setApiError('')
  }
  const stopRecording = () => { if (recognitionRef.current) { recognitionRef.current.stop(); setIsRecording(false) } }

  const detectLocation = () => {
    if (!navigator.geolocation) { setGeoError('Geolocation not supported.'); return }
    setGeoLoading(true); setGeoError('')
    navigator.geolocation.getCurrentPosition(
      pos => { const { latitude:lat, longitude:lng } = pos.coords; setGeoCoords({ lat, lng }); handle('location', `${lat.toFixed(6)}°N, ${lng.toFixed(6)}°E`); setGeoLoading(false) },
      err => { setGeoError(err.message); setGeoLoading(false) }, { enableHighAccuracy:true, timeout:10000 }
    )
  }

  const submit = async () => {
    setSubmitting(true); setApiError('')
    try {
      const payload = { description: mode==='voice' ? voiceTranscript : form.description, category:form.category, location:form.location, inputMode:mode, imageFile: mode==='image' ? imageFile : null, voiceTranscript: mode==='voice' ? voiceTranscript : '', geoLat:geoCoords?.lat, geoLng:geoCoords?.lng, legalDraft }
      const res = await submitComplaint(payload); setResult(res.data); setSubmitted(true)
    } catch (err) { setApiError(err.message || 'Failed to submit.') }
    setSubmitting(false)
  }

  const taStyle = { width:'100%', minHeight:130, padding:14, background:'var(--input-bg)', border:`1px solid ${bdim}`, borderRadius:12, color:txtPri, outline:'none', fontFamily:"'DM Sans',sans-serif", fontSize:15, lineHeight:1.7, resize:'vertical', transition:'border-color 0.2s, background 0.35s, color 0.35s' }

  return (
    <div className="page-enter" style={{ background:bg, minHeight:'100vh', color:txtPri, paddingTop:72, transition:'background 0.35s,color 0.35s' }}>
      {/* Hero */}
      <section style={{ position:'relative', overflow:'hidden', padding:'56px 48px 44px' }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:`linear-gradient(${dark ? 'rgba(26,86,232,0.04)' : 'rgba(26,86,232,0.03)'} 1px,transparent 1px),linear-gradient(90deg,${dark ? 'rgba(26,86,232,0.04)' : 'rgba(26,86,232,0.03)'} 1px,transparent 1px)`, backgroundSize:'64px 64px' }} />
        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, fontFamily:"'Space Mono',monospace", fontSize:10, fontWeight:700, color:'#3b74ff', letterSpacing:2, textTransform:'uppercase', marginBottom:16 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#3b74ff', animation:'pulse 1.6s infinite' }} />
            Legal Conversion Pipeline
          </div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'clamp(32px,4.5vw,50px)', lineHeight:1.1, letterSpacing:'-1.5px', marginBottom:12, color:txtPri, transition:'color 0.35s' }}>
            {showLegalReview ? 'Legal Draft ' : 'File Your '}
            <span style={{ background:'linear-gradient(90deg,#1a56e8,#3b74ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              {showLegalReview ? 'Approval' : 'Complaint'}
            </span>
          </h1>
        </div>
      </section>

      <section style={{ maxWidth:1200, margin:'0 auto', padding:'0 48px 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:36, alignItems:'start' }}>

          {/* Left */}
          <div>
            {submitted ? (
              <div style={{ background:surf, borderRadius:18, border:`1px solid ${bdim}`, padding:'56px 44px', textAlign:'center', transition:'background 0.35s' }}>
                <div style={{ width:72, height:72, borderRadius:'50%', margin:'0 auto 20px', background:'rgba(26,86,232,0.15)', border:'2px solid rgba(26,86,232,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon name="check" size={32} color="#1a56e8" sw={2.5} />
                </div>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:26, marginBottom:12, color:txtPri }}>Legally Submitted!</h2>
                <div style={{ background:'rgba(26,86,232,0.08)', border:'1px solid rgba(26,86,232,0.2)', borderRadius:13, padding:'18px 24px', marginBottom:22, textAlign:'left' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'5px 0' }}>
                    <span style={{ color:txtMut }}>Tracking ID</span>
                    <span style={{ color:'#3b74ff', fontWeight:700 }}>{result?.trackingId}</span>
                  </div>
                </div>
                <button onClick={() => navigate('track')} style={{ background:'#1a56e8', color:'#fff', padding:'11px 22px', borderRadius:9, border:'none', cursor:'pointer', fontWeight:700 }}>Track Status</button>
              </div>
            ) : showLegalReview ? (
              <div style={{ background:surf, borderRadius:18, border:`1px solid ${bdim}`, padding:36, transition:'background 0.35s' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:19, color:txtPri }}>RTI Draft Preview</div>
                  <button onClick={() => setShowLegalReview(false)} style={{ background:'transparent', color:txtMut, border:'none', cursor:'pointer', fontSize:13 }}>← Back to Edit</button>
                </div>
                <div style={{ background:'#f8fafc', color:'#1e293b', padding:36, borderRadius:12, fontFamily:"'Courier Prime','Courier New',monospace", fontSize:13, lineHeight:1.6, whiteSpace:'pre-wrap', border:'1px solid #e2e8f0', boxShadow:'inset 0 2px 8px rgba(0,0,0,0.04)', marginBottom:28 }}>
                  {legalDraft}
                </div>
                <button onClick={submit} disabled={submitting} style={{ width:'100%', padding:14, background:'#1a56e8', color:'#fff', border:'none', borderRadius:12, fontWeight:700, cursor:'pointer', boxShadow:'0 6px 18px rgba(26,86,232,0.28)', fontSize:14 }}>
                  {submitting ? 'Submitting Formally...' : 'Confirm & Submit Legal Document'}
                </button>
              </div>
            ) : (
              <div style={{ background:surf, borderRadius:18, border:`1px solid ${bdim}`, padding:24, transition:'background 0.35s' }}>

                {/* Category dropdown */}
                <div style={{ marginBottom:24, position:'relative' }}>
                  <div style={{ fontSize:11, fontWeight:700, color:txtFaint, textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>Select Department</div>
                  <button
                    onClick={() => setCatOpen(o => !o)}
                    style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderRadius:11, background:'var(--input-bg)', border:`1.5px solid ${catOpen ? 'rgba(26,86,232,0.5)' : bdim}`, cursor:'pointer', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:txtPri, transition:'all 0.2s' }}
                  >
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ width:8, height:8, borderRadius:'50%', background:'#1a56e8', display:'inline-block' }} />
                      {form.category}
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={txtMut} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: catOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.25s' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {catOpen && (
                    <div style={{ position:'absolute', top:'100%', left:0, right:0, marginTop:6, background:surf, border:`1px solid ${bdim}`, borderRadius:12, boxShadow:`0 8px 32px ${dark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.12)'}`, zIndex:100, overflow:'hidden' }}>
                      {ISSUE_CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => { handle('category', cat); setCatOpen(false) }}
                          style={{ width:'100%', padding:'11px 16px', background: form.category === cat ? 'rgba(26,86,232,0.1)' : 'transparent', border:'none', borderBottom:`1px solid ${bdim}`, cursor:'pointer', fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:14, color: form.category === cat ? '#3b74ff' : txtPri, textAlign:'left', display:'flex', alignItems:'center', gap:10, transition:'background 0.15s' }}
                          onMouseEnter={e => { if (form.category !== cat) e.currentTarget.style.background='var(--bg-glass-hover)' }}
                          onMouseLeave={e => { if (form.category !== cat) e.currentTarget.style.background='transparent' }}
                        >
                          {form.category === cat && <span style={{ width:6, height:6, borderRadius:'50%', background:'#1a56e8', display:'inline-block', flexShrink:0 }} />}
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input method */}
                <div style={{ fontSize:11, fontWeight:700, color:txtFaint, textTransform:'uppercase', letterSpacing:1.5, marginBottom:12 }}>Input Method</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:22 }}>
                  <ModeTab icon="file"  label="Text"     active={mode==='text'}     onClick={() => setMode('text')}     txtMut={txtMut} bdim={bdim} />
                  <ModeTab icon="image" label="Image"    active={mode==='image'}    onClick={() => setMode('image')}    txtMut={txtMut} bdim={bdim} />
                  <ModeTab icon="mic"   label="Voice"    active={mode==='voice'}    onClick={() => setMode('voice')}    txtMut={txtMut} bdim={bdim} />
                  <ModeTab icon="map"   label="Location" active={mode==='location'} onClick={() => setMode('location')} txtMut={txtMut} bdim={bdim} />
                </div>

                {mode === 'text' && <textarea style={taStyle} placeholder="Describe your complaint in detail..." value={form.description} onChange={e => handle('description', e.target.value)} onFocus={e => e.target.style.borderColor='rgba(26,86,232,0.5)'} onBlur={e => e.target.style.borderColor=bdim} />}
                {mode === 'image' && (
                  <div onClick={() => fileInputRef.current?.click()} onDrop={e => { e.preventDefault(); handleImageSelect(e.dataTransfer.files[0]) }} onDragOver={e => e.preventDefault()}
                    style={{ border:`2px dashed ${bdim}`, padding:48, textAlign:'center', borderRadius:14, cursor:'pointer', background:'var(--input-bg)', transition:'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='rgba(26,86,232,0.4)'} onMouseLeave={e => e.currentTarget.style.borderColor=bdim}
                  >
                    {imagePreview ? <img src={imagePreview} style={{ maxWidth:200, borderRadius:8 }} alt="preview" /> : <div><Icon name="image" size={28} color={txtMut} /><p style={{ marginTop:12, color:txtMut, fontSize:14 }}>Drag & drop or click to upload evidence</p></div>}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={e => handleImageSelect(e.target.files[0])} style={{ display:'none' }} />
                  </div>
                )}
                {mode === 'voice' && (
                  <div style={{ textAlign:'center', padding:'36px 20px' }}>
                    <button onClick={isRecording ? stopRecording : startRecording} style={{ width:76, height:76, borderRadius:'50%', background: isRecording ? '#ef4444' : '#1a56e8', border:'none', cursor:'pointer', boxShadow: isRecording ? '0 0 0 8px rgba(239,68,68,0.2)' : '0 6px 20px rgba(26,86,232,0.4)', transition:'all 0.3s' }}>
                      <Icon name="mic" size={28} color="white" />
                    </button>
                    <p style={{ marginTop:14, color:txtMut, fontSize:14 }}>{isRecording ? 'Listening...' : 'Click to record'}</p>
                    {voiceTranscript && <div style={{ marginTop:14, padding:12, background:'var(--input-bg)', borderRadius:10, fontSize:13, color:txtPri, textAlign:'left', lineHeight:1.65 }}>{voiceTranscript}</div>}
                  </div>
                )}
                {mode === 'location' && (
                  <div style={{ textAlign:'center', padding:'36px 20px' }}>
                    <button onClick={detectLocation} disabled={geoLoading} style={{ display:'inline-flex', alignItems:'center', gap:9, padding:'12px 24px', background:'#1a56e8', color:'#fff', borderRadius:10, border:'none', cursor:'pointer', fontWeight:700, fontSize:14, transition:'all 0.2s' }}>
                      <Icon name="map" size={16} color="white" /> {geoLoading ? 'Detecting...' : 'Detect My Location'}
                    </button>
                    {form.location && <div style={{ marginTop:14, padding:12, background:'rgba(26,86,232,0.1)', border:'1px solid rgba(26,86,232,0.2)', borderRadius:10, fontSize:13, color:'#3b74ff' }}>{form.location}</div>}
                    {geoError && <p style={{ marginTop:12, color:'#ef4444', fontSize:13 }}>{geoError}</p>}
                  </div>
                )}

                {apiError && <div style={{ color:'#ef4444', marginTop:12, fontSize:13 }}>{apiError}</div>}
                <button onClick={previewLegalDraft} style={{ width:'100%', marginTop:22, padding:14, background:'#1a56e8', color:'#fff', borderRadius:12, fontWeight:700, border:'none', cursor:'pointer', fontFamily:"'Syne',sans-serif", fontSize:14, boxShadow:'0 6px 20px rgba(26,86,232,0.35)', transition:'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background='#3b74ff'}
                  onMouseLeave={e => e.currentTarget.style.background='#1a56e8'}
                >Generate Legal RTI Draft →</button>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ position:'sticky', top:88 }}>
            <div style={{ background:surf, borderRadius:16, border:`1px solid ${bdim}`, overflow:'hidden', transition:'background 0.35s' }}>
              {PIPELINE_PREVIEW.map((s, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 18px', borderBottom: i < 3 ? `1px solid ${bdim}` : 'none' }}>
                  <div style={{ width:38, height:38, borderRadius:9, background:`${s.color}15`, border:`1px solid ${s.color}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon name={s.icon} size={16} color={s.color} />
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13, color:txtPri, fontFamily:"'Syne',sans-serif", transition:'color 0.35s' }}>{s.label}</div>
                    <div style={{ fontSize:11, color:txtMut, marginTop:2, transition:'color 0.35s' }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .page-enter { animation: fade 0.5s ease; }
        @keyframes fade { from{opacity:0} to{opacity:1} }
      `}</style>
    </div>
  )
}
