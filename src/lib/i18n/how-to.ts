export type Locale = 'en' | 'id';

export const LOCALES: Locale[] = ['en', 'id'];
export const DEFAULT_LOCALE: Locale = 'en';

export interface Bullet {
  /** Optional short label rendered before the text, e.g. "Top left". */
  label?: string;
  text: string;
}

export interface Step {
  title: string;
  body: string;
}

export interface Section {
  title: string;
  intro?: string;
  steps?: Step[];
  code?: { commands: string[]; note?: string };
  bullets?: Bullet[];
  note?: string;
}

export interface HowToContent {
  backToOffice: string;
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
  };
  sections: Section[];
  footer: string;
}

export const howToContent: Record<Locale, HowToContent> = {
  en: {
    backToOffice: 'Back to the office',
    hero: {
      badge: 'Documentation',
      title: 'How to use Kantor-Kita',
      subtitle:
        'A 2D pixel office where AI coding agents work on your projects. Everything you need to get started, in a couple of minutes.',
      cta: 'Open the office',
    },
    sections: [
      {
        title: 'What you are looking at',
        intro:
          'Kantor-Kita turns your repositories into rooms and your AI agents into co-workers sitting at desks. Nothing runs on your laptop — the whole office lives in the cloud.',
        bullets: [
          {
            label: 'Rooms',
            text: 'every room is one workspace, meaning one repository or project (backend, frontend, infra, game).',
          },
          {
            label: 'Desks',
            text: 'every desk is occupied by one AI coding agent (Qoder, Antigravity or Midas) with its own status and job.',
          },
          {
            label: 'Speech bubbles',
            text: 'while an agent works, its latest action (file being edited, command being run) appears above its head.',
          },
          {
            label: 'Live status',
            text: 'the office polls the server every 2 seconds, so the screen stays in sync without refreshing.',
          },
        ],
      },
      {
        title: 'Get to know the interface',
        bullets: [
          {
            label: 'Top left',
            text: 'zoom in, zoom out and fullscreen — inspect a single room or the whole floor.',
          },
          {
            label: 'Top center',
            text: 'weekly and 5-hour AI usage quotas, with reset countdowns.',
          },
          {
            label: 'Right side',
            text: 'the agent roster: who is online, what they do and their current state.',
          },
          {
            label: 'Bottom left',
            text: 'the + button opens the task dialog; Layout manages workspaces and rooms.',
          },
          {
            label: 'Bottom right',
            text: 'the lo-fi music player. Purely for the vibes.',
          },
        ],
      },
      {
        title: 'Send your first task',
        steps: [
          {
            title: 'Open the task dialog',
            body: 'Click the + button at the bottom left of the office screen.',
          },
          {
            title: 'Choose a provider',
            body: 'Pick Qoder, Antigravity or Midas for this job. Each agent is pinned to a workspace.',
          },
          {
            title: 'Write a clear prompt',
            body: "Example: 'Add a refund endpoint with tests, then open a PR.' Small, specific tasks work best.",
          },
          {
            title: 'Add a workspace token only if needed',
            body: 'The token stays scoped to that workspace. Leave it empty to run in simulation mode.',
          },
          {
            title: 'Send it',
            body: 'The agent switches to WORKING and its speech bubble reports the action as it happens.',
          },
        ],
        note:
          'Tasks are dispatched through /api/tasks/dispatch. In this build the provider adapters still respond in simulation mode, so you can walk through the whole flow without a real token.',
      },
      {
        title: 'Run it locally',
        intro: 'You need Node 20+ and pnpm 9+.',
        code: {
          commands: [
            'git clone <repo-url>',
            'cd kantor-kita',
            'pnpm install',
            'cp .env.example .env.local',
            'pnpm dev',
          ],
        },
        bullets: [
          {
            label: 'With Neon Postgres',
            text: 'set DATABASE_URL in .env.local, then run pnpm db:push to create the tables.',
          },
          {
            label: 'Production',
            text: 'deploy the project to Vercel and add the same variables in the project settings.',
          },
        ],
        note:
          'Open http://localhost:3000. DATABASE_URL is optional — without it the app serves demo data from src/lib/mock-data.ts, so you can develop the UI offline.',
      },
      {
        title: 'Good to know',
        bullets: [
          {
            label: 'Serverless first',
            text: 'no machine has to stay on; the office keeps running in the cloud.',
          },
          {
            label: 'One token per workspace',
            text: 'keep credentials isolated and never reuse the same personal token across rooms.',
          },
          {
            label: 'Simulate before wiring',
            text: 'build and test the UI and flows first, then plug in real provider credentials.',
          },
          {
            label: 'Phone friendly',
            text: 'the office scales down to a phone screen; use fullscreen for the best view.',
          },
        ],
      },
    ],
    footer: 'Kantor-Kita · Autonomous multi-agent virtual office',
  },

  id: {
    backToOffice: 'Kembali ke kantor',
    hero: {
      badge: 'Dokumentasi',
      title: 'Cara pakai Kantor-Kita',
      subtitle:
        'Kantor piksel 2D tempat AI coding agent mengerjakan project kamu. Semua yang perlu kamu tahu untuk mulai, dalam beberapa menit.',
      cta: 'Buka kantor',
    },
    sections: [
      {
        title: 'Apa yang sedang kamu lihat',
        intro:
          'Kantor-Kita mengubah repository jadi ruangan, dan AI agent jadi rekan kerja yang duduk di meja. Tidak ada yang berjalan di laptop kamu — seluruh kantor hidup di cloud.',
        bullets: [
          {
            label: 'Ruangan',
            text: 'setiap ruangan adalah satu workspace, yaitu satu repository atau project (backend, frontend, infra, game).',
          },
          {
            label: 'Meja',
            text: 'setiap meja ditempati satu AI coding agent (Qoder, Antigravity, atau Midas) dengan status dan pekerjaannya sendiri.',
          },
          {
            label: 'Speech bubble',
            text: 'saat agent bekerja, aksi terakhirnya (file yang diedit, perintah yang dijalankan) muncul di atas kepalanya.',
          },
          {
            label: 'Status live',
            text: 'kantor melakukan polling ke server setiap 2 detik, jadi layar selalu sinkron tanpa perlu refresh.',
          },
        ],
      },
      {
        title: 'Kenali antarmukanya',
        bullets: [
          {
            label: 'Kiri atas',
            text: 'zoom in, zoom out, dan fullscreen — untuk melihat satu ruangan atau seluruh lantai.',
          },
          {
            label: 'Tengah atas',
            text: 'kuota pemakaian AI mingguan dan 5 jam, lengkap dengan hitungan reset.',
          },
          {
            label: 'Sisi kanan',
            text: 'daftar agent: siapa yang online, perannya, dan statusnya sekarang.',
          },
          {
            label: 'Kiri bawah',
            text: 'tombol + membuka dialog tugas; Layout untuk mengatur workspace dan ruangan.',
          },
          {
            label: 'Kanan bawah',
            text: 'pemutar musik lo-fi. Murni untuk suasana.',
          },
        ],
      },
      {
        title: 'Kirim tugas pertama',
        steps: [
          {
            title: 'Buka dialog tugas',
            body: 'Klik tombol + di kiri bawah layar kantor.',
          },
          {
            title: 'Pilih provider',
            body: 'Tentukan Qoder, Antigravity, atau Midas untuk tugas ini. Setiap agent terikat ke satu workspace.',
          },
          {
            title: 'Tulis prompt yang jelas',
            body: "Contoh: 'Tambahkan endpoint refund beserta test, lalu buka PR.' Tugas kecil dan spesifik paling ampuh.",
          },
          {
            title: 'Isi token workspace hanya bila perlu',
            body: 'Token ini hanya berlaku untuk workspace tersebut. Biarkan kosong untuk mode simulasi.',
          },
          {
            title: 'Kirim',
            body: 'Agent berubah ke status WORKING dan speech bubble menampilkan aksinya secara langsung.',
          },
        ],
        note:
          'Tugas dikirim lewat /api/tasks/dispatch. Di versi ini adapter provider masih merespons dalam mode simulasi, jadi seluruh alur bisa dicoba tanpa token asli.',
      },
      {
        title: 'Jalankan di lokal',
        intro: 'Butuh Node 20+ dan pnpm 9+.',
        code: {
          commands: [
            'git clone <repo-url>',
            'cd kantor-kita',
            'pnpm install',
            'cp .env.example .env.local',
            'pnpm dev',
          ],
        },
        bullets: [
          {
            label: 'Dengan Neon Postgres',
            text: 'isi DATABASE_URL di .env.local, lalu jalankan pnpm db:push untuk membuat tabel.',
          },
          {
            label: 'Produksi',
            text: 'deploy ke Vercel dan isi variabel yang sama di project settings.',
          },
        ],
        note:
          'Buka http://localhost:3000. DATABASE_URL opsional — tanpa itu aplikasi memakai data demo dari src/lib/mock-data.ts, jadi UI bisa dikembangkan offline.',
      },
      {
        title: 'Yang perlu diingat',
        bullets: [
          {
            label: 'Serverless dulu',
            text: 'tidak ada mesin yang harus menyala; kantor tetap jalan di cloud.',
          },
          {
            label: 'Satu token per workspace',
            text: 'jaga kredensial tetap terisolasi dan jangan pakai token pribadi yang sama di banyak ruangan.',
          },
          {
            label: 'Simulasi sebelum konek',
            text: 'bangun dan uji UI serta alurnya dulu, baru pasang kredensial provider asli.',
          },
          {
            label: 'Ramah HP',
            text: 'kantor menyesuaikan ukuran layar ponsel; gunakan fullscreen untuk tampilan terbaik.',
          },
        ],
      },
    ],
    footer: 'Kantor-Kita · Kantor virtual multi-agent otonom',
  },
};
