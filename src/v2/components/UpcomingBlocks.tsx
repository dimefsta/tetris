import { Block, SHAPES } from '../types';

interface Props {
  upcomingBlocks: Block[];
}

function UpcomingBlocks({ upcomingBlocks }: Props) {
  // Show top 3 upcoming pieces
  const previewList = upcomingBlocks.slice(0, 3);

  return (
    <div className="arcade-card upcoming-card">
      <div className="card-header">
        <span className="card-title">NEXT</span>
      </div>

      <div className="upcoming-list">
        {previewList.length > 0 ? (
          previewList.map((block, index) => {
            const shape = SHAPES[block].shape;
            const isPrimaryNext = index === 0;

            return (
              <div
                key={`${block}-${index}`}
                className={`upcoming-item ${isPrimaryNext ? 'primary-next' : 'sub-next'}`}
              >
                <div className="mini-grid">
                  {shape.map((row, rIdx) => (
                    <div key={rIdx} className="mini-row">
                      {row.map((cell, cIdx) => (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={`mini-cell ${cell ? `block block-${block}` : 'empty-mini'}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="upcoming-item primary-next upcoming-empty-hint">
            <div className="hold-empty-hint">
              <span>[READY]</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpcomingBlocks;
