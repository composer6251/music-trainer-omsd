import type { TheoryLesson } from '../types/theory';

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

export const BEGINNER_LESSONS: TheoryLesson[] = [
  {
    id: 'module-1',
    moduleTitle: 'The Staff & Clefs (Line-by-Line)',
    steps: [
      {
        id: 'step-1',
        title: 'Finding the Anchor',
        instruction: 'In music, we use a "Staff" of five lines. But before we build the whole staff, let\'s find our home. Can you find Middle C on your keyboard? It often sits on its own "ledger line" below the staff.',
        successMessage: 'Excellent! Middle C is our anchor point.',
        musicXml: middleCXml,
        validation: {
          type: 'MATCH_PITCH',
          expectedPitches: [60], // MIDI 60 = C4
        }
      },
      {
        id: 'step-2',
        title: 'Moving Up',
        instruction: 'Music is spatial. If we move up from Middle C to the very next note (a "step" up), we land on D. Can you find D on your keyboard?',
        successMessage: 'Perfect! You\'ve moved from a line to the space just above it.',
        musicXml: nextNoteXml,
        validation: {
          type: 'MATCH_PITCH',
          expectedPitches: [62], // MIDI 62 = D4
        }
      },
      {
        id: 'step-3',
        title: 'The First Floor',
        instruction: 'As we continue climbing, we reach the very first line of the 5-line staff. This note is E. Can you find it? It\'s one step higher than D.',
        successMessage: 'Great job! You\'ve reached the "First Floor" of the staff.',
        musicXml: noteEXml,
        validation: {
          type: 'MATCH_PITCH',
          expectedPitches: [64], // MIDI 64 = E4
        }
      },
      {
        id: 'step-4',
        title: 'The G-Clef\'s Secret',
        instruction: 'Look at the curly symbol on the left. It\'s the Treble Clef, also called the "G-Clef." Notice how it curls around the second line? That\'s a hint! Every note on that second line is a G. Try playing G!',
        successMessage: 'Exactly! The clef "unlocks" the names of the lines for us.',
        musicXml: noteGXml,
        validation: {
          type: 'MATCH_PITCH',
          expectedPitches: [67], // MIDI 67 = G4
        }
      },
      {
        id: 'step-5',
        title: 'Descending: The F-Clef',
        instruction: 'Lower notes use a different staff called the Bass Clef. It\'s also known as the "F-Clef." Those two dots surround the fourth line from the bottom. Every note on that line is an F. Can you find this low F?',
        successMessage: 'Well done! You\'ve mastered the lower territory.',
        musicXml: noteF3Xml,
        validation: {
          type: 'MATCH_PITCH',
          expectedPitches: [53], // MIDI 53 = F3
        }
      },
      {
        id: 'step-6',
        title: 'The Grand Connection',
        instruction: 'When we put the Treble and Bass staves together, we get the "Grand Staff." Notice how Middle C sits right in the middle, connecting them like a bridge. Find that Middle C one last time!',
        successMessage: 'Perfect! You now understand how the entire musical map fits together.',
        musicXml: grandStaffCXml,
        validation: {
          type: 'MATCH_PITCH',
          expectedPitches: [60], // MIDI 60 = C4
        }
      }
    ]
  }
];
