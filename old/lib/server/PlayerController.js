class PlayerController {
  constructor() {
    this.state = {
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
  }
  update(data) {
    this.state = data;
  }
}
module.exports = PlayerController;
