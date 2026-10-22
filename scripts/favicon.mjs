// Writes apps/website/icons/favicon.svg: the logo on a transparent background (docs/BRAND.md).
import { writeFileSync } from "node:fs";
import { bars } from "./logo.mjs";

const round = (n) => Math.round(n * 100) / 100;
const path = (points) => `M${points.map(([x, y]) => `${round(x)} ${round(y)}`).join("L")}Z`;

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
  bars.map(({ color, polygon }) => `<path fill="${color}" d="${path(polygon)}"/>`).join("") +
  `</svg>\n`;

writeFileSync(new URL("../apps/website/icons/favicon.svg", import.meta.url), svg);
