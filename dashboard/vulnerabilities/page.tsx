'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import VulnerabilityTable from '../components/widgets/VulnerabilityTable';

interface Vulnerability {
  _id: string;
  software_id: string;
  cve_id: string;
  severity: string;
  description: string;
  last_modified: string;
  status: string;
}

export default function Vulnerabilities() {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVulnerabilities() {
      try {
        setLoading(true);
        const res = await fetch('/api/vulnerabilities');
        const data = await res.json();
        setVulnerabilities(data);
      } catch (err) {
        console.error('Error cargando vulnerabilidades:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVulnerabilities();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#8B0000]">Vulnerabilidades</h2>
      {loading ? <p className="text-gray-400">Cargando...</p> : <VulnerabilityTable vulnerabilities={vulnerabilities} />}
    </motion.div>
  );
}