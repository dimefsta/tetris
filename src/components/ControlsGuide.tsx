interface Props {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotateCW: () => void;
  onRotateCCW: () => void;
  onSoftDrop: () => void;
  onStopSoftDrop: () => void;
  onHardDrop: () => void;
  onHold: () => void;
  isPlaying: boolean;
  canHold: boolean;
}

function ControlsGuide({
  onMoveLeft,
  onMoveRight,
  onRotateCW,
  onRotateCCW,
  onSoftDrop,
  onStopSoftDrop,
  onHardDrop,
  onHold,
  isPlaying,
  canHold,
}: Props) {
  return (
    <div className="controls-container">
      {/* Mobile/Touch Arcade Buttons */}
      <div className="touch-controls">
        <div className="touch-group d-pad">
          <button
            className="touch-btn"
            onClick={onMoveLeft}
            disabled={!isPlaying}
            aria-label="Move Left"
          >
            ◀
          </button>
          <button
            className="touch-btn"
            onMouseDown={onSoftDrop}
            onMouseUp={onStopSoftDrop}
            onTouchStart={onSoftDrop}
            onTouchEnd={onStopSoftDrop}
            disabled={!isPlaying}
            aria-label="Soft Drop"
          >
            ▼
          </button>
          <button
            className="touch-btn"
            onClick={onMoveRight}
            disabled={!isPlaying}
            aria-label="Move Right"
          >
            ▶
          </button>
        </div>

        <div className="touch-group actions">
          <button
            className="touch-btn util-btn"
            onClick={onHold}
            disabled={!isPlaying || !canHold}
            title="Hold Piece"
          >
            HOLD
          </button>
          <button
            className="touch-btn rotate-btn"
            onClick={onRotateCCW}
            disabled={!isPlaying}
            title="Rotate Left"
          >
            ↺
          </button>
          <button
            className="touch-btn rotate-btn highlight"
            onClick={onRotateCW}
            disabled={!isPlaying}
            title="Rotate Right"
          >
            ↻
          </button>
          <button
            className="touch-btn drop-btn"
            onClick={onHardDrop}
            disabled={!isPlaying}
            title="Hard Drop"
          >
            DROP ⤓
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Bar */}
      <div className="keyboard-shortcuts">
        <div className="shortcut-tag">
          <kbd>←</kbd> <kbd>→</kbd> Move
        </div>
        <div className="shortcut-tag">
          <kbd>↑</kbd> Rotate
        </div>
        <div className="shortcut-tag">
          <kbd>Z</kbd> CCW
        </div>
        <div className="shortcut-tag">
          <kbd>↓</kbd> Soft Drop
        </div>
        <div className="shortcut-tag">
          <kbd>Space</kbd> Hard Drop
        </div>
        <div className="shortcut-tag">
          <kbd>C</kbd> Hold
        </div>
        <div className="shortcut-tag">
          <kbd>P</kbd> Pause
        </div>
      </div>
    </div>
  );
}

export default ControlsGuide;
