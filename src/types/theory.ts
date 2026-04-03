export interface TheoryStep {
  id: string;
  title: string;
  instruction: string;
  successMessage: string;
  musicXml?: string;
  bpm?: number; // Optional: If the step requires a metronome
  keyboardRange?: { start: number; end: number }; // Optional: Custom range for keyboard
  highlightedNotes?: number[]; // Optional: Notes to highlight on the keyboard
  noteLabels?: Record<number, string>; // Optional: Custom labels for specific notes
  autoAdvance?: boolean; // Optional: If true, move to the next step automatically when solved
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
  title: string;
  description?: string;
  steps: TheoryStep[];
}

export interface TheoryModule {
  id: string;
  title: string;
  description?: string;
  lessons: TheoryLesson[];
}
