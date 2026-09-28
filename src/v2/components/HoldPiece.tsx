import { Block, SHAPES } from '../types';

interface Props {
  heldBlock: Block | null;
  canHold: boolean;
  onHold?: () => void;
}

function HoldPiece({ heldBlock, canHold, onHold }: Props) {
  return (
    <div
      className={`arcade-card hold-card ${!canHold ? 'hold-locked' : ''}`}
      onClick={canHold ? onHold : undefined}
      title="Press C or Shift to Hold"
    >
      <div className="card-header">
        <span className="card-title">HOLD</span>
        <span className="shortcut-badge">C / Shift</span>
      </div>

      <div className="preview-container">
        {heldBlock ? (
          <div className={`mini-grid block-${heldBlock}`}>
            {SHAPES[heldBlock].shape.map((row, rIdx) => (
              <div key={rIdx} className="mini-row">
                {row.map((cell, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`mini-cell ${cell ? `block block-${heldBlock}` : 'empty-mini'}`}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="hold-empty-hint">
            <span>[EMPTY]</span>
          </div>
        )}
      </div>

      <div className="card-footer-hint">
        {canHold ? 'READY' : 'LOCKED'}
      </div>
    </div>
  );
}

export default HoldPiece;
