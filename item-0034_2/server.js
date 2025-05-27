const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Serve the CSV file when requested
app.get("/csv", (req, res) => {
  const filePath = path.join(__dirname, "data.csv");

  res.send(filePath, "boardgame_ratings.csv", (err) => {
    if (err) {
      res.status(500).send("Error downloading the file.");
    }
  });
});

app.listen(port, () => {
  console.log(
    `Server is running at http://localhost:${port}`
  );
});
