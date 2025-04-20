import axios from 'axios';
import sanitizeHtml from 'sanitize-html';

const API_BASE_URL = '/api';
const SHODAN_API_KEY = process.env.SHODAN_API_KEY || 'tu_clave_shodan';
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY || 'tu_clave_virustotal';

export async function fetchDevices() {
  try {
    const response = await axios.get(`${API_BASE_URL}/devices`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener dispositivos:', error);
    throw new Error('No se pudieron obtener los dispositivos');
  }
}

export async function addDevice(device: {
  _id: string;
  name: string;
  ipAddress: string;
  deviceType: string;
  group: string;
}) {
  try {
    // Sanitizar entradas
    const sanitizedDevice = {
      _id: sanitizeHtml(device._id),
      name: sanitizeHtml(device.name),
      ipAddress: sanitizeHtml(device.ipAddress),
      deviceType: sanitizeHtml(device.deviceType),
      group: sanitizeHtml(device.group),
    };
    const response = await axios.post(`${API_BASE_URL}/devices`, sanitizedDevice, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error al agregar dispositivo:', error);
    throw new Error('No se pudo agregar el dispositivo');
  }
}

export async function deleteDevice(_id: string) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/devices`, {
      data: { _id: sanitizeHtml(_id) },
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar dispositivo:', error);
    throw new Error('No se pudo eliminar el dispositivo');
  }
}

export async function fetchSummary({ timeRange }: { timeRange: string } = { timeRange: '30d' }) {
  try {
    const response = await axios.get(`${API_BASE_URL}/summary`, {
      params: { timeRange: sanitizeHtml(timeRange) },
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener resumen:', error);
    throw new Error('No se pudo obtener el resumen');
  }
}

export async function fetchThreatTrend({ timeRange }: { timeRange: string }) {
  try {
    const response = await axios.get(`${API_BASE_URL}/threat-trend`, {
      params: { timeRange: sanitizeHtml(timeRange) },
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener tendencia de amenazas:', error);
    throw new Error('No se pudieron obtener datos de tendencia de amenazas');
  }
}

export async function fetchPolicies() {
  try {
    const response = await axios.get(`${API_BASE_URL}/policies`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener políticas:', error);
    throw new Error('No se pudieron obtener las políticas');
  }
}

export async function validateToken(token: string) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/validate-token`,
      { token: sanitizeHtml(token) },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error al validar token:', error);
    throw new Error('No se pudo validar el token');
  }
}

export async function investigateDomain(domain: string) {
  try {
    const response = await axios.get(`https://www.virustotal.com/api/v3/domains/${sanitizeHtml(domain)}`, {
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
        'Accept': 'application/json',
      },
    });
    return {
      status: response.data.data.attributes.last_analysis_stats.malicious > 0 ? 'malicious' : 'clean',
      categories: response.data.data.attributes.categories
        ? Object.values(response.data.data.attributes.categories)
        : [],
    };
  } catch (error) {
    console.error('Error al investigar dominio:', error);
    return null;
  }
}

export async function fetchShodanData(ip: string) {
  try {
    const response = await axios.get(`https://api.shodan.io/shodan/host/${sanitizeHtml(ip)}`, {
      params: { key: SHODAN_API_KEY },
      headers: { 'Accept': 'application/json' },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener datos de Shodan:', error.message);
    if (error.response?.status === 404) {
      return null; // IP no encontrada
    }
    throw new Error('No se pudieron obtener datos de Shodan');
  }
}