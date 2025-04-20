'use client';

import { motion } from 'framer-motion';

interface KPIWidgetProps {
  title: string;
  value: number;
  color: string;
  trend?: number;
  onClick?: () => void;
}

export default function KPIWidget({ title, value, color, trend, onClick }: KPIWidgetProps) {
  return (
    <motion.div
      className="bg-[#2D2D2D] p-4 rounded-lg border border-[#8B0000]/50 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${title}`}
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="text-sm text-gray-400">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
      {trend !== undefined && (
        <p className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend >= 0 ? '+' : ''}{trend}
        </p>
      )}
    </motion.div>
  );
}