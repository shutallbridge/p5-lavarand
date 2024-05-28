/*
Terminology:

1. Paint (memory level)
2. Commit (primitive level)
*/

/*

  gl style: "grid" | "crypto"
  gl circles
  gl msGrid
  gl gridBg
  gl cryptoBh

  -setup-  

  -draw-

  circles.forEach(circle => circle.move())
  msGrid.computeFieldDensity(circles)
  
  if (style === "grid") {
    gridBg.commit(msGrid, circles)
  }
  if (style === "crypto") {
    cyrptoBg.commit(msGrid, circles)
  }

  -switch style-

  style = newStyle
  if (style === "grid") {
    gridBg.init(msGrid, circles)
  }
  if (style === "crypto") {
    cryptoBg.init(msGrid, circles)
  }

  */

const circleNum = 8;

let circles = [];
let marchingSquareGrid;
let dotGridWall;

function setup() {
  createCanvas(windowWidth, windowHeight);

  Array.from({ length: circleNum }).forEach(() => {
    circles.push(Circle.spawnRandom(width, height));
  });

  marchingSquareGrid = new MarchingSquareGrid(width, height, 20);

  dotGridWall = new DotGridWall(marchingSquareGrid);
  dotGridWall.init();

  // cryptoGridWall = new CryptoGridWall(marchingSquareGrid);
  // cryptoGridWall.init();
}

function draw() {
  circles.forEach((circle) => {
    circle.move(width, height);
    // circle.paint();
  });

  marchingSquareGrid.computeDensityField(circles);
  // marchingSquareGrid.commit();

  dotGridWall.commit();

  // cryptoGridWall.commit();

  // noLoop();
}

let latestCircle;

function mousePressed() {
  if (mouseButton !== LEFT) {
    return;
  }

  latestCircle = Circle.spawnStationaryGrowth(mouseX, mouseY);
  circles.push(latestCircle);
}

function mouseReleased() {
  latestCircle.stopStationaryGrowth();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  marchingSquareGrid.updateGridSize(width, height);

  const newCircles = circles.filter((circle) => {
    return circle.isWithinBoundary(width, height);
  });
  circles = newCircles;
}
