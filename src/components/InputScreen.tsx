import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Flame, Sprout, Zap, Globe, Languages, ChevronRight, Skull } from 'lucide-react';
import type { HeatLevel, Language } from '../types';
import { PRESET_PROFILES } from '../data/presets';

interface InputScreenProps {
  username: string;
  heatLevel: HeatLevel;
  language: Language;
  loading: boolean;
  error: string | null;
  onUsernameChange: (v: string) => void;
  onHeatLevelChange: (v: HeatLevel) => void;
  onLanguageChange: (v: Language) => void;
  onSubmit: (e: React.FormEvent) => void;
  onPresetSelect: (key: string) => void;
  onPlaySound: (t: any) => void;
}

const HEAT_CONFIG = {
  singe:   { icon: Sprout, color: 'text-green-600', label: 'Singe',   labelId: 'Hangat'  },
  burn:    { icon: Flame,  color: 'text-orange-500', label: 'Burn',   labelId: 'Pedas'   },
  nuclear: { icon: Zap,    color: 'text-red-600',    label: 'Nuclear', labelId: 'Nuklir' },
} as const;

export function InputScreen({
  username, heatLevel, language, loading, error,
  onUsernameChange, onHeatLevelChange, onLanguageChange,
  onSubmit, onPresetSelect, onPlaySound,
}: InputScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── HEADER ── */}
      <header className="flex items-center justify-between px-4 md:px-12 py-3 md:py-5 border-b-4 border-black">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black flex items-center justify-center flex-shrink-0">
            <Flame className="w-3.5 h-3.5 text-[#FFEF00]" />
          </div>
          <span className="font-black text-black text-xs uppercase tracking-widest hidden sm:block">
            GitHub Roaster
          </span>
        </div>

        {/* Controls — heat level + language */}
        <div className="flex items-center gap-2">
          {/* Heat level — icon-only on mobile */}
          <div className="flex items-center border-4 border-black overflow-hidden">
            {(Object.entries(HEAT_CONFIG) as [HeatLevel, typeof HEAT_CONFIG[HeatLevel]][]).map(([level, cfg]) => {
              const Icon = cfg.icon;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => { onHeatLevelChange(level); onPlaySound('click'); }}
                  title={language === 'id' ? cfg.labelId : cfg.label}
                  className={`px-2 py-1.5 text-[10px] font-black uppercase transition-colors cursor-pointer flex items-center gap-1 ${
                    heatLevel === level ? 'bg-black text-[#FFEF00]' : 'bg-transparent text-black hover:bg-black/10'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden lg:inline">{language === 'id' ? cfg.labelId : cfg.label}</span>
                </button>
              );
            })}
          </div>

          {/* Language */}
          <div className="flex items-center border-4 border-black overflow-hidden">
            {(['id', 'en'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => { onLanguageChange(lang); onPlaySound('click'); }}
                className={`px-2.5 py-1.5 text-[10px] font-black uppercase transition-colors cursor-pointer flex items-center gap-1 ${
                  language === lang ? 'bg-black text-[#FFEF00]' : 'bg-transparent text-black hover:bg-black/10'
                }`}
              >
                {lang === 'en' ? <Globe className="w-3 h-3" /> : <Languages className="w-3 h-3" />}
                <span>{lang === 'en' ? 'EN' : 'ID'}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-8 md:py-12 gap-6 md:gap-10">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-center space-y-1"
        >
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-black">
            Roast GitHub
          </h1>
          <p className="text-black/50 font-bold text-xs sm:text-sm uppercase tracking-widest">
            {language === 'id'
              ? 'Masukkan username — kami urus sisanya'
              : 'Drop a username — we handle the rest'}
          </p>
        </motion.div>

        {/* Input form */}
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-lg space-y-3"
        >
          {/* Username */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl md:text-2xl text-black/40 select-none pointer-events-none">
              @
            </span>
            <input
              ref={inputRef}
              type="text"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              placeholder={language === 'id' ? 'username korban' : 'target username'}
              className="w-full border-4 border-black bg-white pl-9 pr-4 py-4 md:py-5 text-xl md:text-2xl font-black focus:outline-none focus:bg-white placeholder-black/25 uppercase tracking-tight shadow-[4px_4px_0px_0px_#000] md:shadow-[6px_6px_0px_0px_#000] transition-shadow"
              disabled={loading}
              autoFocus
            />
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-4 border-black bg-white px-4 py-3 text-xs font-black uppercase text-red-600 tracking-wide"
            >
              ⚠ {error}
            </motion.div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className={`w-full border-4 border-black py-4 md:py-5 text-xl md:text-2xl font-black uppercase tracking-tight flex items-center justify-center gap-3 transition-all ${
              username.trim()
                ? 'bg-black text-[#FFEF00] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer hover:bg-black/90'
                : 'bg-black/20 text-black/30 cursor-not-allowed border-dashed'
            }`}
          >
            <Flame className={`w-5 h-5 flex-shrink-0 ${username.trim() ? 'text-[#FFEF00] animate-bounce' : 'text-black/30'}`} />
            {language === 'id' ? 'Roast Sekarang' : 'Roast Now'}
          </button>
        </motion.form>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 w-full max-w-lg"
        >
          <div className="flex-1 h-0.5 bg-black/20" />
          <span className="text-[10px] font-black uppercase tracking-widest text-black/40 whitespace-nowrap">
            {language === 'id' ? 'atau coba preset' : 'or try presets'}
          </span>
          <div className="flex-1 h-0.5 bg-black/20" />
        </motion.div>

        {/* Preset grid — 2 cols on all sizes */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="w-full max-w-lg grid grid-cols-2 gap-2"
        >
          {Object.entries(PRESET_PROFILES).map(([key, item]) => (
            <button
              key={key}
              onClick={() => onPresetSelect(key)}
              onMouseEnter={() => onPlaySound('hover')}
              className="bg-white border-4 border-black p-2.5 md:p-3 flex items-center gap-2 md:gap-3 cursor-pointer shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group text-left"
            >
              <img
                src={item.profile.avatar_url}
                alt={item.profile.name}
                className="w-7 h-7 md:w-8 md:h-8 border-2 border-black grayscale flex-shrink-0 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] md:text-xs font-black uppercase leading-tight truncate group-hover:text-[#FF00FF]">
                  {item.profile.name}
                </p>
                <p className="text-[9px] md:text-[10px] font-bold text-black/40 truncate">@{item.profile.login}</p>
              </div>
              <ChevronRight className="w-3 h-3 text-black/40 flex-shrink-0" />
            </button>
          ))}
        </motion.div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t-4 border-black px-4 md:px-12 py-3 flex justify-between items-center gap-4">
        <span className="text-[9px] font-black uppercase tracking-widest text-black/40 hidden sm:block">
          BORDER-RADIUS: 0
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          <Skull className="w-3 h-3 text-black/40 flex-shrink-0" />
          <span className="text-[9px] font-black uppercase tracking-widest text-black/40 text-right">
            {language === 'id' ? 'KERUSAKAN PSIKOLOGIS DIJAMIN' : 'PSYCHOLOGICAL DAMAGE GUARANTEED'}
          </span>
        </div>
      </footer>
    </div>
  );
}
