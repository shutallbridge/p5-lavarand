// eslint-disable-next-line no-unused-vars
class MarchingSquareGrid {
  constructor(gridWidth, gridHeight, cellSize) {
    this.createGrid(gridWidth, gridHeight, cellSize);
  }

  getInfo() {
    const { gridWidth, gridHeight, columnNum, rowNum, cellSize } = this;
    return { gridWidth, gridHeight, columnNum, rowNum, cellSize };
  }

  updateGridSize(gridWidth, gridHeight) {
    // todo: might need to re-compute density field again?
    const cellSize = this.cellSize;
    this.createGrid(gridWidth, gridHeight, cellSize);
  }

  updateCellSize(cellSize) {
    // todo: might need to re-compute density field again?
    const gridWidth = this.gridWidth;
    const gridHeight = this.gridHeight;
    this.createGrid(gridWidth, gridHeight, cellSize);
  }

  createGrid(gridWidth, gridHeight, cellSize) {
    const columnNum = Math.floor(gridWidth / cellSize) + 1;
    const rowNum = Math.floor(gridHeight / cellSize) + 1;

    const grid = Array.from({ length: columnNum }).map((_, i) =>
      Array.from({ length: rowNum }).map((_, j) => {
        const gridPoint = {
          posX: i * cellSize,
          posY: j * cellSize,
          densityField: 0,
        };
        return gridPoint;
      })
    );

    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.columnNum = columnNum;
    this.rowNum = rowNum;
    this.cellSize = cellSize;
    this.grid = grid;
  }

  computeDensityField(circles) {
    this.forEachGridPoint((gridPoint) => {
      const densityField = circles.reduce((currentSum, circle) => {
        const value =
          circle.radius ** 2 /
          ((gridPoint.posX - circle.posX) ** 2 +
            (gridPoint.posY - circle.posY) ** 2);
        return currentSum + value;
      }, 0);
      gridPoint.densityField = densityField;
    });
  }

  commit() {
    this.forEachGridPoint((gridPoint) => {
      safeCommit(() => {
        strokeWeight(3);
        stroke(0);
        point(gridPoint.posX, gridPoint.posY);
        strokeWeight(1);
        // text(round(gridPoint.densityField, 2), gridPoint.posX, gridPoint.posY);
      });
    });
  }

  test() {
    this.forEachGridCell((vertA, vertB, vertC, vertD) => {
      safeCommit(() => {
        strokeWeight(3);
        stroke("red");
        point(
          vertA.posX + (vertB.posX - vertA.posX) / 2,
          vertD.posY - (vertC.posY - vertB.posY) / 2
        );
      });
    });
  }

  forEachGridPoint(callback) {
    this.grid.forEach((column, columnIndex) =>
      column.forEach((gridPoint, rowIndex) =>
        callback(gridPoint, columnIndex, rowIndex)
      )
    );
  }

  forEachGridCell(callback) {
    this.forEachGridPoint((_, columnIndex, rowIndex) => {
      if (columnIndex === this.columnNum - 1 || rowIndex === this.rowNum - 1) {
        return;
      }

      const vertA = this.grid[columnIndex][rowIndex];
      const vertB = this.grid[columnIndex + 1][rowIndex];
      const vertC = this.grid[columnIndex + 1][rowIndex + 1];
      const vertD = this.grid[columnIndex][rowIndex + 1];

      callback(vertA, vertB, vertC, vertD);
    });
  }
}
