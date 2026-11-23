# Blueprint Proyek: Kantor-Kita (Autonomous Multi-Agent Virtual Office)

Sistem kantor virtual 2D retro pixel-art berbasis web yang mengorkestrasikan dan memvisualisasikan aktivitas **AI Coding Agent otonom (tanpa komputer lokal)** yang bekerja secara paralel pada **berbagai workspace/project (multi-repo)** menggunakan berbagai penyedia AI (**Qoder Cloud, Antigravity, Midas**).

---

## 1. Arsitektur Inti & Teknologi Pilihan (The Best-in-Class Stack)

| Kategori | Teknologi / Package | Alasan Pemilihan "Do The Best" |
| :--- | :--- | :--- |
| **Fullstack Framework** | **Next.js 15 (App Router) + TypeScript** | Standar industri untuk React fullstack di Vercel: Server Actions, Route Handlers, Edge/Node runtimes, dan zero-config deployment. |
| **Hosting & Cloud Platform** | **Vercel** | Platform serverless native untuk Next.js dengan CDN global, Vercel Edge Network, dan integrasi 1-click storage. |
| **Database (Serverless Postgres)** | **Neon Tech (`@neondatabase/serverless`)** | Postgres cloud serverless dengan arsitektur auto-scaling, *scale-to-zero*, dan connection pooling bawaan (PgBouncer) yang kebal kendala *connection exhaustion* pada serverless functions. |
| **Object-Relational Mapping (ORM)** | **Drizzle ORM (`drizzle-orm`, `drizzle-kit`)** | Jauh lebih ringan dan cepat dibandingkan Prisma di lingkungan serverless. Zero cold-start overhead, SQL-like query builder, dan type-safety murni. |
| **2D Pixel Canvas Engine** | **Pixi.js v8 (`pixi.js`)** | WebGL/WebGPU 2D rendering engine tercepat untuk browser. Mendukung mode `nearest-neighbor` (pixel-perfect) untuk grafis retro, jauh lebih ramah SSR/React dibanding Phaser yang berat. |
| **State Sync & Realtime** | **SWR (`swr`) + Zustand (`zustand`)** | `SWR` menangani data fetching & smart polling ke database Neon (revalidasi otomatis, no-delay). `Zustand` menangani client-side game state (zoom camera, active agent selection, audio state). |
| **UI Components & Styling** | **Tailwind CSS v4 + Radix UI + Lucide React** | Utility-first CSS dengan komponen headless aksesibel untuk modal setting, task input dialog, slider audio, dan icon modern. |
| **AI Agent SDK & Provider** | **`@qoder-ai/qoder-agent-sdk` + Vercel `ai` SDK** | SDK resmi Qoder untuk integrasi Qoder Cloud Agent, dikombinasikan dengan Vercel AI SDK untuk standardisasi LLM provider lainnya. |
| **Audio / Lo-Fi Player** | **Howler.js (`howler`) + Web Audio API** | Audio library paling stabil untuk cross-browser sound effects (SFX mengetik, bel task selesai) dan background lo-fi music stream. |
| **Schema Validation** | **Zod (`zod`)** | Validasi runtime type-safe untuk payload API, webhook, dan environment variables. |

---

## 2. Diagram Alur Sistem (End-to-End Architecture)

```
[ Pengguna di Browser / HP / Laptop ]
                 │
                 ▼ (Akses Dashboard Web di Vercel)
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js App)                          │
│  ┌──────────────────────────────┐    ┌──────────────────────────────┐  │
│  │   Pixi.js 2D Canvas Engine   │    │   Zustand & SWR Smart Sync   │  │
│  │ (Avatar, Desks, SpeechBubble)│◄───┤  (Polling Neon / SSE Stream) │  │
│  └──────────────────────────────┘    └──────────────────────────────┘  │
└────────────────────────────────┬───────────────────────────────────────┘
                                 │
                   HTTPS API Request / Webhook
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Vercel Serverless)                       │
│  ┌──────────────────────────────┐    ┌──────────────────────────────┐  │
│  │ Route Handlers & Server Acts │    │   Unified Provider Adapter   │  │
│  │  (/api/tasks, /api/webhooks) │───►│ (Qoder Cloud, Antigravity)   │  │
│  └──────────────┬───────────────┘    └──────────────┬───────────────┘  │
└─────────────────┼───────────────────────────────────┼──────────────────┘
                  │                                   │
                  ▼ (Drizzle ORM)                     ▼ (Async API Trigger)
┌──────────────────────────────────┐ ┌──────────────────────────────────┐
│        NEON TECH POSTGRES        │ │     REMOTE CLOUD EXECUTION       │
│  - workspaces (repo & env mapping)│ │  - Qoder Cloud Agents (VM)       │
│  - agents (status, current_action)│ │  - Antigravity Runner            │
│  - tasks (prompts & PR links)    │ │  - Midas AI Analytics Engine     │
│  - agent_logs (audit events)     │ │  (Git Clone, Edit, Run Bash, PR) │
└──────────────────────────────────┘ └──────────────────────────────────┘
```

---

## 3. Desain Skema Database (Drizzle ORM di Neon Tech)

```typescript
// src/db/schema.ts
import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

// 1. Workspaces (Mewakili tiap project / ruangan kantor)
export const workspaces = pgTable('workspaces', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),                  // Contoh: "Acme / payments"
  slug: text('slug').notNull().unique(),         // "acme-payments"
  repoUrl: text('repo_url').notNull(),          // "github.com/org/payments"
  projectType: text('project_type').notNull(),   // "go", "typescript", "python"
  qoderEnvId: text('qoder_env_id'),              // Qoder Cloud Environment ID
  roomCoordinates: text('room_coordinates'),     // Koordinat area di canvas: "{x: 100, y: 200}"
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Agents (Mewakili karakter di kantor)
export const agents = pgTable('agents', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),                  // Contoh: "Dev-Go", "Frontend-Bot"
  avatarSprite: text('avatar_sprite').notNull(), // Sprite ID/skin karakter
  provider: text('provider').notNull(),          // "qoder", "antigravity", "midas"
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  status: text('status').notNull().default('IDLE'), // "IDLE" | "THINKING" | "WORKING" | "WAITING_APPROVAL"
  currentAction: text('current_action').default('Idle'), // "Editing handler.go | Acme / payments"
  deskX: integer('desk_x').notNull(),
  deskY: integer('desk_y').notNull(),
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

// 4. Agent Logs (Rekaman aksi live untuk speech bubble dan audit trail)
export const agentLogs = pgTable('agent_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id').references(() => tasks.id),
  agentId: uuid('agent_id').references(() => agents.id).notNull(),
  eventType: text('event_type').notNull(),       // "TOOL_CALL" | "FILE_READ" | "FILE_EDIT" | "BASH"
  toolName: text('tool_name'),                   // "read_file", "edit_file", "git_commit"
  targetFile: text('target_file'),               // "handler.go", "useVariant.ts"
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

---

## 4. Pola Provider Adapter (Multi-Provider Abstraction)

Untuk menghubungkan **Qoder Cloud**, **Antigravity**, dan **Midas**, kita menggunakan antarmuka adapter terstandarisasi:

```typescript
// src/lib/providers/types.ts
export interface AgentTaskRequest {
  taskId: string;
  workspaceId: string;
  environmentId?: string;
  repoUrl: string;
  prompt: string;
}

export interface AgentProviderAdapter {
  providerName: 'qoder' | 'antigravity' | 'midas';
  dispatchTask(request: AgentTaskRequest): Promise<{ externalJobId: string }>;
  cancelTask(externalJobId: string): Promise<boolean>;
  getQuotaUsage(): Promise<{ weeklyPercent: number; hourlyPercent: number }>;
}
```

### Implementasi Qoder Cloud Adapter:
```typescript
// src/lib/providers/qoder-adapter.ts
import { accessTokenFromEnv, query } from '@qoder-ai/qoder-agent-sdk';
import { AgentProviderAdapter, AgentTaskRequest } from './types';
import { db } from '@/db';
import { agents, agentLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export class QoderCloudAdapter implements AgentProviderAdapter {
  providerName = 'qoder' as const;

  async dispatchTask(request: AgentTaskRequest) {
    // Jalankan eksekusi async di cloud Qoder
    this.streamTaskExecution(request).catch(console.error);
    return { externalJobId: `qoder-${request.taskId}` };
  }

  private async streamTaskExecution(req: AgentTaskRequest) {
    const events = query({
      prompt: req.prompt,
      auth: accessTokenFromEnv(),
      experimentalCloudAgent: {
        environmentId: req.environmentId!,
      },
    });

    for await (const event of events) {
      if (event.type === 'tool_call') {
        const actionText = `${event.toolName} ${event.targetFile || ''}`;
        
        // 1. Update status agent secara instan di Neon Postgres
        await db.update(agents)
          .set({ status: 'WORKING', currentAction: actionText, updatedAt: new Date() })
          .where(eq(agents.workspaceId, req.workspaceId));

        // 2. Simpan ke agent_logs
        await db.insert(agentLogs).values({
          taskId: req.taskId,
          agentId: req.taskId, // mapping ID
          eventType: 'TOOL_CALL',
          toolName: event.toolName,
          targetFile: event.targetFile,
        });
      }
    }
  }

  async getQuotaUsage() {
    return { weeklyPercent: 79, hourlyPercent: 62 };
  }

  async cancelTask() { return true; }
}
```

---

## 5. Struktur Folder Proyek (Next.js Fullstack)

```
kantor-kita/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── office/
│   │   │   │   └── state/route.ts       # Endpoint polling data kantor (SWR)
│   │   │   ├── tasks/
│   │   │   │   └── dispatch/route.ts    # Mengirim tugas ke AI agent
│   │   │   ├── webhooks/
│   │   │   │   └── qoder/route.ts       # Menerima callback dari Qoder Cloud
│   │   │   └── workspaces/route.ts      # CRUD data workspace
│   │   ├── layout.tsx                   # Layout global (font pixel, audio provider)
│   │   └── page.tsx                     # Main Office Page (Canvas + Overlays)
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── OfficeCanvas.tsx         # Root Pixi.js Canvas wrapper
│   │   │   ├── AgentSprite.ts           # Logika gerak & animasi karakter
│   │   │   ├── SpeechBubble.tsx         # Teks status di atas kepala karakter
│   │   │   └── TilemapRenderer.ts       # Gambar ubin kantor, meja, tanaman, sofa
│   │   ├── hud/
│   │   │   ├── TopQuotaBar.tsx          # Bar kuota mingguan & 5 jam (sesuai gambar)
│   │   │   ├── AgentRoster.tsx          # Panel avatar list di sebelah kanan
│   │   │   ├── MusicPlayer.tsx          # Lo-Fi player (Chrome Commons di kanan bawah)
│   │   │   ├── WorkspaceModal.tsx       # Dialog tambah workspace/project baru
│   │   │   └── TaskPromptDialog.tsx     # Dialog kirim tugas ke agent di meja tertentu
│   │   └── ui/                          # Radix / Tailwind reusable components
│   ├── db/
│   │   ├── index.ts                     # Inisialisasi Neon Drizzle Client
│   │   └── schema.ts                    # Skema tabel database Neon
│   ├── lib/
│   │   ├── providers/                   # Multi-provider adapter layer
│   │   │   ├── types.ts
│   │   │   ├── qoder-adapter.ts
│   │   │   ├── antigravity-adapter.ts
│   │   │   └── midas-adapter.ts
│   │   └── store/
│   │       └── useOfficeStore.ts        # Zustand state store
│   └── public/
│       ├── assets/
│       │   ├── tiles/                   # Ubin lantai kayu, dinding, sofa, meja
│       │   ├── sprites/                 # Karakter pixel walking & typing
│       │   └── audio/                   # Musik lofi retro & SFX
│       └── fonts/                       # Pixel font (e.g. 'Press Start 2P')
├── drizzle.config.ts                    # Konfigurasi Drizzle migrations
├── next.config.ts
├── package.json
└── tailwind.config.ts
```

---

## 6. Roadmap Pelaksanaan Bertahap

| Fase | Target Kerja | Output Terukur |
| :--- | :--- | :--- |
| **Fase 1: Setup Foundation** | - Inisialisasi Next.js 15, Tailwind, & Drizzle.<br>- Koneksikan database Neon Tech.<br>- Siapkan skema tabel `workspaces`, `agents`, `tasks`. | Database Neon terhubung, migration sukses, dan seed data 4 workspace awal sudah masuk. |
| **Fase 2: Qoder Cloud Adapter** | - Setup `@qoder-ai/qoder-agent-sdk`.<br>- Buat API `/api/tasks/dispatch` untuk mengirim prompt ke Qoder Cloud.<br>- Buat sinkronisasi update status ke database Neon. | Mengirim prompt via Postman -> Qoder Cloud bekerja -> status di DB Neon berubah jadi `WORKING: Editing handler.go`. |
| **Fase 3: Canvas Kantor Pixel-Art** | - Pasang Pixi.js di Next.js.<br>- Render layout ruangan (meja, kursi, sofa, meeting room).<br>- Tampilkan sprite karakter di meja masing-masing. | Tampilan retro kantor 2D muncul di browser dengan karakter beranimasi mengetik & duduk di meja. |
| **Fase 4: Realtime HUD & Audio** | - Pasang SWR untuk smart polling ke `/api/office/state` (setiap 1.5 detik).<br>- Hubungkan speech bubble live di atas kepala karakter.<br>- Tambahkan bar kuota & lo-fi audio player di kanan bawah. | Tampilan 100% mirip dengan screenshot: bubble aksi muncul saat agent bekerja, musik lo-fi bisa diputar. |
| **Fase 5: Multi-Provider (Antigravity & Midas)** | - Integrasikan adapter Antigravity dan Midas.<br>- Tambahkan selector provider di dialog penugasan. | Karakter di Meja A menggunakan Qoder Cloud, Meja B menggunakan Antigravity, Meja C menggunakan Midas. |
| **Fase 6: Deploy ke Vercel** | - Konfigurasi Environment Variables di Vercel Dashboard.<br>- Tes live production dari HP dan laptop. | Web live di domain `kantor-kita.vercel.app` berjalan 24/7 tanpa perlu laptop lokal hidup. |

---

## 7. Variabel Lingkungan (.env.example)

```env
# Database Neon Tech (Pooled Connection)
DATABASE_URL="postgresql://user:password@ep-cool-project-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Qoder Cloud Credentials
QODER_PERSONAL_ACCESS_TOKEN="pat_xxxxxxxxxxxxxxxxxxxx"

# Antigravity / Gemini API
GOOGLE_AI_API_KEY="AIzaxxxxxxxxxxxxxxxxxxxx"

# Next.js Public
NEXT_PUBLIC_APP_URL="https://kantor-kita.vercel.app"
```
