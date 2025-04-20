'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapWidgetProps {
  locations: { lat: number; lng: number; ip: string }[];
}

export default function MapWidget({ locations }: MapWidgetProps) {
  const validLocations = locations.filter(
    (loc) => typeof loc.lat === 'number' && typeof loc.lng === 'number' && loc.ip
  );

  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: '300px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {validLocations.length > 0 ? (
        validLocations.map((loc, i) => (
          <Marker key={i} position={[loc.lat, loc.lng]}>
            <Popup>IP: {loc.ip}</Popup>
          </Marker>
        ))
      ) : (
        <Popup position={[0, 0]}>No hay ubicaciones disponibles</Popup>
      )}
    </MapContainer>
  );
}