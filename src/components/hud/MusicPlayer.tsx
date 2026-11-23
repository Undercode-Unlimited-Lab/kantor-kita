'use client';

import React, { useState, useEffect } from 'react';
import { useOfficeStore } from '@/lib/store/useOfficeStore';
import { Play, Pause, SkipForward, Volume2, VolumeX, Settings } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const { isPlayingMusic, toggleMusic, musicVolume, setMusicVolume } = useOfficeStore();
  const [isMuted, setIsMuted] = useState(false);

  // Equalizer visual animation bars
  const [bars, setBars] = useState([40, 70, 30, 90, 60, 45, 80]);

  useEffect(() => {
    if (!isPlayingMusic) return;
    const interval = setInterval(() => {
      setBars([
        Math.floor(Math.random() * 80) + 20,
        Math.floor(Math.random() * 90) + 10,
        Math.floor(Math.random() * 70) + 30,
        Math.floor(Math.random() * 85) + 15,
        Math.floor(Math.random() * 75) + 25,
        Math.floor(Math.random() * 80) + 20,
        Math.floor(Math.random() * 95) + 10,
      ]);
    }, 150);
    return () => clearInterval(interval);
  }, [isPlayingMusic]);

  return (
    <div className="absolute bottom-4 right-4 z-30 font-mono text-xs select-none">
      <div className="bg-[#1b1b2f]/90 border border-[#2e3458] rounded p-2 flex items-center gap-3 shadow-2xl backdrop-blur">
        {/* Play / Pause Button */}
        <button
          onClick={toggleMusic}
          className="p-1.5 bg-[#2e3458] hover:bg-indigo-600 text-slate-200 rounded transition"
          title={isPlayingMusic ? 'Pause Lo-Fi' : 'Play Lo-Fi'}
        >
          {isPlayingMusic ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <button className="p-1 text-slate-400 hover:text-slate-200 transition">
          <SkipForward size={14} />
        </button>

        {/* Track Info */}
        <div className="flex flex-col min-w-[130px]">
          <span className="text-slate-200 font-bold truncate">Chrome Commons</span>
          <span className="text-[10px] text-slate-400 truncate">Town · F# mixolydian</span>
        </div>

        {/* Animated Equalizer Waveform */}
        <div className="flex items-end gap-0.5 h-5 px-1">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-t transition-all duration-150 ${
                isPlayingMusic ? 'bg-indigo-400' : 'bg-slate-600'
              }`}
              style={{ height: isPlayingMusic ? `${h}%` : '20%' }}
            />
          ))}
        </div>

        {/* Volume & Settings */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-1 text-slate-400 hover:text-slate-200 transition"
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>

        <button className="p-1 text-slate-400 hover:text-slate-200 transition">
          <Settings size={14} />
        </button>
      </div>
    </div>
  );
};
