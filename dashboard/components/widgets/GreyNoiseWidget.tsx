// components/widgets/GreyNoiseWidget.tsx
'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchGreyNoiseData } from '../../lib/api';

interface GreyNoiseData {
  ip: string;
  noise: boolean;
  riot: boolean;
  classification: string;
  name: string;
  last_seen: string;
}

interface GreyNoiseWidgetProps {
  ip: string;
}

export default function GreyNoiseWidget({ ip }: GreyNoiseWidgetProps) {
  const [data, setData] = useState<GreyNoiseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadGreyNoiseData() {
      try {
        setLoading(true);
        const result = await fetchGreyNoiseData(ip);
        setData(result);
        setError('');
      } catch {
        setError('Error al obtener datos de GreyNoise.');
      } finally {
        setLoading(false);
      }
    }
    if (ip) loadGreyNoiseData();
  }, [ip]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#2D2D2D] p-4 rounded-lg border border-[#8B0000]/50"
    >
      <h3 className="text-lg font-bold text-[#8B0000] mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        Análisis de Ruido (GreyNoise)
      </h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : !data || !data.ip ? (
        <p className="text-gray-400">No se encontraron datos para esta IP.</p>
      ) : (
        <div className="space-y-4 text-white">
          <div>
            <p className="font-semibold">IP:</p>
            <p>{data.ip}</p>
          </div>
          <div>
            <p className="font-semibold">¿Es ruido?:</p>
            <p>{data.noise ? 'Sí' : 'No'}</p>
          </div>
          <div>
            <p className="font-semibold">¿Servicio benigno?:</p>
            <p>{data.riot ? 'Sí' : 'No'}</p>
          </div>
          <div>
            <p className="font-semibold">Clasificación:</p>
            <p>{data.classification || 'Desconocida'}</p>
          </div>
          <div>
            <p className="font-semibold">Nombre:</p>
            <p>{data.name || 'Ninguno'}</p>
          </div>
          <div>
            <p className="font-semibold">Última vez vista:</p>
            <p>{data.last_seen || 'Desconocida'}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}