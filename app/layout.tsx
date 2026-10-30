import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Simple protected routes' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="min-h-screen bg-slate-50 px-4 py-16 text-slate-900">
    <main className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">{children}</main>
  </body></html>;
}
