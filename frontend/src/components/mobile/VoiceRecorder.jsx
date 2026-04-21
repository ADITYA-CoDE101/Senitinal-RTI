import React from 'react';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';

const BLUE = '#1a56e8';
const CYAN = '#00c2e0';
const RED  = '#ef4444';
const BDIM = 'rgba(255,255,255,0.08)';

/**
 * VoiceRecorder
 * Full voice input panel with language picker, animated mic button,
 * real-time transcript textarea (editable), word count, and clear button.
 *
 * Props:
 *   onTranscriptChange — callback(text) fired whenever transcript updates
 *   transcript         — controlled transcript value (pass voiceTranscript state from parent)
 */
export default function VoiceRecorder({ onTranscriptChange, transcript: externalTranscript }) {
  const {
    isRecording, voiceTranscript, voiceLang, voiceError,
    LANG_OPTIONS, setVoiceLang,
    startRecording, stopRecording, clearTranscript, updateTranscript,
  } = useVoiceRecorder();

  // Keep parent in sync
  React.useEffect(() => {
    onTranscriptChange?.(voiceTranscript);
  }, [voiceTranscript]); // eslint-disable-line react-hooks/exhaustive-deps

  const wordCount = (voiceTranscript || '').trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={{ padding: '20px 8px' }}>

      {/* ── Language Selector ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {LANG_OPTIONS.map(([code, label]) => (
          <button key={code}
            onClick={() => { if (!isRecording) setVoiceLang(code); }}
            style={{
              padding: '6px 14px', borderRadius: 20,
              border: `1px solid ${voiceLang === code ? CYAN : BDIM}`,
              background: voiceLang === code ? `${CYAN}15` : 'transparent',
              color: voiceLang === code ? CYAN : 'rgba(255,255,255,0.4)',
              fontSize: 12, fontWeight: 600,
              cursor: isRecording ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Mic Button ── */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            width: 88, height: 88, borderRadius: '50%',
            background: isRecording ? RED : BLUE,
            border: 'none', cursor: 'pointer',
            boxShadow: isRecording
              ? `0 0 0 12px ${RED}18, 0 0 0 24px ${RED}08`
              : `0 8px 28px ${BLUE}50`,
            transition: 'all 0.3s',
            animation: isRecording ? 'pulse 1.5s infinite' : 'none',
            fontSize: 32,
          }}>
          🎙
        </button>
        <p style={{
          marginTop: 14, fontSize: 13, fontWeight: 600,
          color: isRecording ? RED : 'rgba(255,255,255,0.4)',
        }}>
          {isRecording ? '🔴 Listening… click to stop' : 'Click mic to start recording'}
        </p>
        {isRecording && (
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>
            Speaking in:{' '}
            {voiceLang === 'hi-IN' ? 'हिन्दी' : voiceLang === 'en-US' ? 'English (US)' : 'English (India)'}
          </p>
        )}
      </div>

      {/* ── Transcript Box ── */}
      {voiceTranscript ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase', letterSpacing: 1.5,
            }}>Transcript</div>
            <button onClick={clearTranscript} style={{
              fontSize: 11, color: RED, background: 'transparent',
              border: 'none', cursor: 'pointer', fontWeight: 600,
            }}>✕ Clear</button>
          </div>
          <textarea
            value={voiceTranscript}
            onChange={e => updateTranscript(e.target.value)}
            style={{
              width: '100%', minHeight: 110, padding: 14,
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${BDIM}`, borderRadius: 12,
              color: 'rgba(255,255,255,0.85)', fontSize: 14,
              lineHeight: 1.75, resize: 'vertical', outline: 'none',
              fontFamily: "'DM Sans',sans-serif",
            }}
            placeholder="Your speech will appear here. You can also type to edit it."
          />
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>
            {wordCount} word{wordCount !== 1 ? 's' : ''} · You can edit the transcript before analyzing
          </div>
        </div>
      ) : (
        <div style={{
          padding: '14px 20px',
          background: 'rgba(255,255,255,0.02)',
          border: `1px dashed ${BDIM}`, borderRadius: 12,
          textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 13,
        }}>
          Your spoken complaint will appear here in real-time
        </div>
      )}

      {/* ── Voice Error ── */}
      {voiceError && (
        <div style={{
          marginTop: 12, padding: '10px 14px',
          background: `${RED}10`, border: `1px solid ${RED}25`,
          borderRadius: 8, fontSize: 12, color: RED,
        }}>⚠️ {voiceError}</div>
      )}

      {/* ── Browser Tip ── */}
      <div style={{
        marginTop: 14, padding: '10px 14px',
        background: 'rgba(255,193,7,0.05)', border: '1px solid rgba(255,193,7,0.15)',
        borderRadius: 8, fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6,
      }}>
        💡 Voice recognition works best on <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Chrome</strong> or{' '}
        <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Edge</strong>. Allow microphone when prompted.
        Also works on Android Chrome.
      </div>
    </div>
  );
}
