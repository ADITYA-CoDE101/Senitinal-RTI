import { useState, useCallback } from 'react';

/**
 * useGeoDetect
 * Detects user location using a 2-layer strategy:
 *  1. GPS (navigator.geolocation) with Nominatim reverse geocoding
 *  2. IP-based fallback (ipapi.co) when GPS is denied/unavailable
 */
export function useGeoDetect() {
  const [geoCoords,  setGeoCoords]  = useState(null);   // { lat, lng }
  const [geoLabel,   setGeoLabel]   = useState('');     // human-readable address
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError,   setGeoError]   = useState('');
  const [geoMethod,  setGeoMethod]  = useState(null);   // 'gps' | 'ip' | null

  const detectLocation = useCallback(async (onLocationDetected) => {
    setGeoLoading(true);
    setGeoError('');

    // ── Layer 1: GPS ─────────────────────────────────────────────
    if (navigator.geolocation) {
      try {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0,
          })
        );
        const { latitude: lat, longitude: lng } = pos.coords;
        setGeoCoords({ lat, lng });
        setGeoMethod('gps');

        // Reverse geocode with free Nominatim (no API key needed)
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const d = await r.json();
          const a = d.address;
          const label = [
            a.neighbourhood || a.suburb,
            a.city || a.town || a.village,
            a.state_district || a.county,
            a.state,
          ].filter(Boolean).join(', ');
          const finalLabel = label || `${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`;
          setGeoLabel(finalLabel);
          onLocationDetected?.({ lat, lng, label: finalLabel });
        } catch {
          const fallLabel = `${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`;
          setGeoLabel(fallLabel);
          onLocationDetected?.({ lat, lng, label: fallLabel });
        }

        setGeoLoading(false);
        return;
      } catch (gpsErr) {
        // Show contextual error while we try IP fallback
        const code = gpsErr.code;
        if (code === 1) {
          // Permission denied — fall through silently to IP
        } else if (code === 2) {
          setGeoError('GPS unavailable — trying network location...');
        } else if (code === 3) {
          setGeoError('GPS timed out — trying network location...');
        }
      }
    }

    // ── Layer 2: IP-based (free, no key needed) ──────────────────
    try {
      const r = await fetch('https://ipapi.co/json/');
      const d = await r.json();
      if (d.latitude && d.longitude) {
        const lat   = d.latitude;
        const lng   = d.longitude;
        const label = [d.city, d.region, d.country_name].filter(Boolean).join(', ');
        setGeoCoords({ lat, lng });
        setGeoLabel(label);
        setGeoMethod('ip');
        setGeoError('');  // clear previous error
        onLocationDetected?.({ lat, lng, label });
        setGeoLoading(false);
        return;
      }
    } catch {
      // IP API also failed
    }

    setGeoError('Could not detect location automatically. Please type your location below.');
    setGeoLoading(false);
  }, []);

  const clearLocation = useCallback(() => {
    setGeoCoords(null);
    setGeoLabel('');
    setGeoMethod(null);
    setGeoError('');
  }, []);

  return {
    geoCoords, geoLabel, geoLoading, geoError, geoMethod,
    detectLocation, clearLocation,
  };
}
