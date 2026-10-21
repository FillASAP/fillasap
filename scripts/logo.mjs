// Logo geometry shared by the favicon and the extension icons (docs/BRAND.md).
export const palette = {
  yellow: "#ffd84d",
  orange: "#ff9233",
  paper: "#f6f7f9",
  graphite: "#404041",
};

const slant = Math.tan((20 * Math.PI) / 180);
const depth = 2.2;
const upright = [
  [9, 6],
  [25, 6],
  [25, 10],
  [13.5, 10],
  [13.5, 14],
  [22, 14],
  [22, 18],
  [13.5, 18],
  [13.5, 21],
  [9, 28],
];

const skewed = upright.map(([x, y]) => [x - slant * y, y]);
const shift = ([x, y], dx, dy) => [x + dx, y + dy];
const center = (values) => 16 - (Math.min(...values) + Math.max(...values)) / 2;
const bounds = skewed.flatMap((point) => [point, shift(point, depth, depth)]);
const offset = [center(bounds.map(([x]) => x)), center(bounds.map(([, y]) => y))];

/** The letter's front face, centered in a 32 × 32 tile. */
export const face = skewed.map((point) => shift(point, ...offset));

/** The extrusion behind the face: its shifted copy plus one quad per edge. */
export const extrusion = [
  face.map((point) => shift(point, depth, depth)),
  ...face.map((point, i) => {
    const next = face[(i + 1) % face.length];
    return [point, next, shift(next, depth, depth), shift(point, depth, depth)];
  }),
];
