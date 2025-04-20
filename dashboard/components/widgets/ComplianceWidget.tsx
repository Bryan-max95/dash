// components/widgets/ComplianceWidget.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchPolicies } from '../../lib/api';

interface ComplianceWidgetProps {
  reports: { totalCves: number; criticalCves: number };
}

export default function ComplianceWidget({ reports }: ComplianceWidgetProps) {
  const [policies, setPolicies] = useState<any[]>([]);
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

  const activePolicies = policies.filter((p) => p.status === 'active').length;
  const complianceScore = reports.totalCves === 0 ? 100 : Math.max(0, 100 - (reports.criticalCves * 10));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#2D2D2D] p-4 rounded-lg border border-[#8B0000]/50"
    >
      <h3 className="text-lg font-bold text-[#8B0000] mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5" />
        Cumplimiento
      </h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-gray-400">
              Políticas Activas: <span className="text-white">{activePolicies}</span>
            </p>
            <p className="text-gray-400">
              Puntaje de Cumplimiento: <span className="text-white">{complianceScore}%</span>
            </p>
            <p className="text-gray-400">
              CVEs Críticos: <span className="text-white">{reports.criticalCves}</span>
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}