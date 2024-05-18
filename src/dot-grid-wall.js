// eslint-disable-next-line no-unused-vars
class DotGridWall {
  init(marchingSquareGrid) {
    marchingSquareGrid.updateCellSize(50);
  }

  commit(marchingSquareGrid) {
    marchingSquareGrid.forEachGridCell((vertA, vertB, vertC, vertD) => {
      const config = [
        this.activation(vertA.densityField),
        this.activation(vertB.densityField),
        this.activation(vertC.densityField),
        this.activation(vertD.densityField),
      ].toString();

      const { cellSize } = marchingSquareGrid.getInfo();

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
  }

  activation(value) {
    return value > 1 ? 1 : 0;
  }
}
