import { create } from 'zustand';

interface OfficeStore {
  zoom: number;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  selectedAgentId: string | null;
  setSelectedAgentId: (id: string | null) => void;
  isPlayingMusic: boolean;
  setMusicPlaying: (playing: boolean) => void;
  musicVolume: number;
  setMusicVolume: (volume: number) => void;
  isTaskModalOpen: boolean;
  setTaskModalOpen: (open: boolean) => void;
  targetWorkspaceId: string | null;
  openTaskModal: (workspaceId: string) => void;
}

export const useOfficeStore = create<OfficeStore>((set) => ({
  zoom: 1.0,
  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.5), 2.5) }),
  zoomIn: () => set((state) => ({ zoom: Math.min(state.zoom + 0.15, 2.5) })),
  zoomOut: () => set((state) => ({ zoom: Math.max(state.zoom - 0.15, 0.5) })),
  selectedAgentId: null,
  setSelectedAgentId: (id) => set({ selectedAgentId: id }),
  isPlayingMusic: false,
  setMusicPlaying: (playing) => set({ isPlayingMusic: playing }),
  musicVolume: 0.5,
  setMusicVolume: (volume) => set({ musicVolume: volume }),
  isTaskModalOpen: false,
  setTaskModalOpen: (open) => set({ isTaskModalOpen: open }),
  targetWorkspaceId: null,
  openTaskModal: (workspaceId) => set({ isTaskModalOpen: true, targetWorkspaceId: workspaceId }),
}));
