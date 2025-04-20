// src/app/dashboard/reports/page.tsx
'use client';

import { motion } from 'framer-motion';
import ReportWidget from '../components/widgets/ReportWidget';

export default function Reports() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#8B0000]">Reportes</h2>
      <ReportWidget />
    </motion.div>
  );
}