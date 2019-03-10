let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);

let port = process.env.PORT || 8000;

app.get("/*", (req, res) => {
  res.sendFile(__dirname + req.url);
});
http.listen(port, () => {
  console.log("listening on port " + port);
});

class GameObject {
  constructor(obj = {}) {
    this.id = Math.floor(Math.random() * 1000000000);
    this.x = obj.x;
    this.y = obj.y;
    this.z = obj.z;
    this.width = obj.width;
    this.height = obj.height;
    this.angle = obj.angle;
    this.rotation = obj.rotation;
    this.velocity = obj.velocity;
    this.size = obj.size;
    this.events = {};
  }
  move(distance) {
    const oldX = this.x;
    const oldZ = this.z;
    this.x -= distance * Math.sin(this.angle);
    this.z += distance * Math.cos(this.angle);
  }
  intersect(obj) {
    let distance = Math.hypot(this.x - obj.x, this.z - obj.z);
    return distance < this.size || distance < obj.size;
  }
  toJSON() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      z: this.z,
      width: this.width,
      height: this.height,
      angle: this.angle,
      rotation: this.rotation,
      velocity: this.velocity
    };
  }
}

class Player extends GameObject {
  constructor(obj = {}) {
    super(obj);
    let colors = [
      0xd8d0d1, // white
      0xf5986e, // pink
      0x7ee5e2, // blue
      0x32cd32 // green
    ];
    this.socketId = obj.socketId;
    this.id = obj.socketId;
    this.nickname = obj.nickname;
    this.width = 50;
    this.height = 50;
    this.health = this.maxHealth = 100;
    this.movement = {};
    this.velocity = 0;
    this.size = 20;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    // this.x = Math.random() * (1000 - this.width);
    // this.y = 5;
    // this.z = Math.random() * (1000 - this.height);
    let randomDist = 500 + Math.random() * 500;
    let randAngle = Math.random() * (2 * Math.PI);

    this.x = -Math.sin(randAngle) * randomDist;
    this.y = 5;
    this.z = Math.cos(randAngle) * randomDist;
    this.angle = 0;
  }
  damage() {
    this.health--;
    if (this.health <= 0) this.remove();
  }
  remove() {
    delete players[this.id];
    io.to(this.socketId).emit("dead");
  }
  toJSON() {
    return Object.assign(super.toJSON(), {
      health: this.health,
      maxHealth: this.maxHealth,
      socketId: this.socketId,
      point: this.point,
      nickname: this.nickname,
      color: this.color
    });
  }
}
let objects = [new GameObject({ x: 0, y: 0, z: 0, size: 520 })];
let players = {};

io.on("connection", socket => {
  let player = null;
  console.log("user connected");
  socket.on("start-game", config => {
    console.log("starting game");
    if (config == undefined) {
      config = { nickname: "boat" };
    }
    player = new Player({
      socketId: socket.id,
      nickname: config.nickname,
      x: 0,
      y: 0,
      z: 0,
      angle: 0,
      rotation: { x: 0, y: 0, z: 0 }
    });
    console.log("team color: " + player.color);
    players[player.id] = player;
  });
  socket.on("movement", function(movement) {
    if (!player || player.health <= 0) return;
    player.movement = movement;
  });
  socket.on("message", function(m) {
    console.log("recipient id: " + m.to);
    console.log(io.sockets.connected);
    let recipient = io.sockets.connected[m.to];
    let sender = players[m.from];
    let message = m.message;
    recipient.emit("message", sender.nickname + ": " + message);
  });
  socket.on("disconnect", function() {
    console.log("user disconnected");
    if (!player) {
      return;
    }
    delete players[player.id];
    player = null;
  });
});
function getRandomTeamColor() {
  let colors = [
    0xd8d0d1, // white
    0xf5986e, // pink
    0x7ee5e2, // blue
    0x32cd32 // green
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}
let fps = 30;
setInterval(() => {
  Object.values(players).forEach(player => {
    const movement = player.movement;
    if (movement.left != undefined) {
      const thrustDirection = movement.forward - movement.backward;
      const turnDirection = movement.right - movement.left;
      const thrustAcceleration = 0.1;
      player.angle += turnDirection * 0.1;
      player.rotation.z = (Math.PI / 4) * turnDirection;
      // console.log("acceleration direction: " + thrustDirection);
      player.velocity += thrustDirection * thrustAcceleration;
      if (player.velocity >= 5) player.velocity = 5;
      if (player.velocity <= 0) player.velocity = 0;
    }
    player.move(player.velocity);
    let collision = false;
    Object.values(players).forEach(other => {
      if (other.id != player.id) {
        if (other.intersect(player)) collision = true;
      }
    });
    Object.values(objects).forEach(object => {
      if (player.intersect(object)) collision = true;
    });
    if (collision) {
      player.move(-player.velocity);
    }
  });
  io.sockets.emit("state", players);
}, 1000 / fps);
