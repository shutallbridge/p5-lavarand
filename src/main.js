let canvas = new Canvas({ style: "cryptoGrid", circleNum: 10 });

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
