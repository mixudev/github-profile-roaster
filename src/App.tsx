import React from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { useSound } from './hooks/useSound';
import { useRoaster } from './hooks/useRoaster';

import { InputScreen } from './components/InputScreen.tsx';
import { LoadingScreen } from './components/LoadingScreen.tsx';
import { ResultScreen } from './components/ResultScreen.tsx';

type AppView = 'input' | 'loading' | 'result';

export default function App() {
  const { playSound } = useSound(true);
  const roaster = useRoaster();

  // Derive current view from roaster state
  const view: AppView = roaster.loading
    ? 'loading'
    : roaster.roastResult
    ? 'result'
    : 'input';

  return (
    <div className="min-h-screen bg-[#FFEF00] font-mono scanlines selection:bg-black selection:text-[#FFEF00]">
      <AnimatePresence mode="wait">
        {view === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <InputScreen
              username={roaster.username}
              heatLevel={roaster.heatLevel}
              language={roaster.language}
              loading={roaster.loading}
              error={roaster.error}
              onUsernameChange={roaster.setUsername}
              onHeatLevelChange={roaster.setHeatLevel}
              onLanguageChange={roaster.setLanguage}
              onSubmit={(e) => roaster.handleRoastRequest(e, playSound)}
              onPresetSelect={(key) => roaster.handlePresetSelect(key, playSound)}
              onPlaySound={playSound}
            />
          </motion.div>
        )}

        {view === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="min-h-screen"
          >
            <LoadingScreen
              username={roaster.username}
              avatarUrl={roaster.fetchedProfile?.avatar_url}
              language={roaster.language}
              loadingStep={roaster.loadingStep}
              loadingSteps={roaster.activeLoadingSteps}
            />
          </motion.div>
        )}

        {view === 'result' && roaster.roastResult && roaster.fetchedProfile && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="min-h-screen"
          >
            <ResultScreen
              roastResult={roaster.roastResult}
              profile={roaster.fetchedProfile}
              repos={roaster.fetchedRepos}
              language={roaster.language}
              heatLevel={roaster.heatLevel}
              copied={roaster.copied}
              activeProvider={roaster.activeProvider}
              onCopy={() => roaster.handleCopy(playSound)}
              onReset={() => roaster.handleReset(playSound)}
              onQuickRoast={(u) => roaster.handleQuickRoast(u, playSound)}
              onLanguageChange={roaster.setLanguage}
              onHeatLevelChange={roaster.setHeatLevel}
              onPlaySound={playSound}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
