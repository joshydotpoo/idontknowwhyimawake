class ClientController {
  constructor() {
    this.shipConfig = {
      velocity: {
        max: 5,
        min: 0,
        acc: 0.1
      }
    };
    this.playerState = {
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      movement: {
        angle: 0,
        velocity: 0
      }
    };
    this.controls = {
      left: 0,
      right: 0,
      up: 0,
      down: 0
    };
  }
  keyDown(key) {
    if (key == "a") this.controls.left = 1;
    if (key == "d") this.controls.right = 1;
    if (key == "w") this.controls.up = 1;
    if (key == "s") this.controls.down = 1;
  }
  keyUp(key) {
    if (key == "a") this.controls.left = 0;
    if (key == "d") this.controls.right = 0;
    if (key == "w") this.controls.up = 0;
    if (key == "s") this.controls.down = 0;
  }
  update() {
    const turnAngle = Math.PI / 16 / 12;
    let turnDirection = this.controls.right - this.controls.left;
    this.playerState.movement.angle -= turnDirection * turnAngle;
    let movementAngle = this.playerState.movement.angle;

    let accDirection = this.controls.up - this.controls.down;
    this.playerState.movement.velocity +=
      accDirection * this.shipConfig.velocity.acc;
    let overSpeedLimit =
      Math.floor(this.playerState.movement.velocity) >
      this.shipConfig.velocity.max;
    let underSpeedLimit =
      Math.ceil(this.playerState.movement.velocity) <
      this.shipConfig.velocity.min;
    if (overSpeedLimit)
      this.playerState.movement.velocity = this.shipConfig.velocity.max;
    else if (underSpeedLimit)
      this.playerState.movement.velocity = this.shipConfig.velocity.min;

    this.playerState.position.z +=
      this.playerState.movement.velocity * Math.cos(movementAngle);
    this.playerState.position.x +=
      this.playerState.movement.velocity * Math.sin(movementAngle);

    if (turnDirection == 1) {
      this.playerState.rotation.z = Math.PI / 4;
    } else if (turnDirection == -1) {
      this.playerState.rotation.z = -Math.PI / 4;
    } else {
      this.playerState.rotation.z = 0;
    }
    this.playerState.rotation.y = this.playerState.movement.angle;
  }
}
