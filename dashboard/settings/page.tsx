'use client';

import { motion } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#8B0000]">Configuración</h2>
      <div className="bg-[#2D2D2D] p-4 rounded-lg border border-[#8B0000]/50">
        <h3 className="text-lg font-bold text-[#8B0000] mb-4 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5" />
          Ajustes Generales
        </h3>
        <p className="text-gray-400">Configuración de notificaciones, temas, y preferencias.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-4 bg-[#8B0000] text-white px-4 py-2 rounded hover:bg-[#8B0000]/80"
        >
          Guardar Cambios
        </motion.button>
      </div>
    </motion.div>
  );
}