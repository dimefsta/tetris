import { useEffect } from 'react';
import Board from './components/Board';
import HoldPiece from './components/HoldPiece';
import UpcomingBlocks from './components/UpcomingBlocks';
import ScoreBoard from './components/ScoreBoard';
import ControlsGuide from './components/ControlsGuide';
import { useTetris } from './hooks/useTetris';

interface ModernTetrisProps {
  onNavigate: (view: 'hub' | 'v1' | 'v2') => void;
}

export function ModernTetris({ onNavigate }: ModernTetrisProps) {
  const {
    board,
    droppingRow,
    droppingColumn,
    droppingBlock,
    droppingShape,
    ghostRow,
    upcomingBlocks,
    heldBlock,
    canHold,
    score,
    highScore,
    lines,
    level,
    isPlaying,
    isPaused,
    isGameOver,
    clearingRows,
    clearMessage,
    isMuted,
    startGame,
    togglePause,
    toggleSound,
    moveLeft,
    moveRight,
    rotatePiece,
    softDrop,
    stopSoftDrop,
    hardDrop,
    holdPiece,
  } = useTetris();

  // Allow Escape key to return to Hub
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
    <div className="arcade-cabinet">
      {/* Background ambient neon glow effects */}
      <div className="ambient-glow cyan" />
      <div className="ambient-glow purple" />

      {/* Arcade Header with Navigation */}
      <header className="arcade-header">
        <div className="logo-group">
          <button
            className="action-pill-btn nav-hub-btn"
            onClick={() => onNavigate('hub')}
            title="Return to Main Menu (Esc)"
          >
            🏠 HUB
          </button>

          <h1 className="arcade-title">
            <span className="letter-t">T</span>
            <span className="letter-e">E</span>
            <span className="letter-t2">T</span>
            <span className="letter-r">R</span>
            <span className="letter-i">I</span>
            <span className="letter-s">S</span>
          </h1>
          <span className="arcade-badge">NEON V2</span>
        </div>

        <div className="header-actions">
          <button
            className="action-pill-btn switch-v1-btn"
            onClick={() => onNavigate('v1')}
            title="Switch to 1st Edition (V1)"
          >
            🕹️ 1ST EDITION
          </button>

          <button
            className={`action-icon-btn ${isMuted ? 'muted' : ''}`}
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Toggle Sound"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {isPlaying && (
            <button
              className="action-pill-btn"
              onClick={togglePause}
              title="Pause Game (P)"
            >
              {isPaused ? '▶ RESUME' : '❚❚ PAUSE'}
            </button>
          )}

          <button
            className="action-pill-btn primary"
            onClick={startGame}
          >
            {isPlaying ? 'RESTART' : 'NEW GAME'}
          </button>
        </div>
      </header>

      {/* Main Arena */}
      <main className="game-arena">
        {/* Left Wing: Hold Piece */}
        <aside className="arena-wing left-wing">
          <HoldPiece
            heldBlock={heldBlock}
            canHold={canHold}
            onHold={holdPiece}
          />
        </aside>

        {/* Center: Main Game Board */}
        <section className="arena-center">
          <Board
            currentBoard={board}
            droppingShape={isPlaying ? droppingShape : null}
            droppingRow={droppingRow}
            droppingColumn={droppingColumn}
            droppingBlock={droppingBlock}
            ghostRow={isPlaying ? ghostRow : null}
            clearingRows={clearingRows}
            isPlaying={isPlaying}
            isPaused={isPaused}
            isGameOver={isGameOver}
            clearMessage={clearMessage}
            score={score}
            highScore={highScore}
            onRestart={startGame}
            onResume={togglePause}
          />
        </section>

        {/* Right Wing: Status & Upcoming Next Pieces */}
        <aside className="arena-wing right-wing">
          <ScoreBoard
            score={score}
            highScore={highScore}
            level={level}
            lines={lines}
          />
          <UpcomingBlocks upcomingBlocks={upcomingBlocks} />
        </aside>
      </main>

      {/* On-screen controls & Keyboard guide */}
      <footer className="arcade-footer">
        <ControlsGuide
          onMoveLeft={moveLeft}
          onMoveRight={moveRight}
          onRotateCW={() => rotatePiece(true)}
          onRotateCCW={() => rotatePiece(false)}
          onSoftDrop={softDrop}
          onStopSoftDrop={stopSoftDrop}
          onHardDrop={hardDrop}
          onHold={holdPiece}
          isPlaying={isPlaying && !isPaused}
          canHold={canHold}
        />
      </footer>
    </div>
  );
}

export default ModernTetris;
