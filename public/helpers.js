/**
 * These values define the breakpoints
 */
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
};

function breakPointValue(object, width) {
  if (BREAKPOINTS.lg < width) {
    return object["lg"];
  } else if (BREAKPOINTS.md < width) {
    return object["md"];
  } else if (BREAKPOINTS.sm < width) {
    return object["sm"];
  } else {
    return object["default"];
  }
}

function safePaint(paint) {
  push();
  paint();
  pop();
}
