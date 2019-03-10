// class GameView {
//   constructor() {
//     this.shouldRun = true;
//     this.engine = new GameEngine();
//     this.engine.addMesh(MeshDictionary.spaceships.cargo);
//     this.engine.run();
//     this.engine.addOrbitControls();
//   }
//   addSpaceship(id) {
//     this.engine.addMesh(MeshDictionary.spaceships.cargo, id);
//   }
//   update(gameData) {
//     for (let objId in gameData) {
//       console.log("updating mesh with ID: " + objId);
//       let mesh = this.engine.objects[objId];
//       if (this.engine.objects[objId] == undefined) this.addSpaceship(objId);
//
//       let meshState = gameData[objId].state;
//       this.engine.objects[objId].position.set(
//         meshState.position.x,
//         meshState.position.y,
//         meshState.position.z
//       );
//       this.engine.objects[objId].rotation.x = meshState.rotation.x;
//       this.engine.objects[objId].rotation.y = meshState.rotation.y;
//       this.engine.objects[objId].rotation.z = meshState.rotation.z;
//     }
//   }
// }
let GameView = function(id) {
  this.engine = GameEngine;
  this.engine.init();
  this.engine.run();
  this.engine.follow = id;
};
GameView.prototype.t = function() {
  this.test++;
};
GameView.prototype.addSpaceship = function(id) {
  console.log("creating new spaceship with id: " + id);
  this.engine.addMesh(MeshDictionary.spaceships.cargo, id);
};
GameView.prototype.update = function(gameData) {
  if (this.engine.initialized) {
    let followId = this.engine.follow;
    if (followId != null) {
      let mesh = this.engine.objects[followId];
      let data = gameData[followId];
      if (mesh && data) {
        let oldPos = mesh.position;
        let newPos = data.state.position;
        this.engine.camera.position.x += newPos.x - oldPos.x;
        this.engine.camera.position.y += newPos.y - oldPos.y;
        this.engine.camera.position.z += newPos.z - oldPos.z;
      }
    }
    for (let objId in gameData) {
      let mesh = this.engine.objects[objId];
      if (this.engine.objects[objId] == undefined) this.addSpaceship(objId);

      let meshState = gameData[objId].state;
      this.engine.objects[objId].position.set(
        meshState.position.x,
        meshState.position.y,
        meshState.position.z
      );
      this.engine.objects[objId].rotation.x = meshState.rotation.x;
      this.engine.objects[objId].rotation.y = meshState.rotation.y;
      this.engine.objects[objId].rotation.z = meshState.rotation.z;
    }
  }
};
