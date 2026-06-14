import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';

import { useSound } from './hooks/useSound';
import { useRoaster } from './hooks/useRoaster';

import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ProfileCard } from './components/ProfileCard';
import { PresetsPanel } from './components/PresetsPanel';
import { LoadingTerminal } from './components/LoadingTerminal';
import { RoastResultPanel } from './components/RoastResult';
import { EmptyState } from './components/EmptyState';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Footer } from './components/Footer';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playSound } = useSound(soundEnabled);

  const roaster = useRoaster();

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
    playSound('click');
  };

  return (
    <div className="min-h-screen bg-[#FFEF00] text-black font-mono border-[16px] border-black p-4 md:p-10 flex flex-col justify-between scanlines selection:bg-black selection:text-[#FFEF00]">

      <Header
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        activeProvider={roaster.activeProvider}
      />

      <main className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-8 relative z-20 items-stretch">

        {/* LEFT COLUMN */}
        <div className="col-span-12 md:col-span-5 flex flex-col gap-6">
          <InputPanel
            username={roaster.username}
            heatLevel={roaster.heatLevel}
            language={roaster.language}
            loading={roaster.loading}
            onUsernameChange={roaster.setUsername}
            onHeatLevelChange={roaster.setHeatLevel}
            onLanguageChange={roaster.setLanguage}
            onSubmit={(e) => roaster.handleRoastRequest(e, playSound)}
            onPlaySound={playSound}
          />

          {roaster.error && <ErrorDisplay error={roaster.error} />}

          {roaster.fetchedProfile && (
            <ProfileCard
              profile={roaster.fetchedProfile}
              repos={roaster.fetchedRepos}
              language={roaster.language}
            />
          )}

          {!roaster.fetchedProfile && (
            <PresetsPanel
              language={roaster.language}
              onSelect={(key) => roaster.handlePresetSelect(key, playSound)}
              onPlaySound={playSound}
            />
          )}

          <div className="hidden md:block flex-grow border-4 border-dashed border-black opacity-25" />
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-12 md:col-span-7 flex flex-col h-full min-h-[450px]">
          <div className="bg-black text-white px-4 py-2 text-xl font-black uppercase inline-block self-start border-l-8 border-r-8 border-t-8 border-black">
            {roaster.language === 'id' ? 'Hasil Keputusan' : 'The Verdict'}
          </div>

          <div className="flex-grow border-8 border-black bg-white p-6 md:p-8 shadow-[16px_16px_0px_0px_#000] relative flex flex-col justify-between overflow-hidden">
            <AnimatePresence mode="wait">
              {roaster.loading && (
                <LoadingTerminal
                  username={roaster.username}
                  language={roaster.language}
                  loadingStep={roaster.loadingStep}
                  loadingSteps={roaster.activeLoadingSteps}
                />
              )}

              {roaster.roastResult && !roaster.loading && (
                <RoastResultPanel
                  roastResult={roaster.roastResult}
                  profile={roaster.fetchedProfile!}
                  repos={roaster.fetchedRepos}
                  language={roaster.language}
                  copied={roaster.copied}
                  onCopy={() => roaster.handleCopy(playSound)}
                  onReset={() => roaster.handleReset(playSound)}
                  onPlaySound={playSound}
                />
              )}

              {!roaster.roastResult && !roaster.loading && (
                <EmptyState language={roaster.language} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
