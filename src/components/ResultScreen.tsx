import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame, Copy, Check, RefreshCw, Skull,
  Star, Users, BookOpen, Settings, Sprout, Zap, Globe, Languages
} from 'lucide-react';
import type { RoastResult, GitHubProfile, GitHubRepo, Language, HeatLevel } from '../types';

interface ResultScreenProps {
  roastResult: RoastResult;
  profile: GitHubProfile;
  repos: GitHubRepo[];
  language: Language;
  heatLevel: HeatLevel;
  copied: boolean;
  activeProvider: string;
  onCopy: () => void;
  onReset: () => void;
  onQuickRoast: (username: string) => void;
  onLanguageChange: (v: Language) => void;
  onHeatLevelChange: (v: HeatLevel) => void;
  onPlaySound: (t: any) => void;
}

const HEAT_CONFIG: Record<HeatLevel, { icon: any; label: string; labelId: string; color: string }> = {
  singe:   { icon: Sprout, label: 'Singe',   labelId: 'Hangat', color: 'text-green-400'  },
  burn:    { icon: Flame,  label: 'Burn',    labelId: 'Pedas',  color: 'text-orange-400' },
  nuclear: { icon: Zap,    label: 'Nuclear', labelId: 'Nuklir', color: 'text-red-400'    },
};

export function ResultScreen({
  roastResult, profile, repos, language, heatLevel, copied, activeProvider,
  onCopy, onReset, onQuickRoast, onLanguageChange, onHeatLevelChange, onPlaySound,
}: ResultScreenProps) {
  const [quickUsername, setQuickUsername] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    }
    if (settingsOpen) document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [settingsOpen]);

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const topLang = repos
    .map(r => r.language).filter(Boolean)
    .reduce<Record<string, number>>((acc, l) => { acc[l!] = (acc[l!] || 0) + 1; return acc; }, {});
  const mainLang = Object.entries(topLang).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUsername.trim()) return;
    onQuickRoast(quickUsername.trim());
    setQuickUsername('');
  };

  const ActiveHeatIcon = HEAT_CONFIG[heatLevel].icon;

  return (
    // Mobile: scroll freely. Desktop: locked h-screen
    <div className="min-h-screen md:h-screen flex flex-col md:overflow-hidden">

      {/* ── HEADER ── */}
      <header className="flex items-center gap-2 px-3 md:px-8 py-2.5 border-b-4 border-black bg-black flex-shrink-0">

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 bg-[#FFEF00] flex items-center justify-center">
            <Flame className="w-3 h-3 text-black" />
          </div>
          <span className="font-black text-[#FFEF00] text-xs uppercase tracking-widest hidden md:block">
            GitHub Roaster
          </span>
        </div>

        {/* Quick roast input — hidden on very small screens, shown sm+ */}
        <form onSubmit={handleQuickSubmit} className="flex-1 flex items-center gap-2 min-w-0">
          <div className="flex-1 relative min-w-0">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-black text-white/40 text-xs select-none pointer-events-none">@</span>
            <input
              type="text"
              value={quickUsername}
              onChange={(e) => setQuickUsername(e.target.value)}
              placeholder={language === 'id' ? 'username berikutnya...' : 'next username...'}
              className="w-full border-2 border-white/20 bg-white/10 text-white pl-6 pr-2 py-1.5 text-xs font-bold uppercase focus:outline-none focus:bg-white/20 placeholder-white/25 tracking-tight"
            />
          </div>
          <button
            type="submit"
            disabled={!quickUsername.trim()}
            className={`flex-shrink-0 border-2 px-2.5 py-1.5 text-[10px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer ${
              quickUsername.trim()
                ? 'border-[#FFEF00] bg-[#FFEF00] text-black active:opacity-80'
                : 'border-white/20 bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span className="hidden sm:inline">Roast</span>
          </button>
        </form>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Settings */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setSettingsOpen((o: boolean) => !o)}
              className={`flex items-center gap-1 border-2 px-2.5 py-1.5 text-[10px] font-black uppercase transition-all cursor-pointer ${
                settingsOpen
                  ? 'border-[#FFEF00] bg-[#FFEF00] text-black'
                  : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Settings className={`w-3 h-3 ${settingsOpen ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{language === 'id' ? 'Atur' : 'Settings'}</span>
            </button>

            <AnimatePresence>
              {settingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-[#1a1a1a] border-4 border-[#FFEF00] shadow-[6px_6px_0px_0px_#FFEF00] z-50"
                >
                  <div className="border-b-2 border-white/10 p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">
                      {language === 'id' ? 'Bahasa' : 'Language'}
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['id', 'en'] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => { onLanguageChange(lang); onPlaySound('click'); setSettingsOpen(false); }}
                          className={`flex items-center justify-center gap-1.5 border-2 py-1.5 text-[10px] font-black uppercase cursor-pointer transition-all ${
                            language === lang
                              ? 'border-[#FFEF00] bg-[#FFEF00] text-black'
                              : 'border-white/20 text-white hover:bg-white/10'
                          }`}
                        >
                          {lang === 'en' ? <Globe className="w-3 h-3" /> : <Languages className="w-3 h-3" />}
                          {lang === 'en' ? 'EN' : 'ID'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">
                      {language === 'id' ? 'Tingkat Pedas' : 'Heat Level'}
                    </p>
                    <div className="space-y-1">
                      {(Object.entries(HEAT_CONFIG) as [HeatLevel, typeof HEAT_CONFIG[HeatLevel]][]).map(([level, cfg]) => {
                        const Icon = cfg.icon;
                        const active = heatLevel === level;
                        return (
                          <button
                            key={level}
                            onClick={() => { onHeatLevelChange(level); onPlaySound('click'); setSettingsOpen(false); }}
                            className={`w-full flex items-center gap-2 border-2 px-3 py-1.5 text-[10px] font-black uppercase cursor-pointer transition-all ${
                              active
                                ? 'border-[#FFEF00] bg-[#FFEF00] text-black'
                                : 'border-white/10 text-white hover:bg-white/10'
                            }`}
                          >
                            <Icon className={`w-3 h-3 ${active ? 'text-black' : cfg.color}`} />
                            {language === 'id' ? cfg.labelId : cfg.label}
                            {active && <span className="ml-auto text-[8px]">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reset */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 border-2 border-white/20 bg-white/10 text-white px-2.5 py-1.5 text-[10px] font-black uppercase hover:bg-white/20 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* ── BODY: stack on mobile, side-by-side on desktop ── */}
      <div className="flex-1 flex flex-col md:grid md:grid-cols-12 md:overflow-hidden min-h-0">

        {/* ── LEFT: profile card ──
            Mobile: compact horizontal strip
            Desktop: full sidebar
        ── */}
        <motion.aside
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="md:col-span-4 border-b-4 md:border-b-0 md:border-r-4 border-black bg-[#1a1a1a] flex-shrink-0 md:flex md:flex-col md:overflow-hidden"
        >
          {/* Mobile: horizontal compact card */}
          <div className="md:hidden flex items-center gap-4 px-4 py-4 border-b-2 border-black/40">
            {/* Avatar + score */}
            <div className="relative flex-shrink-0">
              <img
                src={profile.avatar_url}
                alt={profile.name || profile.login}
                className="w-14 h-14 border-3 border-[#FFEF00] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FFEF00] text-black px-1.5 py-0.5 flex items-center gap-0.5 whitespace-nowrap">
                <Skull className="w-2.5 h-2.5" />
                <span className="font-black text-[9px]">{roastResult.burnScore}</span>
              </div>
            </div>

            {/* Identity + stats inline */}
            <div className="flex-1 min-w-0">
              <h2 className="font-black text-sm uppercase leading-tight text-white truncate">
                {profile.name || profile.login}
              </h2>
              <p className="text-[9px] font-bold text-white/40">@{profile.login}</p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="text-[9px] font-black text-white/50 uppercase">
                  <span className="text-white">{profile.public_repos}</span> repos
                </span>
                <span className="text-[9px] font-black text-white/50 uppercase">
                  <span className="text-white">{profile.followers}</span> followers
                </span>
                <span className="text-[9px] font-black text-white/50 uppercase">
                  <span className="text-white">{totalStars}</span> stars
                </span>
                {mainLang !== '—' && (
                  <span className="border border-[#FFEF00] text-[#FFEF00] px-1.5 text-[8px] font-black uppercase">
                    {mainLang}
                  </span>
                )}
              </div>
            </div>

            {/* Heat badge */}
            <div className="flex-shrink-0 flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <ActiveHeatIcon className={`w-3 h-3 ${HEAT_CONFIG[heatLevel].color}`} />
                <span className="text-[8px] font-black uppercase text-white/40">
                  {language === 'id' ? HEAT_CONFIG[heatLevel].labelId : HEAT_CONFIG[heatLevel].label}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop: full vertical card */}
          <div className="hidden md:flex flex-col flex-1 overflow-hidden">
            {/* Avatar block */}
            <div className="px-6 pt-6 pb-8 flex flex-col items-center gap-4 border-b-4 border-black/60 flex-shrink-0">
              <div className="relative">
                <img
                  src={profile.avatar_url}
                  alt={profile.name || profile.login}
                  className="w-20 h-20 border-4 border-[#FFEF00] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#FFEF00] text-black border-2 border-black px-2 py-0.5 flex items-center gap-1 whitespace-nowrap">
                  <Skull className="w-3 h-3" />
                  <span className="font-black text-[10px] tracking-widest">{roastResult.burnScore}/100</span>
                </div>
              </div>
              <div className="text-center mt-1">
                <h2 className="font-black text-base uppercase leading-tight tracking-tighter text-white">
                  {profile.name || profile.login}
                </h2>
                <p className="text-[10px] font-bold text-white/40">@{profile.login}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="px-5 py-4 space-y-2 flex-shrink-0">
              {[
                { icon: BookOpen, value: profile.public_repos, label: 'Repos' },
                { icon: Users, value: `${profile.followers} / ${profile.following}`, label: 'Followers / Following' },
                { icon: Star, value: totalStars, label: 'Stars' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center justify-between border-b border-white/10 pb-1.5 last:border-0 last:pb-0">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3 h-3 text-white/50" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{label}</span>
                  </div>
                  <span className="font-black text-xs text-white">{value}</span>
                </div>
              ))}
              {mainLang !== '—' && (
                <div className="pt-1">
                  <span className="border-2 border-[#FFEF00] text-[#FFEF00] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">
                    {mainLang}
                  </span>
                </div>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="px-5 py-3 border-t border-white/10 flex-shrink-0">
                <p className="text-[10px] font-bold text-white/40 leading-snug italic line-clamp-2">
                  "{profile.bio}"
                </p>
              </div>
            )}

            {/* Heat + title */}
            <div className="mt-auto flex-shrink-0">
              <div className="border-t border-white/10 px-5 py-2 flex items-center gap-2">
                <ActiveHeatIcon className={`w-3 h-3 ${HEAT_CONFIG[heatLevel].color}`} />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                  {language === 'id' ? HEAT_CONFIG[heatLevel].labelId : HEAT_CONFIG[heatLevel].label}
                </span>
              </div>
              <div className="border-t-4 border-[#FFEF00] bg-[#FFEF00] px-5 py-3">
                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-black/40 mb-0.5">
                  {language === 'id' ? 'Klasifikasi' : 'Classification'}
                </p>
                <p className="font-black text-black text-xs uppercase leading-snug tracking-tight">
                  {roastResult.developerTitle}
                </p>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* ── RIGHT: verdict ── */}
        <motion.main
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.06 }}
          className="md:col-span-8 flex flex-col bg-[#FFFDF0] md:overflow-hidden flex-1"
        >
          {/* Sub-header */}
          <div className="border-b-4 border-black px-4 md:px-8 py-3 flex items-center justify-between bg-[#FFFDF0] flex-shrink-0">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/30">
              {language === 'id' ? 'Vonis Akhir' : 'Final Verdict'}
            </p>
            <div className="flex items-center gap-1.5 bg-black text-[#FFEF00] px-3 py-1">
              <Flame className="w-3 h-3 animate-pulse" />
              <span className="font-black text-[10px] uppercase">
                {language === 'id' ? 'Damage' : 'Burn'}: {roastResult.burnScore}%
              </span>
            </div>
          </div>

          {/* Mobile: classification strip */}
          <div className="md:hidden border-b-2 border-black/10 px-4 py-2 bg-black">
            <p className="text-[8px] font-black uppercase tracking-widest text-[#FFEF00]/50 mb-0.5">
              {language === 'id' ? 'Klasifikasi' : 'Classification'}
            </p>
            <p className="font-black text-[#FFEF00] text-xs uppercase leading-snug">
              {roastResult.developerTitle}
            </p>
          </div>

          {/* Roast text */}
          <div className="flex-1 flex flex-col justify-between px-4 md:px-8 py-5 md:py-6 min-h-0">
            <div className="relative">
              <span className="absolute -top-1 -left-1 text-[60px] md:text-[80px] font-serif text-black/5 select-none leading-none pointer-events-none">"</span>
              <p className="text-sm font-bold leading-relaxed text-black relative z-10 pt-2">
                {roastResult.theMainRoast}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-5 flex-shrink-0">
              {roastResult.roastedTags?.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className={`px-2 py-1 border-2 border-black font-black text-[9px] uppercase shadow-[2px_2px_0px_0px_#000] ${
                    idx % 3 === 0 ? 'bg-[#FFEF00] text-black' : idx % 3 === 1 ? 'bg-black text-[#FFEF00]' : 'bg-white text-black'
                  }`}
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="border-t-4 border-black px-4 md:px-8 py-3 flex gap-2 bg-[#FFFDF0] flex-shrink-0">
            <button
              onClick={onCopy}
              onMouseEnter={() => onPlaySound('hover')}
              className="flex-1 bg-black text-[#FFEF00] font-black uppercase text-xs border-4 border-black py-3 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 hover:bg-black/85"
            >
              {copied ? (
                <><Check className="w-3.5 h-3.5 animate-bounce" />{language === 'id' ? 'Tersalin!' : 'Copied!'}</>
              ) : (
                <><Copy className="w-3.5 h-3.5" />{language === 'id' ? 'Salin Roast' : 'Copy Roast'}</>
              )}
            </button>
            <button
              onClick={onReset}
              onMouseEnter={() => onPlaySound('hover')}
              className="border-4 border-black bg-white text-black font-black uppercase text-xs py-3 px-4 cursor-pointer shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-[#FFEF00] transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'id' ? 'Mulai Ulang' : 'Start Over'}</span>
            </button>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
