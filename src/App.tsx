import { useState } from 'react'
import './App.css'
import SheetMusic from './components/SheetMusic'
import { generateRandomNotes } from './utils/musicXmlGenerator'

function App() {
  const [zoom, setZoom] = useState(1.0)
  const [score, setScore] = useState<string>('/sample.musicxml')

  const handleGenerateRandom = () => {
    const newXml = generateRandomNotes(12);
    setScore(newXml);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Music Trainer Prototype</h1>
        <div className="controls">
          <label>
            Zoom: 
            <input 
              type="range" 
              min="0.5" 
              max="2.0" 
              step="0.1" 
              value={zoom} 
              onChange={(e) => setZoom(parseFloat(e.target.value))} 
            />
            {zoom.toFixed(1)}
          </label>
          <button onClick={() => setScore('/sample.musicxml')}>Load Scale</button>
          <button onClick={handleGenerateRandom} style={{ backgroundColor: '#4CAF50', color: 'white' }}>
            Generate Random Exercise
          </button>
        </div>
      </header>
      <main>
        <div className="sheet-music-container">
          <SheetMusic score={score} zoom={zoom} />
        </div>
      </main>
      <section className="theory-section">
        <h2>Music Theory: Random Generation</h2>
        <p>Dynamic generation allows for endless sight-reading practice. This exercise generates random notes from the C Major scale across two octaves.</p>
      </section>
    </div>
  )
}

export default App
