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
      }
    ]
  }
];
