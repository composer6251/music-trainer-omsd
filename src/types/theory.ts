export interface TheoryStep {
  id: string;
  title: string;
  instruction: string;
  successMessage: string;
  musicXml?: string;
  bpm?: number; // Optional: If the step requires a metronome
  validation: {
    type: 'MATCH_PITCH' | 'MATCH_SEQUENCE' | 'MATCH_INTERVAL' | 'FIND_TONIC' | 'MATCH_RHYTHM';
    expectedPitches?: number[];
    expectedInterval?: number;
    expectedRhythm?: { beat: number; pitch: number }[]; // For rhythm matching
    tolerance?: number; // Timing tolerance in ms
  };
}

export interface TheoryLesson {
  id: string;
  moduleTitle: string;
  steps: TheoryStep[];
}
