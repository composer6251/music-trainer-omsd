import React, { useEffect, useMemo, useState } from 'react';
import * as Tone from 'tone';
import type { TimeSignature } from '../utils/musicXmlGenerator';
import type { Subdivision, BeatLabel } from '../types/theory';

interface MetronomeProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  isPlaying: boolean;
  timeSignature: TimeSignature;
  countInBars?: number;
  onCountInStart?: () => void;
  onCountInComplete?: () => void;
  onBeatUpdate?: (activeSubBeat: number, labels: BeatLabel[]) => void;
  silent?: boolean;
}

const Metronome: React.FC<MetronomeProps> = ({ 
  bpm, 
  onBpmChange, 
  isPlaying, 
  timeSignature,
  countInBars = 0,
  onCountInStart,
  onCountInComplete,
  onBeatUpdate,
  silent = false
}) => {
  const [visualSubdivision, setVisualSubdivision] = useState<Subdivision>('1/4');
  const [clickSubdivision, setClickSubdivision] = useState<Subdivision>('1/4');
  const [matchSubdivision, setMatchSubdivision] = useState(false);
  const [activeSubBeat, setActiveSubBeat] = useState(0); // Index in the full label list
  
  const [isCountingInInternal, setIsCountingInInternal] = useState(false);
  const [beatsLeft, setBeatsLeft] = useState(0);

  // Refs for callbacks to avoid loop restarts
  const onCountInStartRef = React.useRef(onCountInStart);
  const onCountInCompleteRef = React.useRef(onCountInComplete);
  const onBeatUpdateRef = React.useRef(onBeatUpdate);

  useEffect(() => { onCountInStartRef.current = onCountInStart; }, [onCountInStart]);
  useEffect(() => { onCountInCompleteRef.current = onCountInComplete; }, [onCountInComplete]);
  useEffect(() => { onBeatUpdateRef.current = onBeatUpdate; }, [onBeatUpdate]);

  // Parse time signature
  const [numerator, denominator] = useMemo(() => 
    timeSignature.split('/').map(Number), 
    [timeSignature]
  );

  // Generate labels based on numerator and visualSubdivision
  const labels = useMemo(() => {
    const list: BeatLabel[] = [];
    for (let i = 1; i <= numerator; i++) {
      list.push({ text: i.toString(), isNumeral: true, subIndex: 0 });
      
      if (visualSubdivision === '1/8') {
        list.push({ text: '&', isNumeral: false, subIndex: 1 });
      } else if (visualSubdivision === '1/8 triplet') {
        list.push({ text: '&', isNumeral: false, subIndex: 1 });
        list.push({ text: 'a', isNumeral: false, subIndex: 2 });
      } else if (visualSubdivision === '1/16') {
        list.push({ text: 'e', isNumeral: false, subIndex: 1 });
        list.push({ text: '&', isNumeral: false, subIndex: 2 });
        list.push({ text: 'a', isNumeral: false, subIndex: 3 });
      }
    }
    return list;
  }, [numerator, visualSubdivision]);

  // Sync state with parent when beat or labels change
  useEffect(() => {
    onBeatUpdate?.(activeSubBeat, labels);
  }, [activeSubBeat, labels, onBeatUpdate]);

  // Refined synth for a "woodblock" or "click" sound
  const clickSynth = useMemo(() => new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
  }).toDestination(), []);

  const noiseSynth = useMemo(() => new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.01, sustain: 0 }
  }).toDestination(), []);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  // Sync matchSubdivision
  useEffect(() => {
    if (matchSubdivision) {
      setClickSubdivision(visualSubdivision);
    }
  }, [matchSubdivision, visualSubdivision]);

  useEffect(() => {
    let loop: Tone.Loop | null = null;
    let ticksPlayed = 0;
    
    // Determine tick rate based on clickSubdivision
    // 4/4 time, 1/4 = "4n", 1/8 = "8n", 1/8 triplet = "8t", 1/16 = "16n"
    const subdivisionToTone = {
      '1/4': '4n',
      '1/8': '8n',
      '1/8 triplet': '8t',
      '1/16': '16n'
    };
    
    // For visual update, we need to know how many ticks per "beat" (numeral)
    const subdivisionToTickCount = {
      '1/4': 1,
      '1/8': 2,
      '1/8 triplet': 3,
      '1/16': 4
    };

    const visualTicksPerBeat = subdivisionToTickCount[visualSubdivision];
    const clickTicksPerBeat = subdivisionToTickCount[clickSubdivision];
    const totalVisualTicks = numerator * visualTicksPerBeat;
    const totalCountInTicks = countInBars * numerator * clickTicksPerBeat;

    if (isPlaying) {
      Tone.start();
      Tone.Transport.start();

      Tone.Draw.schedule(() => {
        if (totalCountInTicks > 0) {
          setIsCountingInInternal(true);
          setBeatsLeft(countInBars * numerator);
          onCountInStartRef.current?.();
        } else {
          setIsCountingInInternal(false);
          onCountInCompleteRef.current?.();
        }
      }, Tone.now());

      loop = new Tone.Loop((time) => {
        // Handle visual update and state transition
        Tone.Draw.schedule(() => {
          // Calculate which visual label should be active
          // This is tricky if click and visual subdivisions differ
          // We normalize everything to 12 ticks per beat (LCM of 1, 2, 3, 4)
          const ticksInBeat = (ticksPlayed % clickTicksPerBeat) / clickTicksPerBeat;
          const currentBeat = Math.floor(ticksPlayed / clickTicksPerBeat) % numerator;
          const visualSubInBeat = Math.floor(ticksInBeat * visualTicksPerBeat);
          
          let visualIndex = 0;
          for(let b=0; b<currentBeat; b++) visualIndex += visualTicksPerBeat;
          visualIndex += visualSubInBeat;

          setActiveSubBeat(visualIndex % totalVisualTicks);
          
          if (ticksPlayed < totalCountInTicks) {
            setBeatsLeft(Math.ceil((totalCountInTicks - ticksPlayed) / clickTicksPerBeat));
          } else if (ticksPlayed === totalCountInTicks) {
            setIsCountingInInternal(false);
            setBeatsLeft(0);
            onCountInCompleteRef.current?.();
          }
        }, time);

        // Play click sound if not silent
        if (!silent) {
          const isBeat = (ticksPlayed % clickTicksPerBeat) === 0;
          
          if (isBeat) {
            // Consistent tone for all main beats (1, 2, 3, 4...)
            clickSynth.triggerAttackRelease("C5", "32n", time);
            noiseSynth.triggerAttack(time);
          } else {
            // Sub-click (softer/different)
            clickSynth.triggerAttackRelease("G4", "32n", time, 0.3);
          }
        }
        
        ticksPlayed++;
      }, subdivisionToTone[clickSubdivision]);

      loop.start(0);
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      Tone.Draw.schedule(() => {
        setActiveSubBeat(0);
        setIsCountingInInternal(false);
        setBeatsLeft(0);
        onCountInCompleteRef.current?.();
      }, Tone.now());
    }

    return () => {
      if (loop) loop.dispose();
    };
  }, [isPlaying, clickSynth, noiseSynth, countInBars, silent, visualSubdivision, clickSubdivision, numerator]);

  return (
    <div className="metronome" style={{ border: 'none', padding: '0 10px' }}>
      <div className="metronome-settings" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input 
            type="range" min="40" max="240" value={bpm} 
            onChange={(e) => onBpmChange(parseInt(e.target.value))} 
            style={{ width: '100px' }}
          />
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', minWidth: '60px' }}>{bpm} BPM</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="select-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <label style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase' }}>Visual Sub</label>
            <select 
              value={visualSubdivision} 
              onChange={(e) => setVisualSubdivision(e.target.value as Subdivision)}
              style={{ padding: '2px 4px', fontSize: '0.8rem' }}
            >
              <option value="1/4">1/4</option>
              <option value="1/8">1/8</option>
              <option value="1/8 triplet">1/8 Triplet</option>
              <option value="1/16">1/16</option>
            </select>
          </div>

          <div className="select-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <label style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase' }}>Click Sub</label>
            <select 
              value={clickSubdivision} 
              onChange={(e) => setClickSubdivision(e.target.value as Subdivision)}
              disabled={matchSubdivision}
              style={{ padding: '2px 4px', fontSize: '0.8rem' }}
            >
              <option value="1/4">1/4</option>
              <option value="1/8">1/8</option>
              <option value="1/8 triplet">1/8 Triplet</option>
              <option value="1/16">1/16</option>
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={matchSubdivision} 
              onChange={(e) => setMatchSubdivision(e.target.checked)} 
            />
            Match
          </label>
        </div>
      </div>

      {isCountingInInternal && (
        <div style={{ 
          fontSize: '0.9rem', 
          fontWeight: 'bold', 
          color: '#e74c3c',
          marginTop: '5px'
        }}>
          COUNT-IN: {beatsLeft}
        </div>
      )}
    </div>
  );
};

export default Metronome;
