import React, { useState, useEffect, useMemo } from 'react';
import * as Tone from 'tone';

interface MetronomeProps {
  initialBpm?: number;
}

const Metronome: React.FC<MetronomeProps> = ({ initialBpm = 100 }) => {
  const [bpm, setBpm] = useState(initialBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBeat, setActiveBeat] = useState(0);

  // Use useMemo to ensure synth is created only once
  const synth = useMemo(() => new Tone.MembraneSynth().toDestination(), []);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    const loop = new Tone.Loop((time) => {
      // Use Tone.Draw to sync state updates with audio timing
      Tone.Draw.schedule(() => {
        setActiveBeat((prev) => (prev + 1) % 4);
      }, time);

      synth.triggerAttackRelease(activeBeat === 0 ? "C3" : "C2", "8n", time);
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
  }, [isPlaying, synth, activeBeat]);

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
          onChange={(e) => setBpm(parseInt(e.target.value))} 
        />
        <span>{bpm} BPM</span>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default Metronome;
