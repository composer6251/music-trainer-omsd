import React, { useState, useCallback } from 'react';
import type { TheoryLesson } from '../types/theory';
import SheetMusic from './SheetMusic';
import MidiKeyboard from './MidiKeyboard';

interface TheoryTrainerProps {
  lesson: TheoryLesson;
  onComplete: () => void;
}

const TheoryTrainer: React.FC<TheoryTrainerProps> = ({ lesson, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isStepSolved, setIsStepSolved] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeNotes, setActiveNotes] = useState<number[]>([]);

  const currentStep = lesson.steps[currentStepIndex];

  const handleNotePlayed = useCallback((note: number) => {
    setActiveNotes(prev => [...new Set([...prev, note])]);
    if (isStepSolved) return;

    const validation = currentStep.validation;
    if (validation.type === 'MATCH_PITCH') {
      if (validation.expectedPitches?.includes(note)) {
        setIsStepSolved(true);
        setFeedback(currentStep.successMessage);
      } else {
        setFeedback('Try again!');
      }
    }
  }, [currentStep, isStepSolved]);

  const handleNoteReleased = useCallback((note: number) => {
    setActiveNotes(prev => prev.filter(n => n !== note));
  }, []);

  const goToNextStep = () => {
    if (currentStepIndex < lesson.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setIsStepSolved(false);
      setFeedback(null);
    } else {
      onComplete();
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setIsStepSolved(false);
      setFeedback(null);
    }
  };

  return (
    <div className="theory-trainer">
      <div className="lesson-header">
        <h3>{lesson.moduleTitle}</h3>
        <div className="progress-bar">
          Step {currentStepIndex + 1} of {lesson.steps.length}
        </div>
      </div>

      <div className="lesson-body">
        <div className="instruction-card">
          <h4>{currentStep.title}</h4>
          <p className="instruction-text">{currentStep.instruction}</p>
          
          {feedback && (
            <div className={`feedback-message ${isStepSolved ? 'success' : 'error'}`}>
              {feedback}
            </div>
          )}

          <div className="step-navigation">
            <button onClick={goToPrevStep} disabled={currentStepIndex === 0}>
              Back
            </button>
            <button 
              onClick={goToNextStep} 
              disabled={!isStepSolved}
              className={isStepSolved ? 'primary' : ''}
            >
              {currentStepIndex === lesson.steps.length - 1 ? 'Finish Lesson' : 'Next Step'}
            </button>
          </div>
        </div>

        <div className="sheet-music-container">
          {currentStep.musicXml && (
            <SheetMusic 
              title={currentStep.title}
              score={currentStep.musicXml} 
              zoom={1.5} 
              playMode="Wait" 
              bpm={100} 
              isMoving={false}
              onNotePlayed={handleNotePlayed}
              onNoteReleased={handleNoteReleased}
            />
          )}
          <div className="keyboard-section">
            <MidiKeyboard 
              activeNotes={activeNotes} 
              startNote={60} 
              endNote={72} 
            />
          </div>
        </div>
      </div>


      <style>{`
        .theory-trainer {
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: left;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .lesson-header {
          border-bottom: 3px solid #3498db;
          padding-bottom: 15px;
          margin-bottom: 10px;
        }
        .lesson-header h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.8rem;
        }
        .progress-bar {
          color: #7f8c8d;
          font-weight: bold;
          margin-top: 5px;
        }
        .lesson-body {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 40px;
          align-items: start;
        }
        .instruction-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          border: 1px solid #e0e0e0;
        }
        .instruction-card h4 {
          margin-top: 0;
          color: #3498db;
          font-size: 1.4rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .instruction-text {
          font-size: 1.25rem;
          line-height: 1.7;
          margin: 20px 0;
          color: #34495e;
          font-weight: 500;
        }
        .feedback-message {
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          font-weight: bold;
          font-size: 1.1rem;
          text-align: center;
          border: 2px solid transparent;
        }
        .feedback-message.success {
          background: #e8f5e9;
          color: #2e7d32;
          border-color: #2e7d32;
        }
        .feedback-message.error {
          background: #ffebee;
          color: #c62828;
          border-color: #c62828;
        }
        .step-navigation {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .step-navigation button {
          padding: 12px 20px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 8px;
        }
        .step-navigation button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        button.primary {
          background-color: #2ecc71;
          color: white;
          border: none;
          box-shadow: 0 4px 0 #27ae60;
        }
        button.primary:not(:disabled):hover {
          background-color: #27ae60;
          transform: translateY(-2px);
          box-shadow: 0 6px 0 #219150;
        }
        button.primary:active {
          transform: translateY(2px);
          box-shadow: 0 0 0 #219150;
        }
        .sheet-music-container {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          border: 1px solid #eee;
          min-height: 300px;
        }
        .keyboard-section {
          margin-top: 20px;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        @media (max-width: 1000px) {
          .lesson-body {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TheoryTrainer;
