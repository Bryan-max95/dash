// components/Topbar.tsx
'use client';

import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';

interface TopbarProps {
  theme: 'dark' | 'light';
}

export default function Topbar({ theme }: TopbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-4 flex justify-between items-center border-b ${
        theme === 'dark' ? 'bg-[#1F1F1F] border-[#8B0000]/50' : 'bg-white border-gray-200'
      }`}
    >
      <h1
        className={`text-xl font-bold ${
          theme === 'dark' ? 'text-[#8B0000]' : 'text-[#1F1F1F]'
        }`}
      >
        Cybersecurity Dashboard
      </h1>
      <div className="flex items-center gap-4">
        <User
          className={`w-6 h-6 ${theme === 'dark' ? 'text-[#8B0000]' : 'text-[#1F1F1F]'}`}
        />
        <LogOut
          className={`w-6 h-6 cursor-pointer ${
            theme === 'dark' ? 'text-[#8B0000]' : 'text-[#1F1F1F]'
          }`}
        />
      </div>
    </motion.div>
  );
}