'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export default function Profile() {
  const user = {
    name: 'Admin User',
    email: 'admin@bwpentesting.com',
    role: 'Administrador',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#8B0000]">Perfil</h2>
      <div className="bg-[#2D2D2D] p-4 rounded-lg border border-[#8B0000]/50">
        <h3 className="text-lg font-bold text-[#8B0000] mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Información del Usuario
        </h3>
        <p className="text-white">Nombre: {user.name}</p>
        <p className="text-white">Email: {user.email}</p>
        <p className="text-white">Rol: {user.role}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-4 bg-[#8B0000] text-white px-4 py-2 rounded hover:bg-[#8B0000]/80"
        >
          Editar Perfil
        </motion.button>
      </div>
    </motion.div>
  );
}