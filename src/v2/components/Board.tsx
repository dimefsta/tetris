import Cell from './Cell';
import { Block, BlockShape, BoardShape, EmptyCell } from '../types';

interface Props {
  currentBoard: BoardShape;
  droppingShape: BlockShape | null;
  droppingRow: number;
  droppingColumn: number;
  droppingBlock: Block;
  ghostRow: number | null;
  clearingRows: number[];
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  clearMessage: { text: string; id: number } | null;
  score: number;
  highScore: number;
  onRestart: () => void;
  onResume: () => void;
}

function Board({
  currentBoard,
  droppingShape,
  droppingRow,
  droppingColumn,
  droppingBlock,
  ghostRow,
  clearingRows,
  isPlaying,
  isPaused,
  isGameOver,
  clearMessage,
  score,
  highScore,
  onRestart,
  onResume,
}: Props) {
  return (
    <div className="board-wrapper">
      <div className="board-bezel">
        <div className="board">
          {currentBoard.map((row, rowIndex) => {
            const isClearing = clearingRows.includes(rowIndex);

            return (
              <div
                className={`row ${isClearing ? 'row-clearing' : ''}`}
                key={`row-${rowIndex}`}
              >
                {row.map((cell, colIndex) => {
                  let isActive = false;
                  if (isPlaying && droppingShape) {
                    const shapeR = rowIndex - droppingRow;
                    const shapeC = colIndex - droppingColumn;
                    if (
                      shapeR >= 0 &&
                      shapeR < droppingShape.length &&
                      shapeC >= 0 &&
                      shapeC < droppingShape[0].length &&
                      droppingShape[shapeR][shapeC]
                    ) {
                      isActive = true;
                    }
                  }

                  let isGhost = false;
                  if (
                    isPlaying &&
                    !isActive &&
                    ghostRow !== null &&
                    ghostRow !== droppingRow &&
                    droppingShape
                  ) {
                    const shapeR = rowIndex - ghostRow;
                    const shapeC = colIndex - droppingColumn;
                    if (
                      shapeR >= 0 &&
                      shapeR < droppingShape.length &&
                      shapeC >= 0 &&
                      shapeC < droppingShape[0].length &&
                      droppingShape[shapeR][shapeC]
                    ) {
                      isGhost = true;
                    }
                  }

                  const cellType = isActive
                    ? droppingBlock
                    : cell;

                  return (
                    <Cell
                      key={`cell-${rowIndex}-${colIndex}`}
                      type={cellType}
                      isGhost={isGhost}
                      ghostType={isGhost ? droppingBlock : null}
                      isClearing={isClearing && cell !== EmptyCell.Empty}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Line Clear Popup */}
        {clearMessage && (
          <div key={clearMessage.id} className="clear-toast">
            {clearMessage.text}
          </div>
        )}

        {/* Pause Overlay */}
        {isPaused && (
          <div className="board-overlay pause-overlay">
            <div className="overlay-content">
              <h2 className="overlay-title">PAUSED</h2>
              <p className="overlay-subtitle">Take a breather</p>
              <button className="arcade-btn primary" onClick={onResume}>
                RESUME
              </button>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="board-overlay gameover-overlay">
            <div className="overlay-content">
              <h2 className="overlay-title gameover-title">GAME OVER</h2>
              <div className="overlay-score-box">
                <div className="overlay-stat">
                  <span>FINAL SCORE</span>
                  <span className="stat-number highlight">{score}</span>
                </div>
                {score >= highScore && score > 0 && (
                  <div className="new-high-badge">★ NEW HIGH SCORE! ★</div>
                )}
              </div>
              <button className="arcade-btn primary pulse" onClick={onRestart}>
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}

        {/* Start Game Overlay when not playing and not game over */}
        {!isPlaying && !isGameOver && (
          <div className="board-overlay start-overlay">
            <div className="overlay-content">
              <div className="arcade-logo">TETRIS</div>
              <p className="arcade-tagline">ARCADE EDITION</p>
              <button className="arcade-btn primary pulse" onClick={onRestart}>
                START GAME
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Board;
