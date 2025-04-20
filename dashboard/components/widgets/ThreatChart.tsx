'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ThreatChartProps {
  data: { labels: string[]; values: number[] };
  options?: { interactive: boolean; timeRange: string; onZoom: (range: string) => void };
}

export default function ThreatChart({ data, options }: ThreatChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Amenazas',
        data: data.values,
        borderColor: '#8B0000',
        backgroundColor: 'rgba(139, 0, 0, 0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: { enabled: options?.interactive },
    },
    scales: {
      x: { title: { display: true, text: 'Tiempo' } },
      y: { title: { display: true, text: 'Número de Amenazas' } },
    },
  };

  return (
    <div>
      <Line data={chartData} options={chartOptions} />
      <p className="text-gray-400 text-sm mt-2">
        Tendencia de amenazas en {options?.timeRange}
      </p>
    </div>
  );
}