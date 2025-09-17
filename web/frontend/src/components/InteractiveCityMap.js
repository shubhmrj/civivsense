import React, { useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// IMPORTANT: Ask the user to place their Mapbox token in an env file or provide via prop.
// mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN_HERE';

/*
 * Simple interactive 2D map with sample issue markers.
 * For production, replace sampleData with live API data from backend.
 */

const sampleData = [
  {
    id: 1,
    type: 'Pothole',
    status: 'open',
    coordinates: [85.297, 23.344] // Ranchi approx
  },
  {
    id: 2,
    type: 'Garbage',
    status: 'resolved',
    coordinates: [85.325, 23.36]
  },
  {
    id: 3,
    type: 'Street Light',
    status: 'in_progress',
    coordinates: [85.30, 23.32]
  }
];

const issueIcon = (color) =>
  new L.Icon({
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color.replace('#', '')}`,
    iconSize: [21, 34],
    iconAnchor: [10, 34],
    popupAnchor: [0, -28]
  });

export default function InteractiveCityMap({ height = 500 }) {
  const [loading] = useState(false);

  return (
    <Box sx={{ position: 'relative' }}>
      {loading && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <CircularProgress />
        </Box>
      )}
      <MapContainer
        center={[23.34, 85.32]}
        zoom={12}
        style={{ width: '100%', height }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sampleData.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.coordinates[1], issue.coordinates[0]]}
            icon={issueIcon(
              issue.status === 'resolved' ? '#2ecc71' : issue.status === 'in_progress' ? '#f39c12' : '#e74c3c'
            )}
          >
            <Popup>
              <strong>{issue.type}</strong>
              <br />Status: {issue.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
