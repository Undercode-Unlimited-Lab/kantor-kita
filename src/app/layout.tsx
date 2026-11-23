import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kantor-Kita | Autonomous Multi-Agent Virtual Office',
  description: 'Cloud-native multi-workspace pixel office for AI coding agents (Qoder, Antigravity, Midas)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased bg-[#0f0f1a] text-slate-100 overflow-hidden">
        {children}
      </body>
    </html>
  );
}
