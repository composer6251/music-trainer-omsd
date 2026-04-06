import React from 'react';
import { midiToNoteName } from '../utils/noteUtils';

interface MidiKeyboardProps {
  activeNotes: number[]; // Array of MIDI note numbers
  startNote?: number;    // Default to 48 (C3)
  endNote?: number;      // Default to 72 (C5)
  highlightedNotes?: number[]; // Notes to "glow" or highlight
  noteLabels?: Record<number, string>; // Labels to show on specific keys
}

const MidiKeyboard: React.FC<MidiKeyboardProps> = ({ 
  activeNotes, 
  startNote = 48, 
  endNote = 72,
  highlightedNotes = [],
  noteLabels = {}
}) => {
  const keys = [];
  
  const isBlackKey = (midi: number) => {
    const note = midi % 12;
    return [1, 3, 6, 8, 10].includes(note);
  };

  for (let i = startNote; i <= endNote; i++) {
    keys.push({
      midi: i,
      isBlack: isBlackKey(i),
      isActive: activeNotes.includes(i),
      isHighlighted: highlightedNotes.includes(i),
      label: noteLabels[i]
    });
  }

  return (
    <div className="piano-container">
      <div className="note-display">
        {activeNotes.length > 0 ? (
          activeNotes.map(midiToNoteName).join(', ')
        ) : (
          <span className="placeholder">Play a note...</span>
        )}
      </div>
      <div className="piano">
        {keys.map((key) => (
          <div
            key={key.midi}
            className={`key ${key.isBlack ? 'black' : 'white'} ${key.isActive ? 'active' : ''} ${key.isHighlighted ? 'highlighted' : ''}`}
            data-midi={key.midi}
          >
            {key.label && <span className="label permanent">{key.label}</span>}
            {!key.label && key.midi === 60 && <span className="label">C4</span>}
          </div>
        ))}
      </div>

      <style>{`
        .piano-container {
          width: 100%;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }
        .note-display {
          background: #1a1a1a;
          color: #2ecc71;
          padding: 8px 24px;
          border-radius: 20px;
          font-family: 'Courier New', Courier, monospace;
          font-weight: bold;
          font-size: 1.2rem;
          min-height: 1.2rem;
          border: 1px solid #333;
          box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
          min-width: 150px;
          text-align: center;
        }
        .note-display .placeholder {
          color: #555;
          font-size: 0.9rem;
          font-style: italic;
        }
        .piano {
          display: flex;
          position: relative;
          height: 120px;
          background: #333;
          padding: 5px;
          border-radius: 8px;
        }
        .key {
          border: 1px solid #000;
          border-radius: 0 0 4px 4px;
          cursor: pointer;
          position: relative;
          transition: background 0.1s, box-shadow 0.2s;
        }
        .key.white {
          width: 40px;
          height: 110px;
          background: white;
          z-index: 1;
        }
        .key.black {
          width: 24px;
          height: 70px;
          background: #222;
          z-index: 2;
          margin-left: -12px;
          margin-right: -12px;
        }
        .key.white.active {
          background: #2ecc71;
        }
        .key.black.active {
          background: #27ae60;
        }
        .key.highlighted {
          box-shadow: inset 0 0 15px #3498db, 0 0 10px #3498db;
          border-color: #3498db;
        }
        .key .label {
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.7rem;
          color: #888;
          pointer-events: none;
        }
        .key .label.permanent {
          color: #2c3e50;
          font-weight: bold;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default MidiKeyboard;
