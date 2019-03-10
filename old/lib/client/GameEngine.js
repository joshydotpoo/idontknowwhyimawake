let GameEngine = {
  scene: null,
  renderer: null,
  camera: null,
  objects: null,
  initialized: false,
  init: function() {
    console.log("initializing game engine");
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;
    GameEngine.scene = new THREE.Scene();
    GameEngine.scene.background = new THREE.Color(0x000000);
    GameEngine.camera = new THREE.PerspectiveCamera(
      75,
      WIDTH / HEIGHT,
      0.1,
      1000
    );
    GameEngine.renderer = new THREE.WebGLRenderer();
    GameEngine.renderer.setSize(WIDTH, HEIGHT);
    GameEngine.camera.position.set(0, 150, -150);
    GameEngine.camera.lookAt(0, 0, 0);
    GameEngine.objects = {};
    GameEngine.addLight();
    GameEngine.addGrid();
    GameEngine.initialized = true;
    window.addEventListener("resize", GameEngine.resizeWindow, false);
    window.onload = () => {
      document.body.appendChild(GameEngine.renderer.domElement);
    };
  },
  addLight: function() {
    let hemisphereLight, shadowLight;
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
    shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
    shadowLight.position.set(150, 350, 350);
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
    var size = 100000;
    var divisions = 1000;
    var gridHelper = new THREE.GridHelper(
      size,
      divisions,
      new THREE.Color(0xf5f5f5),
      new THREE.Color(0xf5f5f5)
    );
    GameEngine.scene.add(gridHelper);
    GameEngine.scene.fog = new THREE.FogExp2(0xf5f5f5, 0.002);
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
      GameEngine.objects[meshId] = mesh;
      GameEngine.scene.add(mesh);
      GameEngine.objects[meshId].position.set(0, 0, 0);
    }
  },
  run: function() {
    requestAnimationFrame(GameEngine.run);
    GameEngine.renderer.render(GameEngine.scene, GameEngine.camera);
  },
  follow: null
};
//
// function GameEngine() {
//   this.scene = null;
//   this.renderer = null;
//   this.camera = null;
//   this.objects = null;
//   this.initialized = false;
//   this.init();
// }
// GameEngine.prototype.init = function() {};
// GameEngine.prototype.addLight = function(scene) {
//   let hemisphereLight, shadowLight;
//   hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
//   shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
//   shadowLight.position.set(150, 350, 350);
//   shadowLight.castShadow = true;
//   shadowLight.shadow.camera.left = -400;
//   shadowLight.shadow.camera.right = 400;
//   shadowLight.shadow.camera.top = 400;
//   shadowLight.shadow.camera.bottom = -400;
//   shadowLight.shadow.camera.near = 1;
//   shadowLight.shadow.camera.far = 1000;
//   shadowLight.shadow.mapSize.width = 2048;
//   shadowLight.shadow.mapSize.height = 2048;
//   scene.add(hemisphereLight);
//   scene.add(shadowLight);
// };
// GameEngine.prototype.addGrid = function(scene) {
//   var size = 100000;
//   var divisions = 1000;
//   var gridHelper = new THREE.GridHelper(
//     size,
//     divisions,
//     new THREE.Color(0xf5f5f5),
//     new THREE.Color(0xf5f5f5)
//   );
//   scene.add(gridHelper);
//   scene.fog = new THREE.FogExp2(0xf5f5f5, 0.002);
// };
// GameEngine.prototype.resizeWindow = function() {
//   // update height and width of the renderer and the camera
//   let HEIGHT = window.innerHeight;
//   let WIDTH = window.innerWidth;
//   this.renderer.setSize(WIDTH, HEIGHT);
//   this.camera.aspect = WIDTH / HEIGHT;
//   this.camera.updateProjectionMatrix();
// };
// GameEngine.prototype.run = () => {
//   requestAnimationFrame(GameEngine.prototype.run);
//   if (this.controls != undefined) this.controls.update();
//   this.renderer.render(this.scene, this.camera);
// };
// GameEngine.prototype.addMesh = function(mesh, id) {
//   this.objects[id] = mesh;
//
//   this.scene.add(mesh);
//   this.objects[id].position.set(0, 0, 0);
// };
// GameEngine.prototype.addOrbitControls = function() {
//   this.controls = new THREE.OrbitControls(this.camera);
//   this.controls.update();
// };
