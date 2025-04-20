// sections/Network.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import DeploymentWidget from '../components/widgets/DeploymentWidget';
import ShodanWidget from '../components/widgets/ShodanWidget';
import GreyNoiseWidget from '../components/widgets/GreyNoiseWidget';
import { fetchDevices } from '../lib/api';

interface Device {
  _id: string;
  ipAddress: string;
}

export default function Network() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedIP, setSelectedIP] = useState('');

  useEffect(() => {
    async function loadDevices() {
      try {
        const data = await fetchDevices();
        setDevices(data);
        if (data.length > 0) setSelectedIP(data[0].ipAddress);
      } catch (err) {
        console.error('Error cargando dispositivos:', err);
      }
    }
    loadDevices();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#8B0000]">Red</h2>
      <DeploymentWidget />
      <div>
        <label className="block text-sm text-gray-400 mb-2">Seleccionar IP para análisis:</label>
        <select
          value={selectedIP}
          onChange={(e) => setSelectedIP(e.target.value)}
          className="bg-[#1F1F1F] text-white border border-[#8B0000]/50 rounded px-3 py-2 focus:outline-none focus:border-[#8B0000]"
        >
          {devices.map((device) => (
            <option key={device._id} value={device.ipAddress}>
              {device.ipAddress}
            </option>
          ))}
        </select>
      </div>
      {selectedIP && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ShodanWidget ip={selectedIP} />
          <GreyNoiseWidget ip={selectedIP} />
        </div>
      )}
    </motion.div>
  );
}