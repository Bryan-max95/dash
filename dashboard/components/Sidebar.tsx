// src/app/dashboard/components/Sidebar.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Shield, AlertCircle, Network, FileText, Settings, User, LifeBuoy } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface SidebarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function Sidebar({ theme, toggleTheme }: SidebarProps) {
  const { data: session } = useSession();

  const links = [
    { href: '/dashboard/overview', label: 'Resumen', icon: Home },
    { href: '/dashboard/network', label: 'Red', icon: Network },
    { href: '/dashboard/compliance', label: 'Cumplimiento', icon: Shield },
    { href: '/dashboard/incidents', label: 'Incidentes', icon: AlertCircle },
    { href: '/dashboard/reports', label: 'Reportes', icon: FileText },
    { href: '/dashboard/support', label: 'Soporte', icon: LifeBuoy },
    { href: '/dashboard/profile', label: 'Perfil', icon: User },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className={`h-screen w-64 fixed p-4 ${
        theme === 'dark' ? 'bg-[#1F1F1F] border-[#8B0000]/50' : 'bg-white border-gray-200'
      } border-r flex flex-col`}
    >
      <div className="mb-8">
        <Image
          src="/images/bwp1.png"
          alt="Logo"
          width={150}
          height={50}
          className={theme === 'dark' ? 'filter brightness-100' : 'filter brightness-75'}
        />
      </div>
      <nav className="flex-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 p-3 rounded-lg mb-2 ${
              theme === 'dark'
                ? 'hover:bg-[#8B0000]/20 text-white'
                : 'hover:bg-gray-200 text-black'
            }`}
          >
            <link.icon
              className="w-5 h-5"
              style={{ color: theme === 'dark' ? '#8B0000' : '#1F1F1F' }}
            />
            {link.label}
          </Link>
        ))}
      </nav>
      {session && (
        <p className="text-gray-400 text-sm mt-2">
          Conectado como: {session.user?.email}
        </p>
      )}
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={toggleTheme}
        className={`mt-auto p-3 rounded-lg ${
          theme === 'dark' ? 'bg-[#8B0000] text-white' : 'bg-gray-200 text-black'
        }`}
      >
        Cambiar a {theme === 'dark' ? 'Claro' : 'Oscuro'}
      </motion.button>
    </motion.div>
  );
}