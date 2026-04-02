export interface TheoryStep {
  id: string;
  title: string;
  instruction: string; // The "Socratic" prompt
  successMessage: string;
  musicXml?: string; // Optional: Some steps might just be text/images
  validation: {
    type: 'MATCH_PITCH' | 'MATCH_SEQUENCE' | 'MATCH_INTERVAL' | 'FIND_TONIC';
    expectedPitches?: number[]; // MIDI note numbers
    expectedInterval?: number; // Semitones
    tolerance?: number;
  };
}

export interface TheoryLesson {
  id: string;
  moduleTitle: string;
  steps: TheoryStep[];
}
