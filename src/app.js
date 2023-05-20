require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const socketio = require("socket.io");

const config = require("./config/config");
const path = require("path");
const SocketController = require("./controllers/SocketController");
const PORT = config.port;

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

const server = require("http").createServer(app);
const io = socketio(server);
io.on("connection", (socket) => SocketController.handleSocket(socket, io));

server.listen(PORT, () => {
  console.log(`server started listening on port ${PORT}\nhttp://localhost:${PORT}`);
});
