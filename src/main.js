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

const circleNum = 5;

const circles = [];
let marchingSquareGrid;
let dotGridWall;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // frameRate(10);

  Array.from({ length: circleNum }).forEach(() => {
    circles.push(new Circle());
  });

  marchingSquareGrid = new MarchingSquareGrid(width, height, 20);

  dotGridWall = new DotGridWall();
}

function draw() {
  background(255);

  circles.forEach((circle) => {
    circle.move();
    circle.paint();
  });

  marchingSquareGrid.computeDensityField(circles);
  marchingSquareGrid.commit();

  dotGridWall.commit(marchingSquareGrid);
}

let latestCircle;

function mousePressed() {
  latestCircle = new Circle(mouseX, mouseY, 10, 0, 0, 0.2);
  circles.push(latestCircle);
}

function mouseReleased() {
  latestCircle.deltaX = 1;
  latestCircle.deltaY = 1;
  latestCircle.deltaRadius = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  marchingSquareGrid.updateGridSize(width, height);
}
