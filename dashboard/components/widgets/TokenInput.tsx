// components/widgets/TokenInput.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Key } from 'lucide-react';
import { validateToken } from '../../lib/api';

export default function TokenInput() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!token.trim()) {
      setError('Por favor, ingresa un token válido.');
      return;
    }
    try {
      const result = await validateToken(token);
      if (result.valid) {
        window.location.href = '/downloads/agent.exe';
      } else {
        setError('Token inválido.');
      }
    } catch {
      setError('Error al validar el token.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-lg border border-[#8B0000]/50 bg-[#2D2D2D]"
    >
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#8B0000' }}>
        <Key className="w-5 h-5" />
        Ingresar Token
      </h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Ingresa tu token"
          className="flex-1 bg-[#1F1F1F] text-white border border-[#8B0000]/50 rounded px-3 py-2 focus:outline-none focus:border-[#8B0000]"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleSubmit}
          className="px-4 py-2 rounded text-white"
          style={{ backgroundColor: '#8B0000' }}
        >
          Obtener Instalador
        </motion.button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </motion.div>
  );
}