import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Target, Flame } from 'lucide-react';
import type { Language } from '../types';

interface LoadingScreenProps {
  username: string;
  avatarUrl?: string;
  language: Language;
  loadingStep: number;
  loadingSteps: string[];
}

const ICONS = [Target, Zap, Flame, Zap, Target, Flame, Zap, Flame];

export function LoadingScreen({ username, avatarUrl, language, loadingStep, loadingSteps }: LoadingScreenProps) {
  const progress = Math.round(((loadingStep + 1) / loadingSteps.length) * 100);
  const StepIcon = ICONS[loadingStep % ICONS.length];

  return (
    <div className="min-h-screen bg-[#FFEF00] flex flex-col items-center justify-center gap-10 px-6">

      {/* Avatar / icon + username */}
      <div className="flex flex-col items-center gap-5">
        <motion.div
          animate={{ rotate: [0, -6, 6, -6, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-24 h-24"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="w-24 h-24 border-4 border-black object-cover grayscale shadow-[8px_8px_0px_0px_#000]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-24 h-24 bg-black border-4 border-black flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
              <Flame className="w-12 h-12 text-[#FFEF00]" />
            </div>
          )}
          {/* Crosshair overlay — border only, no lines */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-full h-full border-4 border-[#FF0000] absolute"
            />
          </div>
        </motion.div>

        <div className="text-center">
          <p className="font-black text-black/50 text-xs uppercase tracking-[0.3em]">
            {language === 'id' ? 'Memproses' : 'Roasting'}
          </p>
          <motion.p
            className="font-black text-black text-2xl sm:text-3xl md:text-5xl uppercase tracking-tight leading-none mt-1"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            @{username}
          </motion.p>
        </div>
      </div>

      {/* Step card */}
      <div className="w-full max-w-sm border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000]">
        <AnimatePresence mode="wait">
          <motion.div
            key={loadingStep}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-4 p-4"
          >
            <div className="w-10 h-10 bg-black flex items-center justify-center flex-shrink-0">
              <StepIcon className="w-5 h-5 text-[#FFEF00]" />
            </div>
            <p className="font-black text-black text-xs uppercase leading-snug tracking-wide">
              {loadingSteps[loadingStep]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress */}
      <div className="w-full max-w-sm space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-black text-black/50 text-[10px] uppercase tracking-widest">Progress</span>
          <span className="font-black text-black text-[10px]">{progress}%</span>
        </div>
        <div className="w-full h-4 border-4 border-black bg-white overflow-hidden">
          <motion.div
            className="h-full bg-black"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between pt-1">
          {loadingSteps.map((_, idx) => (
            <motion.div
              key={idx}
              className={`w-2.5 h-2.5 border-2 border-black ${idx <= loadingStep ? 'bg-black' : 'bg-white'}`}
              animate={idx === loadingStep ? { scale: [1, 1.5, 1] } : {}}
              transition={{ duration: 0.4, repeat: idx === loadingStep ? Infinity : 0, repeatDelay: 0.7 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
