import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="bg-[#EF4444] text-white border-8 border-black p-5 shadow-[8px_8px_0px_0px_#000] flex items-start gap-3 select-none">
      <ShieldAlert className="w-6 h-6 flex-shrink-0 animate-bounce" />
      <div>
        <h4 className="font-black text-xs uppercase tracking-wide">SYSTEM OVERLOAD / FAILURE:</h4>
        <p className="text-sm font-bold mt-1 leading-snug">{error}</p>
      </div>
    </div>
  );
}
