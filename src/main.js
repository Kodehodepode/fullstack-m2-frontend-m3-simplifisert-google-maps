import './style.css'

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Re-map default marker icon asset paths
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIconRetinaUrl,
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
});

// Initialize Map
const map = L.map('map').setView([51.505, -0.09], 13); // "map" er IDen til en DIV i html-filen

// Add OpenStreetMap Tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Add a Sample Marker
L.marker([51.505, -0.09]).addTo(map)
  .bindPopup('A pretty CSS popup.<br> Easily customizable.')
  .openPopup();
