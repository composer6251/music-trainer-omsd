import React, { useEffect, useRef, useCallback, useState } from 'react';
import { OpenSheetMusicDisplay, Note } from 'opensheetmusicdisplay';
import * as Tone from 'tone';
import { useMidi } from '../utils/useMidi';
import { midiToNoteName } from '../utils/noteUtils';
import type { PlayMode } from '../App';
import type { BeatLabel } from '../types/theory';

interface SheetMusicProps {
  score: string;
  zoom?: number;
  playMode: PlayMode;
  bpm: number;
  isMoving: boolean;
  onNotePlayed?: (note: number) => void;
  onNoteReleased?: (note: number) => void;
  title?: string;
  activeNotes?: number[];
  activeSubBeat?: number;
  metronomeLabels?: BeatLabel[];
  isMetronomePlaying?: boolean;
}

const SheetMusic: React.FC<SheetMusicProps> = ({ 
  score, 
  zoom = 1.0, 
  playMode, 
  bpm, 
  isMoving,
  onNotePlayed,
  onNoteReleased,
  title,
  activeNotes = [],
  activeSubBeat = 0,
  metronomeLabels = [],
  isMetronomePlaying = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const [expectedNotes, setExpectedNotes] = useState<string[]>([]);
  const midiStatus = 'MIDI Active';

  const updateExpectedNotes = useCallback(() => {
    const osmd = osmdRef.current;
    if (!osmd || !osmd.cursor) return;
    
    const notesUnderCursor = osmd.cursor.NotesUnderCursor();
    const names = notesUnderCursor.map(n => {
      const pitch = (n.Pitch as unknown as { getHalfTone: () => number }).getHalfTone() + 12;
      return midiToNoteName(pitch);
    });
    setExpectedNotes(names);
  }, []);

  const highlightNote = (note: Note, color: string) => {
    const osmd = osmdRef.current;
    if (!osmd || !osmd.GraphicSheet) return;

    interface GraphicalNote {
      setColor?: (color: string) => void;
      getSVGGElement?: () => HTMLElement;
    }

    const gNote = (osmd.GraphicSheet as unknown as { GetGraphicalNoteFromLogicalNote: (n: Note) => GraphicalNote }).GetGraphicalNoteFromLogicalNote(note);
    if (gNote) {
      if (typeof gNote.setColor === 'function') {
        gNote.setColor(color);
      } else {
        const svgElement = gNote.getSVGGElement?.();
        if (svgElement) {
          svgElement.style.fill = color;
          if (svgElement.children[0]) {
            (svgElement.children[0] as HTMLElement).style.fill = color;
          }
        }
      }
    }
  };

  const checkNoteMatch = useCallback((playedMidiNote: number) => {
    // Notify parent
    if (onNotePlayed) onNotePlayed(playedMidiNote);

    const osmd = osmdRef.current;
    if (!osmd || !osmd.cursor) return;

    const notesUnderCursor = osmd.cursor.NotesUnderCursor();
    let matchFound = false;

    notesUnderCursor.forEach((note) => {
      const osmdPitch = (note.Pitch as unknown as { getHalfTone: () => number }).getHalfTone() + 12;
      
      if (osmdPitch === playedMidiNote) {
        highlightNote(note, "#2ecc71"); // Correct -> Green
        matchFound = true;
      } else {
        highlightNote(note, "#e74c3c"); // Incorrect -> Red
      }
    });

    if (matchFound && playMode === 'Wait') {
      setTimeout(() => {
        osmd.cursor.next();
        updateExpectedNotes();
      }, 50);
    }
  }, [playMode, onNotePlayed, updateExpectedNotes]);

  // Use the global MIDI hook
  useMidi(checkNoteMatch, onNoteReleased);

  // Handle Cursor Movement in Continuous Mode
  useEffect(() => {
    let loop: Tone.Loop | null = null;

    if (playMode === 'Sight Read with Metronome' && isMoving && osmdRef.current) {
      osmdRef.current.cursor.show();
      
      loop = new Tone.Loop((time) => {
        Tone.Draw.schedule(() => {
          if (osmdRef.current && osmdRef.current.cursor) {
            osmdRef.current.cursor.next();
            updateExpectedNotes();
          }
        }, time);
      }, "4n");

      loop.start(0);
    }

    return () => {
      if (loop) {
        loop.dispose();
      }
    };
  }, [playMode, isMoving, bpm, updateExpectedNotes]);

  // Initialization & Score Loading
  useEffect(() => {
    if (containerRef.current && !osmdRef.current) {
      osmdRef.current = new OpenSheetMusicDisplay(containerRef.current, {
        autoResize: true,
        drawTitle: false,
        followCursor: true,
      });
    }
  }, []);

  useEffect(() => {
    const loadScore = async () => {
      if (osmdRef.current && score) {
        try {
          await osmdRef.current.load(score);
          osmdRef.current.Zoom = zoom;
          osmdRef.current.render();
          osmdRef.current.cursor.show();
          osmdRef.current.cursor.reset();
          updateExpectedNotes();
        } catch (error) {
          console.error("Error loading MusicXML:", error);
        }
      }
    };
    loadScore();
  }, [score, zoom, updateExpectedNotes]);

  const playedNoteNames = activeNotes.map(midiToNoteName);
  const isCorrect = activeNotes.length > 0 && activeNotes.some(note => 
    expectedNotes.includes(midiToNoteName(note))
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        {title && <h3 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>{title}</h3>}
        <div style={{ fontSize: '0.8rem', color: '#888' }}>
          Status: {midiStatus} | Mode: {playMode}
        </div>
      </div>

      <div className="note-comparison" style={{ 
        padding: '10px 15px', 
        background: '#f8f9fa', 
        borderRadius: '8px', 
        marginBottom: '10px',
        display: 'flex',
        gap: '30px',
        alignItems: 'center',
        borderLeft: '5px solid #3498db',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#7f8c8d', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expected Note</span>
          <span style={{ color: '#2c3e50', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {expectedNotes.length > 0 ? expectedNotes.join(', ') : '-'}
          </span>
        </div>
        <div style={{ width: '1px', height: '30px', background: '#ddd' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#7f8c8d', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Note</span>
          <span style={{ 
            color: activeNotes.length > 0 ? (isCorrect ? '#27ae60' : '#e74c3c') : '#bdc3c7',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            {playedNoteNames.length > 0 ? playedNoteNames.join(', ') : 'Play now...'}
          </span>
        </div>

        {metronomeLabels.length > 0 && (
          <>
            <div style={{ width: '1px', height: '30px', background: '#ddd' }} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', fontFamily: 'monospace' }}>
              {metronomeLabels.map((label, i) => (
                <span 
                  key={i} 
                  style={{ 
                    fontSize: label.isNumeral ? '1.8rem' : '0.9rem',
                    fontWeight: 'bold',
                    color: activeSubBeat === i && isMetronomePlaying ? '#2ecc71' : '#444',
                    transition: 'color 0.05s',
                    textShadow: activeSubBeat === i && isMetronomePlaying ? '0 0 10px #2ecc71' : 'none',
                    lineHeight: 1
                  }}
                >
                  {label.text}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div ref={containerRef} style={{ width: '100%', overflow: 'auto', background: 'white' }} />
    </div>
  );
};

export default SheetMusic;
