const canvas = new Canvas({
  style: "dotGrid",
  circleNum: 10,
  cellSize: 20,
  hoverRadius: 40,
  minRadius: 40,
  maxRadius: 110,
});

function setup() {
  canvas.updateCanvasVariables({ width: windowWidth, height: windowHeight });
  canvas.setup();
}

function draw() {
  canvas.updateCanvasVariables({ width, height, mouseX, mouseY, frameCount });
  canvas.draw();
}

function mousePressed() {
  canvas.updateCanvasVariables({ mouseButton });
  canvas.mousePressed();
}

function mouseReleased() {
  canvas.updateCanvasVariables({ mouseButton });
  canvas.mouseReleased();
}

function windowResized() {
  canvas.updateCanvasVariables({ width: windowWidth, height: windowHeight });
  canvas.windowResized();
}
