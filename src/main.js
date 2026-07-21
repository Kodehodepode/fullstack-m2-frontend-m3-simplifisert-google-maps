import './style.css'

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Re-map default marker icon asset paths
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

const geoCodeURL = "https://api.geoapify.com/v1/geocode/search";
const placesURL = "https://api.geoapify.com/v2/places";
const geoApifyKey = import.meta.env.VITE_GEOAPIFY_KEY;


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIconRetinaUrl,
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
});

// Initialize Map
const map = L.map('map').setView([51.505, -0.09], 13); // "map" er IDen til en DIV i html-filen
const markerGroup = L.layerGroup().addTo(map); // For å kunne slette alle markører samtidig
map.addEventListener("moveend", event => updatePins());

// Add OpenStreetMap Tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const categoryInputs = Array.from(document.querySelectorAll(".categories input"));

categoryInputs.forEach(checkbox => checkbox.addEventListener("change", event => updatePins()));

searchButton.addEventListener("click", async (event) => {

  const geoCode = await getGeoCode(searchInput.value);

  const coordinates = geoCode.geometry.coordinates.toReversed();

  map.setView(coordinates, 13);

});

const getGeoCode = async (searchText) => {
  const url = new URL(geoCodeURL);

  const params = {
    apiKey: geoApifyKey,
    text: searchText
  };
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
  const data = await response.json();

  return data.features[0];
}

const getPlaces = async (categories) => {
  const url = new URL(placesURL);

  const { _northEast: ne, _southWest: sw } = map.getBounds();
  const rect = [ne.lng, ne.lat, sw.lng, sw.lat].join(",");

  const params = {
    apiKey: geoApifyKey,
    categories: categories,
    filter: "rect:" + rect,
    limit: 20
  };
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
  const places = await response.json();

  return places.features;
}

const updatePins = async () => {
  markerGroup.clearLayers();

  const categories = categoryInputs
    .filter(curr => curr.checked)
    .map(curr => curr.name)
    .join(",");
  
  if (categories === "") { return }

  const places = await getPlaces(categories);

  places.forEach(place => {
    const [lng, lat] = place.geometry.coordinates;
    const marker = L.marker([lat,lng])
      .bindPopup(place.properties.name)
      .openPopup();
    markerGroup.addLayer(marker);
  });
}