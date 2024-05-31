/**
 * `DotGridWall` inherits the default `MarchingSquareGrid` class. The base class already has the
 * functionalities to store a grid of points, each with its density field values, update these
 * field values, and utility methods like `forEachGridPoint` and `forEachGridCell`. This class
 * adds functionalities to paint the canvas in a "digital grid" aesthetic.
 */
class DotGridWall extends MarchingSquareGridFactory() {
  constructor(gridWidth, gridHeight, cellSize, hoverRadius) {
    super(gridWidth, gridHeight, cellSize, hoverRadius);
  }

  /**
   * This method is called every frame to paint the surfaces and contour lines of the lava blobs.
   */
  paint() {
    background(0);

    // This paints the "dots" that form the surfaces of the lava blobs.
    this.forEachGridPoint((gridPoint) => {
      // Map the density field value from the roaming circles to a gray scale.
      const lavaGray = DensityField.mapToGrayScale(
        gridPoint.getCircleDensityField(),
        1,
        1.5
      );

      // Similarly, map the density field value from the mouse following circle to a gray scale.
      const mouseGray = DensityField.mapToGrayScale(
        gridPoint.getMouseDensityField(),
        0.5,
        2
      );

      // The lava blobs formed from the roaming circles "overlay" (or layered towards the front),
      // the circle that follows the users's mouse. To create this effect, if the gray value of
      // points that form the surfaces of lava is greater than zero, this value should always
      // take precedence over the gray value of points that form a circle following the user's mouse.
      // If neither of these points have an opacity, do not paint any point to the canvas (or more
      // accurately, give it an opacity of zero).
      const grayValue = lavaGray > 0 ? lavaGray : mouseGray > 0 ? mouseGray : 0;

      // Get the coordinates for the point currently being iterated.
      const { posX, posY } = gridPoint.getGridInfo();

      safePaint(() => {
        // Apply the calculated gray value.
        stroke(grayValue);

        // Thicken the stroke to make the points more visible.
        strokeWeight(4);

        point(posX, posY);
      });
    });

    // This paints the contour lines of the lava blobs.
    this.forEachGridCell((gridCell) => {
      // Get the four corner vertices that make up the current cell being iterated.
      const { vertA, vertB, vertC, vertD } = gridCell.getGridInfo();

      // There are 16 types of contours (or absence of contours) that can be drawn. The different
      // types of contours are expressed in a tuple (technically a string) of four binary numbers 1
      // or 0. This binary number is determined by checking whether or not a density field value
      // exceeds a certain threshold value (in this case it's set to 1).
      //
      // For example, if the cell was of the configuration [1, 0, 0, 1], it would mean that the
      // corners A and D had a density field value greater than the threshold value. It's then
      // estimated that the contour in this cell would cut through the cell vertically.
      //
      // A+------+B           +    |    +
      //  |      |                 |
      //  |      |     ==>         |
      //  |      |                 |
      // D+------+C           +    |    +
      //
      // Note: This diagram was created with https://asciiflow.com/ and modified by the author
      //
      // This method of drawing contours based on the 16 different types of configutaions was
      // mentioned in the article by Jamie Wong.
      //
      // Source: https://jamie-wong.com/2014/08/19/metaballs-and-marching-squares/#marching-squares
      //
      // The contour configuration is determined here. The configuration tuple is stored as a
      // string because it makes it easier to use the switch statement as seen below.
      const config = [
        DensityField.mapToBinary(vertA.getCircleDensityField()),
        DensityField.mapToBinary(vertB.getCircleDensityField()),
        DensityField.mapToBinary(vertC.getCircleDensityField()),
        DensityField.mapToBinary(vertD.getCircleDensityField()),
      ].toString();
      const { cellSize } = this;

      // For aesthetic purposes, a different set of contour lines are drawn than what is described
      // in the article by Jamie Wong. These contour lines require calculating the mid points
      // between the four corner vertices as well as the center point.
      //
      // - `center` is the center point of the cell
      // - `midA` is the mid-point between A and B
      // - `midB` is the mid-point between B and C
      // - `midC` is the mid-point between C and D
      // - `midD` is the mid-point between D and A
      //
      // `//prettier-ignore` is a directive for the prettier code formatter. It's there to make the
      // code easier to read.
      //
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

        // The switch statement draws the different types of contours based on the cell
        // configuration tuple. Where configurations have the same resulting contours, two
        // consecutive `case` statements are nested to remove code duplicate.
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
