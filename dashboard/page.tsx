// src/app/dashboard/page.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function DashboardHome() {
  const { data: session } = useSession();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#2D2D2D] flex items-center justify-center p-4"
    >
      <div className="bg-[#1F1F1F] p-8 rounded-lg border border-[#8B0000]/50 text-center max-w-md w-full">
        <Shield className="w-12 h-12 text-[#8B0000] mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-4">
          Bienvenido, {session?.user?.name || 'Usuario'}
        </h1>
        <p className="text-gray-400 mb-6">
          Monitorea tus dispositivos y protege tu red con nuestras herramientas.
        </p>
        <Link href="/dashboard/overview">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-[#8B0000] text-white px-6 py-3 rounded-lg hover:bg-[#8B0000]/80"
          >
            Ir al Dashboard
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}