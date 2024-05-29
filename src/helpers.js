const BREAK_POINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
};

function breakPointValue(object, width) {
  if (BREAK_POINTS.lg < width) {
    return object["lg"];
  } else if (BREAK_POINTS.md < width) {
    return object["md"];
  } else if (BREAK_POINTS.sm < width) {
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
