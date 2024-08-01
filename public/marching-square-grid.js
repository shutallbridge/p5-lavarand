class BasePoint {
  constructor(posX, posY, columnIndex, rowIndex) {
    this.posX = posX;
    this.posY = posY;
    this.columnIndex = columnIndex;
    this.rowIndex = rowIndex;

    // marching square data
    this.circleDensityField = 0;
    this.mouseDensityField = 0;
  }

  getGridInfo() {
    const { posX, posY, columnIndex, rowIndex } = this;
    return { posX, posY, columnIndex, rowIndex };
  }

  getCircleDensityField() {
    return this.circleDensityField;
  }

  setCircleDensityField(value) {
    this.circleDensityField = value;
  }

  getMouseDensityField() {
    return this.mouseDensityField;
  }

  setMouseDensityField(value) {
    this.mouseDensityField = value;
  }
}

class BaseCell {
  constructor(vertA, vertB, vertC, vertD) {
    this.vertA = vertA;
    this.vertB = vertB;
    this.vertC = vertC;
    this.vertD = vertD;
  }

  getGridInfo() {
    const { vertA, vertB, vertC, vertD } = this;
    return { vertA, vertB, vertC, vertD };
  }
}

function MarchingSquareGridFactory(args) {
  const { PointClass = BasePoint, CellClass = BaseCell } = args ?? {};

  class MarchingSquareGrid {
    createGrid(gridWidth, gridHeight, cellSize, hoverRadius) {
      const columnNum = Math.floor(gridWidth / cellSize) + 1;
      const rowNum = Math.floor(gridHeight / cellSize) + 1;

      const grid = Array.from({ length: columnNum }).map((_, columnIndex) =>
        Array.from({ length: rowNum }).map((_, rowIndex) => {
          const posX = columnIndex * cellSize;
          const posY = rowIndex * cellSize;
          const gridPoint = new PointClass(posX, posY, columnIndex, rowIndex);
          return gridPoint;
        })
      );

      // warning: mutating grid first to use forEachGridPoint method
      this.grid = grid;

      const cells = {};
      this.forEachGridPoint((_, columnIndex, rowIndex) => {
        if (columnIndex === columnNum - 1 || rowIndex === rowNum - 1) {
          return;
        }

        const key = `${columnIndex},${rowIndex}`;
        const vertA = grid[columnIndex][rowIndex];
        const vertB = grid[columnIndex + 1][rowIndex];
        const vertC = grid[columnIndex + 1][rowIndex + 1];
        const vertD = grid[columnIndex][rowIndex + 1];

        cells[key] = new CellClass(vertA, vertB, vertC, vertD);
      });

      this.cells = cells;
      this.gridWidth = gridWidth;
      this.gridHeight = gridHeight;
      this.cellSize = cellSize;
      this.hoverRadius = hoverRadius;
    }

    constructor(gridWidth, gridHeight, cellSize, hoverRadius) {
      this.createGrid(gridWidth, gridHeight, cellSize, hoverRadius);
    }

    updateGridSize(gridWidth, gridHeight) {
      this.createGrid(gridWidth, gridHeight, this.cellSize, this.hoverRadius);
    }

    updateCellSize(cellSize) {
      this.createGrid(
        this.gridWidth,
        this.gridHeight,
        cellSize,
        this.hoverRadius
      );
    }

    forEachGridPoint(callback) {
      this.grid.forEach((column, columnIndex) =>
        column.forEach((gridPoint, rowIndex) =>
          callback(gridPoint, columnIndex, rowIndex)
        )
      );
    }

    forEachGridCell(callback) {
      for (const [key, gridCell] of Object.entries(this.cells)) {
        const [columnIndex, rowIndex] = key.split(",").map(Number);
        callback(gridCell, columnIndex, rowIndex);
      }
    }

    mouseHover(mouseX, mouseY) {
      this.forEachGridPoint((gridPoint) => {
        const center = { posX: mouseX, posY: mouseY };
        const densityField = DensityField.computeSingle(
          this.hoverRadius,
          center,
          gridPoint
        );
        gridPoint.setMouseDensityField(densityField);
      });
    }

    marchingSquare(circles) {
      this.forEachGridPoint((gridPoint) => {
        const densityField = DensityField.computeMultiple(circles, gridPoint);
        gridPoint.setCircleDensityField(densityField);
      });
    }
  }

  return MarchingSquareGrid;
}
