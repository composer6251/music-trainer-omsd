import React, { useEffect, useRef, useCallback } from 'react';
import { OpenSheetMusicDisplay, Note } from 'opensheetmusicdisplay';
import * as Tone from 'tone';
import { useMidi } from '../utils/useMidi';
import type { PlayMode } from '../App';

interface SheetMusicProps {
  score: string;
  zoom?: number;
  playMode: PlayMode;
  bpm: number;
  isMoving: boolean;
  onNotePlayed?: (note: number) => void;
  onNoteReleased?: (note: number) => void;
  title?: string;
}

const SheetMusic: React.FC<SheetMusicProps> = ({ 
  score, 
  zoom = 1.0, 
  playMode, 
  bpm, 
  isMoving,
  onNotePlayed,
  onNoteReleased,
  title
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const midiStatus = 'MIDI Active';

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
      }, 50);
    }
  }, [playMode, onNotePlayed]);

  // Use the global MIDI hook
  useMidi(checkNoteMatch, onNoteReleased);

  // Handle Cursor Movement in Continuous Mode
  useEffect(() => {
    let loop: Tone.Loop | null = null;

    if (playMode === 'Sight Reading with Metronome' && isMoving && osmdRef.current) {
      osmdRef.current.cursor.show();
      
      loop = new Tone.Loop((time) => {
        Tone.Draw.schedule(() => {
          if (osmdRef.current && osmdRef.current.cursor) {
            osmdRef.current.cursor.next();
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
  }, [playMode, isMoving, bpm]);

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
        } catch (error) {
          console.error("Error loading MusicXML:", error);
        }
      }
    };
    loadScore();
  }, [score, zoom]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        {title && <h3 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>{title}</h3>}
        <div style={{ fontSize: '0.8rem', color: '#888' }}>
          Status: {midiStatus} | Mode: {playMode}
        </div>
      </div>
      <div ref={containerRef} style={{ width: '100%', overflow: 'auto', background: 'white' }} />
    </div>
  );
};

export default SheetMusic;
