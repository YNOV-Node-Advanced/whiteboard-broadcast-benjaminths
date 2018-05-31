const path = require("path");
const express = require("express");
const uuidv4 = require("uuid/v4");
const http = require("http");
const WebSocket = require("ws");

const app = express();

const PUBLIC_FOLDER = path.join(__dirname, "../public");
const PORT = process.env.PORT || 5000;

// Assign a random channel to people opening the application
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:channel", (req, res, next) => {
  res.sendFile(path.join(PUBLIC_FOLDER, "index.html"), {}, err => {
    if (err) {
      next(err);
    }
  });
});

app.use(express.static(PUBLIC_FOLDER));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(PORT, () => {
  console.log(`Server started on port ${server.address().port}`);
});

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    ws.send(message);
    console.log(message);
  });
});
