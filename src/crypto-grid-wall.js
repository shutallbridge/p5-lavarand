/**
 * This class extends the `BasePoint` class to hold extra information that are relevant only to
 * the `CryptoGridWall` class. In addition to the coordinates of each point and the density field
 * values, each point in the `CryptoGridWall` class needs to be assigned a random character
 * that will then be painted on to the canvas.
 */
class CryptoGridPoint extends BasePoint {
  constructor(posX, posY, columnIndex, rowIndex) {
    super(posX, posY, columnIndex, rowIndex);

    // Variable for holding a random character
    this.letter = "";
  }

  getLetter() {
    return this.letter;
  }

  setLetter(letter) {
    this.letter = letter;
  }
}

// This string is used to pick a random character.
const characters =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * `CryptoGridWall` inherits the customized `MarchingSquareGrid` class. The base class already has the
 * functionalities to keep information about the marching square grid, as well as to calculate the density
 * field values required to paint the lava blobs. This class adds functionalities to assign a random letter
 * to each grid point, and to paint the canvas in a cryptographic aesthetic.
 */
class CryptoGridWall extends MarchingSquareGridFactory({
  PointClass: CryptoGridPoint,
}) {
  constructor(gridWidth, gridHeight, cellSize, hoverRadius) {
    // This calls the constructor of the base class (`MarchingSquareGrid`)
    super(gridWidth, gridHeight, cellSize, hoverRadius);
  }

  /**
   * This method assigns a random character to each grid necessary for the cryptographic aesthetic. It is called
   * for every frame, but random characters are assigned once in every four consecutive frames. This was necessary
   * as the cryptographic letters kept on changing too fast.
   */
  crypto(frameCount) {
    // Makes the rest of the function run only once in four consecutive frames.
    if (frameCount % 4 !== 0) {
      return;
    }

    // `forEachGridPoint` is available from the inherited base class `MarchingSquareGrid`
    this.forEachGridPoint((gridPoint) => {
      // Pick a random character from the `characters` string variable
      const randomLetter = characters.charAt(random(0, characters.length - 1));
      gridPoint.setLetter(randomLetter);
    });
  }

  /**
   * This method paints the canvas with a grid of letters that differ in the opacity. The different opacity of each
   * letter forms the lava blobs.
   */
  paint() {
    background(0);

    this.forEachGridPoint((gridPoint) => {
      // The density field value determines the opacity of each letter. This would be the sum of both the density field
      // value of the circles roaming around the canvas, and the circle that follows the users's mouse.
      const densityField =
        gridPoint.getCircleDensityField() + gridPoint.getMouseDensityField();

      const lowerTrim = 140;

      // Map the density field value to the alpha value between 140 and 255. If this value is greater than 140, the point
      // is assumed to form a contour of a lava blob. If the value is 140, the point is assumed to be the background.
      const foregroundAlpha = DensityField.mapToGrayScale(
        densityField,
        1,
        2,
        lowerTrim,
        255
      );

      // This is the alpha value for letters that do not form a contour of a lava blob.
      const backgroundAlpha = 30;

      // If the `foregroundAlpha` value is greater than 140 (`lowerTrim`), the final alpha value should be the same value.
      // Otherwise, if the value is less than or equal to 140, the final alpha value should be 30 (`backgroundAlpha`).
      // The final alpha value is increased by 50% to give more opacity.
      const alphaValue =
        (foregroundAlpha > lowerTrim ? foregroundAlpha : backgroundAlpha) * 1.5;

      // Get the coordinates for the point currently being iterated, so it can be painted to the canvas.
      const { posX, posY } = gridPoint.getGridInfo();

      safePaint(() => {
        // Both fill and stroke colors need to be changed.
        fill(22, 100, 8, alphaValue);
        stroke(22, 100, 8, alphaValue);

        // This changes the font weight of the letters.
        strokeWeight(1.5);

        // Paint the letter at its coordinates.
        text(gridPoint.getLetter(), posX, posY);
      });
    });
  }
}
