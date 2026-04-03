import type { TheoryModule } from '../types/theory';

// A simple 1-measure MusicXML with a single Middle C (C4)
const middleCXml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      <note>
        <pitch><step>C</step><octave>4</octave></pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
  </part>
</score-partwise>`;

// Step 2: D4 (one space above Middle C)
const nextNoteXml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      <note>
        <pitch><step>D</step><octave>4</octave></pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
  </part>
</score-partwise>`;

// Step 3: E4 (First line of the staff)
const noteEXml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      <note>
        <pitch><step>E</step><octave>4</octave></pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
  </part>
</score-partwise>`;

// Step 4: G4 (Second line - The G Clef line)
const noteGXml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      <note>
        <pitch><step>G</step><octave>4</octave></pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
  </part>
</score-partwise>`;

// Step 5: F3 (Fourth line of Bass Staff - The F Clef line)
const noteF3Xml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>F</sign><line>4</line></clef>
      </attributes>
      <note>
        <pitch><step>F</step><octave>3</octave></pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
  </part>
</score-partwise>`;

// Step 6: Grand Staff Middle C
const grandStaffCXml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <staves>2</staves>
        <clef number="1"><sign>G</sign><line>2</line></clef>
        <clef number="2"><sign>F</sign><line>4</line></clef>
      </attributes>
      <note>
        <pitch><step>C</step><octave>4</octave></pitch>
        <duration>4</duration>
        <type>whole</type>
        <staff>1</staff>
      </note>
    </measure>
  </part>
</score-partwise>`;

export const BEGINNER_MODULES: TheoryModule[] = [
  {
    id: 'module-keyboard',
    title: 'Learn the notes of the keyboard',
    lessons: [
      {
        id: 'keyboard-basics',
        title: 'Keyboard Layout',
        steps: [
          {
            id: 'kb-1',
            title: 'The White Keys',
            instruction: 'The white keys are named after the first seven letters of the alphabet: A, B, C, D, E, F, G. Find any C on the keyboard.',
            successMessage: 'Great! You found a C.',
            validation: {
              type: 'MATCH_PITCH',
              expectedPitches: [36, 48, 60, 72, 84], 
            }
          }
        ]
      }
    ]
  },
  {
    id: 'module-staff',
    title: 'Learn the staff',
    lessons: [
      {
        id: 'lesson-treble',
        title: 'Treble Clef',
        steps: [
          {
            id: 'tc-1',
            title: 'Finding the Anchor',
            instruction: 'Middle C often sits on its own "ledger line" below the staff. Can you find Middle C (C4) on your keyboard?',
            successMessage: 'Excellent! Middle C is our anchor point.',
            musicXml: middleCXml,
            validation: {
              type: 'MATCH_PITCH',
              expectedPitches: [60],
            }
          },
          {
            id: 'tc-2',
            title: 'Moving Up to D',
            instruction: 'If we move up from Middle C, we land on D. Can you find D4?',
            successMessage: 'Perfect!',
            musicXml: nextNoteXml,
            validation: {
              type: 'MATCH_PITCH',
              expectedPitches: [62],
            }
          },
          {
            id: 'tc-3',
            title: 'The First Line: E',
            instruction: 'The first line of the treble staff is E. Find E4.',
            successMessage: 'Great job!',
            musicXml: noteEXml,
            validation: {
              type: 'MATCH_PITCH',
              expectedPitches: [64],
            }
          },
          {
            id: 'tc-4',
            title: 'The G-Clef',
            instruction: 'The Treble Clef curls around the second line, which is G. Try playing G4!',
            successMessage: 'Exactly!',
            musicXml: noteGXml,
            validation: {
              type: 'MATCH_PITCH',
              expectedPitches: [67],
            }
          }
        ]
      },
      {
        id: 'lesson-treble-8va',
        title: 'Treble Clef 8va (Guitar)',
        steps: [
          {
            id: 't8-1',
            title: 'Guitar Range',
            instruction: 'Guitar music is written an octave higher than it sounds. Play E3 (the note just below Middle C).',
            successMessage: 'Correct!',
            validation: {
              type: 'MATCH_PITCH',
              expectedPitches: [52],
            }
          }
        ]
      },
      {
        id: 'lesson-bass',
        title: 'Bass Clef',
        steps: [
          {
            id: 'bc-1',
            title: 'The F-Clef',
            instruction: 'The Bass Clef dots surround the F line. Find F3.',
            successMessage: 'Well done!',
            musicXml: noteF3Xml,
            validation: {
              type: 'MATCH_PITCH',
              expectedPitches: [53],
            }
          }
        ]
      },
      {
        id: 'lesson-grand',
        title: 'Grand Staff',
        steps: [
          {
            id: 'gs-1',
            title: 'Connecting the Staves',
            instruction: 'The Grand Staff connects Treble and Bass. Find Middle C again!',
            successMessage: 'Perfect!',
            musicXml: grandStaffCXml,
            validation: {
              type: 'MATCH_PITCH',
              expectedPitches: [60],
            }
          }
        ]
      }
    ]
  },
  {
    id: 'module-chords',
    title: 'Learn Chords',
    lessons: [
      {
        id: 'lesson-major',
        title: 'Major Chords',
        steps: [
          {
            id: 'mc-1',
            title: 'C Major',
            instruction: 'Play C4, E4, and G4 together.',
            successMessage: 'Beautiful!',
            validation: {
              type: 'MATCH_PITCH',
              expectedPitches: [60, 64, 67],
            }
          }
        ]
      }
    ]
  }
];
