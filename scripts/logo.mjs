// Logo geometry shared by the favicon and the extension icons (docs/BRAND.md).
const palette = {
  yellow: "#fdd228",
  orange: "#fc9c28",
  ember: "#fc7c37",
};

const slant = Math.tan((24 * Math.PI) / 180);
// Measured on the 1254 px artwork: top, bottom, and each side's x at mid height.
const artwork = [
  { color: palette.yellow, top: 248.5, bottom: 514.5, left: 347.4, right: 1094.4 },
  { color: palette.orange, top: 556.5, bottom: 785.5, left: 228.1, right: 798.2 },
  { color: palette.ember, top: 826.5, bottom: 1032.5, left: 128.9, right: 457 },
];

const parallelogram = ({ top, bottom, left, right }) => {
  const lean = (y) => ((top + bottom) / 2 - y) * slant;
  return [
    [left + lean(top), top],
    [right + lean(top), top],
    [right + lean(bottom), bottom],
    [left + lean(bottom), bottom],
  ];
};

const shapes = artwork.map(parallelogram);
const points = shapes.flat();
const range = (values) => [Math.min(...values), Math.max(...values)];
const [xs, ys] = [range(points.map(([x]) => x)), range(points.map(([, y]) => y))];
const scale = 30 / Math.max(xs[1] - xs[0], ys[1] - ys[0]);
const fit = ([x, y]) => [
  16 + (x - (xs[0] + xs[1]) / 2) * scale,
  16 + (y - (ys[0] + ys[1]) / 2) * scale,
];

/** Three slanted bars, top to bottom, centered in a 32 × 32 box with a 1-unit margin. */
export const bars = artwork.map(({ color }, i) => ({ color, polygon: shapes[i].map(fit) }));
