let MeshDictionary = {};
MeshDictionary.spaceships = {};
MeshDictionary.planets = {};
let Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  pink: 0xf5986e,
  brownDark: 0x23190f,
  blue: 0x68c3c0,
  black: 0x000000
};
MeshDictionary.flame = function() {
  let flame = new THREE.Object3D();
  var geometry = new THREE.ConeGeometry(4, 30, 32, 25, 15);
  var material = new THREE.MeshBasicMaterial({ color: Colors.red });
  var cone = new THREE.Mesh(geometry, material);
  cone.rotateX(-Math.PI / 2);
  flame.add(cone);
  console.log(flame);
  return flame;
};

MeshDictionary.spaceships.cargo = function(meshColor) {
  if (!meshColor) {
    console.log("calculating random color");
    let meshColor =
      Colors[
        Object.keys(Colors)[
          Math.floor(Math.random() * Object.keys(Colors).length)
        ]
      ];
  }
  console.log(meshColor);
  this.mesh = new THREE.Object3D();
  // Create the Cargo Bay
  let cargoBayGeo = new THREE.BoxGeometry(4, 4, 5, 1, 1, 1);
  let cargoBayMat = new THREE.MeshPhongMaterial({
    color: meshColor,
    flatShading: true
  });
  let cargoBay = new THREE.Mesh(cargoBayGeo, cargoBayMat);
  cargoBay.castShadow = true;
  cargoBay.receiveShadow = true;
  cargoBay.position.set(0, 0, -2.5);
  this.mesh.add(cargoBay);
  // Create the Cabin
  let topCabinGeo = new THREE.BoxGeometry(4, 2, 2, 1, 1, 1);
  let topCabinMat = new THREE.MeshPhongMaterial({
    color: Colors.black,
    flatShading: true
  });
  let topCabin = new THREE.Mesh(topCabinGeo, topCabinMat);
  topCabin.castShadow = true;
  topCabin.receiveShadow = true;
  topCabin.position.set(0, 1, 1);
  topCabinGeo.vertices[5].y -= 0.5;
  topCabinGeo.vertices[5].z += 1;
  topCabinGeo.vertices[0].y -= 0.5;
  topCabinGeo.vertices[0].z += 1;
  topCabinGeo.vertices[2].z += 2;
  topCabinGeo.vertices[7].z += 2;
  this.mesh.add(topCabin);
  let bottomCabinGeo = new THREE.BoxGeometry(4, 2, 4, 1, 1, 1);
  let bottomCabinMat = new THREE.MeshPhongMaterial({
    color: meshColor,
    flatShading: true
  });
  let bottomCabin = new THREE.Mesh(bottomCabinGeo, bottomCabinMat);
  bottomCabin.castShadow = true;
  bottomCabin.receiveShadow = true;
  bottomCabin.position.set(0, -1, 2);
  this.mesh.add(bottomCabin);
  // Create the Tail
  let tailGeo = new THREE.BoxGeometry(4, 1, 1, 1, 1, 1);
  let tailMat = new THREE.MeshPhongMaterial({
    color: meshColor,
    flatShading: true
  });
  let tail = new THREE.Mesh(tailGeo, tailMat);
  tail.castShadow = true;
  tail.receiveShadow = true;
  tail.position.set(0, 2.5, -4.5);
  tailGeo.vertices[5].y -= 1;
  tailGeo.vertices[5].z += 1;
  tailGeo.vertices[0].y -= 1;
  tailGeo.vertices[0].z += 1;
  this.mesh.add(tail);
  // Create Right wing
  let rightWingGeo = new THREE.BoxGeometry(2, 4, 3, 1, 1, 1);
  let rightWingMat = new THREE.MeshPhongMaterial({
    color: meshColor,
    flatShading: true
  });
  let rightWing = new THREE.Mesh(rightWingGeo, rightWingMat);
  rightWing.castShadow = true;
  rightWing.receiveShadow = true;
  rightWing.position.set(-3, 0, -1.5);
  this.mesh.add(rightWing);
  rightWingGeo.vertices[4].y -= 1;
  rightWingGeo.vertices[4].z += 0.5;
  rightWingGeo.vertices[5].y -= 1;
  rightWingGeo.vertices[5].z -= 0.5;
  rightWingGeo.vertices[6].y += 1;
  rightWingGeo.vertices[6].z += 0.5;
  rightWingGeo.vertices[7].y += 1;
  rightWingGeo.vertices[7].z -= 0.5;
  // Create Left Wing
  let leftWingGeo = new THREE.BoxGeometry(2, 4, 3, 1, 1, 1);
  let leftWingMat = new THREE.MeshPhongMaterial({
    color: meshColor,
    flatShading: true
  });
  let leftWing = new THREE.Mesh(leftWingGeo, leftWingMat);
  leftWing.castShadow = true;
  leftWing.receiveShadow = true;
  leftWing.position.set(3, 0, -1.5);
  this.mesh.add(leftWing);
  leftWingGeo.vertices[0].y -= 1;
  leftWingGeo.vertices[0].z -= 0.5;
  leftWingGeo.vertices[1].y -= 1;
  leftWingGeo.vertices[1].z += 0.5;
  leftWingGeo.vertices[2].y += 1;
  leftWingGeo.vertices[2].z -= 0.5;
  leftWingGeo.vertices[3].y += 1;
  leftWingGeo.vertices[3].z += 0.5;
  // Create Right Engine
  let rightEngineGeo = new THREE.CylinderGeometry(2, 2.5, 4, 6);
  let rightEngineMat = new THREE.MeshPhongMaterial({
    color: meshColor,
    flatShading: true
  });
  let rightEngine = new THREE.Mesh(rightEngineGeo, rightEngineMat);
  rightEngine.castShadow = true;
  rightEngine.receiveShadow = true;
  rightEngine.position.set(-5, 0, -1.5);
  rightEngine.rotateX(Math.PI / 2);
  this.mesh.add(rightEngine);
  // Create Left Engine
  let leftEngineGeo = new THREE.CylinderGeometry(2, 2.5, 4, 6);
  let leftEngineMat = new THREE.MeshPhongMaterial({
    color: meshColor,
    flatShading: true
  });
  let leftEngine = new THREE.Mesh(leftEngineGeo, leftEngineMat);
  leftEngine.castShadow = true;
  leftEngine.receiveShadow = true;
  leftEngine.position.set(5, 0, -1.5);
  leftEngine.rotateX(Math.PI / 2);
  this.mesh.add(leftEngine);
  this.mesh.scale.set(2, 2, 2);

  let leftFlame = MeshDictionary.flame().clone();
  leftFlame.name = "left_flame";
  leftFlame.scale.set(0.3, 0.3, 0.3);
  leftFlame.position.x -= 5;
  leftFlame.position.z -= 7;
  let rightFlame = MeshDictionary.flame().clone();
  rightFlame.name = "right_flame";
  rightFlame.scale.set(0.3, 0.3, 0.3);
  rightFlame.position.x += 5;
  rightFlame.position.z -= 7;
  this.mesh.add(leftFlame);
  this.mesh.add(rightFlame);
  return this.mesh;
};
MeshDictionary.planets.origin = function() {
  let mesh = new THREE.Object3D();
  let planetGeo = new THREE.SphereGeometry(50, 32, 32);
  let planetMat = new THREE.MeshPhongMaterial({
    color: Colors.blue,
    flatShading: true
  });
  planetGeo.mergeVertices();
  let l = planetGeo.vertices.length;
  for (let i = 0; i < l; i++) {
    let v = planetGeo.vertices[i];
    let ang = Math.random() * Math.PI * 2;
    let amp = Math.random() * 2;
    v.x += Math.cos(ang) * amp;
    v.y += Math.sin(ang) * amp;
  }
  planetGeo.verticesNeedUpdate = true;
  let planet = new THREE.Mesh(planetGeo, planetMat);
  mesh.add(planet);
  return mesh;
};
