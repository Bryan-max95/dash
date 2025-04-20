// components/widgets/IncidentTable.tsx
'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface Report {
  _id: string;
  equipo_id: string;
  timestamp: string;
  total_cves: number;
  critical_cves: number;
}

interface IncidentTableProps {
  reports: Report[];
}

export default function IncidentTable({ reports }: IncidentTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#2D2D2D] p-4 rounded-lg border border-[#8B0000]/50 overflow-x-auto"
    >
      <h3 className="text-lg font-bold text-[#8B0000] mb-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        Incidentes Recientes
      </h3>
      {reports.length === 0 ? (
        <p className="text-gray-400">No hay incidentes registrados.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#8B0000]/50">
              <th className="p-2 text-gray-400">Equipo</th>
              <th className="p-2 text-gray-400">Fecha</th>
              <th className="p-2 text-gray-400">Total CVEs</th>
              <th className="p-2 text-gray-400">CVEs Críticos</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <motion.tr
                key={report._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-[#8B0000]/50"
              >
                <td className="p-2 text-white">{report.equipo_id}</td>
                <td className="p-2 text-white">{new Date(report.timestamp).toLocaleString()}</td>
                <td className="p-2 text-white">{report.total_cves}</td>
                <td className="p-2 text-white">{report.critical_cves}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}