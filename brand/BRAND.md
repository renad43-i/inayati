# RENAURA — Brand Guide (Palette A)

Skin care & hair care brand. Arabic-first (RTL) website with English brand name.
Message: products for **every skin tone and every hair type** (straight, wavy, curly, coily).

## Colors (Palette A — approved)

| Token | Hex | Use |
|---|---|---|
| `--rn-red` | `#8E1B22` | Velvet red. Brand name, primary buttons, prices, sale badges, links |
| `--rn-olive` | `#3E4130` | Dark olive. Body text, headings, menus, footer background |
| `--rn-cream` | `#F4EFEA` | Light cream. Page background |

Supporting (derived, use sparingly):

| Token | Hex | Use |
|---|---|---|
| `--rn-white` | `#FFFFFF` | Product cards on cream background |
| `--rn-red-dark` | `#721519` | Button hover |
| `--rn-red-soft` | `#F3E1DF` | Sale/promo section background |
| `--rn-olive-muted` | `#6E705F` | Secondary text, captions |
| `--rn-line` | `#E2DAD1` | Borders, dividers |

Skin-tone colors (only for illustrations / hair-type icons / the logo arcs):
`#E3B793` straight · `#C68E64` wavy · `#9A6443` curly · `#5C3722` coily

Rules:
- Background is always light (cream or white). No dark page backgrounds, except the footer (olive).
- Red is the accent: buttons, prices, brand name, key highlights. Not for long text.
- Body text is olive, never pure black.
- Approx. ratio: cream 60% · white 15% · olive 15% · red 10%.

## Typography

- Display / headings (Latin): **Cormorant Garamond** 500 (Google Fonts)
- Arabic headings: **Noto Naskh Arabic** 600–700
- Arabic body: **IBM Plex Sans Arabic** 400/500
- Small Latin labels (e.g. "SKIN · HAIR · GLOW"): Cormorant Garamond, uppercase, letter-spacing 0.3em

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Noto+Naskh+Arabic:wght@600;700&display=swap" rel="stylesheet">
```

## CSS tokens

```css
:root {
  --rn-red: #8E1B22;
  --rn-red-dark: #721519;
  --rn-red-soft: #F3E1DF;
  --rn-olive: #3E4130;
  --rn-olive-muted: #6E705F;
  --rn-cream: #F4EFEA;
  --rn-white: #FFFFFF;
  --rn-line: #E2DAD1;

  --rn-font-display: "Cormorant Garamond", Georgia, serif;
  --rn-font-ar-head: "Noto Naskh Arabic", "IBM Plex Sans Arabic", serif;
  --rn-font-body: "IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif;

  --rn-radius: 4px;
}
html { direction: rtl; }
body { background: var(--rn-cream); color: var(--rn-olive); font-family: var(--rn-font-body); }
h1, h2, h3 { font-family: var(--rn-font-ar-head); color: var(--rn-olive); }
.btn-primary { background: var(--rn-red); color: var(--rn-cream); border-radius: var(--rn-radius); padding: .75rem 1.75rem; }
.btn-primary:hover { background: var(--rn-red-dark); }
.btn-outline { border: 1px solid var(--rn-olive); color: var(--rn-olive); background: transparent; }
.price { color: var(--rn-red); font-weight: 600; }
footer { background: var(--rn-olive); color: var(--rn-cream); }
```

## Tailwind (optional)

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      rn: {
        red: '#8E1B22', 'red-dark': '#721519', 'red-soft': '#F3E1DF',
        olive: '#3E4130', 'olive-muted': '#6E705F',
        cream: '#F4EFEA', line: '#E2DAD1',
        skin1: '#E3B793', skin2: '#C68E64', skin3: '#9A6443', skin4: '#5C3722',
      },
    },
    fontFamily: {
      display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      arhead: ['"Noto Naskh Arabic"', 'serif'],
      body: ['"IBM Plex Sans Arabic"', 'sans-serif'],
    },
  },
}
```

## Logo files (in this folder)

The logo: four half-arcs, each a hair type (outer straight → wavy → curly → inner coily), each a skin tone from light to dark, with a dot in the center; "RENAURA" in velvet red; "SKIN · HAIR · GLOW" in olive. Text is converted to outlines (no font needed).

| File | Use |
|---|---|
| `renaura-logo-horizontal.svg` | **Website header** (arcs beside the name) |
| `renaura-logo.svg` | Stacked logo: hero, about page, packaging |
| `renaura-logo-no-tagline.svg` | Small spaces |
| `renaura-logo-light.svg`, `renaura-logo-horizontal-light.svg` | On olive footer, red banners, photos |
| `renaura-icon.svg`, `renaura-icon-red.svg` | Social avatars, app icon |
| `favicon-32.png`, `favicon-180.png` (apple-touch-icon), `favicon-512.png` | Browser / PWA icons |

PNG versions (transparent, 2×) are included for every SVG.

Logo rules: keep clear space around the logo equal to the height of the dot ×3; minimum header width 140px; don't recolor the arcs; don't put the dark logo on a dark background (use the `-light` version).
