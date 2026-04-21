import { useState, useRef, useCallback } from 'react';

/**
 * useVoiceRecorder
 * Manages browser SpeechRecognition with:
 *  - Mic permission check
 *  - Multi-language support (en-IN, hi-IN, en-US)
 *  - Ref-based transcript to avoid closure bugs
 *  - Human-readable per-error-code messages
 */
export function useVoiceRecorder() {
  const recRef              = useRef(null);
  const finalTranscriptRef  = useRef(''); // avoids stale closure on restart

  const [isRecording,     setIsRecording]     = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceLang,       setVoiceLang]       = useState('en-IN');
  const [voiceError,      setVoiceError]      = useState('');

  const LANG_OPTIONS = [
    ['en-IN', '🇮🇳 English (India)'],
    ['hi-IN', '🇮🇳 हिन्दी'],
    ['en-US', '🇺🇸 English (US)'],
  ];

  const ERROR_MSG = {
    'not-allowed':         'Microphone access denied. Click the 🔒 icon in the address bar and allow microphone.',
    'no-speech':           'No speech detected. Please speak clearly and try again.',
    'audio-capture':       'No microphone found. Please connect a microphone and try again.',
    'network':             'Network error during speech recognition. Check your connection.',
    'aborted':             'Recording stopped.',
    'service-not-allowed': 'Speech service blocked. Try on Chrome/Edge or allow the permission.',
  };

  const startRecording = useCallback(async () => {
    setVoiceError('');

    // 1. Check mic permission
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setVoiceError('Microphone access denied. Please allow microphone permission in your browser settings.');
      return;
    }

    // 2. Check browser support
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setVoiceError('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const r          = new SR();
    r.continuous     = true;
    r.interimResults = true;
    r.lang           = voiceLang;

    r.onresult = e => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscriptRef.current += e.results[i][0].transcript + ' ';
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      setVoiceTranscript(finalTranscriptRef.current + interim);
    };

    r.onerror = e => {
      setVoiceError(ERROR_MSG[e.error] || `Speech error: ${e.error}`);
      setIsRecording(false);
    };

    r.onend = () => setIsRecording(false);

    recRef.current = r;
    r.start();
    setIsRecording(true);
  }, [voiceLang]); // eslint-disable-line react-hooks/exhaustive-deps

  const stopRecording = useCallback(() => {
    recRef.current?.stop();
    setIsRecording(false);
  }, []);

  const clearTranscript = useCallback(() => {
    finalTranscriptRef.current = '';
    setVoiceTranscript('');
  }, []);

  // Allow external edit of transcript (e.g. user types in textarea)
  const updateTranscript = useCallback(text => {
    finalTranscriptRef.current = text;
    setVoiceTranscript(text);
  }, []);

  return {
    isRecording, voiceTranscript, voiceLang, voiceError,
    LANG_OPTIONS,
    setVoiceLang,
    startRecording, stopRecording, clearTranscript, updateTranscript,
  };
}
