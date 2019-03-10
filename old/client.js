let socket = io();
let clientId, client, game;
socket.on("initClient", function(id) {
  console.log("client id set to " + id);
  client = new ClientController();
  clientId = id;
  document.addEventListener("keyup", e => client.keyUp(e.key));
  document.addEventListener("keydown", e => client.keyDown(e.key));
  game = new GameView(id);
  let localTick = 20;
  setInterval(() => {
    let testData = {};
    client.update();
    testData[clientId] = { state: client.playerState };
    game.update(testData);
    socket.emit("update", client.playerState);
  }, localTick);
});
socket.on("tick", gameData => {
  // console.log(client.playerState);
  if (clientId != null) {
    delete gameData.clientId;
    game.update(gameData);
  }
});
