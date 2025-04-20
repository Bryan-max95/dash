// components/widgets/ShodanWidget.tsx
'use client';

import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchShodanData } from '../../lib/api';

interface ShodanData {
  ip: string;
  ports: number[];
  cpes: string[];
  vulns: string[];
  tags: string[];
}

interface ShodanWidgetProps {
  ip: string;
}

export default function ShodanWidget({ ip }: ShodanWidgetProps) {
  const [data, setData] = useState<ShodanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadShodanData() {
      try {
        setLoading(true);
        const result = await fetchShodanData(ip);
        setData(result);
        setError('');
      } catch {
        setError('Error al obtener datos de Shodan.');
      } finally {
        setLoading(false);
      }
    }
    if (ip) loadShodanData();
  }, [ip]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#2D2D2D] p-4 rounded-lg border border-[#8B0000]/50"
    >
      <h3 className="text-lg font-bold text-[#8B0000] mb-4 flex items-center gap-2">
        <Network className="w-5 h-5" />
        Análisis de Red (Shodan)
      </h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : !data || data.ports.length === 0 ? (
        <p className="text-gray-400">No se encontraron datos para esta IP.</p>
      ) : (
        <div className="space-y-4 text-white">
          <div>
            <p className="font-semibold">IP:</p>
            <p>{data.ip}</p>
          </div>
          <div>
            <p className="font-semibold">Puertos Abiertos:</p>
            <p>{data.ports.join(', ') || 'Ninguno'}</p>
          </div>
          <div>
            <p className="font-semibold">Vulnerabilidades:</p>
            <p>{data.vulns.join(', ') || 'Ninguna'}</p>
          </div>
          <div>
            <p className="font-semibold">CPEs:</p>
            <p>{data.cpes.join(', ') || 'Ninguno'}</p>
          </div>
          <div>
            <p className="font-semibold">Etiquetas:</p>
            <p>{data.tags.join(', ') || 'Ninguna'}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}