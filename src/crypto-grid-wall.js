const characters =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// eslint-disable-next-line no-unused-vars
class CryptoGridWall {
  constructor(marchingSquareGrid) {
    this.marchingSquareGrid = marchingSquareGrid;
  }

  init() {
    this.marchingSquareGrid.updateCellSize(20);
  }

  commit() {
    background(0);

    this.marchingSquareGrid.forEachGridPoint((gridPoint) => {
      safeCommit(() => {
        const fillGray = this.mapDensityFieldToGrayScale(
          gridPoint.densityField,
          1.5
        );
        fill(fillGray);
        stroke(0);
        strokeWeight(1);
        text(
          characters.charAt(random(0, characters.length - 1)),
          gridPoint.posX,
          gridPoint.posY
        );
      });
    });
  }

  mapDensityFieldToGrayScale(value, threshold) {
    if (value < 1) {
      return 70;
    } else if (value < threshold) {
      return map(value, 1, threshold, 100, 255);
    } else {
      return 255;
    }
  }
}
