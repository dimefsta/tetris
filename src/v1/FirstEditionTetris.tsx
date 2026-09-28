import { useEffect } from 'react';
import Board from './components/Board';
import UpcomingBlocks from './components/UpcomingBlocks';
import { useTetris } from './hooks/useTetris';
import './firstEdition.css';

interface FirstEditionTetrisProps {
  onNavigate: (view: 'hub' | 'v1' | 'v2') => void;
}

export function FirstEditionTetris({ onNavigate }: FirstEditionTetrisProps) {
  const { board, startGame, isPlaying, score, upcomingBlocks } = useTetris();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onNavigate('hub');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  return (
    <div className="first-edition-root">
      {/* Minimal Top Navigation */}
      <div className="v1-nav-bar">
        <span className="v1-title-label">1st Edition (Original)</span>
        <div className="v1-nav-actions">
          <button
            className="v1-nav-btn"
            onClick={() => onNavigate('hub')}
            title="Return to Main Menu (Esc)"
          >
            ← Main Menu
          </button>
          <button
            className="v1-nav-btn"
            onClick={() => onNavigate('v2')}
            title="Launch Modern V2"
          >
            Modern V2 →
          </button>
        </div>
      </div>

      {/* Raw Original Game Layout */}
      <div className="app">
        <h1>Tetris</h1>
        <Board currentBoard={board} />
        <div className="controls">
          <h2>Score: {score}</h2>
          {isPlaying ? (
            <UpcomingBlocks upcomingBlocks={upcomingBlocks} />
          ) : (
            <button onClick={startGame}>New Game</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FirstEditionTetris;
