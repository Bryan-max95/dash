// sections/Compliance.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ComplianceWidget from '../components/widgets/ComplianceWidget';
import { fetchSummary } from '../lib/api';

export default function Compliance() {
  const [summary, setSummary] = useState<{ totalCves: number; criticalCves: number }>({
    totalCves: 0,
    criticalCves: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        const data = await fetchSummary();
        setSummary({ totalCves: data.totalCves, criticalCves: data.criticalCves });
      } catch (err) {
        console.error('Error cargando datos de cumplimiento:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#8B0000]">Cumplimiento</h2>
      {loading ? <p className="text-gray-400">Cargando...</p> : <ComplianceWidget reports={summary} />}
    </motion.div>
  );
}