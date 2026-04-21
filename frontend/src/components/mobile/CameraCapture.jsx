import React, { useRef } from 'react';
import { useCamera } from '../../hooks/useCamera';

const BLUE = '#1a56e8';
const CYAN = '#00c2e0';
const RED  = '#ef4444';
const BDIM = 'rgba(255,255,255,0.08)';

/**
 * CameraCapture
 * Renders the full Image input panel.
 * On mobile: "Take Photo" triggers the native camera via <input capture="environment">.
 * On desktop: "Open Camera" opens a live getUserMedia preview with a shutter button.
 *
 * Props:
 *   imageFile    — current File object (or null)
 *   imagePreview — current data URL preview (or null)
 *   onImage      — callback(File) called when a new image is selected/captured
 */
export default function CameraCapture({ imageFile, imagePreview, onImage }) {
  const fileRef = useRef(null);
  const { videoRef, canvasRef, cameraOpen, cameraError, isMobile, openCamera, capturePhoto, closeCamera } = useCamera();

  const handleCapture = async () => {
    const file = await capturePhoto();
    if (file) onImage(file);
  };

  const handleRemove = () => onImage(null);

  return (
    <div>
      {/* ── Live camera view (desktop) ── */}
      {cameraOpen ? (
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#000' }}>
          <video ref={videoRef} autoPlay playsInline muted
            style={{ width: '100%', maxHeight: 320, objectFit: 'cover', display: 'block' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Close button */}
          <button onClick={closeCamera} style={{
            position: 'absolute', top: 12, right: 12,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(0,0,0,0.65)', border: 'none',
            color: '#fff', cursor: 'pointer', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>

          {/* Shutter button */}
          <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <button onClick={handleCapture} style={{
              width: 70, height: 70, borderRadius: '50%',
              background: '#fff', border: '4px solid rgba(255,255,255,0.4)',
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              fontSize: 30, lineHeight: '70px', textAlign: 'center',
            }}>📸</button>
          </div>

          <div style={{
            position: 'absolute', top: 12, left: 0, right: 0,
            textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.65)',
            pointerEvents: 'none',
          }}>Tap 📸 to capture</div>
        </div>

      ) : imagePreview ? (
        /* ── Photo preview ── */
        <div>
          <img src={imagePreview} alt="preview"
            style={{ width: '100%', maxHeight: 260, borderRadius: 14, objectFit: 'cover', display: 'block' }} />
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button onClick={handleRemove} style={{
              flex: 1, padding: '10px 0', background: 'rgba(255,255,255,0.05)',
              color: RED, border: `1px solid ${RED}30`, borderRadius: 10,
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}>🗑 Remove</button>
            <button onClick={isMobile ? () => fileRef.current?.click() : openCamera} style={{
              flex: 1, padding: '10px 0', background: 'rgba(255,255,255,0.05)',
              color: CYAN, border: `1px solid ${CYAN}30`, borderRadius: 10,
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}>🔄 Retake</button>
          </div>
        </div>

      ) : (
        /* ── No image yet: options panel ── */
        <div>
          {/* Take Photo / Open Camera */}
          <button onClick={isMobile ? () => fileRef.current?.click() : openCamera} style={{
            width: '100%', padding: 20,
            background: `linear-gradient(135deg,${BLUE}22,${CYAN}11)`,
            border: `1px solid ${CYAN}30`, borderRadius: 14,
            cursor: 'pointer', marginBottom: 12,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 36 }}>📷</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>
              {isMobile ? 'Take Photo' : 'Open Camera'}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              {isMobile ? 'Opens your rear camera directly' : 'Live camera preview in browser'}
            </span>
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 1, background: BDIM }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: BDIM }} />
          </div>

          {/* Upload from gallery / drag-drop */}
          <div onClick={() => fileRef.current?.click()}
            onDrop={e => { e.preventDefault(); onImage(e.dataTransfer.files[0]); }}
            onDragOver={e => e.preventDefault()}
            style={{
              border: `2px dashed ${BDIM}`, padding: 24, textAlign: 'center',
              borderRadius: 14, cursor: 'pointer', background: 'rgba(255,255,255,0.01)',
            }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⬆️</div>
            <p style={{ color: 'rgba(255,255,255,0.35)', margin: 0, fontSize: 13 }}>
              {isMobile ? 'Upload from Gallery' : 'Drop image here or click to upload'}
            </p>
          </div>

          {/* Mobile tip */}
          {isMobile && (
            <div style={{
              marginTop: 12, padding: '10px 14px',
              background: 'rgba(255,193,7,0.05)', border: '1px solid rgba(255,193,7,0.15)',
              borderRadius: 8, fontSize: 11, color: 'rgba(255,255,255,0.4)',
            }}>
              📱 "Take Photo" opens your rear camera directly on Android / iPhone.
            </div>
          )}
        </div>
      )}

      {/* Hidden file input — capture=environment triggers native camera on mobile */}
      <input ref={fileRef} type="file" accept="image/*"
        capture={isMobile ? 'environment' : undefined}
        onChange={e => onImage(e.target.files[0])}
        style={{ display: 'none' }} />

      {/* Camera error */}
      {cameraError && (
        <div style={{
          marginTop: 12, padding: '10px 14px',
          background: `${RED}10`, border: `1px solid ${RED}25`,
          borderRadius: 8, fontSize: 12, color: RED,
        }}>⚠️ {cameraError}</div>
      )}
    </div>
  );
}
