# Lucide Icon Migration Spec

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main)
> **This doc is HISTORICAL/REFERENCE.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas:
> - **Still accurate as the icon-system contract.** The shipped React app uses `lucide-react` (`import { Home } from 'lucide-react'`) exactly as §6 prescribes; the inline-SVG `data-icon` renderer described here was only ever a prototype-HTML shim and is moot now that the surfaces are React (the static `0021`–`0024` prototype HTML files are reference artifacts).
> - One stale tie-in: §8 "Theme contract" claims the five V1 themes recolor icons via `currentColor`. The **5-theme system is retired and the app is light-locked** (see `Theme_System_Implementation_Spec.md` AS-BUILT block) — icons still inherit `currentColor`, but there is only one (light) theme to inherit from. No icon-system change needed.
>
> When this body disagrees with the above, **the above wins.**

**Status:** Pilot in progress (2026-05-12)
**Owner:** Frontend chrome team
**Project rule reference:** "Setnayan minimalist icon system — all icons use Lucide React (Apple-Settings minimalist outline style); emoji-as-icon banned in customer-facing chrome." (locked 2026-05-12, memory: `project_setnayan_themes_and_icons.md`)

---

## 1. Why this migration exists

Setnayan locked a strict ban on emoji-as-icon in customer-facing chrome. Emojis are visually inconsistent across platforms (Apple vs. Google vs. Microsoft each render the same codepoint differently), they break theme switching (they don't inherit `currentColor`), and they read as casual where Setnayan's brand register reads luxurious + modern.

The production stack ships React (per `0013_platform_stack_and_sync/`), so the production answer is straightforward: `import { Home, Users, Calendar } from 'lucide-react'` and use them as JSX components.

The current prototypes (0021–0024) are **static HTML files** that can't import from npm. To keep the prototypes visually consistent with the production answer **without rewriting them in React**, this spec defines an inline-SVG renderer that ships in a single `<script>` block at the top of each prototype.

---

## 2. Current pilot scope

**This pilot pass migrates ONLY the bot-nav `<div class="ico">…</div>` chrome icons** across the four shipped prototypes:

- `0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.html`
- `0022_vendor_dashboard/0022_vendor_dashboard.html`
- `0023_admin_console/0023_admin_console.html`
- `0024_save_the_date/0024_save_the_date.html`

The bot-nav was prioritized because:
1. It's the highest-visibility surface (always on screen).
2. It uses a tight, predictable set of icons (~5 per file, 12 total across all four).
3. It's the surface where the emoji vs. SVG difference is most jarring on theme switch.

Everything else (body-copy emoji, callout glyphs, status chips) is **out of scope for the pilot** and tracked in the punch list below (§ 7).

---

## 3. Runtime contract

The renderer ships as a single inline `<script>` block injected immediately before each prototype's `</head>` tag. The contract:

- **Any element with `data-icon="<name>"`** is auto-replaced on `DOMContentLoaded` with an inline SVG matching the Lucide v0.383 path data for `<name>`.
- **Size override:** `data-size="N"` (default `20`, valid values `16` / `20` / `24`).
- **Stroke override:** `data-stroke="N"` (default `1.75`).
- **Color:** the SVG uses `stroke="currentColor"`, so it inherits whatever `color` is set on the parent. This is what makes theme switching automatic — change the parent's color, the icon recolors.
- **Idempotency:** once rendered, the element gets `data-icon-rendered="1"` so subsequent `renderLucideIcons()` calls skip it. New DOM (dynamically inserted) can be re-scanned by calling `renderLucideIcons(root)` after the insert.
- **Unknown icon name:** warns in console, leaves the element empty. Never throws.

### The script block (canonical form)

```html
<script>
const LUCIDE_PATHS = {
  'home': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  /* … see prototypes for the full dictionary … */
};

const LUCIDE_SVG_TEMPLATE = (paths, size, strokeWidth) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

function renderLucideIcons(root) {
  root = root || document;
  const nodes = root.querySelectorAll('[data-icon]:not([data-icon-rendered])');
  nodes.forEach(function(node) {
    const name = node.getAttribute('data-icon');
    const size = parseInt(node.getAttribute('data-size') || '20', 10);
    const stroke = parseFloat(node.getAttribute('data-stroke') || '1.75');
    const paths = LUCIDE_PATHS[name];
    if (!paths) { console.warn('[lucide] unknown icon:', name); return; }
    node.innerHTML = LUCIDE_SVG_TEMPLATE(paths, size, stroke);
    node.setAttribute('data-icon-rendered', '1');
    node.style.display = 'inline-flex';
    node.style.alignItems = 'center';
    node.style.justifyContent = 'center';
    node.style.verticalAlign = 'middle';
    node.style.lineHeight = '1';
  });
}

document.addEventListener('DOMContentLoaded', function() { renderLucideIcons(); });
</script>
```

The full `LUCIDE_PATHS` dictionary is checked into the script block at the top of each prototype. Paths are verified against Lucide v0.383 — the production build will pin the same version.

---

## 4. Pilot replacement table (chrome icons only)

These are the substitutions applied during the pilot pass. The pattern targets `<div class="ico">X</div>` specifically so that emojis appearing inside body copy or chip glyphs are NOT swapped.

| Emoji char | Codepoint | Replacement |
|---|---|---|
| `⌂` | U+2302 (HOUSE) | `<span data-icon="home" data-size="18"></span>` |
| `♥` | U+2665 (BLACK HEART SUIT) | `<span data-icon="users" data-size="18"></span>` |
| `◈` | U+25C8 (WHITE DIAMOND CONTAINING BLACK SMALL DIAMOND) | `<span data-icon="briefcase" data-size="18"></span>` |
| `▣` | U+25A3 (WHITE SQUARE CONTAINING BLACK SMALL SQUARE) | `<span data-icon="calendar" data-size="18"></span>` |
| `✦` | U+2726 (BLACK FOUR POINTED STAR) | `<span data-icon="sparkles" data-size="18"></span>` |
| `▢` | U+25A2 (WHITE SQUARE WITH ROUNDED CORNERS) | `<span data-icon="layout-grid" data-size="18"></span>` |
| `✉` | U+2709 (ENVELOPE) | `<span data-icon="mail" data-size="18"></span>` |
| `▦` | U+25A6 (SQUARE WITH ORTHOGONAL CROSSHATCH FILL) | `<span data-icon="qr-code" data-size="18"></span>` |
| `◐` | U+25D0 (CIRCLE WITH LEFT HALF BLACK) | `<span data-icon="image" data-size="18"></span>` |
| `⚙` | U+2699 (GEAR) | `<span data-icon="settings" data-size="18"></span>` |
| `◉` | U+25C9 (FISHEYE) | `<span data-icon="users" data-size="18"></span>` |
| `₱` | U+20B1 (PESO SIGN) | `<span data-icon="credit-card" data-size="18"></span>` |

The pattern always wraps the new `<span data-icon>` inside the original `<div class="ico">` shell so the surrounding CSS (sizing, padding, hover states) keeps working unchanged.

### Pilot-pass results

| File | Replacements applied | Lines after |
|---|---:|---:|
| `0021_couple_dashboard_fully_purchased.html` | 100 | 7172 |
| `0022_vendor_dashboard.html` | 24 | 2473 |
| `0023_admin_console.html` | 21 | 1426 |
| `0024_save_the_date.html` | 10 | 2022 |
| **Total** | **155** | — |

All four files parse as valid HTML after the pass.

---

## 5. Full icon dictionary (production-aligned)

The pilot ships 31 icons in the dictionary, all verified Lucide v0.383 path strings. The list grows as new chrome icons are migrated.

| Icon name | Used for |
|---|---|
| `home` | Bot-nav Home |
| `users` | Bot-nav Guests / Customers / Crew |
| `heart` | Couple chrome — "Our" sections |
| `building` | Vendor business profile |
| `briefcase` | Bot-nav Vendors / Services |
| `calendar` | Bot-nav Schedule / Calendar |
| `sparkles` | Bot-nav Services / AI features |
| `layout-grid` | Bot-nav Marketplace / All services |
| `mail` | Bot-nav Inbox / Mail |
| `qr-code` | Bot-nav QR Hub |
| `image` | Bot-nav Gallery / Photos |
| `shopping-cart` | Marketplace / cart surface |
| `settings` | Bot-nav Settings |
| `credit-card` | Bot-nav Payments / Wallet |
| `bar-chart-3` | Admin analytics |
| `film` | Reels / video surfaces |
| `camera` | Capture surfaces (Papic, Save-the-Date upload) |
| `message-circle` | Chat (0019 communications) |
| `star` | Reviews / Boosted vendor flag |
| `check`, `check-circle-2` | Verified / Done states |
| `map-pin` | Location / venue / Setnayan logo motif |
| `bell` | Notifications |
| `utensils-crossed` | Catering vendor category |
| `cake` | Cake vendor category |
| `clock` | Time / countdown |
| `minus`, `x` | Close / remove |
| `folder` | Files / contracts |
| `smartphone` | Mobile surface preview |
| `party-popper` | Celebration surfaces |

---

## 6. Production-build migration plan

When the prototypes are ported to React/Next.js (0013 Sprint 0 + downstream), the inline `<span data-icon>` markup is replaced cleanly:

**Before (static HTML, this pilot):**
```html
<div class="ico"><span data-icon="home" data-size="18"></span></div>
```

**After (production React):**
```tsx
import { Home } from 'lucide-react';

<div className="ico"><Home size={18} strokeWidth={1.75} /></div>
```

The mapping is mechanical — a codemod can do it in one pass:
1. Match `<span data-icon="(\w+)" data-size="(\d+)"( data-stroke="([\d.]+)")?\s*/?>` and emit the corresponding JSX.
2. Convert kebab-case icon names to PascalCase (`layout-grid` → `LayoutGrid`, `bar-chart-3` → `BarChart3`).
3. Hoist the imports to the top of each component file.

The script block in the prototype's `<head>` is deleted at port time — React owns rendering.

**Bundle-size note:** `lucide-react` uses tree-shaking — only the icons actually imported land in the bundle. The full Lucide catalog is ~1.4 MB, but a typical Setnayan chrome surface imports 8–15 icons = ~6–12 KB gzipped.

---

## 7. What's still left — punch list per prototype

Counts below are emoji/symbol occurrences NOT covered by the pilot pass. Most are body-copy or callout glyphs that the production build will need to migrate (or, where they qualify as status indicators, intentionally retain).

### `0021_couple_dashboard_fully_purchased.html` (586 remaining)

High-volume (chrome / structural):
- `→` (151) — inline arrows / step indicators → migrate to `arrow-right`
- `✓` (78) — checkmarks → migrate to `check` (or `check-circle-2` when inside a colored badge)
- `★` (78) — review stars / featured badges → migrate to `star` (filled variant when appropriate)
- `✦` (33) — bullet glyphs → migrate to `sparkles`
- `▾` (21) — dropdown carets → migrate to `chevron-down`
- `🔒` (18) — locked-feature badges → migrate to `lock`
- `←` (13) — back navigation → migrate to `arrow-left`
- `📍` (9) — venue location pins → migrate to `map-pin`
- `🛒` (7) — cart glyphs → migrate to `shopping-cart`
- `✕` (7), `✗` — close / remove → migrate to `x`
- `▶`, `▸` (14) — play / disclosure → migrate to `play` / `chevron-right`
- `🍽` (6) — catering callouts → migrate to `utensils-crossed`
- `🏛` (6) — church / venue → migrate to `building`
- `📄` (4) — files / docs → migrate to `file-text`
- `⏰` (4) — reminders → migrate to `alarm-clock`
- `↻` (4) — refresh → migrate to `refresh-cw`

Status-indicator glyphs (KEEP as emoji per project rule):
- `🟣`, `🟢` — Internal / Team Member badge chips (already allowlisted)
- `⚐` (6) — Dispute flag (allowlisted)

### `0022_vendor_dashboard.html` (96 remaining)

- `→` (29) → `arrow-right`
- `✓` (20) → `check`
- `🔒` (7) → `lock`
- `⋯` (6) — overflow menu glyph → migrate to `more-horizontal`
- `📄` (5) → `file-text`
- `📋` (4) → `clipboard`
- `🖼` (3) → `image`
- `📹` (3) → `video`
- `📍` (3) → `map-pin`
- `📊` (1) → `bar-chart-3`
- `💳` (1) → `credit-card`
- `💬` (1) → `message-circle`
- `📞` (1) → `phone`
- `📎` (2) → `paperclip`
- `🤝` (1) → keep as content glyph or replace with `handshake` (Lucide v0.400+)

### `0023_admin_console.html` (98 remaining)

- `✓` (37) → `check`
- `→` (20) → `arrow-right`
- `🔒` (7) → `lock`
- `⋯` (7) → `more-horizontal`
- `↗` (3) → `arrow-up-right`
- `🔍` (2) → `search`
- `⏱` (1) → `timer`
- `🔔` (1) → `bell`
- `📷` (1) → `camera`
- `💬` (1) → `message-circle`

Status indicators (KEEP):
- `🟢` (4), `🟣` (3) — Team Member / Internal badge chips
- `⚐` (6) — Dispute flag

### `0024_save_the_date.html` (129 remaining)

- `♫` (29) — music track glyph → migrate to `music`
- `▶` (24) — play button → migrate to `play`
- `→` (14) → `arrow-right`
- `✦` (5) → `sparkles`
- `♡` (5) — wishlist hearts → migrate to `heart`
- `⬇` (5) → `download` or `arrow-down`
- `★` (4) → `star`
- `🎬` (3) — director / clip clapper → migrate to `clapperboard`
- `🎵` (2) → `music`
- `🔗` (2) → `link`
- `📸` (2) → `camera`
- `💖` (1), `🤍` (1) — keep for emotional copy or migrate to `heart` variants
- `💍` (1) — wedding ring glyph → leave OR build a custom Lucide-style ring SVG (no first-party Lucide icon exists)
- Status / chrome misc: `🔥` (3), `✨` (3) — keep as accent emoji in headlines/body copy if needed; never as primary nav glyphs.

---

## 8. Rules summary

**Banned in customer-facing chrome (locked):**
- Emoji-as-icon in nav bars, action buttons, menu items, breadcrumbs, primary CTAs, sidebar items, tab strips.
- Geometric Unicode glyphs (`⌂ ◈ ▣ ▢ ◐ ◉ ▦`) used as icon proxies.

**Allowed (exceptions):**
- Status chips that explicitly reference emoji as part of the brand vocabulary: `🟣 Internal`, `🟢 Team Member`, `⚐ Dispute`, `★ Featured`, `✓ Verified`. These are content, not chrome.
- Emoji inside body copy / paragraphs / quoted user content.
- Vendor avatars / customer profile photos (image uploads, not glyphs).

**Sizes (locked):** 16px / 20px / 24px only.
**Stroke width (locked):** `1.75` default. Heavier (`2`) only when used inside a dark filled circle for contrast.
**Color (locked):** inherits `currentColor`. No `fill="#xxxxxx"` overrides in chrome.
**Theme contract:** because icons inherit `currentColor`, all five V1 themes (Setnayan Default / Victorian / Classy / iOS / Forest Theme) recolor icons automatically via CSS variables. No theme-specific icon overrides needed.

---

## 9. Verification commands

```bash
# Confirm script injection
grep -c 'LUCIDE_PATHS' <prototype>.html  # expect 2 (declaration + closing }, plus one find in dictionary)

# Confirm chrome icons migrated
grep -c 'data-icon=' <prototype>.html

# Confirm HTML still parses
python3 -c "import html.parser; html.parser.HTMLParser().feed(open('<prototype>.html').read()); print('OK')"
```

---

## 10. Changelog

- **2026-05-12** — Pilot pass landed across 0021 / 0022 / 0023 / 0024 prototypes. 155 chrome-icon replacements applied. Full dictionary (31 icons) shipped in each prototype's `<head>`. Spec drafted.
