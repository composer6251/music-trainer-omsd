import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import SheetMusic from './components/SheetMusic'
import Metronome from './components/Metronome'
import TheoryTrainer from './components/TheoryTrainer'
import MidiKeyboard from './components/MidiKeyboard'
import AudioInput from './components/AudioInput'
import { generateMusicXml } from './utils/musicXmlGenerator'
import { BEGINNER_MODULES } from './data/lessons'
import type { Scale, StaffType, RhythmComplexity } from './utils/musicXmlGenerator'
import * as Tone from 'tone'

type Page = 'Music Reading' | 'Learn Theory - Beginner' | 'Learn Theory - Advanced' | 'Composition';
export type PlayMode = 'Wait' | 'Continuous';
type InputSource = 'MIDI' | 'Audio';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('Music Reading');
  const [zoom, setZoom] = useState(1.0);
  const [score, setScore] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  
  // Trainer Settings
  const [scale, setScale] = useState<Scale>('C Major');
  const [staff, setStaff] = useState<StaffType>('Treble');
  const [voices, setVoices] = useState(1);
  const [measures, setMeasures] = useState(8);
  const [complexity, setComplexity] = useState<RhythmComplexity>('Basic');
  
  // New Play Mode State
  const [playMode, setPlayMode] = useState<PlayMode>('Wait');
  const [bpm, setBpm] = useState(100);
  const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const [inputSource, setInputSource] = useState<InputSource>('MIDI');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [countInBars, setCountInBars] = useState(1);
  const [isCountingIn, setIsCountingIn] = useState(false);

  // Synth setup
  const synthRef = useRef<Tone.PolySynth | null>(null);

  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  const handleGenerate = useCallback(() => {
    const newXml = generateMusicXml(measures, scale, staff, voices, complexity);
    setScore(newXml);
    setIsMetronomePlaying(false); // Stop metronome on new exercise
  }, [measures, scale, staff, voices, complexity]);

  const handleNotePlayed = useCallback((note: number) => {
    setActiveNotes(prev => [...new Set([...prev, note])]);
    if (isSoundEnabled && synthRef.current) {
      synthRef.current.triggerAttack(Tone.Frequency(note, "midi").toFrequency());
    }
  }, [isSoundEnabled]);

  const handleNoteReleased = useCallback((note: number) => {
    setActiveNotes(prev => prev.filter(n => n !== note));
    if (synthRef.current) {
      synthRef.current.triggerRelease(Tone.Frequency(note, "midi").toFrequency());
    }
  }, []);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const renderHeader = () => (
    <nav className="main-nav">
      {(['Music Reading', 'Learn Theory - Beginner', 'Learn Theory - Advanced', 'Composition'] as Page[]).map((page) => (
        <button 
          key={page} 
          className={currentPage === page ? 'active' : ''} 
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}
    </nav>
  );

  const renderTrainerControls = () => (
    <div className="trainer-options">
      <div className="option-group">
        <label>Scale:</label>
        <select value={scale} onChange={(e) => setScale(e.target.value as Scale)}>
          <option>C Major</option>
          <option>G Major</option>
          <option>F Major</option>
          <option>D Major</option>
          <option>Bb Major</option>
          <option>A Minor</option>
          <option>E Minor</option>
        </select>
      </div>

      <div className="option-group">
        <label>Staff:</label>
        <select value={staff} onChange={(e) => setStaff(e.target.value as StaffType)}>
          <option value="Treble">Treble Staff</option>
          <option value="Bass">Bass Staff</option>
          <option value="Alto">Alto Staff</option>
          <option value="Treble8va">Treble 8va (Guitar)</option>
          <option value="Grand">Grand Staff</option>
        </select>
      </div>

      <div className="option-group">
        <label>Input:</label>
        <select value={inputSource} onChange={(e) => setInputSource(e.target.value as InputSource)}>
          <option value="MIDI">MIDI Device</option>
          <option value="Audio">Acoustic / Mic</option>
        </select>
      </div>

      <div className="option-group">
        <label>Sound:</label>
        <button 
          className={isSoundEnabled ? 'active' : ''} 
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          style={{ 
            padding: '6px 12px', 
            fontSize: '0.8rem',
            backgroundColor: isSoundEnabled ? '#646cff' : '#444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isSoundEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="option-group">
        <label>Voices:</label>
        <select value={voices} onChange={(e) => setVoices(parseInt(e.target.value))}>
          <option value={1}>1 Voice</option>
          <option value={2}>2 Voices</option>
        </select>
      </div>

      <div className="option-group">
        <label>Length:</label>
        <select value={measures} onChange={(e) => setMeasures(parseInt(e.target.value))}>
          <option value={4}>4 Bars</option>
          <option value={8}>8 Bars</option>
          <option value={16}>16 Bars</option>
          <option value={32}>32 Bars</option>
        </select>
      </div>

      <div className="option-group">
        <label>Mode:</label>
        <select value={playMode} onChange={(e) => setPlayMode(e.target.value as PlayMode)}>
          <option value="Wait">Wait for Note</option>
          <option value="Continuous">Continuous (BPM Sync)</option>
        </select>
      </div>

      <div className="option-group">
        <label>Complexity:</label>
        <select value={complexity} onChange={(e) => setComplexity(e.target.value as RhythmComplexity)}>
          <option value="Basic">Basic (Quarter only)</option>
          <option value="Intermediate">Intermediate (+8th, Half)</option>
          <option value="Advanced">Advanced (+Whole)</option>
        </select>
      </div>

      <div className="option-group">
        <label>Count-in:</label>
        <select value={countInBars} onChange={(e) => setCountInBars(parseInt(e.target.value))}>
          <option value={0}>None</option>
          <option value={1}>1 Bar</option>
          <option value={2}>2 Bars</option>
          <option value={3}>3 Bars</option>
          <option value={4}>4 Bars</option>
        </select>
      </div>

      <Metronome 
        bpm={bpm} 
        onBpmChange={setBpm} 
        isPlaying={isMetronomePlaying} 
        onToggle={setIsMetronomePlaying} 
        countInBars={countInBars}
        onCountInStart={() => setIsCountingIn(true)}
        onCountInComplete={() => setIsCountingIn(false)}
      />

      <button className="generate-btn" onClick={handleGenerate}>
        New Exercise
      </button>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Music Master Trainer</h1>
        {renderHeader()}
      </header>

      <main>
        {currentPage === 'Music Reading' && (
          <div className="reading-trainer">
            {renderTrainerControls()}
            
            {voices === 1 && (
              <div style={{ marginBottom: '15px' }}>
                <AudioInput 
                  isActive={inputSource === 'Audio'} 
                  onNoteDetected={handleNotePlayed} 
                  onNoteLost={handleNoteReleased} 
                />
              </div>
            )}

            <div className="sheet-music-container">
              <SheetMusic 
                title="Dynamic Reading Exercise"
                score={score} 
                zoom={zoom} 
                playMode={playMode}
                bpm={bpm}
                isMoving={isMetronomePlaying && !isCountingIn}
                onNotePlayed={handleNotePlayed}
                onNoteReleased={handleNoteReleased}
              />
              <div className="keyboard-preview">
                <MidiKeyboard activeNotes={activeNotes} />
              </div>
            </div>
            <div className="zoom-controls">
              <label>Zoom:</label>
              <input 
                type="range" min="0.5" max="2.0" step="0.1" 
                value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} 
              />
            </div>
          </div>
        )}

        {currentPage === 'Learn Theory - Beginner' && (
          <div className="theory-view">
            {!selectedLessonId ? (
              <div className="theory-selection">
                {!selectedModuleId ? (
                  <div className="module-selection">
                    <h2 style={{ padding: '0 20px' }}>Beginner Theory Modules</h2>
                    <div className="module-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', padding: '20px' }}>
                      {BEGINNER_MODULES.map((module) => (
                        <div key={module.id} className="module-card" style={{ background: '#1f1f1f', padding: '30px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #333', textAlign: 'left', transition: 'all 0.2s ease' }} onClick={() => setSelectedModuleId(module.id)}>
                          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: '#3498db' }}>{module.title}</h3>
                          {module.description && <p style={{ color: '#aaa', margin: '0 0 20px 0' }}>{module.description}</p>}
                          <button className="primary" style={{ width: '100%' }}>View Lessons</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="lesson-selection">
                    <div style={{ padding: '0 20px', textAlign: 'left' }}>
                      <button onClick={() => setSelectedModuleId(null)} style={{ marginBottom: '20px', background: 'transparent', border: '1px solid #555', color: '#fff' }}>&larr; Back to Modules</button>
                      <h2 style={{ margin: '0 0 10px 0' }}>{BEGINNER_MODULES.find(m => m.id === selectedModuleId)?.title}</h2>
                      <p style={{ color: '#aaa', marginBottom: '30px' }}>Select a lesson to begin.</p>
                    </div>
                    <div className="lesson-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', padding: '20px' }}>
                      {BEGINNER_MODULES.find(m => m.id === selectedModuleId)?.lessons.map((lesson) => (
                        <div key={lesson.id} className="lesson-card" style={{ background: '#1f1f1f', padding: '25px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #333', textAlign: 'left' }} onClick={() => setSelectedLessonId(lesson.id)}>
                          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.3rem' }}>{lesson.title}</h3>
                          <button className="primary" style={{ width: '100%' }}>Start Lesson</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setSelectedLessonId(null)} 
                  style={{ position: 'absolute', top: '-10px', left: '20px', zIndex: 10, background: '#444', color: '#fff', fontSize: '0.8rem', padding: '5px 10px' }}
                >
                  &larr; Exit Lesson
                </button>
                <TheoryTrainer 
                  lesson={BEGINNER_MODULES.find(m => m.id === selectedModuleId)?.lessons.find(l => l.id === selectedLessonId)!} 
                  onComplete={() => {
                    setSelectedLessonId(null);
                  }} 
                />
              </div>
            )}
          </div>
        )}

        {(currentPage === 'Learn Theory - Advanced' || currentPage === 'Composition') && (
          <div className="placeholder-view">
            <h2>{currentPage}</h2>
            <p>Content for {currentPage} is under development.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
