/**
 * `BasePoint` represents each *point* that makes up a grid. Each point contains its coordinates,
 * its column index and its row index. For the purpose of forming a marching square grid, it also
 * stores the density field values at that point.
 *
 * This class can be extended to store extra information about each grid point as it's the case when
 * used by the `CryptoGridWall` class.
 */
class BasePoint {
  constructor(posX, posY, columnIndex, rowIndex) {
    this.posX = posX;
    this.posY = posY;
    this.columnIndex = columnIndex;
    this.rowIndex = rowIndex;

    // This is the density field value derived from all the circles (`Circle` class).
    this.circleDensityField = 0;

    // This is the density field value derived from one circle that follows the position of the mouse.
    // This value is used in addition to the density field value of the circles to create the mouse
    // hovering effect.
    this.mouseDensityField = 0;
  }

  /**
   * Directly accessing class properties can lead to bugs. For example, it makes it easier to write a bug
   * that mutates the property value without the author's intention. Creating getters and setters is a
   * good practice to prevent writing such bugs. JavaScript has ways to create getters and setters that allow
   * for read and write to a property with an assignment operator (`=`). However, this is not used for two
   * reasons. 1) It's a matter of style and preference, explicit getters and setters make it easier to
   * see where dangerous implementations may exist. 2) As implemented below, object getters with object
   * destructuring is convenient and this is more apparent when being explicit.
   */
  getGridInfo() {
    const { posX, posY, columnIndex, rowIndex } = this;

    // Returning an object like this makes it easier to consume the property values with object destructuring.
    //
    // Example:
    // const { posX, columnIndex } = myPoint.getInfo()
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

/**
 * `BaseCell` represent each *cell* formed by four corner points. Each cell contains a pointer to
 * each corner vertex. This class can however be extended to store extra information about each cell
 * if necessary. The vertices are named and ordered as desccribed below:
 *
 *  A+------+B
 *   |      |
 *   |      |
 *   |      |
 *  D+------+C
 *
 * Note: This diagram was created with https://asciiflow.com/
 */
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

/**
 * This is a function that returns a customized `MarchingSquareGrid`. It makes it easier to customize the
 * aggregation relationship between the `CryptoGridWall` or `DotGridWall` classes which inherit the
 * `MarchingSquareGrid` class. For example, the `CryptoGridWall` uses it to extend the data stored at each
 * grid point.
 *
 * Example:
 * class CryptoGridWall extends MarchingSquareGridFactory({ PointClass: ExtendedPoint }) {}
 *
 * This pattern was documented on an article by JAVASCRIPT.INFO
 * Source: https://javascript.info/class-inheritance
 */
function MarchingSquareGridFactory(args) {
  // Making the argument an object makes it easier to understand the function invocation
  //
  // Example: MarchingSquareGridFactory({ PointClass: MyPointClass, CellClass: MyCellClass })
  //
  // The nullish coalescing operator makes the function argument `arg` optional. If no argument is passed
  // in the function call, `args` would be `undefined`. The operator will then evaluate the right hand
  // operand instead. This allows this function to be called like this in which case, it will use the
  // default `BasePoint` and `BaseCell` classes.
  //
  // Example: MarchingSquareGridFactory()
  const { PointClass = BasePoint, CellClass = BaseCell } = args ?? {};

  class MarchingSquareGrid {
    /**
     * This method creates the following:
     *   1. *Points* organized into columns and rows stored in a 2D array
     *   2. *Cells* that are formed by 4 *points* on its vertices organized into a hashmap where its key
     *      is a tuple [columnIndex, rowIndex] (the tuple is represented as a string since JavaScript can only
     *      use strings or symbols as keys)
     *
     * The size of the grid is determined by the `gridWidth`, `gridHeight`, and `cellSize`. `hoverRadius`
     * determines the size of the circle that follows the user's mouse. It's not used directly by the grid.
     */
    createGrid(gridWidth, gridHeight, cellSize, hoverRadius) {
      // The number of columns and rows is determined by calculating how many cells can fit within a
      // given width and height of the canvas. It's made to a whole number by using the floor function and
      // an extra column/width is added to make sure that the grid covers the entire canvas.
      const columnNum = Math.floor(gridWidth / cellSize) + 1;
      const rowNum = Math.floor(gridHeight / cellSize) + 1;

      // Create a 2D array where each item in the parent array represents each row, and each item in the
      // child array represents each point in the grid:
      // [ [*point*, *point*], [*point*, *point*] ]
      //
      // Array.from creates an array of length determined by the `length` argument where each array item will
      // be of value `undefined`. This array is *mapped* where for each array item, a new instance of the
      // `PointClass` is instantiated and stored in the array.
      //
      // Example:
      // Array.from({ length: 3 }).map(() => new Foo())
      // Expected output: [{*foo instance*}, {*foo instance*}, {*foo instance*}]
      const grid = Array.from({ length: columnNum }).map((_, columnIndex) =>
        Array.from({ length: rowNum }).map((_, rowIndex) => {
          const posX = columnIndex * cellSize;
          const posY = rowIndex * cellSize;
          const gridPoint = new PointClass(posX, posY, columnIndex, rowIndex);
          return gridPoint;
        })
      );

      // The newly created `grid` is assigned to the instance of the class. This is necessary to use
      // `forEachGridPoint` method as it relies on the `this` property containing the grid.
      //
      // warning: mutating grid first to use forEachGridPoint method
      this.grid = grid;

      // Creating a hashmap that will contain the grid's cells
      const cells = {};

      // Iterate through all the points in the grid. For each point, find three other points that make up
      // a cell. The four found points are used to instantiate the `CellClass` (or its variant) and stored
      // in the hashmap. For example, if the current iteration point is A, then the three other points are
      // B, C and D:
      //
      // A+------+B
      //  |      |
      //  |      |
      //  |      |
      // C+------+D
      //
      // Note: This diagram was created with https://asciiflow.com/
      //
      // `forEachGridPoint` is a helper function that makes it easier to iterate through all the points in
      // the grid.
      this.forEachGridPoint((_, columnIndex, rowIndex) => {
        // For left-most or bottom-most points, they cannot form cells as there are no adjacent points.
        // This if statement checks for these cases and returns early.
        if (columnIndex === columnNum - 1 || rowIndex === rowNum - 1) {
          return;
        }

        // The key of the hashmap is a tuple style string that concatenates the column index and the row
        // index separated by a comma
        const key = `${columnIndex},${rowIndex}`;

        // The other three vertices (B, C, and D) are accessed by shifting the column/row index by one
        // depending on which vertex is accessed
        const vertA = grid[columnIndex][rowIndex];
        const vertB = grid[columnIndex + 1][rowIndex];
        const vertC = grid[columnIndex + 1][rowIndex + 1];
        const vertD = grid[columnIndex][rowIndex + 1];

        // Instantiate a new cell class and assign to the hashmap
        cells[key] = new CellClass(vertA, vertB, vertC, vertD);
      });

      this.cells = cells;
      this.gridWidth = gridWidth;
      this.gridHeight = gridHeight;
      this.cellSize = cellSize;
      this.hoverRadius = hoverRadius;
    }

    /**
     * The `createGrid` method was separated from the constructor because the same function is used
     * in other methods below that update either the grid dimensions or the cell size.
     */
    constructor(gridWidth, gridHeight, cellSize, hoverRadius) {
      this.createGrid(gridWidth, gridHeight, cellSize, hoverRadius);
    }

    /**
     * Create a new grid with the same cell size as the current grid, but with different width and height.
     * This method is used to make the canvas responsive.
     */
    updateGridSize(gridWidth, gridHeight) {
      this.createGrid(gridWidth, gridHeight, this.cellSize, this.hoverRadius);
    }

    /**
     * Create a new grid with the same width and height as the current grid, but with different cell size.
     */
    updateCellSize(cellSize) {
      this.createGrid(
        this.gridWidth,
        this.gridHeight,
        cellSize,
        this.hoverRadius
      );
    }

    /**
     * This is a helper method that makes it easier to iterate through all the points in the grid. For each
     * point in the grid, the callback function is invoked.
     */
    forEachGridPoint(callback) {
      // The first `forEach` iterates through the parent array where each iteration represents an array that
      // makes up each row. The second `forEach` iterates through the children array where each iteration
      // represents a point in the grid.
      this.grid.forEach((column, columnIndex) =>
        column.forEach((gridPoint, rowIndex) =>
          callback(gridPoint, columnIndex, rowIndex)
        )
      );
    }

    /**
     * This is a helper method that makes it easier to iterate through all the cells in the grid. For each
     * cell in the grid, the callback function is invoked.
     */
    forEachGridCell(callback) {
      // `Ojbect.entries` enumerates the key-value pairs of the cells hashmap
      for (const [key, gridCell] of Object.entries(this.cells)) {
        // `String.prototype.split` splits string by the specified character an returns an array. This array
        // is then mapped to coerce the string into a value of type number.
        //
        // Example:
        // "1,3".split(",")
        // Expected output: ["1", "3"]
        //
        // Example:
        // ["1", "3"].map(Number)
        // Expected output: [1, 3]
        const [columnIndex, rowIndex] = key.split(",").map(Number);
        callback(gridCell, columnIndex, rowIndex);
      }
    }

    /**
     * This method calculates the density field value from the circle that follows the user's mouse for each
     * point in the grid. This method is called each frame to create a hover effect.
     */
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

    /**
     * This method calculates the density field value from the circles roaming around the canvas (`Circle`
     * instances) for each point in the grid. This method is called each frame, and the resulting density field
     * values are used by the `CryptoGridWall` class or the `DotGridWall` class to draw the contours of the lava
     * blobs.
     */
    marchingSquare(circles) {
      this.forEachGridPoint((gridPoint) => {
        const densityField = DensityField.computeMultiple(circles, gridPoint);
        gridPoint.setCircleDensityField(densityField);
      });
    }
  }

  return MarchingSquareGrid;
}
