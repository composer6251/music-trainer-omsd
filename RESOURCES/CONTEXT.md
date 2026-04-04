# Project Context: Music Master Trainer (Handover - April 3, 2026)

This document summarizes the current state of the project, including the significant refactoring of the theory system and the enhancements to the Music Reading interface.

## 🛠 Tech Stack
- **Framework:** React (TypeScript) + Vite
- **Music Rendering:** OpenSheetMusicDisplay (OSMD)
- **Audio Engine:** Tone.js (Synthesis, Metronome, Transport)
- **Input API:** Web MIDI API, Web Audio API (MediaDevices)
- **State Management:** React Hooks + Custom `useMidi` hook for global input.

## 🏗 Core Architecture Updates
- **`useMidi.ts`**: A global hook that provides a consistent `activeNotes` state and event listeners across all components. This ensures the visual keyboard and note displays work even when no sheet music is rendered.
- **Theory Hierarchy**: Refactored from flat lessons to a **Module -> Lesson -> Step** hierarchy.
- **`TheoryTrainer.tsx`**: Now handles auto-advancing steps, custom keyboard ranges, note highlighting, and note labels based on the `TheoryStep` configuration.
- **`App.tsx`**: Centralizes navigation guards (preventing accidental exit from lessons) and the Music Reading exercise configuration.

## ✨ Key Features Implemented
1.  **"Learn the Keyboard" Module**: 
    *   A guided discovery flow starting with a 1-octave keyboard (C4-B4).
    *   Note-by-note discovery with automatic highlighting and permanent labels added upon success.
    *   Automatic transition to a 2-octave keyboard once the first octave is mastered.
2.  **Diatonic Note Range Selection**:
    *   Reading exercises now support a user-defined range (Low Note to High Note).
    *   Dropdowns are **Staff-aware** (filtered by clef range) and **Diatonic** (filtered by the selected scale).
    *   Automatic recalibration if a scale/staff change makes the current range invalid.
3.  **UI & Navigation**:
    *   **Prominent Action Buttons**: "New Exercise" and "START/STOP" (Metronome) are now large, color-coded, and aligned.
    *   **Note Display**: A bar above the keyboard showing the names (e.g., "C4", "Eb3") of all currently pressed notes.
    *   **Navigation Guards**: Trigger `window.confirm` if a user attempts to navigate away from a lesson past Step 1.
    *   **Streamlined Entry**: Modules with only one lesson start immediately; modules with multiple lessons show a selection sub-menu.

## 📖 Lesson Content (Beginner)
- **Keyboard**: Layout basics (The 7 notes + 2nd Octave expansion).
- **The Staff**: Dedicated lessons for Treble, Bass, Alto, Treble 8va (Guitar), and Grand Staff.
- **Chords**: Introduction to Major chords (C Major).

## 🐛 Known Status
- **Type Safety**: All components pass `tsc` type-checking.
- **Metronome Logic**: Metronome button is now context-sensitive and only displays/activates in "Sight Reading with Metronome" mode.

## 🚀 Future Roadmap
1.  **Rhythm Module**: Complete the Module 2 foundations (Early/Late feedback).
2.  **Advanced Theory**: Implement Module 3 (Scales & Tonics).
3.  **Visual Keyboard Improvements**: Add support for black key highlighting and labeling.
