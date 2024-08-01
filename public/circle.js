// eslint-disable-next-line no-unused-vars
class Circle {
  constructor(posX, posY, radius, velX, velY, velRadius) {
    this.posX = posX;
    this.posY = posY;
    this.radius = radius;
    this.velX = velX;
    this.velY = velY;
    this.velRadius = velRadius;
  }

  static spawnRandom(boundaryWidth, boundaryHeight, minRadius, maxRadius) {
    return new Circle(
      random(0, boundaryWidth),
      random(0, boundaryHeight),
      random(minRadius, maxRadius),
      0,
      -1,
      0
    );
  }

  static spawnStationaryGrowth(posX, posY, startRadius, velRadius = 0.4) {
    return new Circle(posX, posY, startRadius, 0, 0, velRadius);
  }

  stopStationaryGrowth() {
    this.velRadius = 0;
    this.velY = -1;
  }

  isWithinBoundary(boundaryWidth, boundaryHeight) {
    return this.posX <= boundaryWidth && this.posY <= boundaryHeight;
  }

  move(boundaryWidth, boundaryHeight) {
    const newVelX = (this.velX + random(-0.5, 0.5)) * 0.9;
    this.velX = newVelX;

    if (this.posX >= boundaryWidth || this.posX < 0) {
      this.velX *= -1;
    }
    if (this.posY >= boundaryHeight || this.posY < 0) {
      this.velY *= -1;
    }

    this.posX += this.velX;
    this.posY += this.velY;
    this.radius += this.velRadius;
  }

  paint() {
    safeCommit(() => {
      noFill();
      stroke("red");
      ellipse(this.posX, this.posY, this.radius * 2);
    });
  }
}
