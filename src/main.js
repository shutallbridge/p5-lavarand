/**
 * Name: p5-lavarand
 * Author: Shu Takahashi
 * Repository: https://github.com/shutallbridge/p5-lavarand
 * License: MIT
 *
 * # Overview of How This Program Works
 *
 * Instances of the `Circle` class roam around the canvas mimicking the movements of blobs of
 * lava. To connect and morph the circles together to form blobs, the program calculates how
 * much the circles overlap each other for a given point. Where many circles overlap, contours
 * are drawn on the canvas to form a blob. This sequence is orchestrated by several different
 * classes as listed below:
 *
 *   - `Canvas`
 *   - `Circle`
 *   - `MarchingSquareGrid`
 *   - `BasePoint` (or its inherited variant)
 *   - `BaseCell` (or its inherited variant)
 *   - `DotGridWall`
 *   - `CryptoGridWall`
 *
 * The `Circle` class has the following main functions:
 *   - Store information of a particular circle (e.g. position, velocity, radius).
 *   - Update this information for each frame.
 *
 * The `MarchingSquareGrid` class has the following main functions:
 *   - Store information of a grid consisting of *points* and *cells*.
 *   - Update the information for each point and cell for each frame.
 *   - Each point stores information such as its position and the value that represents how much
 *     circles overlap at that particular point (known as the density field).
 *   - The shape of this data for a point is determined by the `BasePoint` class or its inherited
 *     variants (this is a one-to-many aggregation relationship).
 *   - Four points form a *cell*. Each cell can store information as well determined by the
 *     `BaseCell` class or its variants (one-to-many aggregation relationship).
 *
 * The `DotGridWall` and `CryptoGridWall` has the following main functions:
 *   - Based on the information (e.g. density field and position) stored in the grid, paint the
 *     contours onto the canvas.
 *   - The two classes differ in the visual style
 *
 * The UML diagram below illustrates the relationship between the different classes:
 *
 *                                                                    +----------------------+
 *  +----------------+                                                |                      |
 *  |                |             +--------------------+             | BasePoint            |
 *  | DotGridWall    | Inheritance |                    | Aggregation | (or inherited class) |
 *  |                +------------>|                    |<>-----------+                      |
 *  +----------------+             |                    |             +----------------------+
 *                                 | MarchingSquareGrid |
 *  +----------------+             |                    |             +----------------------+
 *  |                +------------>|                    |<>-----------+                      |
 *  | CryptoGridWall | Inheritance |                    | Aggregation | BaseCell             |
 *  |                |             +--------------------+             | (or inherited class) |
 *  +----------------+                                                |                      |
 *                                                                    +----------------------+
 *
 * Note: This diagram was created with https://asciiflow.com/
 *
 * # Programming Principles
 *
 * - Separation of concern
 * - Multi-paradigm (OOP and functional)
 * - Pure functions
 * - Scoping (avoid global/window variables)
 * - Avoid hasty abstractions (AHA)
 *
 * # Suggested Order of File Reading to Understand the Program
 *
 *   - main.js (this explanation)
 *   - helpers.js
 *   - circle.js
 *   - density-field.js
 *   - marching-square-grid.js
 *   - crypto-grid-wall.js
 *   - dot-grid-wall.js
 *   - canvas.js
 *   - dialog.js
 *
 */

const canvas = new Canvas({
  style: "dotGrid",
  circleNum: { default: 4, sm: 6, md: 8, lg: 10 },
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
