import React from 'react';

interface MidiKeyboardProps {
  activeNotes: number[]; // Array of MIDI note numbers
  startNote?: number;    // Default to 48 (C3)
  endNote?: number;      // Default to 72 (C5)
}

const MidiKeyboard: React.FC<MidiKeyboardProps> = ({ 
  activeNotes, 
  startNote = 48, 
  endNote = 72 
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
      isActive: activeNotes.includes(i)
    });
  }

  return (
    <div className="piano-container">
      <div className="piano">
        {keys.map((key) => (
          <div
            key={key.midi}
            className={`key ${key.isBlack ? 'black' : 'white'} ${key.isActive ? 'active' : ''}`}
            data-midi={key.midi}
          >
            {key.midi === 60 && <span className="label">C4</span>}
          </div>
        ))}
      </div>

      <style>{`
        .piano-container {
          width: 100%;
          padding: 20px 0;
          overflow-x: auto;
          display: flex;
          justify-content: center;
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
          transition: background 0.1s;
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
        .key .label {
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.7rem;
          color: #888;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default MidiKeyboard;
