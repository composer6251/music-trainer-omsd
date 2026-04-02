import React, { useState, useCallback } from 'react';
import type { TheoryLesson } from '../types/theory';
import SheetMusic from './SheetMusic';

interface TheoryTrainerProps {
  lesson: TheoryLesson;
  onComplete: () => void;
}

const TheoryTrainer: React.FC<TheoryTrainerProps> = ({ lesson, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isStepSolved, setIsStepSolved] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentStep = lesson.steps[currentStepIndex];

  const handleNotePlayed = useCallback((note: number) => {
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
              score={currentStep.musicXml} 
              zoom={1.5} 
              playMode="Wait" 
              bpm={100} 
              isMoving={false}
              onNotePlayed={handleNotePlayed}
            />
          )}
        </div>
      </div>

      <style>{`
        .theory-trainer {
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: left;
        }
        .lesson-header {
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
        }
        .lesson-body {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 30px;
        }
        .instruction-card {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .instruction-text {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .feedback-message {
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-weight: bold;
        }
        .feedback-message.success {
          background: #e8f5e9;
          color: #2e7d32;
        }
        .feedback-message.error {
          background: #ffebee;
          color: #c62828;
        }
        .step-navigation {
          display: flex;
          gap: 10px;
        }
        button.primary {
          background-color: #2ecc71;
          color: white;
          border-color: #27ae60;
        }
        @media (max-width: 900px) {
          .lesson-body {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TheoryTrainer;
