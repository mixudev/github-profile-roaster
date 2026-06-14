import React from 'react';

export function Footer() {
  return (
    <footer className="mt-8 border-t-8 border-black pt-4 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs font-bold gap-4 select-none">
      <div className="flex flex-wrap justify-center md:justify-start gap-4 uppercase tracking-wider text-black/60">
        <span>TERMINAL: TTY1</span>
        <span>SESSION: 0XF2A9</span>
        <span>LATENCY: 14MS</span>
        <span>THEME: BOLD TYPOGRAPHY</span>
      </div>
      <div className="uppercase tracking-widest font-black text-center text-black/90 md:text-right">
        DESIGNED FOR MAXIMUM PSYCHOLOGICAL DAMAGE // BORDER-RADIUS: 0
      </div>
    </footer>
  );
}
