/**
 * These values define the breakpoint values in px. sm means small, md means
 * medium, lg means large.
 *
 * See the `breakPointValue` function for more details.
 */
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
};

/**
 * This is a helper function used to determine the appropriate value given
 * the current screen width. It's used to make the interactive art responsive.
 *
 * This function is inspired by Mantine component library's styles API
 * Source: https://mantine.dev/styles/responsive/
 *
 * EXAMPLE:
 * breakPointValue({sm: "It's SM!", md: "It's MD!", lg: "It's LG!"}, 800)
 * // Expected output: "It's MD!"
 */
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

/**
 * Helper function to safely paint to the canvas without contaminating the paint
 * settings globally. It ensures that the next time the canvas is painted, the
 * previous settings like stroke or fill is not applied.
 *
 * EXAMPLE:
 * safePaint(() => {
 *   fill("black")
 *   circle(50, 50, 25)
 * })
 */
function safePaint(paint) {
  push();
  paint();
  pop();
}
