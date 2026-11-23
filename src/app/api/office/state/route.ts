import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { workspaces, agents, agentLogs } from '@/db/schema';
import { getDynamicState } from '@/lib/office-state';
import { desc } from 'drizzle-orm';

export async function GET() {
  const db = getDb();
  const dynamicState = getDynamicState();

  // If Neon database is configured, load real state from Postgres
  if (db) {
    try {
      const dbWorkspaces = await db.select().from(workspaces);
      const dbAgents = await db.select().from(agents);
      const dbLogs = await db.select().from(agentLogs).orderBy(desc(agentLogs.createdAt)).limit(10);

      if (dbWorkspaces.length > 0) {
        return NextResponse.json({
          workspaces: dbWorkspaces,
          agents: dbAgents,
          recentLogs: dbLogs,
          quota: dynamicState.quota,
        });
      }
    } catch (err) {
      console.warn('Neon DB not seeded yet, serving dynamic in-memory state:', err);
    }
  }

  // Fallback to active dynamic state
  return NextResponse.json(dynamicState);
}
