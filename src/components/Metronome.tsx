import React, { useEffect, useMemo, useState } from 'react';
import * as Tone from 'tone';

interface MetronomeProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  isPlaying: boolean;
  countInBars?: number;
  onCountInStart?: () => void;
  onCountInComplete?: () => void;
  silent?: boolean;
}

const Metronome: React.FC<MetronomeProps> = ({ 
  bpm, 
  onBpmChange, 
  isPlaying, 
  countInBars = 0,
  onCountInStart,
  onCountInComplete,
  silent = false
}) => {
  const [activeBeat, setActiveBeat] = useState(0);
  const [isCountingInInternal, setIsCountingInInternal] = useState(false);
  const [beatsLeft, setBeatsLeft] = useState(0);

  // Refined synth for a "woodblock" or "click" sound
  const clickSynth = useMemo(() => new Tone.Synth({
    oscillator: {
      type: "triangle"
    },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0,
      release: 0.1
    }
  }).toDestination(), []);

  // Add a bit of "noise" for a more organic click
  const noiseSynth = useMemo(() => new Tone.NoiseSynth({
    noise: {
      type: "white"
    },
    envelope: {
      attack: 0.001,
      decay: 0.01,
      sustain: 0
    }
  }).toDestination(), []);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    let loop: Tone.Loop | null = null;
    let beatsPlayed = 0;
    const totalCountInBeats = countInBars * 4;

    if (isPlaying) {
      Tone.start();
      Tone.Transport.start();

      Tone.Draw.schedule(() => {
        if (totalCountInBeats > 0) {
          setIsCountingInInternal(true);
          setBeatsLeft(totalCountInBeats);
          onCountInStart?.();
        } else {
          setIsCountingInInternal(false);
          onCountInComplete?.();
        }
      }, Tone.now());

      loop = new Tone.Loop((time) => {
        // Handle visual update and state transition
        Tone.Draw.schedule(() => {
          setActiveBeat(beatsPlayed % 4);
          
          if (beatsPlayed < totalCountInBeats) {
            setBeatsLeft(totalCountInBeats - beatsPlayed);
          } else if (beatsPlayed === totalCountInBeats) {
            setIsCountingInInternal(false);
            setBeatsLeft(0);
            onCountInComplete?.();
          }
        }, time);

        // Play click sound if not silent
        if (!silent) {
          const freq = (beatsPlayed % 4) === 0 ? "C6" : "C5";
          clickSynth.triggerAttackRelease(freq, "32n", time);
          noiseSynth.triggerAttack(time);
        }
        
        beatsPlayed++;
      }, "4n");

      loop.start(0);
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      Tone.Draw.schedule(() => {
        setActiveBeat(0);
        setIsCountingInInternal(false);
        setBeatsLeft(0);
        onCountInComplete?.();
      }, Tone.now());
    }

    return () => {
      if (loop) loop.dispose();
    };
  }, [isPlaying, clickSynth, noiseSynth, countInBars, onCountInStart, onCountInComplete, silent]);

  return (
    <div className="metronome">
      {isCountingInInternal && (
        <div className="count-in-overlay" style={{ 
          fontSize: '1.2rem', 
          fontWeight: 'bold', 
          color: '#ff4757',
          marginBottom: '5px',
          animation: 'pulse 0.5s infinite alternate'
        }}>
          {beatsLeft > 4 
            ? `Ready: ${Math.ceil(beatsLeft / 4)} Bars` 
            : `Go: ${beatsLeft}`
          }
        </div>
      )}
      <div className="metronome-visual">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`beat-indicator ${isPlaying && activeBeat === i ? 'active' : ''}`} 
          />
        ))}
      </div>
      <div className="metronome-controls">
        <input 
          type="range" 
          min="40" 
          max="240" 
          value={bpm} 
          onChange={(e) => onBpmChange(parseInt(e.target.value))} 
        />
        <span>{bpm} BPM</span>
      </div>
    </div>
  );
};

export default Metronome;
