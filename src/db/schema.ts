import { pgTable, text, timestamp, uuid, integer, boolean } from 'drizzle-orm/pg-core';

// 1. Workspaces (Mewakili tiap project / ruangan kantor)
// Setiap workspace menyimpan kredensial AI-nya sendiri secara terisolasi
export const workspaces = pgTable('workspaces', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),                  // Contoh: "Acme / payments"
  slug: text('slug').notNull().unique(),         // "acme-payments"
  repoUrl: text('repo_url').notNull(),          // "github.com/org/payments"
  projectType: text('project_type').notNull(),   // "go", "typescript", "python", "game"
  qoderEnvId: text('qoder_env_id'),              // Qoder Cloud Environment ID khusus project ini
  providerApiKey: text('provider_api_key'),      // Token / PAT spesifik untuk workspace ini
  providerConfig: text('provider_config'),      // JSON fleksibel: { qoderToken, googleKey, midasKey }
  roomTheme: text('room_theme').default('brick'),// "brick", "carpet", "wood", "tiles"
  posX: integer('pos_x').default(0),
  posY: integer('pos_y').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Agents (Mewakili karakter di kantor)
export const agents = pgTable('agents', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),                  // Contoh: "Dev-Go", "Frontend-Bot"
  role: text('role').notNull(),                  // "Backend Lead", "UI Engineer"
  avatarSprite: text('avatar_sprite').notNull(), // "dev_orange", "dev_green", "dev_blue", "dev_pink"
  provider: text('provider').notNull(),          // "qoder", "antigravity", "midas"
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  customApiKey: text('custom_api_key'),          // Opsional: Override API key di level agent
  status: text('status').notNull().default('IDLE'), // "IDLE" | "THINKING" | "WORKING"
  currentAction: text('current_action').default('Idle'), // "Editing handler.go | Acme / payments"
  targetFile: text('target_file'),               // "handler.go"
  deskX: integer('desk_x').notNull().default(100),
  deskY: integer('desk_y').notNull().default(100),
  currentX: integer('current_x').notNull().default(100),
  currentY: integer('current_y').notNull().default(100),
  isSitting: boolean('is_sitting').default(true),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Tasks (Antrean instruksi kerja untuk AI)
export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  agentId: uuid('agent_id').references(() => agents.id).notNull(),
  title: text('title').notNull(),
  prompt: text('prompt').notNull(),
  status: text('status').notNull().default('QUEUED'), // "QUEUED" | "IN_PROGRESS" | "DONE" | "FAILED"
  branchName: text('branch_name'),
  prUrl: text('pr_url'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Agent Logs (Rekaman aksi live untuk audit trail dan speech bubble)
export const agentLogs = pgTable('agent_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id').references(() => tasks.id),
  agentId: uuid('agent_id').references(() => agents.id).notNull(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  eventType: text('event_type').notNull(),       // "TOOL_CALL" | "FILE_READ" | "FILE_EDIT" | "BASH"
  toolName: text('tool_name'),                   // "read_file", "edit_file", "git_commit"
  targetFile: text('target_file'),               // "handler.go", "useVariant.ts"
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
