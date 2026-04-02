import React, { useEffect, useRef, useState } from 'react';

interface AudioInputProps {
  onNoteDetected: (note: number) => void;
  onNoteLost: (note: number) => void;
  isActive: boolean;
}

const AudioInput: React.FC<AudioInputProps> = ({ onNoteDetected, onNoteLost, isActive }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const lastNoteRef = useRef<number | null>(null);
  const [isMicReady, setIsMicReady] = useState(false);

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      setIsMicReady(true);
      detectPitch();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const detectPitch = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyserRef.current.getFloatTimeDomainData(buffer);

    const frequency = autoCorrelate(buffer, audioContextRef.current!.sampleRate);

    if (frequency !== -1) {
      const midiNote = Math.round(12 * (Math.log2(frequency / 440)) + 69);
      
      if (midiNote !== lastNoteRef.current) {
        if (lastNoteRef.current !== null) {
          onNoteLost(lastNoteRef.current);
        }
        onNoteDetected(midiNote);
        lastNoteRef.current = midiNote;
      }
    } else if (lastNoteRef.current !== null) {
      onNoteLost(lastNoteRef.current);
      lastNoteRef.current = null;
    }

    animationFrameRef.current = requestAnimationFrame(detectPitch);
  };

  // Standard Autocorrelation algorithm to find fundamental frequency
  const autoCorrelate = (buffer: Float32Array, sampleRate: number) => {
    let size = buffer.length;
    let rms = 0;

    for (let i = 0; i < size; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / size);
    if (rms < 0.01) return -1; // Too quiet

    let r1 = 0, r2 = size - 1, thres = 0.2;
    for (let i = 0; i < size / 2; i++) {
      if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
    }
    for (let i = 1; i < size / 2; i++) {
      if (Math.abs(buffer[size - i]) < thres) { r2 = size - i; break; }
    }

    buffer = buffer.slice(r1, r2);
    size = buffer.length;

    let c = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - i; j++) {
        c[i] = c[i] + buffer[j] * buffer[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < size; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    return sampleRate / T0;
  };

  useEffect(() => {
    if (isActive) {
      startAudio();
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (audioContextRef.current) audioContextRef.current.close();
      setIsMicReady(false);
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, [isActive]);

  return (
    <div className="audio-input-status" style={{ fontSize: '0.8rem', color: isMicReady ? '#2ecc71' : '#e74c3c' }}>
      {isActive ? (isMicReady ? '● Audio Input Active' : 'Connecting Audio...') : '○ Audio Input Disabled'}
    </div>
  );
};

export default AudioInput;
