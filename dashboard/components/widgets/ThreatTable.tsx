// components/widgets/ThreatTable.tsx
'use client';

import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export interface Threat {
  id: number;
  type: string;
  risk: 'Crítico' | 'Alto' | 'Medio' | 'Bajo';
  source: string;
  destination: string;
  timestamp: string;
}

export interface ThreatTableProps {
  threats: Threat[];
}

export default function ThreatTable({ threats }: ThreatTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#2D2D2D] rounded-lg border border-[#8B0000]/50 overflow-x-auto"
    >
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[#8B0000]/50">
            <th className="p-4 text-gray-400">Tipo</th>
            <th className="p-4 text-gray-400">Riesgo</th>
            <th className="p-4 text-gray-400">Origen</th>
            <th className="p-4 text-gray-400">Destino</th>
            <th className="p-4 text-gray-400">Fecha</th>
            <th className="p-4 text-gray-400">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {threats.map((threat) => (
            <motion.tr
              key={threat.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-[#8B0000]/50"
            >
              <td className="p-4 text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#8B0000]" />
                {threat.type}
              </td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    threat.risk === 'Crítico'
                      ? 'bg-red-500/20 text-red-500'
                      : threat.risk === 'Alto'
                      ? 'bg-orange-500/20 text-orange-500'
                      : threat.risk === 'Medio'
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : 'bg-green-500/20 text-green-500'
                  }`}
                >
                  {threat.risk}
                </span>
              </td>
              <td className="p-4 text-white">{threat.source}</td>
              <td className="p-4 text-white">{threat.destination}</td>
              <td className="p-4 text-white">{threat.timestamp}</td>
              <td className="p-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#8B0000] text-white px-3 py-1 rounded hover:bg-[#8B0000]/80"
                >
                  Investigar
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}