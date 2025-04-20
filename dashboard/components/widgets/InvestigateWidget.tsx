// components/widgets/InvestigateWidget.tsx
'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { investigateDomain } from '../../lib/api';

interface InvestigateDomain {
  domain: string;
  status?: string;
  categories?: string[];
}

export default function InvestigateWidget() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<InvestigateDomain | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInvestigate = async () => {
    if (!domain.trim()) {
      setError('Ingresa un dominio válido.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = await investigateDomain(domain);
      setResult(data ? { domain, status: data.status, categories: data.categories } : null);
      if (!data) {
        setError('No se encontró información para este dominio.');
      }
    } catch {
      setError('Error al investigar el dominio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#2D2D2D] p-4 rounded-lg border border-[#8B0000]/50"
    >
      <h3 className="text-lg font-bold text-[#8B0000] mb-4 flex items-center gap-2">
        <Search className="w-5 h-5" />
        Investigar Dominio
      </h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Ej: example.com"
          className="flex-1 bg-[#1F1F1F] text-white border border-[#8B0000]/50 rounded px-3 py-2 focus:outline-none focus:border-[#8B0000]"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleInvestigate}
          disabled={loading}
          className="bg-[#8B0000] text-white px-4 py-2 rounded hover:bg-[#8B0000]/80 disabled:opacity-50"
        >
          Buscar
        </motion.button>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : result ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white">
          <p>
            <span className="font-semibold">Dominio:</span> {result.domain}
          </p>
          <p>
            <span className="font-semibold">Estado:</span> {result.status || 'Desconocido'}
          </p>
          {result.categories && result.categories.length > 0 && (
            <p>
              <span className="font-semibold">Categorías:</span> {result.categories.join(', ')}
            </p>
          )}
        </motion.div>
      ) : (
        <p className="text-gray-400">Ingresa un dominio para investigar.</p>
      )}
    </motion.div>
  );
}