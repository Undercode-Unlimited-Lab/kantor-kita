# 🏢 Kantor-Kita

> **Autonomous Multi-Agent Virtual Office for AI Coding Agents**  
> Visualisasi kantor retro 2D pixel-art untuk memantau dan mengorkestrasi AI Coding Agent (Qoder Cloud, Antigravity, Midas) yang bekerja secara otonom pada berbagai workspace/project.

---

## 🚀 Fitur Utama
- **100% Cloud-Native & Serverless**: Berjalan di **Vercel** tanpa membutuhkan laptop/PC lokal menyala.
- **Multi-Workspace & Multi-Project**: Setiap ruangan mewakili repo/project terisolasi (Go backend, React frontend, Mobile/Game, Cloud Infra).
- **Multi-Provider AI**: Mendukung **Qoder Cloud**, **Antigravity**, dan **Midas AI**.
- **Retro 2D Pixel Office**: Ditenagai oleh **Pixi.js v8** dan Canvas 2D dengan animasi mengetik, speech bubble aktivitas live, dan kucing kantor.
- **Serverless Postgres**: Menggunakan **Neon Tech** dengan connection pooler dan Drizzle ORM.
- **Lo-Fi Audio Player & HUD Quota**: Pemutar musik santai retro dengan pelacak kuota mingguan/5-jam.

---

## 🛠️ Stack Teknologi ("The Best-in-Class")
- **Framework**: Next.js 15 (App Router, Server Actions, Route Handlers)
- **Database**: Neon Tech (Serverless Postgres) + Drizzle ORM
- **Engine Grafis**: Pixi.js v8 / HTML5 2D Canvas (Pixel-perfect nearest-neighbor scaling)
- **State Management**: SWR (Smart Polling) + Zustand
- **Styling**: Tailwind CSS + Lucide Icons

---

## 🏃 Cara Menjalankan Lokal

1. Salin file environment:
   ```bash
   cp .env.example .env.local
   ```
2. Jalankan development server:
   ```bash
   pnpm dev
   ```
3. Buka browser di [http://localhost:3000](http://localhost:3000).
