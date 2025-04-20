// src/app/dashboard/layout.tsx
'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { SessionProvider } from 'next-auth/react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <SessionProvider>
      <div
        className={theme === 'dark' ? 'bg-[#2D2D2D] text-white' : 'bg-gray-100 text-black'}
      >
        <div className="flex min-h-screen">
          <Sidebar theme={theme} toggleTheme={toggleTheme} />
          <div className="flex-1 ml-64">
            <Topbar theme={theme} />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}