import React, { useState, useRef, useEffect } from 'react'
import Icon from '../components/Icon'
import { analyzeComplaint, submitComplaint, submitToRTIPortal } from '../services/api'
import CameraCapture from '../components/mobile/CameraCapture'
import VoiceRecorder from '../components/mobile/VoiceRecorder'
import GeoDetect     from '../components/mobile/GeoDetect'
import { useAuth }   from '../context/AuthContext'

const BG = '#07090f', SURF = '#0d1117', BDIM = 'rgba(255,255,255,0.06)'
const BLUE = '#1a56e8', CYAN = '#00c2e0', GREEN = '#0ec98c', AMBER = '#f59e0b', RED = '#ef4444', PURPLE = '#e04dff'

const CATEGORIES = ['Road & Infrastructure','Water & Sanitation','Electricity & Power','Municipal Services','Education','Healthcare','Land & Property','Public Transport','Environment','Other']
const SEV_COLOR = { HIGH: RED, MEDIUM: AMBER, LOW: GREEN }
const EVIDENCE_LABELS = { has_image:'📷 Image Evidence', image_analyzed:'🔍 Image Analyzed by AI', has_geo:'📍 GPS Tagged', has_voice:'🎙️ Voice Input', detailed_description:'📝 Detailed Text' }

const STEPS = [
  { id:'input',    label:'Input',           icon:'file' },
  { id:'ai',       label:'AI Processing',   icon:'cpu' },
  { id:'verify',   label:'Verify & Draft',  icon:'shield' },
  { id:'done',     label:'Submitted',       icon:'check' },
]

function StepBar({ current }) {
  const idx = STEPS.findIndex(s => s.id === current)
  return (
    <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:36 }}>
      {STEPS.map((s, i) => {
        const done = i < idx, active = i === idx
        const col = done ? GREEN : active ? CYAN : 'rgba(255,255,255,0.15)'
        return (
          <React.Fragment key={s.id}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, minWidth:80 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background: active?`${CYAN}20`:done?`${GREEN}20`:'rgba(255,255,255,0.04)', border:`2px solid ${col}`, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.3s' }}>
                <Icon name={done?'check':s.icon} size={15} color={col} sw={2} />
              </div>
              <span style={{ fontSize:10, fontWeight:700, color:col, fontFamily:"'Space Mono',monospace", textTransform:'uppercase', letterSpacing:0.5 }}>{s.label}</span>
            </div>
            {i < STEPS.length-1 && <div style={{ flex:1, height:2, background: done?GREEN:BDIM, margin:'0 4px', marginBottom:20, transition:'background 0.4s' }} />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function CategoryChip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ padding:'7px 13px', borderRadius:9, background:active?'rgba(26,86,232,0.2)':'rgba(255,255,255,0.03)', color:active?CYAN:'rgba(255,255,255,0.4)', border:`1px solid ${active?BLUE:'rgba(255,255,255,0.08)'}`, cursor:'pointer', fontSize:11, fontWeight:700, transition:'all 0.2s', fontFamily:"'Space Mono',monospace", textTransform:'uppercase', letterSpacing:0.5 }}>
      {label}
    </button>
  )
}

function ModeTab({ icon, label, active, onClick }) {
  const [h, sh] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'18px 12px', borderRadius:14, cursor:'pointer', background:active?'rgba(26,86,232,0.15)':h?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.025)', border:`1.5px solid ${active?'rgba(26,86,232,0.5)':h?'rgba(255,255,255,0.12)':BDIM}`, transition:'all 0.2s', transform:active?'translateY(-2px)':'none', boxShadow:active?'0 6px 20px rgba(26,86,232,0.2)':'none' }}>
      <div style={{ width:40, height:40, borderRadius:10, background:active?'rgba(26,86,232,0.25)':'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon name={icon} size={18} color={active?CYAN:'rgba(255,255,255,0.4)'} sw={1.8} />
      </div>
      <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, color:active?'#fff':'rgba(255,255,255,0.5)' }}>{label}</span>
    </button>
  )
}

function ConfidenceMeter({ value }) {
  const col = value >= 75 ? GREEN : value >= 50 ? AMBER : RED
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
        <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:"'Space Mono',monospace" }}>AI Confidence</span>
        <span style={{ fontSize:14, fontWeight:800, color:col, fontFamily:"'Syne',sans-serif" }}>{value}%</span>
      </div>
      <div style={{ height:8, borderRadius:4, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${value}%`, background:`linear-gradient(90deg,${col}88,${col})`, borderRadius:4, transition:'width 1s ease' }} />
      </div>
    </div>
  )
}

export default function FileComplaint({ navigate }) {
  const { user } = useAuth()

  // ── Core state ──
  const [step,          setStep]          = useState('input')
  const [mode,          setMode]          = useState('text')
  const [form,          setForm]          = useState({ description:'', category:CATEGORIES[0], location:'' })
  const [imageFile,     setImageFile]     = useState(null)
  const [imagePreview,  setImagePreview]  = useState(null)
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [geoCoords,     setGeoCoords]     = useState(null)   // { lat, lng } — set by GeoDetect callback

  // ── AI & flow state ──
  const [aiResult,      setAiResult]      = useState(null)
  const [aiLoading,     setAiLoading]     = useState(false)
  const [legalDraft,    setLegalDraft]    = useState('')
  const [showDraft,     setShowDraft]     = useState(false)

  // ── User info edit state ──
  const [editingInfo,   setEditingInfo]   = useState(false)
  const [userInfo,      setUserInfo]      = useState({ 
    name: user?.name || '', 
    address: user?.address || '', 
    phone: user?.phone || '' 
  })

  // Sync user info if it loads after component mount
  useEffect(() => {
    if (user) {
      setUserInfo(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        address: prev.address || user.address || '',
        phone: prev.phone || user.phone || ''
      }))
    }
  }, [user])

  // ── Result & error state ──
  const [submitting,    setSubmitting]    = useState(false)
  const [result,        setResult]        = useState(null)
  const [error,         setError]         = useState('')

  const handle = (k, v) => { setForm(f=>({...f,[k]:v})); setError('') }



  // ── Image handler (passed to CameraCapture as prop) ──
  const onImage = file => {
    if (!file) { setImageFile(null); setImagePreview(null); return }
    setImageFile(file)
    const r = new FileReader()
    r.onload = e => setImagePreview(e.target.result)
    r.readAsDataURL(file)
    if (!form.description) handle('description', `Evidence image: ${file.name}`)
  }


  // ── Step 1 → AI ──
  const runAI = async () => {
    const desc = mode==='voice' ? voiceTranscript : form.description
    if (!desc?.trim() && !imageFile && !geoCoords) { setError('Please provide your complaint details.'); return }
    setAiLoading(true); setError('')
    try {
      const res = await analyzeComplaint({ description:desc, category:form.category, location:form.location, inputMode:mode, voiceTranscript, geoLat:geoCoords?.lat, geoLng:geoCoords?.lng, imageFile: mode==='image'?imageFile:null })
      setAiResult(res.data)
      setStep('ai')
    } catch(e) { setError(e.message||'AI analysis failed') }
    setAiLoading(false)
  }



  // ── Submit ──
  const doSubmit = async () => {
    if (!userInfo.name.trim()) { setError('Please enter your name before submitting.'); return }
    setSubmitting(true); setError('')
    try {
      const desc = mode==='voice' ? voiceTranscript : form.description
      const res = await submitComplaint({ description:desc, category:form.category, location:form.location, inputMode:mode, imageFile: mode==='image'?imageFile:null, voiceTranscript: mode==='voice'?voiceTranscript:'', geoLat:geoCoords?.lat, geoLng:geoCoords?.lng, legalDraft, applicantName:userInfo.name, applicantAddress:userInfo.address||form.location })
      
      try {
        if (res.data?._id) {
          await submitToRTIPortal(res.data._id, { userId: user?._id || user?.id });
        }
      } catch (err) {
        console.error('RTI Automation trigger failed:', err);
      }
      
      setResult(res.data); setStep('done')
    } catch(e) { setError(e.message||'Submission failed') }
    setSubmitting(false)
  }

  return (
    <div className="page-enter" style={{ background:BG, minHeight:'100vh', color:'#fff' }}>
      {/* Hero */}
      <section style={{ position:'relative', overflow:'hidden', padding:'56px 48px 32px' }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:`linear-gradient(${BLUE}08 1px,transparent 1px),linear-gradient(90deg,${BLUE}08 1px,transparent 1px)`, backgroundSize:'64px 64px' }} />
        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, fontFamily:"'Space Mono',monospace", fontSize:10, fontWeight:700, color:CYAN, letterSpacing:2, textTransform:'uppercase', marginBottom:16 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:CYAN, animation:'pulse 1.6s infinite' }} /> AI-Powered RTI Pipeline
          </div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'clamp(32px,4.5vw,52px)', lineHeight:1.08, letterSpacing:'-2px', marginBottom:8 }}>
            File Your <span style={{ background:`linear-gradient(90deg,${BLUE},${CYAN})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Complaint</span>
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.4)', maxWidth:480, lineHeight:1.7 }}>Gemini 2.0 Flash analyzes, classifies, and drafts your RTI in seconds.</p>
        </div>
      </section>

      <section style={{ maxWidth:1100, margin:'0 auto', padding:'0 48px 80px' }}>
        <StepBar current={step} />

        {/* ── STEP 1: INPUT ── */}
        {step==='input' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:32, alignItems:'start' }}>
            <div style={{ background:SURF, borderRadius:20, border:`1px solid ${BDIM}`, padding:28 }}>
              <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:12 }}>Department</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:24 }}>
                {CATEGORIES.map(c => <CategoryChip key={c} label={c} active={form.category===c} onClick={()=>handle('category',c)} />)}
              </div>
              <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:12 }}>Input Method</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:24 }}>
                <ModeTab icon="file"  label="Text"     active={mode==='text'}     onClick={()=>setMode('text')} />
                <ModeTab icon="image" label="Image"    active={mode==='image'}    onClick={()=>setMode('image')} />
                <ModeTab icon="mic"   label="Voice"    active={mode==='voice'}    onClick={()=>setMode('voice')} />
                <ModeTab icon="map"   label="Location" active={mode==='location'} onClick={()=>setMode('location')} />
              </div>

              {mode==='text' && (
                <textarea style={{ width:'100%', minHeight:140, padding:16, background:'rgba(255,255,255,0.03)', border:`1px solid ${BDIM}`, borderRadius:12, color:'#fff', outline:'none', fontFamily:"'DM Sans',sans-serif", fontSize:14, resize:'vertical', lineHeight:1.6 }} placeholder="Describe your issue in detail — location, duration, impact..." value={form.description} onChange={e=>handle('description',e.target.value)} />
              )}
              {mode==='image' && (
                <CameraCapture
                  imageFile={imageFile}
                  imagePreview={imagePreview}
                  onImage={onImage}
                />
              )}
              {mode==='voice' && (
                <VoiceRecorder
                  onTranscriptChange={text => setVoiceTranscript(text)}
                />
              )}
              {mode==='location' && (
                <GeoDetect
                  onLocationDetected={loc => {
                    if (!loc) { setGeoCoords(null); return }
                    setGeoCoords({ lat: loc.lat, lng: loc.lng })
                    handle('location', loc.label)
                  }}
                />
              )}

              <div style={{ marginTop:16 }}>
                <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>Location (optional)</div>
                <input style={{ width:'100%', padding:'12px 16px', background:'rgba(255,255,255,0.03)', border:`1px solid ${BDIM}`, borderRadius:10, color:'#fff', outline:'none', fontSize:14 }} placeholder="Area, landmark, city..." value={form.location} onChange={e=>handle('location',e.target.value)} />
              </div>

              {error && <div style={{ color:RED, marginTop:12, fontSize:13, padding:'10px 14px', background:`${RED}10`, borderRadius:8, border:`1px solid ${RED}25` }}>{error}</div>}
              <button onClick={runAI} disabled={aiLoading} style={{ width:'100%', marginTop:24, padding:16, background:`linear-gradient(135deg,${BLUE},${CYAN}88)`, color:'#fff', borderRadius:12, fontWeight:800, border:'none', cursor:'pointer', fontSize:15, boxShadow:`0 8px 24px ${BLUE}40`, opacity:aiLoading?0.7:1, transition:'all 0.2s' }}>
                {aiLoading ? '🤖 Gemini AI Processing...' : '⚡ Analyze with Gemini AI →'}
              </button>
            </div>
            {/* Sidebar */}
            <div style={{ background:SURF, borderRadius:20, border:`1px solid ${BDIM}`, padding:24, position:'sticky', top:88 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:16 }}>Pipeline Preview</div>
              {[{icon:'cpu',label:'AI Processing',col:BLUE,sub:'Gemini 2.0 Flash analysis'},{icon:'file',label:'RTI Draft',col:AMBER,sub:'AI-enriched legal document'},{icon:'shield',label:'Verification',col:PURPLE,sub:'OTP + CAPTCHA'},{icon:'send',label:'Submission',col:GREEN,sub:'Formally filed & tracked'}].map((s,i)=>(
                <div key={i} style={{ display:'flex', gap:14, padding:'14px 0', borderBottom:i<3?`1px solid ${BDIM}`:'none' }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:`${s.col}15`, border:`1px solid ${s.col}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon name={s.icon} size={15} color={s.col} />
                  </div>
                  <div><div style={{ fontWeight:700, fontSize:13 }}>{s.label}</div><div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:2 }}>{s.sub}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: AI RESULT ── */}
        {step==='ai' && aiResult && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:32, alignItems:'start' }}>
            <div>
              {/* Header */}
              <div style={{ background:SURF, borderRadius:20, border:`1px solid ${BDIM}`, padding:28, marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                  <div>
                    <div style={{ fontSize:10, fontWeight:700, color:CYAN, textTransform:'uppercase', letterSpacing:2, marginBottom:6, fontFamily:"'Space Mono',monospace" }}>
                      🤖 {aiResult.model==='gemini-2.0-flash'?'Gemini 2.0 Flash':'Rule-Based Engine'} Analysis Complete
                    </div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22 }}>AI Processing Results</div>
                  </div>
                  <div style={{ padding:'8px 16px', borderRadius:20, background:`${SEV_COLOR[aiResult.severity]||AMBER}15`, border:`1px solid ${SEV_COLOR[aiResult.severity]||AMBER}30`, color:SEV_COLOR[aiResult.severity]||AMBER, fontWeight:800, fontSize:13, fontFamily:"'Space Mono',monospace" }}>
                    {aiResult.severity} SEVERITY
                  </div>
                </div>
                <ConfidenceMeter value={aiResult.confidence||0} />
              </div>

              {/* AI Summary */}
              <div style={{ background:SURF, borderRadius:16, border:`1px solid ${BDIM}`, padding:24, marginBottom:16 }}>
                <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>📝 AI Summary</div>
                <p style={{ fontSize:15, lineHeight:1.75, color:'rgba(255,255,255,0.85)' }}>{aiResult.summary}</p>
              </div>

              {/* Vision Analysis — only shown when Gemini actually saw the image */}
              {aiResult.imageAnalysis && (
                <div style={{ background:`${PURPLE}08`, borderRadius:16, border:`1px solid ${PURPLE}25`, borderLeft:`3px solid ${PURPLE}`, padding:24, marginBottom:16 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                    <span style={{ fontSize:16 }}>📸</span>
                    <div style={{ fontSize:10, fontWeight:700, color:PURPLE, textTransform:'uppercase', letterSpacing:1.5 }}>Gemini Vision — Image Analysis</div>
                  </div>
                  <p style={{ fontSize:14, lineHeight:1.75, color:'rgba(255,255,255,0.8)', fontStyle:'italic' }}>{aiResult.imageAnalysis}</p>
                </div>
              )}

              {/* Category + Authority */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                <div style={{ background:SURF, borderRadius:16, border:`1px solid ${BDIM}`, padding:20 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>📂 Classified Category</div>
                  <div style={{ fontWeight:800, fontSize:16, color:CYAN }}>{aiResult.category}</div>
                </div>
                <div style={{ background:SURF, borderRadius:16, border:`1px solid ${BDIM}`, padding:20 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>🏛️ Route To Authority</div>
                  <div style={{ fontWeight:700, fontSize:13, color:'rgba(255,255,255,0.85)', lineHeight:1.4 }}>{aiResult.authority}</div>
                </div>
              </div>

              {/* Severity Reason */}
              <div style={{ background:SURF, borderRadius:16, border:`1px solid ${(SEV_COLOR[aiResult.severity]||AMBER)}25`, borderLeft:`3px solid ${SEV_COLOR[aiResult.severity]||AMBER}`, padding:20, marginBottom:16 }}>
                <div style={{ fontSize:10, fontWeight:700, color:SEV_COLOR[aiResult.severity]||AMBER, textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>⚡ Severity Analysis</div>
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>{aiResult.severityReason}</p>
                <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ flex:1, height:6, borderRadius:3, background:'rgba(255,255,255,0.06)' }}>
                    <div style={{ height:'100%', width:`${aiResult.severityScore||0}%`, background:`linear-gradient(90deg,${SEV_COLOR[aiResult.severity]||AMBER}55,${SEV_COLOR[aiResult.severity]||AMBER})`, borderRadius:3 }} />
                  </div>
                  <span style={{ fontSize:12, fontWeight:700, color:SEV_COLOR[aiResult.severity]||AMBER, fontFamily:"'Space Mono',monospace" }}>{aiResult.severityScore}/100</span>
                </div>
              </div>

              {/* Keywords */}
              {aiResult.keywords?.length > 0 && (
                <div style={{ background:SURF, borderRadius:16, border:`1px solid ${BDIM}`, padding:20, marginBottom:16 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:12 }}>🏷️ Key Issues Detected</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {aiResult.keywords.map((k,i)=>(
                      <span key={i} style={{ padding:'5px 12px', borderRadius:6, background:`${BLUE}15`, border:`1px solid ${BLUE}30`, color:CYAN, fontSize:12, fontWeight:700, fontFamily:"'Space Mono',monospace" }}>#{k}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence + Legal */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
                <div style={{ background:SURF, borderRadius:16, border:`1px solid ${BDIM}`, padding:20 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:12 }}>🔗 Evidence on Record</div>
                  {aiResult.evidenceFlags?.length > 0 ? aiResult.evidenceFlags.map((f,i)=>(
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', fontSize:13, color:'rgba(255,255,255,0.7)' }}>
                      <span style={{ color:GREEN }}>✓</span> {EVIDENCE_LABELS[f]||f}
                    </div>
                  )) : <p style={{ fontSize:13, color:'rgba(255,255,255,0.3)' }}>No evidence attached</p>}
                </div>
                <div style={{ background:SURF, borderRadius:16, border:`1px solid ${BDIM}`, padding:20 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:12 }}>⚖️ Applicable Law</div>
                  {aiResult.legalSections?.map((s,i)=>(
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'4px 0', fontSize:12, color:'rgba(255,255,255,0.65)', lineHeight:1.4 }}>
                      <span style={{ color:PURPLE, flexShrink:0 }}>§</span> {s}
                    </div>
                  ))}
                </div>
              </div>

              {error && <div style={{ color:RED, marginBottom:12, fontSize:13, padding:'10px 14px', background:`${RED}10`, borderRadius:8, border:`1px solid ${RED}25` }}>{error}</div>}
              <div style={{ display:'flex', gap:12 }}>
                <button onClick={()=>setStep('input')} style={{ padding:'14px 24px', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.6)', border:`1px solid ${BDIM}`, borderRadius:12, cursor:'pointer', fontWeight:700 }}>← Re-edit</button>
                <button onClick={()=>setStep('verify')} style={{ flex:1, padding:16, background:`linear-gradient(135deg,${AMBER},${GREEN}88)`, color:'#fff', border:'none', borderRadius:12, fontWeight:800, cursor:'pointer', fontSize:15, boxShadow:`0 8px 24px ${GREEN}30` }}>
                  Approve & Generate Legal Draft →
                </button>
              </div>
            </div>
            {/* Mini sidebar */}
            <div style={{ background:SURF, borderRadius:20, border:`1px solid ${BDIM}`, padding:24, position:'sticky', top:88 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:16 }}>Smart Routing</div>
              <div style={{ padding:16, background:`${BLUE}08`, borderRadius:12, border:`1px solid ${BLUE}20`, marginBottom:16 }}>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:4 }}>Filing To</div>
                <div style={{ fontWeight:700, fontSize:14, color:'#fff', lineHeight:1.5 }}>{aiResult.authority}</div>
              </div>
              <div style={{ padding:16, background:`${AMBER}08`, borderRadius:12, border:`1px solid ${AMBER}20` }}>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:4 }}>Response Deadline</div>
                <div style={{ fontWeight:800, fontSize:20, color:AMBER }}>30 Days</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>Under RTI Act, 2005</div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: VERIFY & DRAFT ── */}
        {step==='verify' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:32, alignItems:'start' }}>
            <div>
              {/* Applicant Info Card */}
              <div style={{ background:SURF, borderRadius:20, border:`1px solid ${BDIM}`, padding:28, marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:`${CYAN}15`, border:`1px solid ${CYAN}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon name="user" size={20} color={CYAN} />
                    </div>
                    <div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18 }}>Applicant Information</div>
                      <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>Details that will appear on your RTI application</div>
                    </div>
                  </div>
                  <button onClick={()=>setEditingInfo(e=>!e)} style={{ padding:'7px 16px', background:editingInfo?`${GREEN}15`:'rgba(255,255,255,0.05)', color:editingInfo?GREEN:'rgba(255,255,255,0.5)', border:`1px solid ${editingInfo?GREEN+'44':BDIM}`, borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:13 }}>
                    {editingInfo ? '✓ Done' : '✏️ Edit'}
                  </button>
                </div>
                {editingInfo ? (
                  <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                    {[['name','Full Name','e.g. Rahul Sharma'],['address','Address / City','Area, City, State, PIN'],['phone','Phone Number','10-digit mobile number']].map(([key,label,ph])=>(
                      <div key={key}>
                        <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1.2, marginBottom:6 }}>{label}{key==='name'&&<span style={{color:RED}}> *</span>}</div>
                        <input value={userInfo[key]} onChange={e=>setUserInfo(u=>({...u,[key]:e.target.value}))} placeholder={ph} style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.04)', border:`1px solid ${userInfo[key]?CYAN+'44':BDIM}`, borderRadius:10, color:'#fff', outline:'none', fontSize:14, transition:'border-color 0.2s', boxSizing:'border-box' }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    {[['👤 Name', userInfo.name||'—'],['📍 Address', userInfo.address||form.location||'—'],['📱 Phone', userInfo.phone||'—'],['📂 Category', form.category],['🗺️ Location', form.location||'Not specified'],['🏛️ Authority', aiResult?.authority||'—']].map(([k,v])=>(
                      <div key={k} style={{ padding:'12px 16px', background:'rgba(255,255,255,0.03)', borderRadius:10, border:`1px solid ${BDIM}` }}>
                        <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginBottom:4 }}>{k}</div>
                        <div style={{ fontSize:13, fontWeight:600, color:v==='—'?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.85)', wordBreak:'break-word' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                )}
                {!userInfo.name && !editingInfo && (
                  <div style={{ marginTop:14, padding:'10px 14px', background:`${AMBER}10`, border:`1px solid ${AMBER}30`, borderRadius:8, color:AMBER, fontSize:13 }}>
                    ⚠️ Click <strong>Edit</strong> and enter your name — required for RTI submission.
                  </div>
                )}
              </div>

              {/* RTI Legal Draft — always visible */}
              <div style={{ background:SURF, borderRadius:20, border:`1px solid ${BDIM}`, padding:28, marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18 }}>📄 RTI Legal Draft</div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={()=>{
                      const d = mode==='voice' ? voiceTranscript : form.description;
                      const now = new Date();
                      const dateStr = now.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
                      const yearAgo = new Date(now); yearAgo.setFullYear(yearAgo.getFullYear()-1);
                      const fromStr = yearAgo.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
                      const fs = d.split(/[.!?]/)[0].trim();
                      const rest = d.slice(fs.length).replace(/^[.!?\s]+/,'').trim();
                      setLegalDraft(
`APPLICATION UNDER THE RIGHT TO INFORMATION ACT, 2005\n\nTo,\nThe Public Information Officer (PIO),\n${aiResult?.authority||'The Concerned Public Authority'},\nGovernment of India / State Government.\n\nDate: ${dateStr}\nPlace: ${form.location||'[Location]'}\n\nSubject: Request for Information under Section 6(1) of the RTI Act, 2005 — regarding ${form.category} issue at ${form.location||'[Location]'}.\n\nRespected Sir / Madam,\n\nI, ${userInfo.name||'[Applicant Name]'}, am a citizen of India and I wish to bring to your kind attention a serious matter concerning ${form.category.toLowerCase()} in the area of ${form.location||'the concerned locality'}. ${fs}.${rest?' '+rest:''}\n\nDespite the evident public impact of this issue, no satisfactory resolution has been forthcoming. I am therefore constrained to seek information under the provisions of the Right to Information Act, 2005.\n\nAccordingly, I hereby request the following information under Section 6(1) of the RTI Act, 2005:\n\n1. Kindly furnish the current status of the action taken by the concerned authority.\n\n2. Kindly provide copies of any inspection reports or field surveys conducted at the location in the past twelve months.\n\n3. Kindly furnish details of the budget allocated and expenditure incurred for maintenance during the current and previous financial year.\n\n4. Kindly provide the names, designations, and contact details of officers responsible for this matter.\n\n5. Kindly furnish details of any earlier complaints received and the action taken on each.\n\nThe information sought pertains to the period from ${fromStr} to ${dateStr}.\n\nI am enclosing the prescribed fee of Rs. 10/- and request a response within 30 days as mandated under Section 7(1) of the RTI Act, 2005.\n\nYours faithfully,\n\nName    : ${userInfo.name||'[Applicant Name]'}\nAddress : ${userInfo.address||form.location||'[Address]'}\nPhone   : ${userInfo.phone||'[Phone]'}\nDate    : ${dateStr}\n\nEnclosures:\n  1. Prescribed RTI application fee (Rs. 10/-)`);
                    }} style={{ padding:'8px 16px', background:`${BLUE}20`, color:CYAN, border:`1px solid ${BLUE}44`, borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:13 }}>
                      {legalDraft ? '🔄 Regenerate' : '✨ Generate Draft'}
                    </button>
                    {legalDraft && (
                      <button onClick={()=>{ const b=new Blob([legalDraft],{type:'text/plain'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='RTI_Draft.txt'; a.click() }} style={{ padding:'8px 16px', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.5)', border:`1px solid ${BDIM}`, borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:600 }}>
                        ⬇️ Download
                      </button>
                    )}
                  </div>
                </div>
                {legalDraft ? (
                  <textarea value={legalDraft} onChange={e=>setLegalDraft(e.target.value)} style={{ width:'100%', minHeight:360, padding:20, background:'#f8fafc', color:'#1e293b', border:'1px solid #e2e8f0', borderRadius:12, fontFamily:"'Courier New',monospace", fontSize:12, lineHeight:1.6, resize:'vertical', outline:'none' }} />
                ) : (
                  <div style={{ padding:'36px 20px', textAlign:'center', color:'rgba(255,255,255,0.25)', fontSize:14, border:`1px dashed ${BDIM}`, borderRadius:12 }}>
                    Click <strong style={{color:CYAN}}>✨ Generate Draft</strong> above to create your RTI application letter.
                  </div>
                )}
              </div>

              {error && <div style={{ color:RED, marginBottom:12, fontSize:13, padding:'10px 14px', background:`${RED}10`, borderRadius:8, border:`1px solid ${RED}25` }}>{error}</div>}
              <div style={{ display:'flex', gap:12 }}>
                <button onClick={()=>setStep('ai')} style={{ padding:'14px 20px', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.6)', border:`1px solid ${BDIM}`, borderRadius:12, cursor:'pointer', fontWeight:700 }}>← Back</button>
                <button onClick={doSubmit} disabled={submitting} style={{ flex:1, padding:16, background:`linear-gradient(135deg,${GREEN},${CYAN}88)`, color:'#fff', border:'none', borderRadius:12, fontWeight:800, cursor:'pointer', fontSize:15, boxShadow:`0 8px 24px ${GREEN}30`, opacity:submitting?0.7:1, transition:'all 0.3s' }}>
                  {submitting ? 'Submitting...' : '✅ Confirm & Submit Legal Document'}
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ background:SURF, borderRadius:20, border:`1px solid ${BDIM}`, padding:24, position:'sticky', top:88 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:16 }}>Filing Summary</div>
              {[['Category',aiResult?.category||form.category],['Severity',aiResult?.severity||'MEDIUM'],['Authority',aiResult?.authority||'—'],['Location',form.location||'Not specified'],['Applicant',userInfo.name||'Not set'],['Evidence',(aiResult?.evidenceFlags||[]).length+' item(s)']].map(([k,v])=>(
                <div key={k} style={{ padding:'10px 0', borderBottom:`1px solid ${BDIM}` }}>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginBottom:3 }}>{k}</div>
                  <div style={{ fontSize:13, fontWeight:600, color: k==='Applicant'&&!userInfo.name?AMBER:'rgba(255,255,255,0.85)', wordBreak:'break-word' }}>{v}</div>
                </div>
              ))}
              <div style={{ marginTop:16, padding:14, background:`${GREEN}08`, borderRadius:10, border:`1px solid ${GREEN}20` }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>Response Deadline</div>
                <div style={{ fontWeight:800, fontSize:22, color:GREEN }}>30 Days</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:2 }}>Under RTI Act, 2005</div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: SUCCESS ── */}
        {step==='done' && result && (
          <div style={{ maxWidth:580, margin:'0 auto', textAlign:'center', padding:'40px 0' }}>
            <div style={{ width:90, height:90, borderRadius:'50%', margin:'0 auto 28px', background:`${GREEN}15`, border:`2px solid ${GREEN}40`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name="check" size={40} color={GREEN} sw={2.5} />
            </div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:32, marginBottom:8 }}>Filed Successfully! 🎉</h2>
            <p style={{ color:'rgba(255,255,255,0.45)', marginBottom:32 }}>Your RTI complaint has been formally submitted and is being tracked.</p>
            <div style={{ background:SURF, border:`1px solid ${BDIM}`, borderRadius:16, padding:28, textAlign:'left', marginBottom:24 }}>
              {[['Tracking ID',result.trackingId,CYAN],['Status',result.status,GREEN],['Severity',result.severity,SEV_COLOR[result.severity]||AMBER],['Category',result.category,'#fff'],['Authority',result.authority,'rgba(255,255,255,0.7)'],['Next Follow-up','7 days reminder auto-scheduled',AMBER]].map(([k,v,c])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${BDIM}` }}>
                  <span style={{ color:'rgba(255,255,255,0.4)', fontSize:13 }}>{k}</span>
                  <span style={{ color:c, fontWeight:700, fontSize:13 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={()=>navigate('track')} style={{ flex:1, padding:14, background:BLUE, color:'#fff', border:'none', borderRadius:12, fontWeight:700, cursor:'pointer', boxShadow:`0 8px 20px ${BLUE}40` }}>📊 Track Status</button>
              <button onClick={()=>{ closeCamera(); setStep('input'); setForm({description:'',category:CATEGORIES[0],location:''}); setAiResult(null); setResult(null); setOtpVerified(false); setCaptchaPassed(false); setOtp(''); setLegalDraft(''); setShowDraft(false); setImageFile(null); setImagePreview(null); setVoiceTranscript(''); setGeoCoords(null); finalTranscriptRef.current='' }} style={{ flex:1, padding:14, background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.6)', border:`1px solid ${BDIM}`, borderRadius:12, fontWeight:700, cursor:'pointer' }}>+ New Complaint</button>
            </div>
          </div>
        )}
      </section>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin  { to{transform:rotate(360deg)} }
        .page-enter { animation: fade 0.4s ease; }
        @keyframes fade { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}
