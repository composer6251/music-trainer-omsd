export type StaffType = 'Treble' | 'Bass' | 'Alto' | 'Treble8va' | 'Grand';
export type Scale = 'C Major' | 'G Major' | 'F Major' | 'D Major' | 'Bb Major' | 'A Minor' | 'E Minor';

interface ScaleConfig {
  fifths: number;
  notes: string[];
}

const SCALE_MAP: Record<Scale, ScaleConfig> = {
  'C Major': { fifths: 0, notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  'G Major': { fifths: 1, notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'] },
  'F Major': { fifths: -1, notes: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'] },
  'D Major': { fifths: 2, notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] },
  'Bb Major': { fifths: -2, notes: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'] },
  'A Minor': { fifths: 0, notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
  'E Minor': { fifths: 1, notes: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'] },
};

export const generateMusicXml = (
  numNotes: number = 8,
  scale: Scale = 'C Major',
  staff: StaffType = 'Treble',
  voices: number = 1
): string => {
  const config = SCALE_MAP[scale];
  let measureContent = '';
  
  const getOctave = (staffType: StaffType) => {
    switch (staffType) {
      case 'Bass': return [2, 3];
      case 'Alto': return [3, 4];
      default: return [4, 5];
    }
  };

  const octaves = getOctave(staff);

  for (let i = 0; i < numNotes; i++) {
    if (i > 0 && i % 4 === 0) {
      measureContent += `</measure><measure number="${Math.floor(i / 4) + 1}">`;
    }

    // Handle multiple voices by creating a chord if voices > 1
    const numVoices = Math.max(1, voices);
    for (let v = 0; v < numVoices; v++) {
      const fullNote = config.notes[Math.floor(Math.random() * config.notes.length)];
      const step = fullNote[0];
      const alter = fullNote.includes('#') ? 1 : (fullNote.includes('b') ? -1 : 0);
      const octave = octaves[Math.floor(Math.random() * octaves.length)];

      measureContent += `
        <note>
          ${v > 0 ? '<chord/>' : ''}
          <pitch>
            <step>${step}</step>
            ${alter !== 0 ? `<alter>${alter}</alter>` : ''}
            <octave>${octave}</octave>
          </pitch>
          <duration>1</duration>
          <voice>1</voice>
          <type>quarter</type>
          ${staff === 'Grand' ? `<staff>${v === 0 ? 1 : 2}</staff>` : ''}
        </note>`;
    }
  }

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

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work><work-title>Sight Reading Exercise</work-title></work>
  <part-list>
    <score-part id="P1"><part-name>Piano</part-name></score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>${config.fifths}</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        ${staff === 'Grand' ? '<staves>2</staves>' : ''}
        ${getClef(staff)}
      </attributes>
      ${measureContent}
      <barline location="right"><bar-style>light-heavy</bar-style></barline>
    </measure>
  </part>
</score-partwise>`;
};
