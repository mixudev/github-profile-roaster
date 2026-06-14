import React from 'react';
import { Code, Cpu, Star, GitFork } from 'lucide-react';
import type { GitHubRepo, Language } from '../types';

interface RepoGraveyardProps {
  repos: GitHubRepo[];
  language: Language;
}

function getRepoBadge(repo: GitHubRepo, language: Language): { label: string; color: string } {
  const repoName = repo.name.toLowerCase();

  if (repoName.includes('todo') || repoName.includes('calculator')) {
    return {
      label: language === 'id' ? 'SARJANA TUTORIAL' : 'TUTORIAL LOOP HELL',
      color: 'bg-[#FF00FF] text-white',
    };
  }
  if (repoName.includes('copy') || repoName.includes('temp') || repoName.includes('test')) {
    return {
      label: language === 'id' ? 'KANG COPAS' : 'COPIED TEMPLATE',
      color: 'bg-orange-400 text-black',
    };
  }
  if (repo.stargazers_count === 0) {
    return {
      label: language === 'id' ? 'SEPI PEMINAT' : 'ZERO STAR TRAGEDY',
      color: 'bg-[#EF4444] text-white',
    };
  }
  if (repo.stargazers_count > 10) {
    return {
      label: language === 'id' ? 'PILIHAN SEPUH' : 'STAR HOARDER',
      color: 'bg-[#00FF00] text-black',
    };
  }
  return {
    label: language === 'id' ? 'KUALITAS STANDARD' : 'MEH QUALITY',
    color: 'bg-[#00FFFF] text-black',
  };
}

export function RepoGraveyard({ repos, language }: RepoGraveyardProps) {
  if (!repos || repos.length === 0) return null;

  return (
    <div className="mt-4 border-4 border-black p-4 bg-[#FFEF00]/10">
      <h5 className="font-black text-xs uppercase tracking-wide border-b-2 border-black pb-1.5 mb-2 flex items-center gap-1.5 select-none">
        <Code className="w-4 h-4" />
        <span>{language === 'id' ? 'SENSUS KUBURAN REPOSITORI' : 'REPO GRAVEYARD AUDIT'}</span>
      </h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {repos.slice(0, 4).map((repo, rIdx) => {
          const badge = getRepoBadge(repo, language);
          return (
            <div
              key={rIdx}
              className="border-2 border-black bg-white p-2 flex flex-col justify-between hover:bg-black/5 transition-colors group select-none"
            >
              <div>
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-black text-xs truncate max-w-[125px] group-hover:text-[#FF00FF]">
                    {repo.name}
                  </span>
                  <span className={`text-[8px] font-black px-1 py-0.5 border border-black uppercase whitespace-nowrap leading-none ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-black/60 line-clamp-1 mt-1 leading-tight">
                  {repo.description || (language === 'id' ? 'Males nulis deskripsi repo.' : 'No readme provided.')}
                </p>
              </div>
              <div className="flex items-center justify-between text-[9px] font-bold text-black/50 border-t border-black/10 mt-1.5 pt-1 uppercase">
                <span className="flex items-center gap-0.5">
                  <Cpu className="w-2.5 h-2.5" />
                  {repo.language || 'Markdown'}
                </span>
                <span className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-current text-yellow-500" /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <GitFork className="w-2.5 h-2.5 text-blue-500" /> {repo.forks_count}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
