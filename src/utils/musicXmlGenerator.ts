export const generateRandomNotes = (numNotes: number = 8): string => {
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const octaves = [4, 5];
  
  let measureContent = '';
  
  for (let i = 0; i < numNotes; i++) {
    const step = notes[Math.floor(Math.random() * notes.length)];
    const octave = octaves[Math.floor(Math.random() * octaves.length)];
    
    // Simple 4/4 measure logic: 4 notes per measure
    if (i > 0 && i % 4 === 0) {
      measureContent += `</measure><measure number="${Math.floor(i / 4) + 1}">`;
    }

    measureContent += `
      <note>
        <pitch>
          <step>${step}</step>
          <octave>${octave}</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>`;
  }

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work><work-title>Random Sight Reading</work-title></work>
  <part-list>
    <score-part id="P1"><part-name>Piano</part-name></score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      ${measureContent}
      <barline location="right"><bar-style>light-heavy</bar-style></barline>
    </measure>
  </part>
</score-partwise>`;
};
