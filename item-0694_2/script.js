// Create the map
var map = L.map("map").setView(
  [0.5163504323777589, 100.42602539062501],
  13
);
// Add a basemap tile layer
L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
).addTo(map);

// Create empty layer groups for each of your layers
var layer1 = L.layerGroup();
var layer2 = L.layerGroup();
// Add more layers as needed

// Load your first GeoJSON file

L.geoJSON({
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [102.0, 0.5],
      },
      properties: { prop0: "value0" },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [102.0, 0.0],
          [103.0, 1.0],
          [104.0, 0.0],
          [105.0, 1.0],
        ],
      },
      properties: {
        prop0: "value0",
        prop1: 0.0,
      },
    },
  ],
}).addTo(layer1);

L.geoJSON({
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0],
          ],
        ],
      },
      properties: {
        prop0: "value0",
        prop1: { this: "that" },
      },
    },
  ],
}).addTo(layer2);

// Add the layers to the map
layer1.addTo(map);
layer2.addTo(map);

// Create an object with your layers
var overlayMaps = {
  "Layer 1": layer1,
  "Layer 2": layer2,
};

// Add layer control to the map
L.control.layers(null, overlayMaps).addTo(map);
