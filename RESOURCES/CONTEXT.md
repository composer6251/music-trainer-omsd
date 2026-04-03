# Project Context: Music Master Trainer

This document serves as a handover summary for the current state of the Music Master Trainer project.

## 🛠 Tech Stack
- **Framework:** React (TypeScript) + Vite
- **Music Rendering:** OpenSheetMusicDisplay (OSMD)
- **Audio Engine:** Tone.js (Synthesis, Metronome, Transport)
- **Input APIs:** Web MIDI API, Web Audio API (MediaDevices)
- **Utilities:** Custom MusicXML Generator, Autocorrelation Pitch Detector

## 🏗 Core Architecture
- **`App.tsx`**: Central state management for pages, navigation, and global trainer settings (Scale, Staff, Input, Sound).
- **`SheetMusic.tsx`**: Renders MusicXML and handles the "Wait for Note" and "Continuous" play modes. Optimized with `useRef` for MIDI/Audio callbacks to prevent stale closures.
- **`TheoryTrainer.tsx`**: A state-machine-driven instructional view. Manages lesson steps, Socratic prompts, and specialized validation (Pitch, Rhythm).
- **`AudioInput.tsx`**: Custom pitch detection component. Translates microphone/line-in frequency into MIDI note numbers for monophonic instruments (Guitar/Voice).
- **`MidiKeyboard.tsx`**: Visual feedback component with configurable octave ranges.
- **`Metronome.tsx`**: High-precision click with woodblock synth and a configurable **Count-in** (1–4 bars).

## ✨ Key Features Implemented
1. **Hybrid Input System**: Seamlessly toggle between MIDI and Audio (Mic/Line) for single-voice exercises.
2. **Integrated Synthesizer**: PolySynth provides audible pitch feedback for all inputs with a global Sound ON/OFF toggle.
3. **Advanced Metronome**: Includes a visual/audio count-in that pauses the exercise until the student is ready.
4. **Theory Modules**:
   - **Module 1 (Clefs/Staff)**: 6 steps covering Middle C, Treble/Bass Clef anchors, and the Grand Staff.
   - **Module 2 (Rhythm Basics)**: Foundation for beat detection and internalizing the pulse.
5. **Space-Optimized UI**: Grouped "Score + Keyboard" container with compact headers for single-screen visibility.

## 🐛 Known Status & Fixes
- **MIDI Stability**: Listeners are now bound only once using `useRef` to ensure the latest state is always accessible.
- **Step Navigation**: Added `key={currentStep.id}` to force `SheetMusic` re-mounts when advancing steps, preventing OSMD rendering glitches.

## 🚀 Next Steps
1. **Rhythm Refinement**: Implement "Early/Late" feedback for rhythmic inputs and add Half/Whole note release validation.
2. **Pedagogical Expansion**: Complete Module 2 (Rhythm) and start Module 3 (Scales & The Tonic).
3. **SVG Scaffolding**: Implement dynamic SVG manipulation to hide/show staff lines for beginner spatial lessons.
4. **Audio Calibration**: Fine-tune the "Noise Floor" and "Stability" of the pitch detector for various acoustic environments.

---
*Last Updated: April 2, 2026*
