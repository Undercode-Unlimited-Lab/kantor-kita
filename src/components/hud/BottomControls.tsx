'use client';

import React from 'react';
import { Plus, Layout } from 'lucide-react';
import { useOfficeStore } from '@/lib/store/useOfficeStore';

interface BottomControlsProps {
  onOpenWorkspaceModal?: () => void;
}

export const BottomControls: React.FC<BottomControlsProps> = ({ onOpenWorkspaceModal }) => {
  const { openTaskModal } = useOfficeStore();

  return (
    <div className="absolute bottom-4 left-4 flex items-center gap-2 z-30 font-mono text-xs select-none">
      <div className="flex items-center gap-1.5 bg-[#1b1b2f]/90 border border-[#2e3458] rounded p-1 shadow-lg backdrop-blur">
        {/* Plus Button: Add Task or Workspace */}
        <button
          onClick={() => openTaskModal('ws-payments')}
          className="flex items-center justify-center w-7 h-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition shadow"
          title="Tugaskan Task Baru"
        >
          <Plus size={16} />
        </button>

        {/* Layout Button */}
        <button
          onClick={onOpenWorkspaceModal}
          className="flex items-center gap-1.5 px-2.5 py-1 hover:bg-[#2e3458] text-slate-300 rounded transition"
          title="Atur Workspace & Layout"
        >
          <Layout size={14} />
          <span className="font-bold">Layout</span>
        </button>
      </div>
    </div>
  );
};
