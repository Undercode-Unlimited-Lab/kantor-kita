'use client';

import React from 'react';
import useSWR from 'swr';
import { OfficeCanvas } from '@/components/canvas/OfficeCanvas';
import { TopQuotaBar } from '@/components/hud/TopQuotaBar';
import { AgentRoster } from '@/components/hud/AgentRoster';
import { MusicPlayer } from '@/components/hud/MusicPlayer';
import { BottomControls } from '@/components/hud/BottomControls';
import { TaskPromptDialog } from '@/components/hud/TaskPromptDialog';
import { initialOfficeState } from '@/lib/mock-data';
import { OfficeStateResponse } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OfficePage() {
  // SWR Smart Polling every 2 seconds to Neon database/serverless state
  const { data, mutate } = useSWR<OfficeStateResponse>('/api/office/state', fetcher, {
    fallbackData: initialOfficeState,
    refreshInterval: 2000,
    revalidateOnFocus: true,
  });

  const state = data || initialOfficeState;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0a12]">
      {/* Top HUD: Quota Bars & Zoom */}
      <TopQuotaBar
        weeklyPercent={state.quota.weeklyPercent}
        weeklyResetText={state.quota.weeklyResetText}
        hourlyPercent={state.quota.hourlyPercent}
        hourlyResetText={state.quota.hourlyResetText}
      />

      {/* Right HUD: Agent Avatar Roster */}
      <AgentRoster agents={state.agents} />

      {/* Main 2D Pixel Office Canvas */}
      <OfficeCanvas workspaces={state.workspaces} agents={state.agents} />

      {/* Bottom Left HUD: "+" & Layout buttons */}
      <BottomControls onOpenWorkspaceModal={() => mutate()} />

      {/* Bottom Right HUD: Lo-Fi Music Player */}
      <MusicPlayer />

      {/* Task Assignment Modal */}
      <TaskPromptDialog
        workspaces={state.workspaces}
        agents={state.agents}
        onTaskDispatched={() => mutate()}
      />
    </main>
  );
}
