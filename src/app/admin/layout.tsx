import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../../index.css';
import '../../App.css';
import './admin.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Outreach — miguelgisbert.dev',
  icons: { icon: '/favicon.svg' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ca" className={inter.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
