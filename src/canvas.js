class Canvas {
  constructor(args) {
    const {
      style = "dotGrid",
      circleNum = 8,
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
    this.circleNum = circleNum;
    this.cellSize = cellSize;
    this.hoverRadius = hoverRadius;
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;
    this.circles = [];
    this.latestCircle = null;
    this.dotGridWall = null;
    this.cryptoGridWall = null;
  }

  updateCanvasVariables(args) {
    Object.assign(this, args);
  }

  setup() {
    createCanvas(this.width, this.height);

    Array.from({ length: this.circleNum }).forEach(() => {
      this.circles.push(
        Circle.spawnRandom(
          this.width,
          this.height,
          this.minRadius,
          this.maxRadius
        )
      );
    });

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

    // source: https://stackoverflow.com/questions/60853612/p5-js-on-right-mouse-click-shows-the-browser-context-menu-and-not-the-drawing-fu
    for (let element of document.getElementsByClassName("p5Canvas")) {
      element.addEventListener("contextmenu", (e) => e.preventDefault());
    }
  }

  draw() {
    this.circles.forEach((circle) => {
      circle.move(width, height);
    });

    if (this.style === "dotGrid") {
      this.dotGridWall.mouseHover(this.mouseX, this.mouseY);
      this.dotGridWall.marchingSquare(this.circles);
      this.dotGridWall.paint();
    }

    if (this.style === "cryptoGrid") {
      this.cryptoGridWall.mouseHover(this.mouseX, this.mouseY);
      this.cryptoGridWall.marchingSquare(this.circles);
      this.cryptoGridWall.crypto(this.frameCount);
      this.cryptoGridWall.paint();
    }
  }

  mousePressed() {
    if (this.mouseButton === RIGHT) {
      this.style = this.style === "dotGrid" ? "cryptoGrid" : "dotGrid";
    }

    if (this.mouseButton === LEFT) {
      this.latestCircle = Circle.spawnStationaryGrowth(
        this.mouseX,
        this.mouseY,
        40
      );
      this.circles.push(this.latestCircle);
    }
  }

  mouseReleased() {
    if (!this.latestCircle) {
      return;
    }
    this.latestCircle.stopStationaryGrowth();
  }

  windowResized() {
    resizeCanvas(this.width, this.height);

    this.dotGridWall.updateGridSize(this.width, this.height);
    this.cryptoGridWall.updateGridSize(this.width, this.height);

    this.circles = this.circles.filter((circle) => {
      return circle.isWithinBoundary(this.width, this.height);
    });
  }
}
