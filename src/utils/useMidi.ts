import { useEffect, useCallback, useRef } from 'react';

export const useMidi = (
  onNotePlayed?: (note: number) => void,
  onNoteReleased?: (note: number) => void
) => {
  // Use refs to store latest callbacks to avoid re-binding MIDI listener
  const onNotePlayedRef = useRef(onNotePlayed);
  const onNoteReleasedRef = useRef(onNoteReleased);

  useEffect(() => {
    onNotePlayedRef.current = onNotePlayed;
    onNoteReleasedRef.current = onNoteReleased;
  }, [onNotePlayed, onNoteReleased]);

  const handleMidiMessage = useCallback((event: WebMidi.MIDIMessageEvent) => {
    const data = event.data;
    if (!data) return;
    const [status, note, velocity] = data;
    const type = status & 0xf0;

    // Note On
    if (type === 144 && velocity > 0) {
      if (onNotePlayedRef.current) {
        onNotePlayedRef.current(note);
      }
    } 
    // Note Off (128 or 144 with velocity 0)
    else if (type === 128 || (type === 144 && velocity === 0)) {
      if (onNoteReleasedRef.current) {
        onNoteReleasedRef.current(note);
      }
    }
  }, []);

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(
        (midiAccess) => {
          for (const input of midiAccess.inputs.values()) {
            input.onmidimessage = handleMidiMessage as (e: Event) => void;
          }

          // Handle hot-plugging
          midiAccess.onstatechange = (e: WebMidi.MIDIConnectionEvent) => {
            if (e.port.type === 'input' && e.port.state === 'connected') {
              (e.port as WebMidi.MIDIInput).onmidimessage = handleMidiMessage as (e: Event) => void;
            }
          };
        },
        () => console.warn('MIDI Access Failed')
      );
    }
  }, [handleMidiMessage]);
};
