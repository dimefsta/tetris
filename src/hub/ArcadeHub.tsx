import { useEffect } from 'react';
import { sound } from '../v2/utils/audio';
import './hub.css';

interface ArcadeHubProps {
  onSelectMode: (mode: 'v1' | 'v2') => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

export function ArcadeHub({ onSelectMode, isMuted, onToggleSound }: ArcadeHubProps) {
  // Global keyboard shortcuts for instant mode selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === '1') {
        sound.playLaunch();
        onSelectMode('v1');
      } else if (e.key === '2') {
        sound.playLaunch();
        onSelectMode('v2');
      } else if (e.key.toLowerCase() === 'm') {
        onToggleSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectMode, onToggleSound]);

  const handleLaunch = (mode: 'v1' | 'v2') => {
    sound.playLaunch();
    onSelectMode(mode);
  };

  const handleHover = (isV1: boolean) => {
    if (!isV1) {
      sound.playSelect();
    }
  };

  return (
    <div className="arcade-hub">
      {/* Background ambient scanline texture */}
      <div className="hub-scanlines" />

      {/* Ambient background glows */}
      <div className="ambient-glow cyan" style={{ top: '5%', left: '5%' }} />
      <div className="ambient-glow purple" style={{ bottom: '10%', right: '5%' }} />

      {/* Hub Top Bar & Status */}
      <header className="hub-header">
        <div className="hub-top-bar">
          <div className="hub-system-pill">
            <span className="pulse-dot" />
            ARCADE CABINET READY • 2 EDITIONS LOADED
          </div>

          <button
            className="hub-audio-btn"
            onClick={onToggleSound}
            title={isMuted ? 'Unmute Sound (M)' : 'Mute Sound (M)'}
          >
            {isMuted ? '🔇 MUTED' : '🔊 SOUND ON'}
          </button>
        </div>

        <div className="hub-title-group">
          <h1 className="hub-main-title">
            <span style={{ color: 'var(--c-i)' }}>T</span>
            <span style={{ color: 'var(--c-l)' }}>E</span>
            <span style={{ color: 'var(--c-o)' }}>T</span>
            <span style={{ color: 'var(--c-s)' }}>R</span>
            <span style={{ color: 'var(--c-j)' }}>I</span>
            <span style={{ color: 'var(--c-t)' }}>S</span>
            <span style={{ color: 'var(--c-z)', marginLeft: '12px' }}>HUB</span>
          </h1>
          <p className="hub-subtitle">
            SELECT YOUR EDITION &amp; INSERT COIN
          </p>
        </div>
      </header>

      {/* Dual Edition Mode Selection Grid */}
      <main className="hub-modes-container">
        {/* CARD 1: 1ST EDITION (RAW / MINIMALIST) */}
        <section
          className="hub-mode-card card-v1"
          onClick={() => handleLaunch('v1')}
          onMouseEnter={() => handleHover(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleLaunch('v1')}
        >
          <div>
            <div className="hub-card-header">
              <div className="hub-card-edition">
                <span className="hub-card-icon">📄</span>
                <h2 className="hub-card-title">1ST EDITION</h2>
              </div>
              <span className="hub-card-badge">RAW &amp; UNSTYLED</span>
            </div>

            {/* Plain unstyled mockup of original 1st edition board */}
            <div className="hub-board-preview preview-v1">
              <div className="mini-preview-grid">
                <div className="mini-p-cell c-empty" />
                <div className="mini-p-cell c-empty" />
                <div className="mini-p-cell c-i" />
                <div className="mini-p-cell c-i" />
                <div className="mini-p-cell c-i" />
                <div className="mini-p-cell c-i" />
                <div className="mini-p-cell c-empty" />
                <div className="mini-p-cell c-empty" />

                <div className="mini-p-cell c-empty" />
                <div className="mini-p-cell c-l" />
                <div className="mini-p-cell c-empty" />
                <div className="mini-p-cell c-empty" />
                <div className="mini-p-cell c-o" />
                <div className="mini-p-cell c-o" />
                <div className="mini-p-cell c-empty" />
                <div className="mini-p-cell c-empty" />

                <div className="mini-p-cell c-l" />
                <div className="mini-p-cell c-l" />
                <div className="mini-p-cell c-l" />
                <div className="mini-p-cell c-empty" />
                <div className="mini-p-cell c-o" />
                <div className="mini-p-cell c-o" />
                <div className="mini-p-cell c-z" />
                <div className="mini-p-cell c-z" />

                <div className="mini-p-cell c-j" />
                <div className="mini-p-cell c-j" />
                <div className="mini-p-cell c-j" />
                <div className="mini-p-cell c-t" />
                <div className="mini-p-cell c-t" />
                <div className="mini-p-cell c-t" />
                <div className="mini-p-cell c-empty" />
                <div className="mini-p-cell c-z" />
              </div>
            </div>

            <p className="hub-card-desc">
              The original minimalist implementation from the repository. Pure simple HTML/CSS/JS without extra polish, neon effects, or added shaders.
            </p>

            <ul className="hub-card-features">
              <li><span>◽</span> <strong>10×20 Pure Grid</strong> - Original HTML/CSS</li>
              <li><span>◽</span> <strong>Interval Tick Gravity</strong> - Authentic unaccelerated drop</li>
              <li><span>◽</span> <strong>Original Scoring</strong> - 100/300/500/800 pts</li>
              <li><span>◽</span> <strong>Zero Shaders or Glow</strong> - Unadulterated simplicity</li>
            </ul>
          </div>

          <div className="hub-card-actions">
            <button className="hub-launch-btn">
              PLAY 1ST EDITION →
            </button>
            <span className="hub-hotkey-hint">Press <kbd>1</kbd> to launch</span>
          </div>
        </section>

        {/* CARD 2: MODERN NEON EDITION (V2) */}
        <section
          className="hub-mode-card card-v2"
          onClick={() => handleLaunch('v2')}
          onMouseEnter={() => handleHover(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleLaunch('v2')}
        >
          <div>
            <div className="hub-card-header">
              <div className="hub-card-edition">
                <span className="hub-card-icon">🚀</span>
                <h2 className="hub-card-title">MODERN NEON</h2>
              </div>
              <span className="hub-card-badge">EDITION V2</span>
            </div>

            {/* Mini preview mockup of modern neon board */}
            <div className="hub-board-preview preview-v2">
              <div className="mini-preview-grid">
                <div className="mini-p-cell m-empty" />
                <div className="mini-p-cell m-empty" />
                <div className="mini-p-cell m-i" />
                <div className="mini-p-cell m-i" />
                <div className="mini-p-cell m-i" />
                <div className="mini-p-cell m-i" />
                <div className="mini-p-cell m-empty" />
                <div className="mini-p-cell m-empty" />

                <div className="mini-p-cell m-empty" />
                <div className="mini-p-cell m-empty" />
                <div className="mini-p-cell m-ghost" />
                <div className="mini-p-cell m-ghost" />
                <div className="mini-p-cell m-ghost" />
                <div className="mini-p-cell m-ghost" />
                <div className="mini-p-cell m-empty" />
                <div className="mini-p-cell m-empty" />

                <div className="mini-p-cell m-t" />
                <div className="mini-p-cell m-t" />
                <div className="mini-p-cell m-t" />
                <div className="mini-p-cell m-empty" />
                <div className="mini-p-cell m-s" />
                <div className="mini-p-cell m-s" />
                <div className="mini-p-cell m-empty" />
                <div className="mini-p-cell m-empty" />

                <div className="mini-p-cell m-empty" />
                <div className="mini-p-cell m-t" />
                <div className="mini-p-cell m-j" />
                <div className="mini-p-cell m-j" />
                <div className="mini-p-cell m-s" />
                <div className="mini-p-cell m-s" />
                <div className="mini-p-cell m-j" />
                <div className="mini-p-cell m-j" />
              </div>
            </div>

            <p className="hub-card-desc">
              Supercharged modern arcade experience featuring glowing neon shaders, Web Audio 8-bit synth sound FX, ghost piece, hold piece chamber, and combo streaks.
            </p>

            <ul className="hub-card-features">
              <li><span>🌌</span> <strong>Cyber Neon Shaders</strong> - Ambient glowing cells</li>
              <li><span>👻</span> <strong>Ghost Piece &amp; Hard Drop</strong> - Fast targeting</li>
              <li><span>🔄</span> <strong>Hold Slot &amp; 3-Piece Queue</strong> - Deep tactics</li>
              <li><span>🔊</span> <strong>Web Audio Synthesizer</strong> - Authentic 8-bit FX</li>
            </ul>
          </div>

          <div className="hub-card-actions">
            <button className="hub-launch-btn">
              LAUNCH MODERN V2 ⚡
            </button>
            <span className="hub-hotkey-hint">Press <kbd>2</kbd> to launch</span>
          </div>
        </section>
      </main>

      {/* Footer Navigation and System Info */}
      <footer className="hub-footer">
        <div>
          <span>Keyboard Shortcuts: </span>
          <span style={{ color: '#cbd5e1' }}>
            <kbd>[1]</kbd> 1st Edition • <kbd>[2]</kbd> Modern V2 • <kbd>[M]</kbd> Mute Audio • <kbd>[Esc]</kbd> Hub
          </span>
        </div>

        <div className="hub-footer-links">
          <a
            href="https://github.com/dimefsta/tetris"
            target="_blank"
            rel="noopener noreferrer"
            title="Original GitHub Repository"
          >
            GitHub: dimefsta/tetris
          </a>
        </div>
      </footer>
    </div>
  );
}

export default ArcadeHub;
