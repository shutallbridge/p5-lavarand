/**
 * The `Canvas` class aggregates all the classes necessary to paint the laba blobs on to the
 * canvas:
 *
 * - Has `Circle` (one-to-many in an array, array of instances of `Circle`)
 * - Has a `DotGridWall` (one-to-one)
 * - Has a `CryptoGridWall` (one-to-one)
 *
 * In addition to aggregating the classes, it also keeps track of configuration variables that
 * determine the characteristics and aesthetics of the lava blobs. This class also keeps track
 * of canvas variables made available to the window scope by the p5js library.
 */
class Canvas {
  constructor(args) {
    // Destructure the named arguments (passed in as an object), and give a default value in case
    // they were not specified.
    const {
      style = "dotGrid",
      circleNum = { default: 4, sm: 6, md: 8, lg: 10 },
      cellSize = 20,
      hoverRadius = 40,
      minRadius = 40,
      maxRadius = 110,
    } = args ?? {};

    // canvas variables
    this.width = 0;
    this.height = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.frameCount = 0;
    this.mouseButton = "";

    // style is either "dotGrid" or "cryptoGrid"
    this.style = style;

    // Minimum number of roaming circles the canvas should have at different breakpoint sizes
    this.circleNum = circleNum;

    // Size of each cell that makes up the marching square grid
    this.cellSize = cellSize;

    // Radius of the circle (more accurately the underlying circle that determine the contours)
    // that follows the users's mouse
    this.hoverRadius = hoverRadius;

    // Minimum and maximum radius of the roaming circles
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;

    // An array to store instances of the roaming circles (`Circle` instances)
    this.circles = [];

    // A pointer to keep the last `Circle` that was drawn by the user
    this.latestCircle = null;

    // Pointers to the instances of the two classes that paint to the canvas (`DotGridWall` and
    // `CryptoGridWall`)
    this.dotGridWall = null;
    this.cryptoGridWall = null;
  }

  /**
   * This is a method for updating the canvas variables. The canvas variables can be updated
   * using an object as the argument.
   *
   * Example:
   * canvas.updateCanvasVariables({ width: 500, height: 500 })
   */
  updateCanvasVariables(args) {
    Object.assign(this, args);
  }

  /**
   * This method is for setting up the canvas. It creates the p5js canvas, instantiates the roaming
   * circles spawned at random locations, and instantiates the two painting classes `DotGridWall`
   * and `CryptoGridWall`.
   */
  setup() {
    createCanvas(this.width, this.height);

    // Instantiate the roaming circles. The number of circles is determined by the width of the
    // canvas. `Circle.spawnRandom` instantiates a circle at a random location within a given
    // canvas width and height.
    Array.from({ length: breakPointValue(this.circleNum, this.width) }).forEach(
      () => {
        this.circles.push(
          Circle.spawnRandom(
            this.width,
            this.height,
            this.minRadius,
            this.maxRadius
          )
        );
      }
    );

    this.dotGridWall = new DotGridWall(
      this.width,
      this.height,
      this.cellSize,
      this.hoverRadius
    );
    this.cryptoGridWall = new CryptoGridWall(
      this.width,
      this.height,
      this.cellSize,
      this.hoverRadius
    );

    // A right click from the user is used to switch the style of the lava blobs (see
    // `mousePressed`). But this by default opens the context menu. A question about how to disable
    // this context menu was asked on StackOverflow and used in this part of the code.
    //
    // source: https://stackoverflow.com/questions/60853612/p5-js-on-right-mouse-click-shows-the-browser-context-menu-and-not-the-drawing-fu
    for (let element of document.getElementsByClassName("p5Canvas")) {
      element.addEventListener("contextmenu", (e) => e.preventDefault());
    }
  }

  /**
   * This method is run every frame to move the roaming circles and paint the canvas according to
   * the set aesthetic style. If statements are used to update and paint the appropriate canvas
   * painting classes.
   */
  draw() {
    // Iterate through the roaming circles and move each circle
    this.circles.forEach((circle) => {
      circle.move(width, height);
    });

    if (this.style === "dotGrid") {
      // Calculate the density field value from the circle that follows the user's mouse
      this.dotGridWall.mouseHover(this.mouseX, this.mouseY);

      // Calculate the density field values from the roaming circles
      this.dotGridWall.marchingSquare(this.circles);

      // Paint the canvas
      this.dotGridWall.paint();
    }

    if (this.style === "cryptoGrid") {
      this.cryptoGridWall.mouseHover(this.mouseX, this.mouseY);
      this.cryptoGridWall.marchingSquare(this.circles);

      // Assign a random letter to each point in the grid for the cryptographic aesthetic
      this.cryptoGridWall.crypto(this.frameCount);
      this.cryptoGridWall.paint();
    }
  }

  /**
   * This method is invoked whenever a user left clicks or right clicks. A left click spawns a new
   * lava blob on to the canvas, while a right click changes the aesthetic style.
   */
  mousePressed() {
    // The style should change only if the click was a right click
    if (this.mouseButton === RIGHT) {
      // If the current style is "dotGrid", then change the style to "cryptoGrid". Otherwise, if
      // the current style is "cryptoGrid", change the style to "dotGrid"
      this.style = this.style === "dotGrid" ? "cryptoGrid" : "dotGrid";
    }

    // A new circle should spawn only if the click was a left click
    if (this.mouseButton === LEFT) {
      // Instantiate the `Circle` class at the current mouse coordinates. This instance is kept
      // with the pointer `latestCircle` as it needs to be accessed again to stop the circle
      // from growing its radius.
      this.latestCircle = Circle.spawnStationaryGrowth(
        this.mouseX,
        this.mouseY,
        40
      );
      this.circles.push(this.latestCircle);
    }
  }

  /**
   * This method is invoked once the user clicks and lets go. In this case, it should stop the
   * last manually added circle from growing in radius any further.
   */
  mouseReleased() {
    // Check that there is a circle that was last generated by the user. If not, return early.
    if (!this.latestCircle) {
      return;
    }

    // Stop the last circle's radius growth and give it an initial velocity.
    this.latestCircle.stopStationaryGrowth();
  }

  /**
   * This method is invoked whenever the canvas is resized. Whenever the canvas is resized,
   * the marching square grids need to be updated in its dimensions. Circles that are no longer
   * in the canvas are removed and if necessary new roaming circles are added to avoid all the
   * roaming circles from disappearing.
   */
  windowResized() {
    // Resize the p5js canvas
    resizeCanvas(this.width, this.height);

    // Update the marching square grids with the new width and height
    this.dotGridWall.updateGridSize(this.width, this.height);
    this.cryptoGridWall.updateGridSize(this.width, this.height);

    // Find the roaming circles that are still within the canvas. The `Array.prototype.filter`
    // method iterates through an array, calls a callback function, and removes items where the
    // callback function returns false (items that return true are kept).
    const circlesWithinCanvas = this.circles.filter((circle) => {
      // Keep the circle if it's still within the canvas. The following method returns a boolean.
      return circle.isWithinBoundary(this.width, this.height);
    });

    // Calculate the number of circles to add after resizing. `Math.max` ensures that this number
    // is greater than or equal to 0 (arrays of negative lengths cannot be created)
    const numCirclesToAdd = Math.max(
      0,
      // The number of circles to add is calculated by:
      // (number of ideal circles to have at this canvas width) - (current number of circles)
      breakPointValue(this.circleNum, this.width) - this.circles.length
    );

    // Instantiate the new circles to be added into an array.
    const newCircles = Array.from({ length: numCirclesToAdd }).map(() =>
      Circle.spawnRandom(
        this.width,
        this.height,
        this.minRadius,
        this.maxRadius
      )
    );

    // Merge the filtered circles still in the canvas with the new circles that are to be added.
    this.circles = [...circlesWithinCanvas, ...newCircles];
  }
}
