// components/widgets/PolicyWidget.tsx
'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchPolicies } from '../../lib/api';

interface Policy {
  policyId: number;
  name: string;
  status: 'active' | 'inactive';
}

export default function PolicyWidget() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPolicies() {
      try {
        setLoading(true);
        const data = await fetchPolicies();
        setPolicies(data);
        setError('');
      } catch (err) {
        setError('Error al cargar políticas.');
      } finally {
        setLoading(false);
      }
    }
    loadPolicies();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#2D2D2D] p-4 rounded-lg border border-[#8B0000]/50 overflow-x-auto"
    >
      <h3 className="text-lg font-bold text-[#8B0000] mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5" />
        Políticas
      </h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : policies.length === 0 ? (
        <p className="text-gray-400">No hay políticas disponibles.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#8B0000]/50">
              <th className="p-2 text-gray-400">Nombre</th>
              <th className="p-2 text-gray-400">Estado</th>
              <th className="p-2 text-gray-400">ID</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <motion.tr
                key={policy.policyId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-[#8B0000]/50"
              >
                <td className="p-2 text-white">{policy.name}</td>
                <td className="p-2">
                  <span className={policy.status === 'active' ? 'text-green-500' : 'text-red-500'}>
                    {policy.status === 'active' ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="p-2 text-white">{policy.policyId}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}