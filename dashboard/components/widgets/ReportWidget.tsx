// components/widgets/ReportWidget.tsx
'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchDevices } from '../../lib/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Report {
  id: number;
  timestamp: string;
  ip: string;
  action: 'flagged' | 'safe';
  category: string;
}

export default function ReportWidget() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const devices = await fetchDevices();
        // Simular reportes basados en dispositivos
        const simulatedReports: Report[] = devices.map((device: any, index: number) => ({
          id: index + 1,
          timestamp: new Date().toISOString(),
          ip: device.ipAddress || 'Desconocida',
          action: device.greyNoiseData?.noise || device.shodanData?.ports?.length > 0 ? 'flagged' : 'safe',
          category: device.greyNoiseData?.classification || 'Network',
        }));
        setReports(simulatedReports);
        setError('');
      } catch (err) {
        setError('Error al cargar reportes. Verifica la conexión al servidor.');
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const chartData = {
    labels: ['Marcadas', 'Seguras'],
    datasets: [
      {
        label: 'Actividad de Red',
        data: [
          reports.filter((r) => r.action === 'flagged').length,
          reports.filter((r) => r.action === 'safe').length,
        ],
        backgroundColor: ['#8B0000', '#FFFFFF'],
        borderColor: ['#8B0000', '#8B0000'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#2D2D2D] p-4 rounded-lg border border-[#8B0000]/50"
    >
      <h3 className="text-lg font-bold text-[#8B0000] mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Reportes de Amenazas
      </h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-400">No hay reportes disponibles.</p>
      ) : (
        <div className="space-y-4">
          <div className="h-64">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, labels: { color: '#FFFFFF' } },
                  title: { display: true, text: 'Actividad de Red', color: '#FFFFFF' },
                },
                scales: {
                  x: { ticks: { color: '#FFFFFF' } },
                  y: { ticks: { color: '#FFFFFF' }, beginAtZero: true },
                },
              }}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#8B0000]/50">
                  <th className="p-2 text-gray-400">IP</th>
                  <th className="p-2 text-gray-400">Acción</th>
                  <th className="p-2 text-gray-400">Categoría</th>
                  <th className="p-2 text-gray-400">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 5).map((report) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-[#8B0000]/50"
                  >
                    <td className="p-2 text-white">{report.ip}</td>
                    <td className="p-2">
                      <span
                        className={
                          report.action === 'flagged' ? 'text-[#8B0000]' : 'text-white'
                        }
                      >
                        {report.action === 'flagged' ? 'Marcada' : 'Segura'}
                      </span>
                    </td>
                    <td className="p-2 text-white">{report.category}</td>
                    <td className="p-2 text-white">
                      {new Date(report.timestamp).toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}