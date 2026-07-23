# Setnayan Reskin Handoff — for Claude Code

Goal: restyle **www.setnayan.com** (public site + app) to the "Atelier + macOS glass"
look. The site's structure, copy, routes, video hero, interactive demos and
performance are already good — DO NOT change them. Only the skin changes.

## Files
- `setnayan-tokens.css` — design tokens + component classes (buttons, inputs, cards, chips, glass). Load first.
- `setnayan-animations.css` — the full motion library (entrances, loaders, data viz, live signatures, accordion, overlays).
- `Setnayan UI Kit.dc.html` — visual spec of every component (open in a browser).
- `Setnayan Animation Kit.dc.html` — live motion spec with code per pattern.
- `Setnayan Design System.dc.html` — the full reference: foundations, components, surfaces, IA.
- `Setnayan Glass Dashboard.dc.html` — target look for the dashboard, desktop + mobile.
- `Setnayan Screens.dc.html` — every page (site, dashboard, app pages, PDFs) in the new language.

## Apply in this order
1. Load fonts: Hanken Grotesk (400–800) as UI font, Space Mono for data/prices/dates.
2. Include `setnayan-tokens.css` + `setnayan-animations.css` globally.
3. Page backdrop: `.sn-ambient` on glass pages (app); marketing site keeps its near-white paper.
4. Restyle component-by-component against the UI Kit: buttons → `.sn-btn-*`,
   inputs → `.sn-input`, cards/tiles → `.sn-card`, chips → `.sn-chip`, badges → `.sn-badge-*`.
5. Replace unicode glyphs (◈ ¶ ▦ ₱ ◷ ⬡) and emoji chips with Lucide line icons (1.75px stroke).
6. Motion: entrances via `.sn-reveal` (+ scroll gate), bars via `.sn-bar`,
   expand/collapse via `.sn-acc`, modals via `.sn-modal` over `.sn-scrim`.

## Hard rules
- Frame only what's interactive; plain text sits on the backdrop unframed.
- One gold primary CTA per view.
- Pulse animation ONLY on genuinely live states.
- Warm shadows only: rgba(30,26,18,·).
- Ship the prefers-reduced-motion guard (already in the CSS).
- Do not touch: IA/section order, copy, "kept forever" litany, hero videos,
  Papic/Live Studio/3D demos, routes, breakpoints, Next.js/Sentry setup.
