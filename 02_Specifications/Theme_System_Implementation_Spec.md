# Theme System — Implementation Spec

**Locked:** 2026-05-12
**Pilot file:** `0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.html`
**Rollout targets:** 0022 (vendor dashboard) · 0023 (admin console) · 0024 (save-the-date)
**Memory reference:** `project_setnayan_themes_and_icons.md`

---

## 1. Architecture

A single HTML prototype renders **any of five themes at runtime** by switching a
single CSS attribute on `<html>`:

```html
<html data-theme="victorian">   <!-- switches the whole prototype to Victorian -->
<html>                          <!-- no attribute = Setnayan Default -->
```

Each theme is defined as a **CSS variable bundle** scoped to a
`[data-theme="<name>"]` selector. The default theme lives in `:root`, so
removing `data-theme` reverts to Setnayan Default.

Theme variables cover three axes:

| Axis | Variables |
|---|---|
| Palette | `--page-bg` `--surface` `--ink` `--ink-soft` `--ink-faint` `--accent` `--accent-deep` `--accent-soft` `--rule` `--rule-strong` (+ theme-specific extras like `--gold` for Victorian, `--separator` for iOS) |
| Typography | `--font-body` `--font-display` `--font-mono` |
| Iconography | `--icon-stroke` (used by Lucide SVG `stroke-width`) |

Anything else (status colors, role colors like `--bride`/`--groom`, shadows,
canvas chrome) stays in `:root` — themes only change what's listed in the
locked spec.

---

## 2. The 5 themes

### 2.1 Setnayan Default (`:root`)

> Accent swapped from terracotta to deep burgundy on 2026-05-15 (name unchanged; `users.theme_preference` schema key `'setnayan_default'` preserved — accent-token-only update, no data migration).

- `--page-bg: #FAF6F0` (warm cream) · `--surface: #FFFFFF`
- `--ink: #1A1A1A` · `--ink-soft: #6B6B6B`
- `--accent: #7A1F2B` (deep burgundy / wine) · `--accent-deep: #4F1019` · `--accent-soft: #D9B8BD`
- Body: **Manrope** 400/500/600 · Display: **Cormorant Garamond italic** 500 · Mono: **DM Mono** 400
- Icon stroke: **1.75**
- Prior terracotta tokens (`#C97B4B / #8C4A28 / #E8C9B0`) retired from the default; admin can re-seed as a custom theme via `brand_config_versions` if desired.

### 2.2 Victorian (`[data-theme="victorian"]`)
- `--page-bg: #FAF1E6` (aged paper) · `--surface: #FBF6EC`
- `--ink: #2A1810` (deep brown-black) · `--ink-soft: #5C3812`
- `--accent: #8B1E3F` (deep burgundy) · `--accent-deep: #5A0E2A` · `--accent-soft: #D4B8C0`
- `--gold: #C9A66B` (gold leaf accent — Victorian-only)
- Body: **Cormorant Garamond** 400 · Display: **Playfair Display 700 italic** · Mono: **DM Mono** 500
- Icon stroke: **2.25** (heavier, ornate — matches heritage-formal mood)

### 2.3 Classy (`[data-theme="classy"]`)
- `--page-bg: #FFFEF9` (ivory paper) · `--surface: #FFFFFF`
- `--ink: #1A1A1A` · `--ink-soft: #6B6B6B` · `--ink-faint: #B8B8B8`
- `--accent: #B8945F` (champagne gold) · `--accent-deep: #8C6B3F` · `--accent-soft: #E8DCC0`
- Body: **Cormorant Garamond** 400 · Display: **Cinzel** 700 · Mono: **DM Mono** 400
- Icon stroke: **1** (ultra-thin, luxury-quiet)

### 2.4 iOS (`[data-theme="ios"]`)
- `--page-bg: #FFFFFF` · `--surface: #F2F2F7` (iOS system grouped-bg)
- `--ink: #000000` · `--ink-soft: #3C3C43` · `--ink-faint: rgba(60,60,67,0.6)`
- `--accent: #007AFF` (iOS system blue) · `--accent-deep: #0040DD` · `--accent-soft: #B3D7FF`
- `--separator: rgba(60,60,67,0.29)` (iOS-only)
- Body: `-apple-system, "SF Pro Display", "SF Pro Text", Inter, system-ui, sans-serif` · Display: same as body (bold) · Mono: `"SF Mono", ui-monospace, Menlo, monospace`
- Icon stroke: **2** (rounded)

Web fallback for iOS (when not on Apple): `Inter` substitutes for SF Pro automatically via the font stack.

### 2.5 Forest Theme (`[data-theme="forest_theme"]`)

> Added 2026-05-15 as the fifth UI Theme. Vendor-grounded / professional register; champagne gold is constrained to existing tint roles (Boosted gradient · Certified badge · celebration moments) per 0015 § Section 8 so the page-level "no competing accents" discipline holds.

- `--page-bg: #F4F0E8` (warm off-cream, subtle green cast) · `--surface: #FFFFFF`
- `--ink: #1A2520` (deep ink, slight green undertone) · `--ink-soft: #5C6660`
- `--accent: #2D4A3A` (deep forest) · `--accent-deep: #1A2F23` · `--accent-soft: #B8C9BF`
- `--gold: #C9A66B` (champagne gold — reuses Victorian's existing `--gold` token for a single platform-wide champagne value; constrained to Boosted-vendor gradient · Certified-vendor badge · celebration-affordance moments)
- Body: **Manrope** 400/500/600 · Display: **Cormorant Garamond italic** 500 · Mono: **DM Mono** 400 (same editorial typography as Setnayan Default — distinct from Victorian's ornate Playfair register)
- Icon stroke: **1.75** (matches Setnayan Default)

---

## 3. Runtime switching contract

### 3.1 Picker UI

A `.theme-picker` element contains five `.theme-swatch` buttons, each carrying
`data-theme-id` matching one of: `setnayan_default · victorian · classy · ios · forest_theme`.
Swatch backgrounds use a 135° split gradient: bg-color 50% → accent 50% — a
miniature preview of the theme's palette.

The pilot places the picker in three locations:
- **Canvas top chrome** (always visible global control, alongside Web/Mobile/Both toggle)
- **Desktop app-bar** of every surface (next to user avatar) — multi-line `<div class="dash-right">` blocks
- The condensed one-line app-bars do not carry a picker — visiting any surface still flips theme via the global picker

For production Customer chrome: **Settings → Appearance → Theme**.
For production Vendor chrome: same path, but gated behind **Vendor Pro Weekly** (₱499/wk) — non-Pro vendors see Setnayan Default only.

### 3.2 JS contract

A single delegated click handler near `</body>`:

```js
(function(){
  function setTheme(name) {
    if (name === 'setnayan_default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', name);
    }
    document.querySelectorAll('.theme-swatch').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-theme-id') === name);
    });
    // Re-tune Lucide icon stroke widths
    const stroke = (getComputedStyle(document.documentElement)
                    .getPropertyValue('--icon-stroke') || '1.75').trim();
    document.querySelectorAll('[data-icon-rendered] svg').forEach(svg => {
      svg.setAttribute('stroke-width', stroke);
    });
  }
  document.addEventListener('click', e => {
    const swatch = e.target.closest('.theme-swatch');
    if (!swatch) return;
    e.stopPropagation();
    setTheme(swatch.getAttribute('data-theme-id'));
  });
})();
```

**Why this is event-delegated:** swatches are scattered across multiple
surface frames. One delegated listener at `document` catches any swatch
click regardless of which surface is mounted.

**No `localStorage`:** these are prototype demos. Persistence is a V1.5
concern when themes ship into the production product.

---

## 4. What theming does NOT change

| Surface | Reason |
|---|---|
| Admin chrome (purple `#6E5BAD`) | Always purple; visually distinct from customer + vendor; theme system disabled on admin console (0023) — admins see Setnayan Default plus the admin purple-band wrapper regardless |
| Setnayan symbol mark + wordmark | Canonical brand mark — never recolored, never re-typeset |
| Legal documents (Privacy Policy, ToS, Vendor Agreement) | Always default styling for regulatory clarity |
| Save-the-Date template feel-categories | Templates are pre-rendered assets; the theme is an app-chrome concept, not a render-output concept |
| Status semantics (ok = green, warn = amber, bad = red) | `--status-ok/warn/bad` stay constant across themes — a green check must mean "ok" regardless of theme |
| Role colors (`--bride` / `--groom` / `--both`) | Wedding-side identity, not theme — kept constant |
| Lucide icon glyph set | Same glyphs, only stroke weight changes |

---

## 5. Downstream rollout contract (0022 · 0023 · 0024)

Each prototype reuses the same three blocks verbatim:

1. **CSS block** — paste the `:root` font + icon-stroke variables + the three
   `[data-theme="..."]` bundles + the `.theme-picker` / `.theme-swatch` classes
   into the existing `<style>` block, right after `:root`.
2. **Google Fonts link** — extend the existing Fonts URL with
   `Playfair+Display`, `Cinzel`, `Inter` family imports.
3. **Markup** — drop a single `.theme-picker` block into the canvas top chrome
   (alongside view toggle). One global picker is enough; per-surface pickers
   are optional decoration.
4. **JS** — paste the `setTheme` IIFE before `</body>`.

No other edits are required. Existing CSS that already uses `var(--accent)`
etc. automatically inherits theme switching.

**0023 admin console exception:** admin chrome is theme-locked. Either omit
the picker entirely OR ship it but hard-code the Lucide stroke + admin purple
to remain unchanged across themes (purple wrapper sits **over** the customer
chrome it previews).

---

## 6. Acceptance tests

| # | Action | Expected |
|---|---|---|
| 1 | Click Setnayan swatch | `<html>` has no `data-theme`. Page reads cream + terracotta + Cormorant italic display |
| 2 | Click Victorian swatch | `<html data-theme="victorian">`. Burgundy + Playfair Display 700 italic + Lucide strokes thicker (2.25) |
| 3 | Click Classy swatch | `<html data-theme="classy">`. Ivory + champagne + Cinzel display + Lucide strokes near-hairline (1) |
| 4 | Click iOS swatch | `<html data-theme="ios">`. Pure white + system blue + SF Pro / Inter + 2px stroke |
| 5 | Switch between themes 10× | No layout reflow beyond color/font swaps; surface routing remains on whichever surface was active |
| 6 | Switch theme, then click any surface tab | Theme persists across surface navigation (because `data-theme` lives on `<html>`, not on individual surfaces) |
| 7 | Click theme picker, then click avatar (which is also `data-surface`) | Event delegation order: theme handler stops propagation; avatar's `data-surface` does not fire when clicking a swatch |
| 8 | Inspect Lucide icons after theme switch | `<svg stroke-width="…">` matches the active theme's `--icon-stroke` |
| 9 | Reload page | Theme resets to Setnayan Default (no localStorage in pilot) |
| 10 | Open the file via `file://` with no network | Fonts may fall back to system, but theme palette + icon-stroke still apply |

---

## 7. File locations (pilot)

| What | Line range (0021 pilot) |
|---|---|
| Google Fonts `<link>` (extended) | line 10 |
| `:root` block (font + icon-stroke additions) | line 42 onward (inside existing `:root`) |
| `[data-theme="victorian/classy/ios"]` bundles | lines 49–113 |
| `.theme-picker` / `.theme-swatch` CSS | lines 116–129 |
| Canvas-header global picker markup | line 1236 |
| Desktop app-bar picker markup (per-surface, multi-line bars) | lines 1283, 1629 (Home + Guests surfaces; the rest inherit via global) |
| `setTheme` JS IIFE | line 7278 onward |

Final file length: **7,307 lines** (up from 7,172).
