class DotGridWall extends MarchingSquareGridFactory() {
  constructor(gridWidth, gridHeight, cellSize, hoverRadius) {
    super(gridWidth, gridHeight, cellSize, hoverRadius);
  }

  paint() {
    background(0);

    this.forEachGridPoint((gridPoint) => {
      const lavaGray = DensityField.mapToGrayScale(
        gridPoint.getCircleDensityField(),
        1,
        1.5
      );
      const mouseGray = DensityField.mapToGrayScale(
        gridPoint.getMouseDensityField(),
        0.5,
        2
      );
      const grayValue = lavaGray > 0 ? lavaGray : mouseGray > 0 ? mouseGray : 0;

      const { posX, posY } = gridPoint.getGridInfo();

      safePaint(() => {
        stroke(grayValue);
        strokeWeight(4);
        point(posX, posY);
      });
    });

    this.forEachGridCell((gridCell) => {
      const { vertA, vertB, vertC, vertD } = gridCell.getGridInfo();

      const config = [
        DensityField.mapToBinary(vertA.getCircleDensityField()),
        DensityField.mapToBinary(vertB.getCircleDensityField()),
        DensityField.mapToBinary(vertC.getCircleDensityField()),
        DensityField.mapToBinary(vertD.getCircleDensityField()),
      ].toString();
      const { cellSize } = this;
      // prettier-ignore
      const center = { posX: vertA.posX + cellSize / 2, posY: vertA.posY + cellSize / 2 };
      // prettier-ignore
      const midA = { posX: vertA.posX + cellSize / 2, posY: vertA.posY };
      // prettier-ignore
      const midB = {posX: vertA.posX + cellSize, posY: vertA.posY + cellSize / 2}
      // prettier-ignore
      const midC = { posX: vertA.posX + cellSize / 2, posY: vertA.posY + cellSize };
      // prettier-ignore
      const midD = { posX: vertA.posX, posY: vertA.posY + cellSize / 2 }

      safePaint(() => {
        stroke(255);
        switch (config) {
          case "0,0,0,0":
          case "1,1,1,1":
            break;
          case "0,0,0,1":
          case "1,1,1,0":
            line(midD.posX, midD.posY, center.posX, center.posY);
            break;
          case "0,0,1,0":
          case "1,1,0,1":
            line(midB.posX, midB.posY, center.posX, center.posY);
            line(midC.posX, midC.posY, center.posX, center.posY);
            break;
          case "0,0,1,1":
          case "1,1,0,0":
            line(midD.posX, midD.posY, center.posX, center.posY);
            break;
          case "0,1,0,0":
          case "1,0,1,1":
            line(midA.posX, midA.posY, center.posX, center.posY);
            break;
          case "0,1,0,1":
            // hmm
            // line(vertA.posX, vertA.posY, midD.posX, midD.posY);
            // line(vertC.posX, vertC.posY, midB.posX, midB.posY);
            break;
          case "1,0,1,0":
            // line(vertD.posX, vertD.posY, midD.posX, midD.posY);
            // line(vertB.posX, vertB.posX, midB.posX, midB.posY);
            // hmmm
            break;
          case "0,1,1,0":
          case "1,0,0,1":
            line(midA.posX, midA.posY, center.posX, center.posY);
          default:
            break;
        }
      });
    });
  }
}
