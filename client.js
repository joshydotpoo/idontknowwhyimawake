let socket = io();
let mapContainer;
let map;

let lastUpdate = new Date();

function startGame() {
  let nickname = document.querySelector("#nickname").value;

  socket.emit("start-game", { nickname: nickname });
  GameEngine.init();
  GameEngine.run();
  document.querySelector("#hud").removeAttribute("hidden");
  mapContainer = document.querySelector("#map");
  mapContainer.removeAttribute("hidden");
  map = mapContainer.getContext("2d");
  socket.on("message", function(message) {
    document.querySelector("#messages").innerHTML += "<li>" + message + "</li>";
  });
}
let controls = {
  forward: 0,
  backward: 0,
  left: 0,
  right: 0
};
document.addEventListener("keydown", e => {
  let key = e.key;
  if (key == "a") controls.left = 1;
  if (key == "d") controls.right = 1;
  if (key == "w") controls.forward = 1;
  if (key == "s") controls.backward = 1;
  socket.emit("movement", controls);
  console.log("keydown");
});
document.addEventListener("keyup", e => {
  let key = e.key;
  if (key == "a") controls.left = 0;
  if (key == "d") controls.right = 0;
  if (key == "w") controls.forward = 0;
  if (key == "s") controls.backward = 0;
  socket.emit("movement", controls);
});

let GameEngine = {
  gridsize: 100000,
  griddivs: 1000,
  scene: null,
  renderer: null,
  camera: null,
  meshes: null,
  domevents: null,
  initialized: false,
  init: function() {
    console.log("initializing game engine");
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;
    GameEngine.scene = new THREE.Scene();
    GameEngine.scene.background = new THREE.Color(0x000000); //(0xfcf7de);
    GameEngine.camera = new THREE.PerspectiveCamera(
      75,
      WIDTH / HEIGHT,
      0.1,
      1000
    );
    GameEngine.renderer = new THREE.WebGLRenderer();
    GameEngine.renderer.setSize(WIDTH, HEIGHT);
    GameEngine.renderer.shadowMap.enabled = true;
    // GameEngine.camera.position.set(0, 150, -150);
    // GameEngine.camera.lookAt(0, 0, 0);
    GameEngine.meshes = {};
    GameEngine.addLight();
    GameEngine.addGrid();
    GameEngine.domevents = new THREEx.DomEvents(
      GameEngine.camera,
      GameEngine.renderer.domElement
    );
    let ogPlanet = MeshDictionary.planets.origin();
    console.log(ogPlanet);
    ogPlanet.scale.set(10, 10, 10);
    GameEngine.scene.add(ogPlanet);
    GameEngine.initialized = true;
    window.addEventListener("resize", GameEngine.resizeWindow, false);
    document.body.appendChild(GameEngine.renderer.domElement);
    let mapcont = document.querySelector("#map");
    let context = mapcont.getContext("2d");
    context.beginPath();
    context.ellipse(100, 100, 15, 10, 0, 0, Math.PI * 2);
    context.fill();
  },
  addLight: function() {
    let hemisphereLight, shadowLight;
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
    shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
    shadowLight.position.set(0, 350, 350);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;
    GameEngine.scene.add(hemisphereLight);
    GameEngine.scene.add(shadowLight);
  },
  addGrid: function() {
    var size = GameEngine.gridsize;
    var divisions = GameEngine.griddivs;
    var gridHelper = new THREE.GridHelper(
      size,
      divisions,
      new THREE.Color(0x565656),
      new THREE.Color(0x565656)
    );
    GameEngine.scene.add(gridHelper);
    // GameEngine.scene.fog = new THREE.FogExp2(0xfcf7de, 0.003);
  },
  resizeWindow: function() {
    // update height and width of the renderer and the camera
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;
    GameEngine.renderer.setSize(WIDTH, HEIGHT);
    GameEngine.camera.aspect = WIDTH / HEIGHT;
    GameEngine.camera.updateProjectionMatrix();
  },
  addMesh: function(mesh, meshId) {
    if (meshId != undefined) {
      GameEngine.meshes[meshId] = mesh;
    }
  },
  getMesh: function(meshId) {
    return GameEngine.meshes[meshId];
  },
  run: function() {
    requestAnimationFrame(GameEngine.run);
    GameEngine.renderer.render(GameEngine.scene, GameEngine.camera);
  }
};

socket.on("state", function(players) {
  let oldUpdate = lastUpdate;
  lastUpdate = new Date();
  document.querySelector("#update").innerHTML = lastUpdate - oldUpdate;
  if (map) {
    map.clearRect(0, 0, mapContainer.width, mapContainer.height);
    // draw origin planet
    map.beginPath();
    map.fillStyle = "#0000ff";
    map.ellipse(150, 75, 10, 5, 0, 0, 2 * Math.PI);
    map.fill();
  }
  let localPlayer = null;
  if (GameEngine.initialized) {
    Object.values(GameEngine.meshes).forEach(mesh => {
      mesh.used = false;
    });
    Object.values(players).forEach(player => {
      let playerMesh = GameEngine.getMesh(player.id);
      if (!playerMesh) {
        let baseship = MeshDictionary.spaceships.cargo(player.color);
        playerMesh = baseship.clone();
        playerMesh.rotateY(Math.PI / 4);
        playerMesh.castShadow = true;
        playerMesh.needsUpdate = true;
        if (player.id != socket.id) {
          GameEngine.domevents.bind(playerMesh, "click", event => {
            let message = document.querySelector("#sendMessage").value;
            socket.emit("message", {
              to: player.id,
              from: socket.id,
              message: message
            });
          });
        }

        GameEngine.addMesh(playerMesh, player.id);

        GameEngine.scene.add(GameEngine.getMesh(player.id));
      }
      playerMesh.used = true;
      playerMesh.position.set(player.x, player.y, player.z);
      playerMesh.rotation.y = -player.angle;
      playerMesh.rotation.z = player.rotation.z;
      let flameScale = (player.velocity / 5) * 0.3;
      playerMesh.children[8].scale.set(flameScale, flameScale, flameScale);
      playerMesh.children[9].scale.set(flameScale, flameScale, flameScale);

      if (player.socketId === socket.id) {
        GameEngine.camera.position.set(
          player.x + 150 * Math.sin(player.angle),
          75,
          player.z - 150 * Math.cos(player.angle)
        );
        // GameEngine.camera.rotation.set(0, -player.angle - Math.PI / 2, 0);
        GameEngine.camera.lookAt(player.x, player.y, player.z);
        // document.querySelector("#coords").innerHTML =
        //   Math.floor(player.x / 100) +
        //   ", " +
        //   Math.floor(player.z / 100) +
        //   ", elevation: " +
        //   Math.floor(player.y);
        map.fillStyle = "#00ff00";
        map.fillRect(
          Math.floor(-player.x / 100) + 150,
          Math.floor(-player.z / 100) + 75,
          6,
          3
        );
      } else {
        map.fillStyle = "#ff0000";
        map.fillRect(
          Math.floor(-player.x / 100) + 150,
          Math.floor(-player.z / 100) + 75,
          6,
          3
        );
      }
    });
    // let localMesh = GameEngine.getMesh(localPlayer.id);
    // localMesh.position.set(localPlayer.x, localPlayer.y, localPlayer.z);
    // localMesh.rotation.y = -localPlayer.angle;
    // localMesh.rotation.z = localPlayer.rotation.z;
    Object.keys(GameEngine.meshes).forEach(key => {
      const mesh = GameEngine.meshes[key];
      if (!mesh.used) {
        console.log("removing mesh", key);
        GameEngine.scene.remove(mesh);
        mesh.traverse(mesh2 => {
          if (mesh2.geometry) {
            mesh2.geometry.dispose();
          }
        });
        delete GameEngine.meshes[key];
      }
    });
  }
});

function limit(val, min, max) {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}
function flicker(scale) {
  let delta = (1 / 10) * 0.3;
  let randDelt = getRandomInt(0, 1) == 0 ? -delta : delta;
  return limit(scale + randDelt, scale - delta, scale + delta);
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
