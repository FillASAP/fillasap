// Writes apps/website/public/favicon.svg: an italic F extruded toward the bottom right (docs/BRAND.md).
import { writeFileSync } from "node:fs";

const palette = { yellow: "#ffd84d", orange: "#ff9233", paper: "#f6f7f9", graphite: "#404041" };
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
const face = skewed.map((point) => shift(point, ...offset));

const round = (n) => Math.round(n * 100) / 100;
const area = (points) =>
  points.reduce((sum, [x, y], i) => {
    const [nx, ny] = points[(i + 1) % points.length];
    return sum + x * ny - nx * y;
  }, 0);
// Every subpath winds the same way, so the nonzero fill rule never punches holes.
const path = (points) => {
  const ordered = area(points) < 0 ? [...points].reverse() : points;
  return `M${ordered.map(([x, y]) => `${round(x)} ${round(y)}`).join("L")}Z`;
};

const back = face.map((point) => shift(point, depth, depth));
const sides = face.map((point, i) => {
  const next = face[(i + 1) % face.length];
  return [point, next, shift(next, depth, depth), shift(point, depth, depth)];
});
const extrusion = [back, ...sides].map(path).join("");

const style =
  `:root{--face:${palette.yellow};--depth:${palette.orange};--tile:${palette.paper}}` +
  `@media (prefers-color-scheme:dark){:root{--tile:${palette.graphite}}}` +
  "rect{fill:var(--tile)}.depth{fill:var(--depth)}.face{fill:var(--face)}";
const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><style>${style}</style>` +
  `<rect width="32" height="32" rx="7"/><path class="depth" d="${extrusion}"/>` +
  `<path class="face" d="${path(face)}"/></svg>\n`;

writeFileSync(new URL("../apps/website/public/favicon.svg", import.meta.url), svg);
