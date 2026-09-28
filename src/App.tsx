import { useEffect, useState } from 'react';
import ArcadeHub from './hub/ArcadeHub';
import FirstEditionTetris from './v1/FirstEditionTetris';
import ModernTetris from './v2/ModernTetris';
import { sound } from './v2/utils/audio';

export type AppView = 'hub' | 'v1' | 'v2';

function parseViewFromHash(): AppView {
  const hash = window.location.hash.toLowerCase();
  if (hash.includes('v1') || hash.includes('1st-edition') || hash.includes('first-edition')) {
    return 'v1';
  }
  if (hash.includes('v2') || hash.includes('modern')) {
    return 'v2';
  }
  return 'hub';
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>(parseViewFromHash);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  // Synchronize route with hashchange (supports browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const newView = parseViewFromHash();
      setCurrentView(newView);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (view: AppView) => {
    setCurrentView(view);
    const targetHash = view === 'hub' ? '#/' : `#/${view}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className={`tetris-app-root view-${currentView}`}>
      {currentView === 'hub' && (
        <ArcadeHub
          onSelectMode={navigate}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
        />
      )}
      {currentView === 'v1' && (
        <FirstEditionTetris onNavigate={navigate} />
      )}
      {currentView === 'v2' && (
        <ModernTetris onNavigate={navigate} />
      )}
    </div>
  );
}

export default App;
