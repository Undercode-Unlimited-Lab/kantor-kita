import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getProviderAdapter } from '@/lib/providers';
import { getDynamicState, updateAgentState } from '@/lib/office-state';
import { getDb } from '@/db';
import { workspaces, agents, tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';

const taskSchema = z.object({
  workspaceId: z.string(),
  agentId: z.string(),
  prompt: z.string().min(3),
  provider: z.enum(['qoder', 'antigravity', 'midas']).default('qoder'),
  customApiKey: z.string().optional(), // Opsional: Token manual yang dimasukkan user di modal
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = taskSchema.parse(body);

    const adapter = getProviderAdapter(data.provider);
    const db = getDb();
    let workspaceApiKey: string | undefined = data.customApiKey;
    let environmentId: string | undefined;

    // Ambil token dan environment ID khusus workspace ini dari Database Neon jika tersedia
    if (db) {
      try {
        const foundWs = await db
          .select()
          .from(workspaces)
          .where(eq(workspaces.id, data.workspaceId))
          .limit(1);

        if (foundWs.length > 0) {
          workspaceApiKey = workspaceApiKey || foundWs[0].providerApiKey || undefined;
          environmentId = foundWs[0].qoderEnvId || undefined;
        }
      } catch (err) {
        console.warn('Neon DB query fallback to dynamic state:', err);
      }
    }

    // Jika tidak ada di DB, cek di in-memory dynamic state
    if (!workspaceApiKey) {
      const dynamicWs = getDynamicState().workspaces.find((w) => w.id === data.workspaceId);
      workspaceApiKey = dynamicWs?.providerApiKey || undefined;
      environmentId = environmentId || dynamicWs?.qoderEnvId || undefined;
    }

    // Update status ke WORKING
    const actionLabel = `Working on: ${data.prompt.slice(0, 30)}...`;
    updateAgentState(data.agentId, 'WORKING', actionLabel);

    // Dispatch ke provider dengan Kredensial Terisolasi Workspace ini
    const result = await adapter.dispatch({
      taskId: `task-${Date.now()}`,
      workspaceId: data.workspaceId,
      agentId: data.agentId,
      environmentId: environmentId,
      apiKey: workspaceApiKey,
      repoUrl: 'https://github.com/sample',
      prompt: data.prompt,
    });

    return NextResponse.json({
      success: true,
      message: result.message,
      jobId: result.jobId,
      usedCustomToken: result.usedCustomToken,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Invalid task payload' },
      { status: 400 }
    );
  }
}
