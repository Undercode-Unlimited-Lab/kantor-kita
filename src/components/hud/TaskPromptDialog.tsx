'use client';

import React, { useState } from 'react';
import { useOfficeStore } from '@/lib/store/useOfficeStore';
import { WorkspaceItem, AgentItem, AIProvider } from '@/lib/types';
import { X, Send, Bot, CheckCircle, KeyRound } from 'lucide-react';

interface TaskPromptDialogProps {
  workspaces: WorkspaceItem[];
  agents: AgentItem[];
  onTaskDispatched?: () => void;
}

export const TaskPromptDialog: React.FC<TaskPromptDialogProps> = ({
  workspaces,
  agents,
  onTaskDispatched,
}) => {
  const { isTaskModalOpen, setTaskModalOpen, targetWorkspaceId } = useOfficeStore();

  const [prompt, setPrompt] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('qoder');
  const [workspaceToken, setWorkspaceToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isTaskModalOpen) return null;

  const activeWorkspace = workspaces.find((w) => w.id === targetWorkspaceId) || workspaces[0];
  const assignedAgent = agents.find((a) => a.workspaceId === activeWorkspace?.id) || agents[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/tasks/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: activeWorkspace.id,
          agentId: assignedAgent.id,
          prompt: prompt,
          provider: selectedProvider,
          customApiKey: workspaceToken.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message || 'Task dispatched to cloud agent!');
        setPrompt('');
        if (onTaskDispatched) onTaskDispatched();
        setTimeout(() => {
          setTaskModalOpen(false);
          setSuccessMsg('');
        }, 1800);
      }
    } catch (err) {
      console.error('Failed to dispatch task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm font-mono text-xs">
      <div className="bg-[#1b1b2f] border border-[#2e3458] rounded-lg p-5 w-full max-w-md shadow-2xl relative text-slate-200">
        <button
          onClick={() => setTaskModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <Bot className="text-indigo-400" size={18} />
          <h2 className="text-sm font-bold text-white">Tugaskan Agent di Workspace</h2>
        </div>

        {/* Workspace & Agent Info */}
        <div className="bg-[#12121e] border border-[#2e3458] rounded p-2.5 mb-3">
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Workspace:</span>
            <span className="text-emerald-400 font-bold">{activeWorkspace?.name}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Agent:</span>
            <span className="text-sky-400 font-bold">{assignedAgent?.name}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Provider Selection */}
          <div>
            <label className="block text-slate-400 mb-1">Pilih Provider AI:</label>
            <div className="grid grid-cols-3 gap-2">
              {(['qoder', 'antigravity', 'midas'] as AIProvider[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setSelectedProvider(p)}
                  className={`py-1.5 px-2 rounded border uppercase font-bold text-[10px] transition ${
                    selectedProvider === p
                      ? 'border-indigo-400 bg-indigo-600/30 text-white'
                      : 'border-[#2e3458] text-slate-400 hover:border-slate-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Workspace Token Setting Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowTokenInput(!showTokenInput)}
              className="flex items-center gap-1.5 text-[11px] text-indigo-400 hover:text-indigo-300 transition"
            >
              <KeyRound size={12} />
              <span>
                {showTokenInput ? 'Tutup Pengaturan Token' : 'Set Token Khusus Workspace Ini'}
              </span>
            </button>

            {showTokenInput && (
              <div className="mt-1.5 p-2 bg-[#12121e] border border-[#2e3458] rounded">
                <label className="block text-[10px] text-slate-400 mb-1">
                  Access Token / PAT ({selectedProvider.toUpperCase()}):
                </label>
                <input
                  type="password"
                  value={workspaceToken}
                  onChange={(e) => setWorkspaceToken(e.target.value)}
                  placeholder={`Masukkan token ${selectedProvider} untuk workspace ini...`}
                  className="w-full bg-[#1b1b2f] border border-[#2e3458] rounded p-1.5 text-slate-200 focus:outline-none focus:border-indigo-400"
                />
                <span className="text-[9px] text-slate-500 mt-0.5 block">
                  Token ini disimpan khusus untuk workspace ini, tidak mempengaruhi workspace lain.
                </span>
              </div>
            )}
          </div>

          {/* Prompt Input */}
          <div>
            <label className="block text-slate-400 mb-1">Instruksi Tugas (Prompt):</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: Refactor handler.go untuk menambahkan validasi token..."
              rows={3}
              className="w-full bg-[#12121e] border border-[#2e3458] rounded p-2 text-slate-200 focus:outline-none focus:border-indigo-400 resize-none"
              required
            />
          </div>

          {successMsg && (
            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/50 border border-emerald-800 p-2 rounded">
              <CheckCircle size={14} />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setTaskModalOpen(false)}
              className="px-3 py-1.5 bg-[#2e3458] hover:bg-slate-700 text-slate-300 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded transition disabled:opacity-50"
            >
              <Send size={12} />
              <span>{isSubmitting ? 'Mengirim...' : 'Kirim ke Cloud'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
