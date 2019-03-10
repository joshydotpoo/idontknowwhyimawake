let Player = require("./PlayerController.js");
class ServerController {
  constructor(io) {
    console.log("server controller");
    this.io = io;
    this.players = {};
    this.sockets = {};
    this.clock = 0;
    this.tick = 2000;
    this.running = true;
  }
  handleConnect(socket) {
    this.players[socket.id] = new Player(socket.id);
    this.sockets[socket.id] = socket;
    socket.emit("initClient", socket.id);
    socket.on("update", data => {
      this.players[socket.id].update(data);
    });
  }
  handleDisconnect(socket) {
    delete this.players[socket.id];
    delete this.sockets[socket.id];
  }
  run() {
    if (this.running) {
      for (let id in this.players) {
        // update their positions
        // let socket = sockets[id];
        // socket.broadcast.emit();
      }

      setTimeout(() => {
        this.io.sockets.emit("tick", this.players);
        this.clock += this.tick;
        this.run();
      }, this.tick);
    }
  }
}
module.exports = ServerController;
