import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * useCamera
 * Manages the device camera stream, photo capture, and cleanup.
 * Works on both desktop (getUserMedia live preview) and Android/iOS (capture attr).
 */
export function useCamera() {
  const videoRef   = useRef(null);
  const streamRef  = useRef(null);
  const canvasRef  = useRef(null);

  const [cameraOpen,  setCameraOpen]  = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isMobile] = useState(
    () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  );

  // Stop all tracks when component using this hook unmounts
  useEffect(() => {
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  const openCamera = useCallback(async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
      // Attach after render cycle
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (e) {
      const MSG = {
        NotAllowedError:     'Camera access denied. Click the 🔒 icon in the address bar and allow camera.',
        NotFoundError:       'No camera found on this device.',
        NotReadableError:    'Camera is in use by another app. Close it and try again.',
        OverconstrainedError:'Camera does not support the required resolution.',
      };
      setCameraError(MSG[e.name] || `Camera error: ${e.message}`);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    return new Promise(resolve => {
      if (!videoRef.current || !canvasRef.current) { resolve(null); return; }
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      canvas.toBlob(blob => {
        if (!blob) { resolve(null); return; }
        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
        resolve(file);
        closeCamera();
      }, 'image/jpeg', 0.92);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const closeCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
  }, []);

  return { videoRef, canvasRef, cameraOpen, cameraError, isMobile, openCamera, capturePhoto, closeCamera };
}
