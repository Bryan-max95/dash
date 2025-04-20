'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, Download, RefreshCw } from 'lucide-react';
import KPIWidget from '../components/widgets/KPIWidget';
import ThreatChart from '../components/widgets/ThreatChart';
import { fetchSummary, fetchThreatTrend, fetchShodanData } from '../lib/api';
import { CSVLink } from 'react-csv';
import { useRouter } from 'next/navigation';
import { Tooltip } from 'react-tooltip';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';

// Dynamically import MapWidget to avoid SSR issues
const MapWidget = dynamic(() => import('../components/widgets/MapWidget'), { ssr: false });

interface Summary {
  monitoreDevices: number;
  totalCves: number;
  criticalCves: number;
  openPorts: number;
  noisyIPs: number;
  vulnerabilityPercentage: string;
  trend?: {
    monitoreDevices: number;
    totalCves: number;
    criticalCves: number;
    openPorts: number;
    noisyIPs: number;
  };
}

interface ThreatTrend {
  labels: string[];
  values: number[];
}

interface Alert {
  id: string;
  message: string;
  severity: 'critical' | 'warning';
  timestamp: string;
}

interface Location {
  lat: number;
  lng: number;
  ip: string;
}

export default function Overview() {
  const { data: session, status } = useSession();
  const [summary, setSummary] = useState<Summary>({
    monitoreDevices: 0,
    totalCves: 0,
    criticalCves: 0,
    openPorts: 0,
    noisyIPs: 0,
    vulnerabilityPercentage: '0.0',
    trend: { monitoreDevices: 0, totalCves: 0, criticalCves: 0, openPorts: 0, noisyIPs: 0 },
  });
  const [threatTrend, setThreatTrend] = useState<ThreatTrend>({ labels: [], values: [] });
  const [locations, setLocations] = useState<Location[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30d');
  const router = useRouter();

  const loadData = useCallback(async () => {
    if (status === 'authenticated') {
      try {
        setLoading(true);
        setError('');
        const [summaryData, trendData] = await Promise.all([
          fetchSummary({ timeRange }).catch(() => ({
            monitoreDevices: 0,
            totalCves: 0,
            criticalCves: 0,
            openPorts: 0,
            noisyIPs: 0,
            vulnerabilityPercentage: '0.0',
          })),
          fetchThreatTrend({ timeRange }).catch(() => ({ labels: [], values: [] })),
        ]);
        setSummary(summaryData);
        setThreatTrend(trendData);

        // Fetch geolocation data from Shodan
        const noisyIP = '8.8.8.8'; // Reemplazar con IPs reales desde fetchDevices
        const shodanData = await fetchShodanData(noisyIP).catch(() => null);
        if (shodanData?.geo) {
          setLocations([
            {
              lat: shodanData.geo.lat || 0,
              lng: shodanData.geo.lon || 0,
              ip: noisyIP,
            },
          ]);
        } else {
          setLocations([]);
        }

        // Mock alerts (reemplazar con endpoint real si es necesario)
        setAlerts([
          {
            id: '1',
            message: 'Nuevo CVE crítico detectado en 8.8.8.8',
            severity: 'critical',
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
        console.error('Error cargando resumen:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [timeRange, status]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Update every 60s
    return () => clearInterval(interval);
  }, [loadData]);

  const handleKPIClick = (type: string) => {
    if (type === 'Equipos Monitoreados') {
      router.push('/dashboard/network');
    }
  };

  const csvData = [
    {
      'Equipos Monitoreados': summary.monitoreDevices,
      'CVEs Totales': summary.totalCves,
      'CVEs Críticos': summary.criticalCves,
      'Puertos Abiertos': summary.openPorts,
      'IPs Ruidosas': summary.noisyIPs,
      'Porcentaje de Vulnerabilidad': summary.vulnerabilityPercentage,
    },
  ];

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  if (status === 'loading') {
    return <div className="text-gray-400">Cargando...</div>;
  }

  if (status !== 'authenticated') {
    return <div className="text-red-500">Por favor, inicia sesión para acceder al dashboard.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6 max-w-7xl mx-auto bg-[#1A1A1A] rounded-lg"
      role="region"
      aria-label="Resumen del Dashboard"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#8B0000]">Resumen de Seguridad</h2>
        <div className="flex gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#2D2D2D] border border-[#8B0000]/50 rounded px-3 py-1 text-white"
            aria-label="Seleccionar rango de tiempo"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
          </select>
          <CSVLink
            data={csvData}
            filename={`security_summary_${new Date().toISOString()}.csv`}
            className="flex items-center gap-2 bg-[#8B0000] text-white px-3 py-1 rounded hover:bg-[#6B0000]"
            aria-label="Exportar datos como CSV"
          >
            <Download size={16} />
            Exportar
          </CSVLink>
          {error && (
            <button
              onClick={loadData}
              className="flex items-center gap-2 bg-[#8B0000] text-white px-3 py-1 rounded hover:bg-[#6B0000]"
              aria-label="Reintentar carga de datos"
            >
              <RefreshCw size={16} />
              Reintentar
            </button>
          )}
        </div>
      </div>

      {alerts.length > 0 && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[#2D2D2D] p-4 rounded-lg border border-[#8B0000]/50"
          role="alert"
        >
          <h3 className="text-lg font-semibold text-[#8B0000] flex items-center gap-2">
            <AlertTriangle size={20} />
            Alertas Críticas
          </h3>
          {alerts.map((alert) => (
            <div key={alert.id} className="flex justify-between items-center mt-2 text-white">
              <p>
                <span className={alert.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'}>
                  {alert.severity === 'critical' ? '[Crítico]' : '[Advertencia]'}
                </span>{' '}
                {alert.message} ({new Date(alert.timestamp).toLocaleString()})
              </p>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="text-gray-400 hover:text-white"
                aria-label={`Cerrar alerta ${alert.message}`}
              >
                Cerrar
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-8 h-8 border-2 border-t-[#8B0000] rounded-full"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div data-tooltip-id="monitoreDevices-tooltip">
            <KPIWidget
              title="Equipos Monitoreados"
              value={summary.monitoreDevices}
              color="#8B0000"
              trend={summary.trend?.monitoreDevices}
              onClick={() => handleKPIClick('Equipos Monitoreados')}
            />
            <Tooltip id="monitoreDevices-tooltip" place="top" className="z-10">
              Número de dispositivos actualmente monitoreados en la red.
            </Tooltip>
          </div>
          <div data-tooltip-id="totalCves-tooltip">
            <KPIWidget
              title="CVEs Totales"
              value={summary.totalCves}
              color="#8B0000"
              trend={summary.trend?.totalCves}
            />
            <Tooltip id="totalCves-tooltip" place="top" className="z-10">
              Total de vulnerabilidades (CVEs) detectadas en la red.
            </Tooltip>
          </div>
          <div data-tooltip-id="criticalCves-tooltip">
            <KPIWidget
              title="CVEs Críticos"
              value={summary.criticalCves}
              color="#8B0000"
              trend={summary.trend?.criticalCves}
            />
            <Tooltip id="criticalCves-tooltip" place="top" className="z-10">
              Vulnerabilidades críticas que requieren atención inmediata.
            </Tooltip>
          </div>
          <div data-tooltip-id="openPorts-tooltip">
            <KPIWidget
              title="Puertos Abiertos"
              value={summary.openPorts}
              color="#8B0000"
              trend={summary.trend?.openPorts}
            />
            <Tooltip id="openPorts-tooltip" place="top" className="z-10">
              Número de puertos abiertos detectados en los dispositivos.
            </Tooltip>
          </div>
          <div data-tooltip-id="noisyIPs-tooltip">
            <KPIWidget
              title="IPs Ruidosas"
              value={summary.noisyIPs}
              color="#8B0000"
              trend={summary.trend?.noisyIPs}
            />
            <Tooltip id="noisyIPs-tooltip" place="top" className="z-10">
              IPs que generan tráfico sospechoso.
            </Tooltip>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#2D2D2D] p-4 rounded-lg border border-[#8B0000]/50"
        >
          <h3 className="text-lg font-semibold text-[#8B0000] mb-2">Tendencia de Amenazas</h3>
          <ThreatChart
            data={threatTrend}
            options={{
              interactive: true,
              timeRange,
              onZoom: (range: string) => setTimeRange(range),
            }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#2D2D2D] p-4 rounded-lg border border-[#8B0000]/50"
        >
          <h3 className="text-lg font-semibold text-[#8B0000] mb-2">Geolocalización de IPs</h3>
          <MapWidget locations={locations} />
        </motion.div>
      </div>
    </motion.div>
  );
}