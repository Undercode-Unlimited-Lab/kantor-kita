import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { initialOfficeState } from '../lib/mock-data';

async function seed() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || !dbUrl.startsWith('postgres')) {
    console.error('DATABASE_URL is not set or invalid in .env / .env.local');
    process.exit(1);
  }

  const sql = neon(dbUrl);
  const db = drizzle(sql, { schema });

  console.log('Seeding workspaces and agents to Neon Postgres...');

  // Insert Workspaces
  for (const ws of initialOfficeState.workspaces) {
    await db.insert(schema.workspaces).values({
      name: ws.name,
      slug: ws.slug,
      repoUrl: ws.repoUrl,
      projectType: ws.projectType,
      qoderEnvId: ws.qoderEnvId,
      providerApiKey: ws.providerApiKey,
      roomTheme: ws.roomTheme,
      posX: ws.posX,
      posY: ws.posY,
    }).onConflictDoNothing();
  }

  // Insert Agents
  for (const ag of initialOfficeState.agents) {
    await db.insert(schema.agents).values({
      name: ag.name,
      role: ag.role,
      avatarSprite: ag.avatarSprite,
      provider: ag.provider,
      customApiKey: ag.customApiKey,
      status: ag.status,
      currentAction: ag.currentAction,
      targetFile: ag.targetFile,
      deskX: ag.deskX,
      deskY: ag.deskY,
      currentX: ag.currentX,
      currentY: ag.currentY,
      isSitting: ag.isSitting,
    }).onConflictDoNothing();
  }

  console.log('Seeding completed successfully!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
