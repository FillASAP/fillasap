// Writes apps/website/icons/favicon.svg: the logo on a transparent background (docs/BRAND.md).
import { writeFileSync } from "node:fs";
import { extrusion, face, palette } from "./logo.mjs";

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

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
  `<path fill="${palette.orange}" d="${extrusion.map(path).join("")}"/>` +
  `<path fill="${palette.yellow}" d="${path(face)}"/></svg>\n`;

writeFileSync(new URL("../apps/website/icons/favicon.svg", import.meta.url), svg);
