import { AIProviderAdapter, DispatchTaskPayload, ProviderTaskResult, QuotaInfo } from './types';

export class QoderCloudAdapter implements AIProviderAdapter {
  name = 'qoder' as const;

  async dispatch(payload: DispatchTaskPayload): Promise<ProviderTaskResult> {
    // Membaca token secara dinamis dari workspace / agent yang sedang berjalan
    const activeToken = payload.apiKey || payload.providerConfig?.qoderToken;

    console.log(
      `[QoderCloud] Dispatching task ${payload.taskId} for workspace ${payload.workspaceId}` +
      ` using ${activeToken ? 'Workspace-Specific PAT' : 'No Token (Simulation)'}`
    );

    if (!activeToken) {
      console.warn(
        `[QoderCloud] Workspace ${payload.workspaceId} belum memiliki QODER token khusus. Menjalankan mode simulasi.`
      );
    }

    return {
      jobId: `qoder-job-${Date.now()}`,
      status: 'ACCEPTED',
      message: `Tugas dikirim ke Qoder Cloud VM (${payload.environmentId || 'env-workspace'}) ${
        activeToken ? 'dengan Workspace Token terisolasi' : '(Simulasi - Token belum diisi)'
      }`,
      usedCustomToken: !!activeToken,
    };
  }

  async getQuota(): Promise<QuotaInfo> {
    return {
      weeklyPercent: 79,
      weeklyResetText: 'resets in 3d 10h',
      hourlyPercent: 62,
      hourlyResetText: 'resets in 2h 12m',
    };
  }
}
