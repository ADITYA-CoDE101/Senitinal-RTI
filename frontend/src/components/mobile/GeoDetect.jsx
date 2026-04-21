import React from 'react';
import { useGeoDetect } from '../../hooks/useGeoDetect';

const BLUE  = '#1a56e8';
const CYAN  = '#00c2e0';
const GREEN = '#0ec98c';
const RED   = '#ef4444';
const BDIM  = 'rgba(255,255,255,0.08)';

/**
 * GeoDetect
 * Location detection panel.
 * Tries GPS first → Nominatim reverse geocode → ipapi.co IP fallback.
 *
 * Props:
 *   onLocationDetected — callback({ lat, lng, label }) when location is found
 */
export default function GeoDetect({ onLocationDetected }) {
  const {
    geoCoords, geoLabel, geoLoading, geoError, geoMethod,
    detectLocation, clearLocation,
  } = useGeoDetect();

  const handleDetect = () => detectLocation(onLocationDetected);

  const handleClear = () => {
    clearLocation();
    onLocationDetected?.(null);
  };

  return (
    <div style={{ padding: '24px 16px' }}>

      {/* ── Detect Button ── */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <button
          onClick={handleDetect}
          disabled={geoLoading}
          style={{
            padding: '14px 32px',
            background: geoLoading ? 'rgba(255,255,255,0.06)' : BLUE,
            color: '#fff', borderRadius: 12, border: 'none',
            cursor: geoLoading ? 'not-allowed' : 'pointer',
            fontWeight: 700, fontSize: 14,
            boxShadow: geoLoading ? 'none' : `0 8px 20px ${BLUE}40`,
            transition: 'all 0.3s',
            display: 'inline-flex', alignItems: 'center', gap: 10,
          }}>
          {geoLoading ? (
            <>
              <span style={{
                width: 16, height: 16,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff', borderRadius: '50%',
                display: 'inline-block', animation: 'spin 0.8s linear infinite',
              }} />
              Detecting location...
            </>
          ) : '📍 Auto-Detect My Location'}
        </button>
      </div>

      {/* ── Permission Tip (shown before any detection) ── */}
      {!geoCoords && !geoLoading && !geoError && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.2)',
          borderRadius: 10, marginBottom: 16,
          fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6,
        }}>
          <strong style={{ color: 'rgba(255,193,7,0.8)' }}>💡 Tip:</strong> If your browser asks for
          location permission, click <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Allow</strong>.
          If GPS is blocked, we'll automatically detect your city via your network connection.
        </div>
      )}

      {/* ── Loading Status ── */}
      {geoLoading && (
        <div style={{
          padding: '12px 16px',
          background: `${CYAN}08`, border: `1px solid ${CYAN}20`,
          borderRadius: 10, marginBottom: 16,
          fontSize: 13, color: CYAN, textAlign: 'center',
        }}>
          Trying GPS → will fall back to network location if needed…
        </div>
      )}

      {/* ── Success Card ── */}
      {geoCoords && (
        <div style={{
          padding: 18,
          background: `${GREEN}08`, border: `1px solid ${GREEN}25`,
          borderRadius: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>✅</span>
              <span style={{ fontWeight: 700, color: GREEN, fontSize: 14 }}>Location Detected</span>
            </div>
            <button onClick={handleClear} style={{
              fontSize: 11, color: 'rgba(255,255,255,0.3)',
              background: 'transparent', border: 'none', cursor: 'pointer',
            }}>✕ Clear</button>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>
            📍 {geoLabel}
          </div>
          <div style={{
            fontSize: 11, color: 'rgba(255,255,255,0.3)',
            fontFamily: "'Space Mono',monospace",
          }}>
            Lat: {geoCoords.lat?.toFixed(5)}° · Lng: {geoCoords.lng?.toFixed(5)}°
            {geoMethod && (
              <span style={{ marginLeft: 10, color: geoMethod === 'gps' ? GREEN : CYAN }}>
                via {geoMethod === 'gps' ? '🛰 GPS' : '🌐 Network'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {geoError && (
        <div style={{
          padding: '10px 14px',
          background: `${RED}08`, border: `1px solid ${RED}20`,
          borderRadius: 8, fontSize: 12, color: RED, marginTop: 12,
        }}>⚠️ {geoError}</div>
      )}
    </div>
  );
}
