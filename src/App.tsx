import { useState, useEffect, useCallback } from 'react'
import './App.css'
import SheetMusic from './components/SheetMusic'
import Metronome from './components/Metronome'
import TheoryTrainer from './components/TheoryTrainer'
import { generateMusicXml } from './utils/musicXmlGenerator'
import { BEGINNER_LESSONS } from './data/lessons'
import type { Scale, StaffType, RhythmComplexity } from './utils/musicXmlGenerator'

type Page = 'Music Reading' | 'Learn Theory - Beginner' | 'Learn Theory - Advanced' | 'Composition';
export type PlayMode = 'Wait' | 'Continuous';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('Music Reading');
  const [zoom, setZoom] = useState(1.0);
  const [score, setScore] = useState<string>('');
  
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

  const handleGenerate = useCallback(() => {
    const newXml = generateMusicXml(measures, scale, staff, voices, complexity);
    setScore(newXml);
    setIsMetronomePlaying(false); // Stop metronome on new exercise
  }, [measures, scale, staff, voices, complexity]);

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

      <Metronome 
        bpm={bpm} 
        onBpmChange={setBpm} 
        isPlaying={isMetronomePlaying} 
        onToggle={setIsMetronomePlaying} 
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
            <div className="sheet-music-container">
              <SheetMusic 
                score={score} 
                zoom={zoom} 
                playMode={playMode}
                bpm={bpm}
                isMoving={isMetronomePlaying}
              />
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
            <TheoryTrainer 
              lesson={BEGINNER_LESSONS[0]} 
              onComplete={() => setCurrentPage('Music Reading')} 
            />
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
