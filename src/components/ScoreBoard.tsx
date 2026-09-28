interface Props {
  score: number;
  highScore: number;
  level: number;
  lines: number;
}

function ScoreBoard({ score, highScore, level, lines }: Props) {
  return (
    <div className="arcade-card scoreboard-card">
      <div className="card-header">
        <span className="card-title">STATUS</span>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">SCORE</span>
          <span className="stat-value neon-cyan">{score.toLocaleString()}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">HIGH SCORE</span>
          <span className="stat-value neon-gold">{highScore.toLocaleString()}</span>
        </div>

        <div className="stat-divider" />

        <div className="stat-row">
          <div className="stat-item compact">
            <span className="stat-label">LEVEL</span>
            <span className="stat-value neon-green">{level}</span>
          </div>

          <div className="stat-item compact">
            <span className="stat-label">LINES</span>
            <span className="stat-value neon-purple">{lines}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoreBoard;
