import { AIProviderAdapter, DispatchTaskPayload, ProviderTaskResult, QuotaInfo } from './types';

export class AntigravityAdapter implements AIProviderAdapter {
  name = 'antigravity' as const;

  async dispatch(payload: DispatchTaskPayload): Promise<ProviderTaskResult> {
    const activeKey = payload.apiKey || payload.providerConfig?.googleKey;

    console.log(
      `[Antigravity] Spawning agent for workspace: ${payload.workspaceId} ` +
      `(${activeKey ? 'Workspace API Key' : 'Simulation Mode'})`
    );

    return {
      jobId: `ag-job-${Date.now()}`,
      status: 'PROCESSING',
      message: `Antigravity Deepmind Agent aktif untuk workspace ${payload.workspaceId}`,
      usedCustomToken: !!activeKey,
    };
  }

  async getQuota(): Promise<QuotaInfo> {
    return {
      weeklyPercent: 45,
      weeklyResetText: 'resets in 5d 14h',
      hourlyPercent: 28,
      hourlyResetText: 'resets in 1h 45m',
    };
  }
}
