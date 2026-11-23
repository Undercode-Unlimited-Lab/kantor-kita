'use client';

import React from 'react';
import { AgentItem } from '@/lib/types';
import { useOfficeStore } from '@/lib/store/useOfficeStore';

interface AgentRosterProps {
  agents: AgentItem[];
}

export const AgentRoster: React.FC<AgentRosterProps> = ({ agents }) => {
  const { selectedAgentId, setSelectedAgentId, openTaskModal } = useOfficeStore();

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-30 font-mono text-xs select-none">
      <div className="bg-[#1b1b2f]/90 border border-[#2e3458] rounded p-1.5 flex flex-col gap-2 shadow-xl backdrop-blur">
        {agents.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          const isWorking = agent.status === 'WORKING';

          // Color skin for avatars
          const skinColors: Record<string, string> = {
            dev_orange: 'from-amber-600 to-orange-700',
            dev_green: 'from-emerald-600 to-teal-800',
            dev_pink: 'from-rose-500 to-pink-700',
            dev_blue: 'from-sky-600 to-indigo-800',
          };
          const bgGradient = skinColors[agent.avatarSprite] || 'from-slate-600 to-slate-800';

          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgentId(isSelected ? null : agent.id)}
              onDoubleClick={() => openTaskModal(agent.workspaceId)}
              className={`relative group cursor-pointer w-10 h-10 rounded border transition-all ${
                isSelected
                  ? 'border-indigo-400 scale-105 shadow-md shadow-indigo-500/20'
                  : 'border-[#2e3458] hover:border-slate-400'
              } bg-[#12121e] overflow-hidden flex items-center justify-center`}
              title={`${agent.name} (${agent.role}) - Double click to assign task`}
            >
              {/* Mini Pixel Avatar */}
              <div
                className={`w-7 h-7 rounded bg-gradient-to-b ${bgGradient} flex flex-col items-center justify-center shadow-inner`}
              >
                {/* Hair / Head */}
                <div className="w-5 h-2 bg-amber-900 rounded-t-sm" />
                {/* Face & Eyes */}
                <div className="w-4 h-2 bg-amber-200 flex justify-around items-center px-0.5">
                  <div className="w-0.5 h-0.5 bg-black" />
                  <div className="w-0.5 h-0.5 bg-black" />
                </div>
              </div>

              {/* Status Dot indicator */}
              <span
                className={`absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full border border-black ${
                  isWorking ? 'bg-emerald-400 animate-pulse' : 'bg-sky-400'
                }`}
              />

              {/* Tooltip on hover */}
              <div className="absolute right-12 top-0 hidden group-hover:flex flex-col bg-[#12121e] border border-[#2e3458] px-2 py-1 rounded whitespace-nowrap shadow-xl z-40">
                <span className="font-bold text-slate-200">{agent.name}</span>
                <span className="text-[10px] text-slate-400">{agent.role}</span>
                <span className="text-[10px] text-indigo-300">
                  Provider: {agent.provider.toUpperCase()}
                </span>
                <span className="text-[10px] text-emerald-400">
                  Status: {agent.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
