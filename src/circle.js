// eslint-disable-next-line no-unused-vars
class Circle {
  constructor(
    posX = random(0, width),
    posY = random(0, height),
    radius = random(20, 80),
    deltaX = 1,
    deltaY = 1,
    deltaRadius = 0
  ) {
    this.posX = posX;
    this.posY = posY;
    this.radius = radius;
    this.deltaX = deltaX;
    this.deltaY = deltaY;
    this.deltaRadius = deltaRadius;
  }

  move() {
    if (this.posX >= width || this.posX < 0) {
      this.deltaX *= -1;
    }
    if (this.posY >= height || this.posY < 0) {
      this.deltaY *= -1;
    }
    this.posX += this.deltaX;
    this.posY += this.deltaY;
    this.radius += this.deltaRadius;
  }

  paint() {
    push();
    noFill();
    stroke("red");
    ellipse(this.posX, this.posY, this.radius * 2);
    pop();
  }
}
