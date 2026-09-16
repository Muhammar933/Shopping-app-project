import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
  activeTab: string;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative mx-auto w-full max-w-[420px] h-[860px] bg-[#111111] rounded-[52px] p-3 shadow-2xl ring-1 ring-white/10 flex flex-col select-none overflow-hidden">
      {/* Outer Phone Frame Accents */}
      <div className="absolute -left-[3px] top-28 w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
      <div className="absolute -left-[3px] top-44 w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
      <div className="absolute -right-[3px] top-36 w-[3px] h-16 bg-[#2a2a2a] rounded-r-sm" />

      {/* Screen Container */}
      <div className="relative w-full h-full bg-[#FAFAF8] rounded-[44px] overflow-hidden flex flex-col">
        {/* Dynamic Island / Top Status Bar */}
        <div className="h-11 bg-transparent px-6 pt-3 flex items-center justify-between text-xs font-semibold text-neutral-900 z-50 pointer-events-none">
          <span>{currentTime}</span>
          {/* Dynamic Island */}
          <div className="w-28 h-6 bg-black rounded-full flex items-center justify-end px-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a] border border-[#2b2b2b]" />
          </div>
          <div className="flex items-center gap-1.5 text-neutral-800">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* Screen Content Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </div>

        {/* Bottom Home Indicator */}
        <div className="h-6 w-full flex items-center justify-center bg-white/80 backdrop-blur-sm z-50 pointer-events-none">
          <div className="w-32 h-1 bg-neutral-900/30 rounded-full" />
        </div>
      </div>
    </div>
  );
};
