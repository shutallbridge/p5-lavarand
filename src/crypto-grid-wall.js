class CryptoGridPoint extends BasePoint {
  constructor(posX, posY, columnIndex, rowIndex) {
    super(posX, posY, columnIndex, rowIndex);

    this.letter = "";
  }

  getLetter() {
    return this.letter;
  }

  setLetter(letter) {
    this.letter = letter;
  }
}

const characters =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

class CryptoGridWall extends MarchingSquareGridFactory({
  PointClass: CryptoGridPoint,
}) {
  constructor(gridWidth, gridHeight, cellSize, hoverRadius) {
    super(gridWidth, gridHeight, cellSize, hoverRadius);
  }

  crypto(frameCount) {
    if (frameCount % 4 !== 0) {
      return;
    }

    this.forEachGridPoint((gridPoint) => {
      const randomLetter = characters.charAt(random(0, characters.length - 1));
      gridPoint.setLetter(randomLetter);
    });
  }

  paint() {
    background(0);

    this.forEachGridPoint((gridPoint) => {
      const densityField =
        gridPoint.getCircleDensityField() + gridPoint.getMouseDensityField();

      const lowerTrim = 140;

      const foregroundAlpha = DensityField.mapToGrayScale(
        densityField,
        1,
        2,
        lowerTrim,
        255
      );

      const backgroundAlpha = 50;

      const alphaValue =
        (foregroundAlpha > lowerTrim ? foregroundAlpha : backgroundAlpha) * 1.5;

      const { posX, posY } = gridPoint.getGridInfo();

      safePaint(() => {
        fill(22, 100, 8, alphaValue);
        stroke(22, 100, 8, alphaValue);
        strokeWeight(1.5);
        text(gridPoint.getLetter(), posX, posY);
      });
    });
  }
}
