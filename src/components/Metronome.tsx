import React, { useEffect, useMemo, useState } from 'react';
import * as Tone from 'tone';

interface MetronomeProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  isPlaying: boolean;
  onToggle: (isPlaying: boolean) => void;
}

const Metronome: React.FC<MetronomeProps> = ({ bpm, onBpmChange, isPlaying, onToggle }) => {
  const [activeBeat, setActiveBeat] = useState(0);

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
    const loop = new Tone.Loop((time) => {
      Tone.Draw.schedule(() => {
        setActiveBeat((prev) => (prev + 1) % 4);
      }, time);

      // Play both a tone and a noise "click" for a more realistic feel
      const freq = activeBeat === 0 ? "C6" : "C5";
      clickSynth.triggerAttackRelease(freq, "32n", time);
      noiseSynth.triggerAttack(time);
    }, "4n");

    if (isPlaying) {
      Tone.start();
      Tone.Transport.start();
      loop.start(0);
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      setActiveBeat(0);
    }

    return () => {
      loop.dispose();
    };
  }, [isPlaying, clickSynth, noiseSynth, activeBeat]);

  return (
    <div className="metronome">
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
        <button onClick={() => onToggle(!isPlaying)}>
          {isPlaying ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default Metronome;
