/**
 * This class is a collection of methods for calculating and using density field values. See
 * the explanation for `computeSingle` for more about density field.
 *
 * It's a class rather than separate functions for namespacing purposes. Rather than having
 * multiple long function names like `computeSingleDensityField`, it's easier to *namespace* the
 * collection of these functions into one class so it can be accessed
 * `DensityField.computeSingle` or such.
 *
 */
class DensityField {
  /**
   * The density field value measures the influence or the presence of circles at a given point.
   * The closer the point is to the center of the circle, the greater the influence (or density)
   * that circle has on that point. For one circle, if the value is less than 1, it indicates
   * that the circle is not overlapping the given point. If this value is greater than 1, it
   * indicates that the circle is overlapping the given point.
   *
   * This method calculates the density field value for one particular circle. Given coordinates
   * for a particular point (`gridPoint`), calculate the density field that measures how much overlap
   * there is between the circle and the testing point (`gridPoint`).
   *
   * The formula was derived from the equation of a circle x^2 + y^2 = r^2. The derivation was based
   * on a blog post by Jamie Wong.
   *
   * Source: https://jamie-wong.com/2014/08/19/metaballs-and-marching-squares/#the-math
   */
  static computeSingle(radius, center, gridPoint) {
    return (
      radius ** 2 /
      ((gridPoint.posX - center.posX) ** 2 +
        (gridPoint.posY - center.posY) ** 2)
    );
  }

  /**
   * This method calculates the density field value at a given point given an array of circles.
   * The density field value at a given point is the sum of the density field value of each circle
   * at the given point.
   */
  static computeMultiple(circles, gridPoint) {
    // The `Array.prototype.reduce` method is useful for calculating a sum of some value that is to
    // be derived from an array. In this case, it's used to calculate the sum of density field value
    // of each individual circle. The `currentSum` represents the running sum of these density field
    // values. The second argument of 0 indicates that the sum should start from 0.
    //
    // Example:
    // Iteration 0: currentSum = 0
    // Iteration 1: currentSum = 0, value = 1.5 (return this value to add to the running sum)
    // Iteration 2: currentSum = 1.5, value = 0.8
    // Iteration 3: currentSum = 2.3, value = 1.1
    // ...
    return circles.reduce((currentSum, circle) => {
      const value = this.computeSingle(circle.radius, circle, gridPoint);
      return currentSum + value;
    }, 0);
  }

  /**
   * This method maps a density field value to a gray scale value between 0 and 255 (this *trim* can
   * be changed in the two last optional arguments). For any value lower than the lower threshold value,
   * the lower trim value (0) is returned. For any value above the upper threshold value, it returns the
   * upper trim value (255). For any value between the lower and upper threshold value, the value is mapped
   * linearly between the lower trim value and upper trim value.
   *
   * This method is used to paint the surfaces of the lava blobs by the `DotGridWall` class and
   * `CryptoGridWall` class.
   */
  static mapToGrayScale(
    value,
    lowerThreshold,
    upperThreshold,
    lowerTrim = 0,
    upperTrim = 255
  ) {
    if (value < lowerThreshold) {
      return lowerTrim;
    } else if (value < upperThreshold) {
      return map(value, lowerThreshold, upperThreshold, lowerTrim, upperTrim);
    } else {
      return upperTrim;
    }
  }

  /**
   * This method converts a density field value to 0 or 1. If the density field value is greater than
   * 1, the method returns 1. If the value is less than 1, it returns 0.
   *
   * This method is used by the `DotGridWall` class to classify a cell (cell is made of four grid points)
   * into different types of contours that form the surfaces/edges of lava blobs.
   */
  static mapToBinary(value) {
    return value > 1 ? 1 : 0;
  }
}
