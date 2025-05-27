const express = require("express");
const path = require("path");
const cors = require("cors"); // <-- Add this
const app = express();
const port = 3000;

// ✅ Apply CORS middleware BEFORE any routes
app.use(cors()); // This allows all origins — perfect for development

// Serve a local file on GET request
app.get("/api/download", async (req, res) => {
  const filePath = path.join(
    __dirname,
    "files",
    "sample.pdf"
  );
  // await sleep(5000);
  res.send({
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
  });
});
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
app.listen(port, () => {
  console.log(
    `✅ File server running at http://localhost:${port}`
  );
});
