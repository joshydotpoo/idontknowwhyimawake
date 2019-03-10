let express = require("express");
let app = express();
let http = require("http").Server(app);
let port = 6969;
let io = require("socket.io")(http);
let serverController = new (require("./lib/server/ServerController.js"))(io);
serverController.run();

app.get("/*", (req, res) => {
  res.sendFile(__dirname + req.url);
});
http.listen(port, () => {
  console.log("listening on port " + port);
});
io.on("connection", socket => {
  console.log("user connected");
  serverController.handleConnect(socket);
  socket.on("disconnect", function() {
    console.log("user disconnected");
    serverController.handleDisconnect(socket);
  });
});
