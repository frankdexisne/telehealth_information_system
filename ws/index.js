const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/receive-event", (req, _, next) => {
  const { event, data } = req.body;
  if (data) io.emit(event, data);
  else io.emit(event);
  return next();
});

const expressServer = app.listen(3002);
const io = require("socket.io")(expressServer);
const authenticate = require("./middleware/authenticate");

const connectionHandler = (socket) => {
  const token = socket.handshake.auth.token;
  if (token && authenticate(token)) {
    socket.on("created", function () {
      socket.broadcast.emit("created");
      console.log("created");
    });

    socket.on("follow-up", function () {
      socket.broadcast.emit("follow-up");
    });

    socket.on("additional-advice", function () {
      socket.broadcast.emit("additional-advice");
    });

    socket.on("attachment", function () {
      socket.broadcast.emit("attachment");
    });

    socket.on("prescription", function () {
      socket.broadcast.emit("prescription");
    });

    socket.on("out-when-called", function () {
      socket.broadcast.emit("out-when-called");
    });

    socket.on("forward-to-homis", function () {
      socket.broadcast.emit("forward-to-homis");
    });

    socket.on("triaged", function (departmentId) {
      socket.broadcast.emit("triaged", departmentId);
    });

    socket.on("assigned", function (departmentId) {
      socket.broadcast.emit("assigned", departmentId);
    });

    socket.on("locked", function (departmentId) {
      socket.broadcast.emit("locked", departmentId);
    });
  }

  socket.on("disconnected", () => console.log("DISCONNECTED CLIENT"));
};

io.on("connection", connectionHandler);
