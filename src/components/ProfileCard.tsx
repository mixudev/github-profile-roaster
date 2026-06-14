import React from 'react';
import type { GitHubProfile, GitHubRepo, Language } from '../types';

interface ProfileCardProps {
  profile: GitHubProfile;
  repos: GitHubRepo[];
  language: Language;
}

export function ProfileCard({ profile, repos, language }: ProfileCardProps) {
  return (
    <div className="border-8 border-black bg-[#00FFFF] p-5 shadow-[8px_8px_0px_0px_#000] text-black transition-all">
      <h3 className="font-black text-xl uppercase border-b-4 border-black pb-1 mb-3 flex items-center justify-between select-none">
        <span>{language === 'id' ? 'Data Diambil:' : 'Data Fetched:'}</span>
        <span className="text-xs bg-black text-white px-2 py-0.5 font-mono">@{profile.login}</span>
      </h3>
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs md:text-sm font-black uppercase">
        <div>REPOS: {profile.public_repos}</div>
        <div>FOLLOWERS: {profile.followers}</div>
        <div>FOLLOWING: {profile.following}</div>
        <div>LANG: {repos?.[0]?.language || 'None'}</div>
      </div>
    </div>
  );
}
