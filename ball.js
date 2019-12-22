function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

class Ball {
  constructor(brain) {
    this.x = 64;
    this.y = height / 2;
    this.r = 12;
    this.gravity = 0.8;
    this.lift = -12;
    this.velocity = 0;
    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    } else {
      this.brain = new NeuralNetwork(5, 8, 2);
    }
    this.score = 1;
    this.fitness = 0;
  }

  copy() {
    return new Ball(this.brain);
  }

  show() {
    image(ballSprite, this.x, this.y, this.r * 2, this.r * 2);
  }
  
  think(pipes) {
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let diff = pipes[i].x - this.x;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = pipes[i];
      }
    }

    if (closest != null) {
      let inputs = [];
      inputs[0] = map(closest.x, this.x, width, 0, 1);
      inputs[1] = map(closest.top, 0, height, 0, 1);
      inputs[2] = map(closest.bottom, 0, height, 0, 1);
      inputs[3] = map(this.y, 0, height, 0, 1);
      inputs[4] = map(this.velocity, -5, 5, 0, 1);

      let action = this.brain.predict(inputs);
      if (action[1] > action[0]) {
        this.up();
      }
    }
  }

  up() {
    this.velocity += this.lift;
  }

  bottomTop() {
    return (this.y > height || this.y < 0);
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    this.score++;
  }
}
