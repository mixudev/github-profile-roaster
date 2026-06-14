import React from 'react';
import { Terminal, Flame, Globe, Languages, Sprout, Zap } from 'lucide-react';
import type { HeatLevel, Language } from '../types';

interface InputPanelProps {
  username: string;
  heatLevel: HeatLevel;
  language: Language;
  loading: boolean;
  onUsernameChange: (v: string) => void;
  onHeatLevelChange: (v: HeatLevel) => void;
  onLanguageChange: (v: Language) => void;
  onSubmit: (e: React.FormEvent) => void;
  onPlaySound: (t: any) => void;
}

export function InputPanel({
  username, heatLevel, language, loading,
  onUsernameChange, onHeatLevelChange, onLanguageChange,
  onSubmit, onPlaySound,
}: InputPanelProps) {
  return (
    <section className="bg-white border-8 border-black p-6 shadow-[10px_10px_0px_0px_#000] flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b-2 border-black pb-2">
        <Terminal className="w-5 h-5 text-black" />
        <label htmlFor="username-input" className="text-lg md:text-2xl font-black uppercase tracking-tight select-none">
          {language === 'id' ? 'Masukkan Username Target' : 'Enter Victim Username'}
        </label>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Username input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-black font-black text-xl select-none">@</span>
          </div>
          <input
            id="username-input"
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="username"
            className="w-full border-8 border-black bg-white p-4 pl-10 text-2xl font-bold focus:outline-none focus:bg-[#00FFFF] placeholder-gray-400 uppercase select-all transition-colors"
            disabled={loading}
            onKeyDown={() => {
              if (Math.random() > 0.6) onPlaySound('hover');
            }}
          />
        </div>

        {/* Heat level selector */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-black/60">
            <span>{language === 'id' ? 'Tingkat Kepedasan:' : 'Compilation Heat:'}</span>
            <span className="text-[#FF00FF] font-black">{heatLevel.toUpperCase()}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['singe', 'burn', 'nuclear'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => { onHeatLevelChange(level); onPlaySound('click'); }}
                onMouseEnter={() => onPlaySound('hover')}
                className={`border-4 border-black py-2 px-1 text-[10px] md:text-xs font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  heatLevel === level
                    ? 'bg-black text-white shadow-none translate-x-[1px] translate-y-[1px]'
                    : 'bg-white hover:bg-[#FFF7ED] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {level === 'singe' && <Sprout className="w-3.5 h-3.5 text-[#00FF00]" />}
                {level === 'burn' && <Flame className="w-3.5 h-3.5 text-[#FF8C00]" />}
                {level === 'nuclear' && <Zap className="w-3.5 h-3.5 text-[#FFEF00]" />}
                <span>{level}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language selector */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-black/60">
            <span>{language === 'id' ? 'Bahasa Roast:' : 'Roast Language:'}</span>
            <span className="text-[#00CCCC] font-black">{language === 'en' ? 'ENGLISH' : 'BAHASA INDONESIA'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['en', 'id'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => { onLanguageChange(lang); onPlaySound('click'); }}
                onMouseEnter={() => onPlaySound('hover')}
                className={`border-4 border-black py-2 text-[10px] md:text-xs font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  language === lang
                    ? 'bg-black text-white shadow-none translate-x-[1px] translate-y-[1px]'
                    : 'bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {lang === 'en' ? <Globe className="w-3.5 h-3.5" /> : <Languages className="w-3.5 h-3.5" />}
                <span>{lang === 'en' ? 'English' : 'Indonesia'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !username.trim()}
          onMouseEnter={() => { if (username.trim()) onPlaySound('hover'); }}
          className={`w-full border-8 border-black p-5 text-2xl md:text-4xl font-black uppercase transition-all flex items-center justify-center gap-2 select-none ${
            username.trim()
              ? 'bg-[#FF00FF] text-white shadow-[12px_12px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[4px_4px_0px_0px_#000] cursor-pointer hover:bg-[#ff40ff]'
              : 'bg-gray-100 text-black/30 border-dashed cursor-not-allowed shadow-none'
          }`}
        >
          <span>{language === 'id' ? 'Roast Me!' : 'Roast Me!'}</span>
          <Flame className={`w-6 h-6 flex-shrink-0 ${username.trim() ? 'animate-bounce text-[#FFEF00]' : 'text-black/30'}`} />
        </button>
      </form>
    </section>
  );
}
