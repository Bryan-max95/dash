// sections/Incidents.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import IncidentTable from '../components/widgets/IncidentTable';

interface Report {
  _id: string;
  equipo_id: string;
  timestamp: string;
  total_cves: number;
  critical_cves: number;
}

export default function Incidents() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        // Simulado por ahora
        setReports([]);
      } catch (err) {
        console.error('Error cargando incidentes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#8B0000]">Incidentes</h2>
      {loading ? <p className="text-gray-400">Cargando...</p> : <IncidentTable reports={reports} />}
    </motion.div>
  );
}