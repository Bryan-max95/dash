'use client';

import { motion } from 'framer-motion';
import InvestigateWidget from '../components/widgets/InvestigateWidget';

export default function Threats() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#8B0000]">Amenazas</h2>
      <InvestigateWidget />
    </motion.div>
  );
}