import { useState } from 'react'
import './App.css'
import SheetMusic from './components/SheetMusic'

function App() {
  const [zoom, setZoom] = useState(1.0)
  const [scoreUrl, setScoreUrl] = useState('/sample.musicxml')

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
          <button onClick={() => setScoreUrl('/sample.musicxml')}>Reset Score</button>
        </div>
      </header>
      <main>
        <div className="sheet-music-container">
          <SheetMusic url={scoreUrl} zoom={zoom} />
        </div>
      </main>
      <section className="theory-section">
        <h2>Music Theory: C Major Scale</h2>
        <p>The C major scale consists of the notes: C, D, E, F, G, A, B. It has no sharps or flats.</p>
      </section>
    </div>
  )
}

export default App
