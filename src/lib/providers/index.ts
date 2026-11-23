import { AIProviderAdapter } from './types';
import { QoderCloudAdapter } from './qoder-adapter';
import { AntigravityAdapter } from './antigravity-adapter';
import { MidasAdapter } from './midas-adapter';

const adapters: Record<string, AIProviderAdapter> = {
  qoder: new QoderCloudAdapter(),
  antigravity: new AntigravityAdapter(),
  midas: new MidasAdapter(),
};

export function getProviderAdapter(provider: string): AIProviderAdapter {
  return adapters[provider] || adapters.qoder;
}

export * from './types';
