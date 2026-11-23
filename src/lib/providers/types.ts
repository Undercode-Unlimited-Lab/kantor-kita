export interface DispatchTaskPayload {
  taskId: string;
  workspaceId: string;
  agentId: string;
  environmentId?: string | null;
  apiKey?: string | null;              // Token spesifik dari workspace/agent
  providerConfig?: Record<string, string> | null;
  repoUrl: string;
  prompt: string;
}

export interface ProviderTaskResult {
  jobId: string;
  status: 'PENDING' | 'ACCEPTED' | 'PROCESSING';
  message: string;
  usedCustomToken: boolean;
}

export interface QuotaInfo {
  weeklyPercent: number;
  weeklyResetText: string;
  hourlyPercent: number;
  hourlyResetText: string;
}

export interface AIProviderAdapter {
  name: 'qoder' | 'antigravity' | 'midas';
  dispatch(payload: DispatchTaskPayload): Promise<ProviderTaskResult>;
  getQuota(): Promise<QuotaInfo>;
}
