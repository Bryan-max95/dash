'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import DeploymentWidget from '../components/widgets/DeploymentWidget';
import { fetchDevices, fetchShodanData, addDevice, deleteDevice } from '../lib/api';
import { CSVLink } from 'react-csv';
import { useSession } from 'next-auth/react';

interface Device {
  _id: string;
  name: string;
  ipAddress: string;
  deviceType: string;
  group: string;
}

interface VulnerabilityData {
  ip: string;
  ports: number[];
  vulns: string[];
  hostnames: string[];
  os?: string;
  org?: string;
}

export default function Network() {
  const { data: session, status } = useSession();
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedIP, setSelectedIP] = useState('');
  const [customIP, setCustomIP] = useState('');
  const [customName, setCustomName] = useState('');
  const [deviceType, setDeviceType] = useState('PC');
  const [group, setGroup] = useState('General');
  const [vulnerabilityData, setVulnerabilityData] = useState<VulnerabilityData | null>(null);
  const [error, setError] = useState('');
  const [vulnError, setVulnError] = useState('');
  const [loadingVulns, setLoadingVulns] = useState(false);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    async function loadDevices() {
      if (status === 'authenticated') {
        try {
          setError('');
          setLoadingDevices(true);
          const data = await fetchDevices();
          setDevices(data);
          if (data.length > 0) setSelectedIP(data[0].ipAddress);
        } catch (err) {
          setError('No se pudieron cargar los dispositivos.');
          console.error('Error al cargar dispositivos:', err);
        } finally {
          setLoadingDevices(false);
        }
      }
    }
    loadDevices();
  }, [status]);

  useEffect(() => {
    // Obtener CSRF token
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    setCsrfToken(token);
  }, []);

  const handleAddCustomIP = async () => {
    if (status !== 'authenticated') {
      setError('Debes iniciar sesión para agregar dispositivos.');
      return;
    }
    if (!customIP.trim()) {
      setError('Ingresa una IP válida.');
      return;
    }
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(customIP)) {
      setError('Formato de IP inválido. Ejemplo: 192.168.1.1');
      return;
    }
    if (!customName.trim()) {
      setError('Ingresa un nombre para el dispositivo.');
      return;
    }
    const newDevice: Device = {
      _id: `device-${Date.now()}`,
      name: customName,
      ipAddress: customIP,
      deviceType,
      group,
    };
    try {
      await addDevice(newDevice);
      setDevices((prev) => [...prev, newDevice]);
      setSelectedIP(customIP);
      setCustomIP('');
      setCustomName('');
      setDeviceType('PC');
      setGroup('General');
      setError('');
    } catch (err) {
      setError('Error al guardar el dispositivo.');
      console.error('Error al agregar dispositivo:', err);
    }
  };

  const handleDeleteDevice = async (_id: string) => {
    if (status !== 'authenticated') {
      setError('Debes iniciar sesión para eliminar dispositivos.');
      return;
    }
    try {
      await deleteDevice(_id);
      setDevices((prev) => prev.filter((device) => device._id !== _id));
      if (selectedIP === devices.find((d) => d._id === _id)?.ipAddress) {
        setSelectedIP('');
      }
      setError('');
    } catch (err) {
      setError('Error al eliminar el dispositivo.');
      console.error('Error al eliminar dispositivo:', err);
    }
  };

  const handleAnalyzeIP = async () => {
    if (status !== 'authenticated') {
      setVulnError('Debes iniciar sesión para analizar IPs.');
      return;
    }
    if (!selectedIP) {
      setVulnError('Selecciona una IP para analizar.');
      return;
    }

    setLoadingVulns(true);
    setVulnError('');
    setVulnerabilityData(null);

    try {
      const shodanResult = await fetchShodanData(selectedIP);
      if (!shodanResult) {
        setVulnError('No se encontraron datos de vulnerabilidades para esta IP.');
        return;
      }
      setVulnerabilityData({
        ip: shodanResult.ip_str || selectedIP,
        ports: shodanResult.ports || [],
        vulns: shodanResult.vulns || [],
        hostnames: shodanResult.hostnames || [],
        os: shodanResult.os || 'N/A',
        org: shodanResult.org || 'N/A',
      });
    } catch (err) {
      setVulnError('Error al analizar la IP. Por favor, intenta de nuevo.');
      console.error('Error al analizar IP:', err);
    } finally {
      setLoadingVulns(false);
    }
  };

  const csvData = devices.map((device) => ({
    ID: device._id,
    Nombre: device.name,
    IP: device.ipAddress,
    Tipo: device.deviceType,
    Grupo: device.group,
  }));

  if (status === 'loading') {
    return <div className="text-gray-400">Cargando...</div>;
  }

  if (status !== 'authenticated') {
    return <div className="text-red-500">Por favor, inicia sesión para acceder al análisis de red.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-4xl mx-auto bg-[#1A1A1A] rounded-lg"
    >
      <h1 className="text-2xl font-bold text-[#8B0000] mb-4">Análisis de Red</h1>

      {/* Mensajes de Error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {vulnError && <p className="text-red-500 mb-4">{vulnError}</p>}

      {/* Exportar CSV */}
      <div className="mb-4">
        <CSVLink
          data={csvData}
          filename={`devices_${new Date().toISOString()}.csv`}
          className="flex items-center gap-2 bg-[#8B0000] text-white px-3 py-1 rounded hover:bg-[#6B0000]"
          aria-label="Exportar dispositivos como CSV"
        >
          <Download size={16} />
          Exportar Dispositivos
        </CSVLink>
      </div>

      {/* Lista de Dispositivos */}
      {loadingDevices ? (
        <p className="text-gray-400">Cargando dispositivos...</p>
      ) : (
        <div className="mb-6">
          <DeploymentWidget devices={devices} onDelete={handleDeleteDevice} />
        </div>
      )}

      {/* Entrada de IP Personalizada */}
      <form className="mb-4">
        <input type="hidden" name="csrf-token" value={csrfToken} />
        <label htmlFor="customIP" className="block text-sm font-medium text-gray-400 mb-1">
          Agregar IP personalizada
        </label>
        <div className="flex flex-col gap-2">
          <input
            id="customIP"
            type="text"
            value={customIP}
            onChange={(e) => setCustomIP(e.target.value)}
            placeholder="Ej: 192.168.1.1"
            className="bg-[#2D2D2D] border border-[#8B0000]/50 rounded px-3 py-2 text-white"
            aria-label="IP personalizada"
          />
          <input
            id="customName"
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Nombre del dispositivo"
            className="bg-[#2D2D2D] border border-[#8B0000]/50 rounded px-3 py-2 text-white"
            aria-label="Nombre del dispositivo"
          />
          <select
            id="deviceType"
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            className="bg-[#2D2D2D] border border-[#8B0000]/50 rounded px-3 py-2 text-white"
            aria-label="Tipo de dispositivo"
          >
            <option value="PC">PC</option>
            <option value="Servidor">Servidor</option>
            <option value="Laptop">Laptop</option>
            <option value="Otro">Otro</option>
          </select>
          <input
            id="group"
            type="text"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            placeholder="Grupo (e.g., Servidores)"
            className="bg-[#2D2D2D] border border-[#8B0000]/50 rounded px-3 py-2 text-white"
            aria-label="Grupo de dispositivos"
          />
          <button
            type="button"
            onClick={handleAddCustomIP}
            className="bg-[#8B0000] text-white px-4 py-2 rounded hover:bg-[#6B0000]"
            aria-label="Agregar dispositivo"
          >
            Agregar
          </button>
        </div>
      </form>

      {/* Selección de Dispositivo */}
      <div className="mb-4">
        <label htmlFor="deviceSelect" className="block text-sm font-medium text-gray-400 mb-1">
          Seleccionar Dispositivo
        </label>
        <select
          id="deviceSelect"
          value={selectedIP}
          onChange={(e) => setSelectedIP(e.target.value)}
          className="bg-[#2D2D2D] border border-[#8B0000]/50 rounded px-3 py-2 w-full text-white"
          aria-label="Seleccionar dispositivo"
        >
          {devices.length === 0 ? (
            <option value="">No hay dispositivos disponibles</option>
          ) : (
            devices.map((device) => (
              <option key={device._id} value={device.ipAddress}>
                {device.ipAddress} ({device.name}, {device.group})
              </option>
            ))
          )}
        </select>
      </div>

      {/* Botón de Análisis */}
      <button
        onClick={handleAnalyzeIP}
        disabled={loadingVulns || !selectedIP}
        className={`w-full py-2 rounded text-white ${
          loadingVulns || !selectedIP
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#8B0000] hover:bg-[#6B0000]'
        }`}
        aria-label="Analizar IP seleccionada"
      >
        {loadingVulns ? 'Analizando...' : 'Analizar IP'}
      </button>

      {/* Mostrar Datos de Vulnerabilidades */}
      {vulnerabilityData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 bg-[#2D2D2D] p-4 rounded-lg border border-[#8B0000]/50"
        >
          <h2 className="text-xl font-semibold text-[#8B0000] mb-2">Resultados del Análisis</h2>
          <div className="mb-4">
            <h3 className="font-medium text-gray-400">Shodan</h3>
            <p className="text-white">IP: {vulnerabilityData.ip}</p>
            <p className="text-white">
              Puertos: {vulnerabilityData.ports.join(', ') || 'N/A'}
            </p>
            <p className="text-white">
              Vulnerabilidades: {vulnerabilityData.vulns.join(', ') || 'Ninguna'}
            </p>
            <p className="text-white">
              Hostnames: {vulnerabilityData.hostnames.join(', ') || 'N/A'}
            </p>
            <p className="text-white">Sistema Operativo: {vulnerabilityData.os}</p>
            <p className="text-white">Organización: {vulnerabilityData.org}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}