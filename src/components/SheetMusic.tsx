import React, { useEffect, useRef, useState, useCallback } from 'react';
import { OpenSheetMusicDisplay, Note } from 'opensheetmusicdisplay';
import * as Tone from 'tone';
import type { PlayMode } from '../App';

interface SheetMusicProps {
  score: string;
  zoom?: number;
  playMode: PlayMode;
  bpm: number;
  isMoving: boolean;
  onNotePlayed?: (note: number) => void;
}

const SheetMusic: React.FC<SheetMusicProps> = ({ 
  score, 
  zoom = 1.0, 
  playMode, 
  bpm, 
  isMoving,
  onNotePlayed 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const [midiStatus, setMidiStatus] = useState<string>('Initializing MIDI...');

  const highlightNote = (note: Note, color: string) => {
    const osmd = osmdRef.current;
    if (!osmd || !osmd.GraphicSheet) return;

    const gNote = (osmd.GraphicSheet as any).GetGraphicalNoteFromLogicalNote(note);
    if (gNote) {
      if (typeof (gNote as any).setColor === 'function') {
        (gNote as any).setColor(color);
      } else {
        const svgElement = (gNote as any).getSVGGElement?.();
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
    // Notify parent of the played note
    if (onNotePlayed) {
      onNotePlayed(playedMidiNote);
    }

    const osmd = osmdRef.current;
    if (!osmd || !osmd.cursor) return;

    const notesUnderCursor = osmd.cursor.NotesUnderCursor();
    let matchFound = false;

    notesUnderCursor.forEach((note) => {
      const osmdPitch = (note.Pitch as any).getHalfTone() + 12;
      
      if (osmdPitch === playedMidiNote) {
        highlightNote(note, "#2ecc71"); // Correct -> Green
        matchFound = true;
      } else {
        // Only turn red if it's the wrong pitch for the current note position
        highlightNote(note, "#e74c3c"); // Incorrect -> Red
      }
    });

    if (matchFound && playMode === 'Wait') {
      setTimeout(() => {
        osmd.cursor.next();
      }, 50);
    }
  }, [playMode, onNotePlayed]);

  const handleMidiMessage = useCallback((event: any) => {
    const data = event.data;
    if (!data) return;
    const [status, note, velocity] = data;
    const type = status & 0xf0;
    if (type === 144 && velocity > 0) {
      checkNoteMatch(note);
    }
  }, [checkNoteMatch]);

  // Handle Cursor Movement in Continuous Mode
  useEffect(() => {
    let loop: Tone.Loop | null = null;

    if (playMode === 'Continuous' && isMoving && osmdRef.current) {
      osmdRef.current.cursor.show();
      
      // Advance cursor every quarter note (standard 4/4)
      // Note: For complex rhythms, we'd need to sync with the actual MusicXML timestamps
      loop = new Tone.Loop((time) => {
        Tone.Draw.schedule(() => {
          if (osmdRef.current && osmdRef.current.cursor) {
            osmdRef.current.cursor.next();
          }
        }, time);
      }, "4n"); // "4n" is a quarter note

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
        drawTitle: true,
        followCursor: true,
      });
    }

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(
        (midiAccess) => {
          setMidiStatus('MIDI Ready');
          for (const input of midiAccess.inputs.values()) {
            input.onmidimessage = handleMidiMessage;
          }
        },
        () => setMidiStatus('MIDI Access Failed')
      );
    }
  }, [handleMidiMessage]);

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
      <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>
        Status: {midiStatus} | Mode: {playMode}
      </div>
      <div ref={containerRef} style={{ width: '100%', overflow: 'auto', background: 'white' }} />
    </div>
  );
};

export default SheetMusic;
