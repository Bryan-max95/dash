'use client';

import { motion } from 'framer-motion';
import { Network, Trash2 } from 'lucide-react';

interface Device {
  _id: string;
  name: string;
  ipAddress: string;
  deviceType: string;
  group: string;
}

interface DeploymentWidgetProps {
  devices: Device[];
  onDelete: (_id: string) => void;
}

export default function DeploymentWidget({ devices, onDelete }: DeploymentWidgetProps) {
  const groups = [...new Set(devices.map((device) => device.group))];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#2D2D2D] p-4 rounded-lg border border-[#8B0000]/50 overflow-x-auto"
    >
      <h3 className="text-lg font-bold text-[#8B0000] mb-4 flex items-center gap-2">
        <Network className="w-5 h-5" />
        Dispositivos Registrados
      </h3>
      {devices.length === 0 ? (
        <p className="text-gray-400">No hay dispositivos registrados.</p>
      ) : (
        groups.map((group) => (
          <div key={group} className="mb-4">
            <h4 className="text-md font-semibold text-gray-400 mb-2">{group}</h4>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#8B0000]/50">
                  <th className="p-2 text-gray-400">Nombre</th>
                  <th className="p-2 text-gray-400">IP</th>
                  <th className="p-2 text-gray-400">Tipo</th>
                  <th className="p-2 text-gray-400">Acción</th>
                </tr>
              </thead>
              <tbody>
                {devices
                  .filter((device) => device.group === group)
                  .map((device) => (
                    <motion.tr
                      key={device._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-[#8B0000]/50"
                    >
                      <td className="p-2 text-white">{device.name}</td>
                      <td className="p-2 text-white">{device.ipAddress}</td>
                      <td className="p-2 text-white">{device.deviceType}</td>
                      <td className="p-2">
                        <button
                          onClick={() => onDelete(device._id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label={`Eliminar dispositivo ${device.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </motion.div>
  );
}