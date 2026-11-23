'use client';

import React from 'react';
import { useOfficeStore } from '@/lib/store/useOfficeStore';
import { Plus, Minus, Maximize, LayoutGrid } from 'lucide-react';

interface TopQuotaBarProps {
  weeklyPercent?: number;
  weeklyResetText?: string;
  hourlyPercent?: number;
  hourlyResetText?: string;
}

export const TopQuotaBar: React.FC<TopQuotaBarProps> = ({
  weeklyPercent = 79,
  weeklyResetText = 'resets in 3d 10h',
  hourlyPercent = 62,
  hourlyResetText = 'resets in 2h 12m',
}) => {
  const { zoom, zoomIn, zoomOut } = useOfficeStore();

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-30 font-mono text-xs select-none">
      {/* Left: View Controls */}
      <div className="flex items-center gap-1.5 pointer-events-auto bg-[#1b1b2f]/90 border border-[#2e3458] rounded p-1 shadow-lg backdrop-blur">
        <button
          onClick={zoomIn}
          className="p-1 hover:bg-[#2e3458] rounded text-slate-300 transition"
          title="Zoom In"
        >
          <Plus size={14} />
        </button>
        <button
          onClick={zoomOut}
          className="p-1 hover:bg-[#2e3458] rounded text-slate-300 transition"
          title="Zoom Out"
        >
          <Minus size={14} />
        </button>
        <div className="w-[1px] h-4 bg-[#2e3458] mx-0.5" />
        <button
          onClick={toggleFullScreen}
          className="p-1 hover:bg-[#2e3458] rounded text-slate-300 transition"
          title="Fullscreen"
        >
          <Maximize size={14} />
        </button>
      </div>

      {/* Center: Quota Bars */}
      <div className="flex items-center gap-4 pointer-events-auto bg-[#1b1b2f]/90 border border-[#2e3458] px-3 py-1.5 rounded shadow-lg backdrop-blur">
        {/* Weekly Quota */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-3 bg-black/60 rounded overflow-hidden border border-emerald-900/50">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${weeklyPercent}%` }}
            />
          </div>
          <span className="text-emerald-400 font-bold">{weeklyPercent}%</span>
          <span className="text-slate-400 text-[10px]">Weekly · {weeklyResetText}</span>
        </div>

        <div className="w-[1px] h-4 bg-[#2e3458]" />

        {/* 5-Hour Quota */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-3 bg-black/60 rounded overflow-hidden border border-sky-900/50">
            <div
              className="h-full bg-sky-500 transition-all duration-500"
              style={{ width: `${hourlyPercent}%` }}
            />
          </div>
          <span className="text-sky-400 font-bold">{hourlyPercent}%</span>
          <span className="text-slate-400 text-[10px]">5-hour · {hourlyResetText}</span>
        </div>
      </div>

      {/* Placeholder to balance space */}
      <div className="w-20" />
    </div>
  );
};
