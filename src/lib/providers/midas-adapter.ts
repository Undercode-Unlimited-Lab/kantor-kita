import { AIProviderAdapter, DispatchTaskPayload, ProviderTaskResult, QuotaInfo } from './types';

export class MidasAdapter implements AIProviderAdapter {
  name = 'midas' as const;

  async dispatch(payload: DispatchTaskPayload): Promise<ProviderTaskResult> {
    const activeToken = payload.apiKey || payload.providerConfig?.midasKey;

    console.log(
      `[Midas] Sending task to Midas AI for workspace: ${payload.workspaceId}`
    );

    return {
      jobId: `midas-job-${Date.now()}`,
      status: 'ACCEPTED',
      message: `Midas AI analytics pipeline aktif untuk workspace ${payload.workspaceId}`,
      usedCustomToken: !!activeToken,
    };
  }

  async getQuota(): Promise<QuotaInfo> {
    return {
      weeklyPercent: 88,
      weeklyResetText: 'resets in 1d 08h',
      hourlyPercent: 74,
      hourlyResetText: 'resets in 30m',
    };
  }
}
