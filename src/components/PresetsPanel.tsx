import React from 'react';
import { Skull, ChevronRight } from 'lucide-react';
import { PRESET_PROFILES } from '../data/presets';
import type { Language } from '../types';

interface PresetsPanelProps {
  language: Language;
  onSelect: (key: string) => void;
  onPlaySound: (t: any) => void;
}

export function PresetsPanel({ language, onSelect, onPlaySound }: PresetsPanelProps) {
  return (
    <div className="bg-white border-8 border-black p-5 shadow-[10px_10px_0px_0px_#000] flex-grow flex flex-col justify-between">
      <div>
        <h3 className="text-md font-black uppercase border-b-4 border-black pb-2 mb-4 flex items-center gap-1.5 select-none">
          <Skull className="w-5 h-5 flex-shrink-0" />
          <span>{language === 'id' ? 'DEMO DEV LEGENDA' : 'PRESET DEV GOD DEMOS'}</span>
        </h3>
        <div className="space-y-2">
          {Object.entries(PRESET_PROFILES).map(([key, item]) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              onMouseEnter={() => onPlaySound('hover')}
              className="w-full bg-white border-4 border-black p-3 text-left flex items-center justify-between cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.profile.avatar_url}
                  alt={item.profile.name}
                  className="w-8 h-8 filter grayscale border-2 border-black rounded-none object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-black uppercase leading-tight group-hover:text-[#FF00FF]">
                    {item.profile.name}
                  </h4>
                  <span className="text-[10px] font-bold text-black/50">@{item.profile.login}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>
      <p className="text-[10px] font-bold text-black/60 uppercase tracking-tight mt-4 select-none">
        ➔ {language === 'id'
          ? 'DEMO CEPAT BYPASS RATE LIMIT GITHUB SEKETIKA.'
          : "QUICK DEMOS BYPASS GITHUB'S RATE LIMIT LIMITATIONS INSTANTLY."}
      </p>
    </div>
  );
}
