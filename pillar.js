class Pipe {
  constructor() {
    let spacing = 125;
    let centery = random(spacing, height - spacing);
    this.top = centery - spacing / 2;
    this.bottom = height - (centery + spacing / 2);
    this.x = width;
    this.w = 80;
    this.speed = 6;
  }

  hits(ball) {
    if ((ball.y - ball.r) < this.top || (ball.y + ball.r) > (height - this.bottom)) {
      if (ball.x > this.x && ball.x < this.x + this.w) {
        return true;
      }
    }
    return false;
  }

  show() {
    image(pillarUp, this.x, 0, this.w, this.top);
    image(pillarDown, this.x, height - this.bottom, this.w, this.bottom);
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }
}
