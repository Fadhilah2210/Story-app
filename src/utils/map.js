import React, { useEffect, useState } from 'react';
import L from 'leaflet';

function MapComponent() {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const map = L.map('map').setView([-6.2, 106.8], 5); // Default Indonesia
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      shadowSize: [41, 41],
    });

    let markerInstance;

    map.on('click', function (e) {
      const selectedLat = e.latlng.lat;
      const selectedLon = e.latlng.lng;

      setLat(selectedLat);
      setLon(selectedLon);

      if (markerInstance) {
        map.removeLayer(markerInstance);
      }

      markerInstance = L.marker([selectedLat, selectedLon], { icon: customIcon })
        .addTo(map)
        .bindPopup(`Lat: ${selectedLat}<br>Lon: ${selectedLon}`)
        .openPopup();

      setMarker(markerInstance);
    });

    // Trigger to refresh map size after component is mounted
    map.invalidateSize();
  }, []);

  return (
    <div>
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
      <input type="text" value={lat} readOnly />
      <input type="text" value={lon} readOnly />
    </div>
  );
}

export default MapComponent;
