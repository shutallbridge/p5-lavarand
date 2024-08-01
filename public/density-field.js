// for namespacing and organization purposes
class DensityField {
  static computeSingle(radius, center, gridPoint) {
    return (
      radius ** 2 /
      ((gridPoint.posX - center.posX) ** 2 +
        (gridPoint.posY - center.posY) ** 2)
    );
  }

  static computeMultiple(circles, gridPoint) {
    return circles.reduce((currentSum, circle) => {
      const value = this.computeSingle(circle.radius, circle, gridPoint);
      return currentSum + value;
    }, 0);
  }

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

  static mapToBinary(value) {
    return value > 1 ? 1 : 0;
  }
}
