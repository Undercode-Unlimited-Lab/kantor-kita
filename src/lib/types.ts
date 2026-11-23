export type AgentStatus = 'IDLE' | 'THINKING' | 'WORKING' | 'WAITING_APPROVAL';

export type AIProvider = 'qoder' | 'antigravity' | 'midas';

export interface WorkspaceItem {
  id: string;
  name: string;
  slug: string;
  repoUrl: string;
  projectType: string;
  qoderEnvId?: string | null;
  providerApiKey?: string | null;
  providerConfig?: string | null;
  roomTheme: string;
  posX: number;
  posY: number;
}

export interface AgentItem {
  id: string;
  name: string;
  role: string;
  avatarSprite: string;
  provider: AIProvider;
  workspaceId: string;
  workspaceName?: string;
  customApiKey?: string | null;
  status: AgentStatus;
  currentAction: string;
  targetFile?: string | null;
  deskX: number;
  deskY: number;
  currentX: number;
  currentY: number;
  isSitting: boolean;
}

export interface TaskItem {
  id: string;
  workspaceId: string;
  agentId: string;
  title: string;
  prompt: string;
  status: 'QUEUED' | 'IN_PROGRESS' | 'DONE' | 'FAILED';
  branchName?: string | null;
  prUrl?: string | null;
  createdAt: string;
}

export interface OfficeStateResponse {
  workspaces: WorkspaceItem[];
  agents: AgentItem[];
  recentLogs: {
    id: string;
    agentId: string;
    toolName: string;
    targetFile?: string | null;
    details?: string | null;
    createdAt: string;
  }[];
  quota: {
    weeklyPercent: number;
    weeklyResetText: string;
    hourlyPercent: number;
    hourlyResetText: string;
  };
}
