import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeProvider: string;
}

export function Header({ soundEnabled, onToggleSound, activeProvider }: HeaderProps) {
  const providerLabel = activeProvider
    ? `● ONLINE_${activeProvider.toUpperCase()}`
    : '● ONLINE_READY';

  return (
    <header className="border-b-8 border-black pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 z-20">
      <div>
        <h1 className="text-4xl md:text-7xl font-black leading-none uppercase tracking-tighter">
          Github Roaster
        </h1>

      </div>


    </header>
  );
}
