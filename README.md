# Color Palette Generator

Generate harmonious 5-color palettes from a base color using six color theory schemes, entirely in the browser.

**Live Demo:** https://file-converter-free.com/en/developer-tools/color-palette-generator

## How It Works

`hexToRgb` extracts R/G/B channels from a 6-digit hex string via `parseInt`. `rgbToHsl` converts to HSL using the standard max/min/delta formulas, yielding hue in degrees (0-360), saturation and lightness as percentages. `hslToRgb` reverses via a `hue2rgb` helper that handles the six hue sectors. `generatePalette` takes the base HSL and applies one of six color theory schemes by rotating and adjusting the hue: complementary (h + 180), triadic (h + 120, h + 240), analogous (h ± 20, h ± 40), split-complementary (h + 150, h + 210), tetradic (h + 90, h + 180, h + 270), and monochromatic (same hue, lightness steps). Each scheme returns 5 color objects with hex, RGB, and HSL values. `renderPalette` builds DOM swatch cards with per-swatch copy-to-clipboard buttons.

## Features

- 6 color theory schemes: complementary, triadic, analogous, split-complementary, tetradic, monochromatic
- 5-color palette output with HEX, RGB, and HSL values per swatch
- Copy HEX per swatch via Clipboard API
- Color picker and hex text input with bidirectional sync
- Auto-generates palette on load

## Browser APIs Used

- Clipboard API (`navigator.clipboard.writeText`)

## Code Structure

| File | Description |
|------|-------------|
| `color-palette-generator.js` | `hexToRgb`, `rgbToHsl`, `hslToRgb`, `rgbToHex`, `generatePalette` (6 schemes via hue rotation), `renderPalette` DOM swatch builder |

## Usage

| Element ID / Selector | Purpose |
|----------------------|---------|
| `#cpgBaseColor` | Base color picker |
| `#cpgBaseHex` | Base color hex text input |
| `#cpgPaletteType` | Palette type selector (complementary/triadic/etc.) |
| `#cpgGenerate` | Generate palette button |
| `#cpgPalette` | Palette swatch output container |
| `.cpg-swatch-copy` | Per-swatch copy HEX button |

## License

MIT
