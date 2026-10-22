# Brand

The logo, the palette, and how the website and the extension popup use them.

## Logo

The logo is an italic **F** with a solid extrusion. `scripts/logo.mjs` holds its geometry and colors, and `vp run logo` regenerates every file drawn from it; edit the scripts, never the outputs:

| File                                      | Script                 | Background                       |
| ----------------------------------------- | ---------------------- | -------------------------------- |
| `apps/website/icons/favicon.svg`          | `scripts/favicon.mjs`  | Transparent                      |
| `apps/extension/public/icon/<size>.png`   | `scripts/logo-png.mjs` | Transparent; 16, 32, 48, 128 px  |
| `apps/website/icons/favicon.ico`          | `scripts/logo-png.mjs` | Transparent; 16, 32, 48 px       |
| `apps/website/icons/apple-touch-icon.png` | `scripts/logo-png.mjs` | Transparent; 180 px              |
| `docs/logo.png`                           | `scripts/logo-png.mjs` | Transparent; 512 px, for avatars |

No file has a tile: yellow and orange read on both light and dark backgrounds, so one file serves both themes. The extension icons are PNG because Chrome rejects SVG manifest icons. iOS browsers ignore SVG favicons, so the website also links the ICO and the touch icon; `index.html` lists the ICO before the SVG, with `sizes="32x32"`, so desktop browsers still pick the SVG. iOS fills the touch icon's transparency with black. The website icons live outside `public/` so the build gives them content-hashed names; browsers cache favicons for weeks, and only a new name makes them fetch a changed logo. `docs/logo.png` is the avatar for the GitHub organization and X; it has a wider margin so a circular crop keeps the letter's corners. The script rasterizes the polygons itself (8 × 8 samples per pixel), so it needs no browser or image library. WXT finds `public/icon/<size>.png` and lists them in the manifest; `vp run test:extension-manifest` fails if a production build ships without them.

- **Letter.** An upright F (top bar, middle bar, stem) slanted 20° to the right. The stem ends in a point toward the bottom left, which reads as speed.
- **Depth.** The letter is extruded 2.2 units (of a 32-unit box) toward the bottom right: one shifted copy plus a quad per edge. No outline.
- **Box.** The letter and its depth are centered in a 32 × 32 box (the favicon's view box).
- **Colors.** Face yellow, depth orange, on a transparent background.

## Palette

| Token                 | Hex       | Role                                                    |
| --------------------- | --------- | ------------------------------------------------------- |
| `--brand-yellow`      | `#ffd84d` | Logo face; reserved for highlights, unused in the UI    |
| `--brand-orange`      | `#ff9233` | Logo depth; the accent in both themes                   |
| `--brand-orange-deep` | `#b35300` | Links in light mode, where orange is too light for text |
| `--brand-ink`         | `#1c1d21` | Text in light mode, and text on any accent fill         |
| `--brand-paper`       | `#f6f7f9` | Light page background                                   |

Grays (`--gray-0` … `--gray-950`) are the neutral surfaces, borders, and secondary text.

### Where the accent goes

Yellow and orange are for calls to action, highlights, and accents: a primary button, a link, a marker that needs the eye. Structure stays neutral: surfaces, cards, borders, and dividers use the grays, and buttons have no border.

Orange is the accent in both themes. Its contrast (WCAG 2.2 ratios):

| Use                  | Light mode                   | Dark mode               |
| -------------------- | ---------------------------- | ----------------------- |
| Button fill and text | orange with ink: 7.55:1      | orange with ink: 7.55:1 |
| Popup link           | deep orange on white: 5.06:1 | orange on popup: 7.95:1 |

Plain orange on white is 2.23:1, below 4.5:1 for text, so light-mode links use deep orange. White text on orange fails the same way, so accent fills always carry ink text.

## Tokens

Each stylesheet (`apps/website/src/app/app.css`, `apps/extension/src/popup/popup.css`) opens with a `:root` block in two layers:

1. **Palette:** `--brand-*` and `--gray-*`. The only place a hex color is written.
2. **Semantic:** `--surface`, `--card`, `--border`, `--text`, `--muted`, `--accent`, `--accent-text`, `--link`. Each points to a palette token, and the `prefers-color-scheme: dark` block repoints them.

Rules use semantic tokens only: never write a hex color in a property, and never reference a palette token outside the `:root` blocks. A new color is a new palette token plus a semantic token for its role. The website and the popup are separate apps that share no code, so each file repeats the palette tokens it uses; keep their values identical to this table.
