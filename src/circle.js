class Circle {
  /**
   * Each circle has a position (`posX` and `posY`), `radius`, velocity (`velX` and `velY`),
   * and the rate at which the radius is increasing or decreasing (`velRadius`)
   */
  constructor(posX, posY, radius, velX, velY, velRadius) {
    this.posX = posX;
    this.posY = posY;
    this.radius = radius;
    this.velX = velX;
    this.velY = velY;
    this.velRadius = velRadius;
  }

  /**
   * This is a handy shortcut for instantiating this class of a random size in a random
   * coordinate. The arguments `boundaryWidth` and `boundaryHeight` are used to define the
   * boundary in which a circle is instantiated at a random location. `minRadius` is the
   * minimum radius of the circle while `maxRadius` is the maximum radius of the circle.
   * This function can be called without an instance of the class and it returns an instance
   * of this class.
   *
   * This method is used at the beginning of the program (or after resizing) to create
   * lava blobs at random locations on the canvas.
   */
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

  /**
   * This is similar to `spawnRandom` as it also provides a shortcut for instantiating this
   * class. However, the position in which a circle is instantiated is specified (`posX` and
   * `posY`). When instantiated, the circle will be growing by default starting from the radius
   * specified by `startRadius`.
   *
   * This method is invoked when a user begins to press down their mouse with a left click.
   * It creates an interaction where users can add more lava blobs to the canvas.
   */
  static spawnStationaryGrowth(posX, posY, startRadius, velRadius = 0.4) {
    return new Circle(posX, posY, startRadius, 0, 0, velRadius);
  }

  /**
   * This compliments the `spawnStationaryGrowth` method. It stops the circle's growth
   * and gives an initial velocity in the downwards direction.
   *
   * This method is invoked when a user releases their mouse after a long held click.
   */
  stopStationaryGrowth() {
    this.velRadius = 0;
    this.velY = -1;
  }

  /**
   * This method checks whether the circle is within a given boundary or not. It's used
   * after the canvas is resized to remove circles that are no longer in the canvas.
   */
  isWithinBoundary(boundaryWidth, boundaryHeight) {
    return this.posX <= boundaryWidth && this.posY <= boundaryHeight;
  }

  /**
   * This method is invoked for each frame and updates the circle's position, velocity
   * and radius. The circle sways randomly from left to right while moving up or down at
   * a constant velocity.
   */
  move(boundaryWidth, boundaryHeight) {
    // A random value between -0.5 and 0.5 is added to the velocity in the horizontal
    // direction to give a swaying effect. Multiplying this velocity by 0.9 helps to
    // dampen the movement to prevent it from becoming too erratic.
    const newVelX = (this.velX + random(-0.5, 0.5)) * 0.9;
    this.velX = newVelX;

    // Detect collision with the bounds of the canvas and reverse its velocity
    if (this.posX >= boundaryWidth || this.posX < 0) {
      this.velX *= -1;
    }
    if (this.posY >= boundaryHeight || this.posY < 0) {
      this.velY *= -1;
    }

    // Position in the next frame is determined by adding the velocity to its current position
    this.posX += this.velX;
    this.posY += this.velY;

    // Likewise, the radius in the next frame is determined by adding the velocity of the radius
    // to the current radius
    this.radius += this.velRadius;
  }

  /**
   * This method paints the circle onto the canvas.
   *
   * This method is used for debugging only. The actual contours of the lava blobs are painted
   * either by the `CryptoGridWall` class or the `DotGridWall` class.
   */
  paint() {
    safeCommit(() => {
      noFill();
      stroke("red");
      ellipse(this.posX, this.posY, this.radius * 2);
    });
  }
}
