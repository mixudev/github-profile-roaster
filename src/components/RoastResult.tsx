import React from 'react';
import { motion } from 'motion/react';
import { Skull, Copy, Check, RefreshCw } from 'lucide-react';
import type { RoastResult as RoastResultType, GitHubProfile, GitHubRepo, Language } from '../types';
import { RepoGraveyard } from './RepoGraveyard';

interface RoastResultProps {
  roastResult: RoastResultType;
  profile: GitHubProfile;
  repos: GitHubRepo[];
  language: Language;
  copied: boolean;
  onCopy: () => void;
  onReset: () => void;
  onPlaySound: (t: any) => void;
}

export function RoastResultPanel({
  roastResult, profile, repos, language, copied, onCopy, onReset, onPlaySound
}: RoastResultProps) {
  return (
    <motion.div
      key="results-block"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 flex flex-col justify-between h-full"
    >
      <div className="space-y-4">
        {/* Profile header row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-black pb-3 gap-3">
          <div className="flex items-center gap-3">
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-12 h-12 border-4 border-black filter grayscale"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="text-md font-black uppercase leading-tight">
                {profile.name || profile.login}
              </h4>
              <span className="text-xs font-bold text-black/50">@{profile.login}</span>
            </div>
          </div>
          <div className="bg-[#FFEF00] border-4 border-black px-4 py-1.5 flex items-center gap-2 shadow-[3px_3px_0px_0px_#000] select-none font-black text-sm">
            <Skull className="w-4 h-4 text-black animate-spin" />
            <span>{language === 'id' ? 'DAMAGE' : 'BURN'}: {roastResult.burnScore}%</span>
          </div>
        </div>

        {/* Roast content blocks */}
        <div className="space-y-4 text-black leading-snug">
          <p className="font-black text-[#0000FF] uppercase underline decoration-4 text-lg md:text-xl">
            {language === 'id' ? 'Klasifikasi Gelar' : 'Summary Classification'}: {roastResult.developerTitle}
          </p>

          <p className="text-sm md:text-base leading-relaxed">
            ➔ <span className="font-bold underline">{language === 'id' ? 'Kritik Statistik' : 'Metrics'}:</span>{' '}
            {roastResult.statsRoast}
          </p>

          <p className="text-sm md:text-base leading-relaxed">
            ➔ <span className="font-bold underline">{language === 'id' ? 'Deskripsi Jiwa' : 'Biography'}:</span>{' '}
            {roastResult.bioRoast}
          </p>

          <p className="text-sm md:text-base leading-relaxed">
            ➔ <span className="font-bold underline">{language === 'id' ? 'Kuburan Kode' : 'Repository Graveyard'}:</span>{' '}
            {roastResult.reposRoast}
          </p>

          <div className="border-4 border-black p-4 bg-gray-50 relative my-2">
            <span className="absolute top-1.5 right-3 text-3xl font-serif text-black/10 select-none">"</span>
            <p className="text-xs md:text-sm font-bold leading-relaxed italic">
              {roastResult.theMainRoast}
            </p>
          </div>

          <RepoGraveyard repos={repos} language={language} />
        </div>
      </div>

      {/* Tags + action buttons */}
      <div className="space-y-4 pt-4 border-t-2 border-black">
        <div className="flex flex-wrap gap-2">
          {roastResult.roastedTags?.map((tag: string, idx: number) => (
            <span
              key={idx}
              className={`px-2 py-1 border-2 border-black font-black text-[10px] md:text-xs uppercase shadow-[2px_2px_0px_0px_#000] ${
                idx % 2 === 0 ? 'bg-[#FFEF00]' : 'bg-[#00FFFF]'
              }`}
            >
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCopy}
            onMouseEnter={() => onPlaySound('hover')}
            className="flex-grow bg-[#00FFFF] text-black font-black uppercase text-xs border-4 border-black py-3 px-4 cursor-pointer shadow-[4px_4px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000] transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 animate-bounce" />
                <span>{language === 'id' ? 'LAPORAN BERHASIL DISALIN!' : 'COPIED DEVASTATING VERDICT!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{language === 'id' ? 'SALIN LAPORAN SARKASME' : 'COPY ROAST REPORT'}</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            onMouseEnter={() => onPlaySound('hover')}
            className="bg-white text-black font-black uppercase text-xs border-4 border-black py-3 px-4 cursor-pointer shadow-[4px_4px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{language === 'id' ? 'KORBAN BERIKUTNYA' : 'NEXT VICTIM'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
