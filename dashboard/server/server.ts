// server/server.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cyberdash', {});

// Esquema de dispositivo
const deviceSchema = new mongoose.Schema({
  token: String,
  name: String,
  ipAddress: String,
  status: String,
  os: String,
  cpuUsage: Number,
  memoryUsage: Number,
  browsers: [{ name: String, version: String }],
  software: [{ name: String, version: String }],
  cves: [{ cveId: String, severity: String, description: String }],
  shodanData: { ports: [Number], cpes: [String], vulns: [String], tags: [String] },
  greyNoiseData: {
    noise: Boolean,
    riot: Boolean,
    classification: String,
    name: String,
    lastSeen: String,
  },
});

const Device = mongoose.model('Device', deviceSchema);

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// Generar token
app.post('/api/generate-token', (req, res) => {
  const { userId } = req.body;
  const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1y' });
  res.json({ token });
});

// Validar token
app.post('/api/validate-token', (req, res) => {
  const { token } = req.body;
  try {
    jwt.verify(token, SECRET_KEY);
    res.json({ valid: true });
  } catch (err) {
    res.status(401).json({ valid: false, error: 'Token inválido' });
  }
});

// Registrar dispositivo
app.post('/api/register-device', async (req, res) => {
  const { token, deviceInfo } = req.body;
  try {
    jwt.verify(token, SECRET_KEY);
    // Consultar Shodan InternetDB
    let shodanData = { ports: [], cpes: [], vulns: [], tags: [] };
    try {
      const shodanResponse = await axios.get(`https://internetdb.shodan.io/${deviceInfo.ipAddress}`);
      shodanData = {
        ports: shodanResponse.data.ports || [],
        cpes: shodanResponse.data.cpes || [],
        vulns: shodanResponse.data.vulns || [],
        tags: shodanResponse.data.tags || [],
      };
    } catch (err: any) {
      console.error('Error consultando Shodan:', err.response?.data || err.message || err);
    }
    // Consultar GreyNoise Community API
    let greyNoiseData = { noise: false, riot: false, classification: 'unknown', name: '', lastSeen: '' };
    try {
      const greyNoiseResponse = await axios.get(`https://api.greynoise.io/v3/community/${deviceInfo.ipAddress}`, {
        headers: {
          'Accept': 'application/json',
          'key': process.env.GREYNOISE_API_KEY,
        },
      });
      greyNoiseData = {
        noise: greyNoiseResponse.data.noise || false,
        riot: greyNoiseResponse.data.riot || false,
        classification: greyNoiseResponse.data.classification || 'unknown',
        name: greyNoiseResponse.data.name || '',
        lastSeen: greyNoiseResponse.data.last_seen || '',
      };
    } catch (err: any) {
      console.error('Error consultando GreyNoise:', err.response?.data || err.message || err);
    }
    const device = new Device({
      token,
      ...deviceInfo,
      status: 'active',
      shodanData,
      greyNoiseData,
    });
    await device.save();
    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Obtener dispositivos
app.get('/api/devices', async (req, res) => {
  const devices = await Device.find();
  res.json(devices);
});

// Obtener resumen
app.get('/api/summary', async (req, res) => {
  const devices = await Device.find();
  const totalCves = devices.reduce((sum, d) => sum + (d.cves?.length || 0), 0);
  const criticalCves = devices.reduce(
    (sum, d) => sum + (d.cves?.filter((c) => c.severity === 'CRITICAL').length || 0),
    0
  );
  const openPorts = devices.reduce((sum, d) => sum + (d.shodanData?.ports?.length || 0), 0);
  const noisyIPs = devices.reduce((sum, d) => sum + (d.greyNoiseData?.noise ? 1 : 0), 0);
  res.json({
    monitoredDevices: devices.length, // Corregí "monitoreDevices" a "monitoredDevices"
    totalCves,
    criticalCves,
    openPorts,
    noisyIPs,
    vulnerabilityPercentage: totalCves ? ((criticalCves / totalCves) * 100).toFixed(1) : 0,
  });
});

// Obtener CVEs de NVD
app.get('/api/cves', async (req, res) => {
  const { software, version } = req.query;
  try {
    const response = await axios.get('https://services.nvd.nist.gov/rest/json/cves/2.0', {
      params: {
        apiKey: process.env.NVD_API_KEY,
        cpeName: `cpe:2.3:a:*:${software}:${version}:*:*:*:*:*:*:*`,
      },
    });
    res.json(response.data.vulnerabilities);
  } catch (err: any) {
    res.status(500).json({ error: 'Error al obtener CVEs', details: err.message || err });
  }
});

// Consultar Shodan InternetDB
app.get('/api/shodan/:ip', async (req, res) => {
  try {
    const response = await axios.get(`https://internetdb.shodan.io/${req.params.ip}`);
    res.json(response.data);
  } catch (err: any) {
    res.status(500).json({ error: 'Error al consultar Shodan', details: err.message || err });
  }
});

// Consultar GreyNoise Community API
app.get('/api/greynoise/:ip', async (req, res) => {
  try {
    const response = await axios.get(`https://api.greynoise.io/v3/community/${req.params.ip}`, {
      headers: {
        'Accept': 'application/json',
        'key': process.env.GREYNOISE_API_KEY,
      },
    });
    res.json(response.data);
  } catch (err: any) {
    res.status(500).json({ error: 'Error al consultar GreyNoise', details: err.message || err });
  }
});

// Políticas (simuladas)
app.get('/api/policies', async (req, res) => {
  res.json([
    { policyId: 1, name: 'Política Base', status: 'active' },
    { policyId: 2, name: 'Política Avanzada', status: 'inactive' },
  ]);
});

app.listen(3001, () => console.log('Servidor corriendo en puerto 3001'));