import React from 'react';
import { motion } from 'motion/react';
import { Flame } from 'lucide-react';
import type { Language } from '../types';

interface EmptyStateProps {
  language: Language;
}

export function EmptyState({ language }: EmptyStateProps) {
  return (
    <motion.div
      key="empty-placeholder"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col justify-between relative"
    >
      <div className="absolute top-4 right-4 text-6xl opacity-10 font-serif select-none">"</div>

      <div className="space-y-6 my-auto p-4 border-4 border-dashed border-black/35 text-center text-black/60">
        <Flame className="w-12 h-12 mx-auto stroke-[1.5] text-black/40 animate-bounce" />
        <div>
          <h4 className="font-black text-lg uppercase tracking-tight text-black">
            {language === 'id' ? 'MENUNGGU KORBAN BERIKUTNYA...' : 'AWAITING VICTIM TRANSCRIPTION...'}
          </h4>
          <p className="text-xs font-semibold leading-relaxed mt-2 uppercase text-black/70">
            {language === 'id'
              ? 'Masukkan username target pada panel pengontrol sebelah kiri dan klik "Roast Me!" untuk menyalakan generator pembakar mental.'
              : 'Provide a valid GitHub username on the left control panel and tap "Roast Me!" to fire up the digital incinerator generator.'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-4 select-none">
        <span className="px-2 py-1 bg-gray-100 border-2 border-black font-black text-[10px] uppercase text-black/50">
          #AWAITING_CRIMINAL
        </span>
        <span className="px-2 py-1 bg-gray-100 border-2 border-black font-black text-[10px] uppercase text-black/50">
          #COMPILER_IDLE
        </span>
      </div>
    </motion.div>
  );
}
