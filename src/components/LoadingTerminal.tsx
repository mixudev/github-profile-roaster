import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Zap, Target } from 'lucide-react';
import type { Language } from '../types';

interface LoadingTerminalProps {
  username: string;
  language: Language;
  loadingStep: number;
  loadingSteps: string[];
}

const ICONS = [Target, Zap, Flame, Zap, Target, Flame, Zap, Flame];

export function LoadingTerminal({ username, language, loadingStep, loadingSteps }: LoadingTerminalProps) {
  const progress = Math.round(((loadingStep + 1) / loadingSteps.length) * 100);
  const StepIcon = ICONS[loadingStep % ICONS.length];

  return (
    <motion.div
      key="loading-terminal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#FFEF00] flex flex-col items-center justify-center gap-8 z-30 p-8"
    >
      {/* Animated fire/skull icon */}
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: [0, -8, 8, -8, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 bg-black flex items-center justify-center border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]"
        >
          <Flame className="w-8 h-8 text-[#FFEF00]" />
        </motion.div>

        <div className="text-center">
          <p className="font-black text-black text-xs uppercase tracking-widest">
            {language === 'id' ? 'Mengeksekusi' : 'Roasting'}
          </p>
          <motion.p
            className="font-black text-black text-2xl md:text-3xl uppercase tracking-tight leading-none"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            @{username}
          </motion.p>
        </div>
      </div>

      {/* Current step */}
      <div className="w-full max-w-xs border-4 border-black bg-white shadow-[6px_6px_0px_0px_#000] p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={loadingStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-black flex items-center justify-center flex-shrink-0">
              <StepIcon className="w-4 h-4 text-[#FFEF00]" />
            </div>
            <p className="font-black text-black text-[11px] uppercase leading-tight">
              {loadingSteps[loadingStep]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="font-black text-black text-[10px] uppercase tracking-widest">
            {language === 'id' ? 'Progress Kehancuran' : 'Destruction Progress'}
          </span>
          <span className="font-black text-black text-[10px]">{progress}%</span>
        </div>
        <div className="w-full h-5 border-4 border-black bg-white overflow-hidden">
          <motion.div
            className="h-full bg-black"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Step dots */}
        <div className="flex justify-between pt-1">
          {loadingSteps.map((_, idx) => (
            <motion.div
              key={idx}
              className={`w-2.5 h-2.5 border-2 border-black ${idx <= loadingStep ? 'bg-black' : 'bg-white'}`}
              animate={idx === loadingStep ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.4, repeat: idx === loadingStep ? Infinity : 0, repeatDelay: 0.8 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
