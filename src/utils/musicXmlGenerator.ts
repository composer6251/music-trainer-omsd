export type StaffType = 'Treble' | 'Bass' | 'Alto' | 'Treble8va' | 'Grand';
export type Scale = 'C Major' | 'G Major' | 'F Major' | 'D Major' | 'Bb Major' | 'A Minor' | 'E Minor';
export type RhythmComplexity = 'Basic' | 'Intermediate' | 'Advanced';

interface ScaleConfig {
  fifths: number;
  notes: string[];
}

export const SCALE_MAP: Record<Scale, ScaleConfig> = {
  'C Major': { fifths: 0, notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  'G Major': { fifths: 1, notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'] },
  'F Major': { fifths: -1, notes: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'] },
  'D Major': { fifths: 2, notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] },
  'Bb Major': { fifths: -2, notes: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'] },
  'A Minor': { fifths: 0, notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
  'E Minor': { fifths: 1, notes: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'] },
};

export const isNoteInScale = (midi: number, scale: Scale) => {
  const config = SCALE_MAP[scale];
  
  // A note is in the scale if its base name (C, D, etc.) matches a note in the scale 
  // AND its accidental (if any) matches the scale's accidental for that note.
  return config.notes.some(scaleNote => {
    // scaleNote is like 'F#' or 'Bb' or 'C'
    return midiToNoteNameWithoutOctave(midi) === scaleNote;
  });
};

const midiToNoteNameWithoutOctave = (midi: number) => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return notes[midi % 12];
};

const getRhythms = (complexity: RhythmComplexity): { type: string, duration: number }[] => {
  switch (complexity) {
    case 'Basic':
      return [{ type: 'quarter', duration: 2 }];
    case 'Intermediate':
      return [
        { type: 'quarter', duration: 2 },
        { type: 'half', duration: 4 },
        { type: 'eighth', duration: 1 }
      ];
    case 'Advanced':
      return [
        { type: 'quarter', duration: 2 },
        { type: 'half', duration: 4 },
        { type: 'eighth', duration: 1 },
        { type: 'whole', duration: 8 }
      ];
    default:
      return [{ type: 'quarter', duration: 2 }];
  }
};

const getPartName = (staff: StaffType): string => {
  switch (staff) {
    case 'Treble': return 'Treble';
    case 'Bass': return 'Bass';
    case 'Alto': return 'Alto';
    case 'Treble8va': return 'Treble 8va';
    case 'Grand': return 'Grand Staff';
    default: return 'Piano';
  }
};

export const generateMusicXml = (
  numMeasures: number = 8,
  scale: Scale = 'C Major',
  staff: StaffType = 'Treble',
  voices: number = 1,
  complexity: RhythmComplexity = 'Basic',
  lowNote: number = 60,
  highNote: number = 72
): string => {
  const config = SCALE_MAP[scale];
  const availableRhythms = getRhythms(complexity);
  const divisions = 2; // 1 duration unit = 8th note
  const beatsPerMeasure = 8; // 4/4 time * 2 divisions

  let scoreContent = '';

  for (let m = 0; m < numMeasures; m++) {
    let measureBeats = 0;
    let measureXml = `<measure number="${m + 1}">`;
    
    if (m === 0) {
      measureXml += `
        <attributes>
          <divisions>${divisions}</divisions>
          <key><fifths>${config.fifths}</fifths></key>
          <time><beats>4</beats><beat-type>4</beat-type></time>
          ${staff === 'Grand' ? '<staves>2</staves>' : ''}
          ${getClef(staff)}
        </attributes>`;
    } else if (m % 4 === 0) {
      measureXml += '<print new-system="yes"/>';
    }

    while (measureBeats < beatsPerMeasure) {
      const remaining = beatsPerMeasure - measureBeats;
      const validRhythms = availableRhythms.filter(r => r.duration <= remaining);
      const rhythm = validRhythms[Math.floor(Math.random() * validRhythms.length)];
      
      const numVoices = Math.max(1, voices);
      for (let v = 0; v < numVoices; v++) {
        // Generate a random note within the MIDI range that fits the scale
        let midi = Math.floor(Math.random() * (highNote - lowNote + 1)) + lowNote;
        
        // Simple scale snapping: if note not in scale, nudge it until it is
        let attempts = 0;
        while (!isNoteInScale(midi, scale) && attempts < 12) {
          midi = (midi + 1 > highNote) ? lowNote : midi + 1;
          attempts++;
        }

        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const step = noteNames[midi % 12][0];
        const alter = noteNames[midi % 12].includes('#') ? 1 : 0;
        const octave = Math.floor(midi / 12) - 1;

        measureXml += `
          <note>
            ${v > 0 ? '<chord/>' : ''}
            <pitch>
              <step>${step}</step>
              ${alter !== 0 ? `<alter>${alter}</alter>` : ''}
              <octave>${octave}</octave>
            </pitch>
            <duration>${rhythm.duration}</duration>
            <voice>1</voice>
            <type>${rhythm.type}</type>
            ${staff === 'Grand' ? `<staff>${v === 0 ? 1 : 2}</staff>` : ''}
          </note>`;
      }
      measureBeats += rhythm.duration;
    }

    if (m === numMeasures - 1) {
      measureXml += '<barline location="right"><bar-style>light-heavy</bar-style></barline>';
    }
    measureXml += '</measure>';
    scoreContent += measureXml;
  }

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work><work-title>Dynamic Reading Exercise</work-title></work>
  <part-list>
    <score-part id="P1"><part-name>${getPartName(staff)}</part-name></score-part>
  </part-list>
  <part id="P1">
    ${scoreContent}
  </part>
</score-partwise>`;
};

const getClef = (staffType: StaffType) => {
  if (staffType === 'Grand') {
    return `
      <clef number="1"><sign>G</sign><line>2</line></clef>
      <clef number="2"><sign>F</sign><line>4</line></clef>
      <staff-details><staff-lines>5</staff-lines></staff-details>`;
  }
  switch (staffType) {
    case 'Bass': return '<clef><sign>F</sign><line>4</line></clef>';
    case 'Alto': return '<clef><sign>C</sign><line>3</line></clef>';
    case 'Treble8va': return '<clef><sign>G</sign><line>2</line><clef-octave-change>-1</clef-octave-change></clef>';
    default: return '<clef><sign>G</sign><line>2</line></clef>';
  }
};
