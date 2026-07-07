# COWORK Mode Instructions — Setnayan Project

> The single file that teaches Cowork mode how to navigate, read, and modify this project. Read by Cowork sessions on project entry. Locked 2026-05-12.

## What Cowork is

Cowork is a desktop-AI mode for non-developers to automate file and task management. Setnayan is being **designed** (specs, prototypes, decisions) through Cowork sessions. The actual code build happens later via Claude Code (see `CLAUDE_Code_Build_Prompt.md`). Cowork's job here is to:

- Read and synthesize project state across many .md / .html / .docx files
- Update specifications when the owner makes new decisions
- Generate new iteration drafts on request
- Maintain the decision log in CLAUDE.md
- Preserve learnings to memory for future sessions
- Generate stakeholder-friendly deliverables (.docx mirrors via pandoc)

Cowork does NOT typically write production code — that's Claude Code's job.

## How to start a Cowork session on this project

1. **First file to read:** `CLAUDE.md` — auto-loaded; the decision history
2. **Second file:** `README.md` — folder map (or this file if user opens Cowork directly)
3. **Memory files:** Check the session memory directory for project-specific patterns
4. **User's first message:** The user tells you what they want to work on; you orient yourself in the relevant iteration folder

## Folder navigation rules

- **Iteration folders (`0000–0024`)** are the unit of work. Each contains a `.md` spec, `.html` prototype, and `.docx` mirror. When working on an iteration, you almost always touch all three.
- **`01_Contracts/`** is for legal/business agreements. Edit only when the user dictates new operational rules.
- **`02_Specifications/`** is for high-level cross-iteration specs. Treat as appendix material to the iteration folders.
- **`03_Strategy/`** is for competitive analysis, market research, pitch decks. Read-only for engineering decisions; reference when user asks for business context.
- **`04_Marketing/`** is for customer-facing collateral. Update when the brand or feature copy changes.
- **`05_Financials/`** is for pricing workbooks. Coordinate with CLAUDE.md SKU table — both must stay in sync.
- **`06_Prototypes/`** is for standalone HTML mockups outside the iteration system. Older artifacts.
- **`07_Archive/`** is retired content. Read for context, never as canonical reference.

## What stays in CLAUDE.md vs. memory

- **CLAUDE.md decision log** — every locked decision with date, what changed, why. Read on every session start.
- **Memory files** — patterns and rules that apply across iterations. Updated when a meaningful new rule emerges.
- **Iteration .md** — the canonical spec for that iteration. Updated when scope changes.

Memory wins over CLAUDE.md only when memory is more recent. Iteration .md wins over both for surface-specific details.

## Decision update workflow

When the user dictates a new decision in a Cowork session:

1. **Capture the decision** — write it as a single paragraph with what + why
2. **Add to CLAUDE.md decision log** — append at the bottom in date order
3. **Update affected iteration .md files** — apply the rule consistently
4. **Update memory** if the rule is cross-iteration (e.g., a new UX pattern)
5. **Update `MEMORY.md` index** — point at the new memory file
6. **Regenerate .docx mirrors** for any modified .md files (pandoc)
7. **Acknowledge to user** — succinct summary of what changed

## Iteration drafting workflow

When user requests a new iteration:

1. **Pick the next available number** — check CLAUDE.md iteration table for last-used
2. **Create folder** `NNNN_short_topic_slug/`
3. **Write the .md spec** — use the established structure (scope, SKU, schema, surfaces, mobile parity, forward deps)
4. **Build the .html prototype** — web + mobile parity, using the canvas pattern from `0001_creating_guest_list/0001_creating_guest_list.html` as template
5. **Generate the .docx mirror** via pandoc
6. **Update CLAUDE.md iteration table** — add the new row with status "drafted YYYY-MM-DD"
7. **Update memory** if the iteration introduces a new pattern
8. **Update README.md** — add the new iteration to the folder map

## Brand consistency rules

- **Wordmark:** SETNAYAN (always bold uppercase, never italic, "SETNAYAN" (the consonant-only stylization is retired))
- **Symbol mark:** the SVG at `public/setnayan_logo.svg` (or `0015_main_website/setnayan_logo.svg` in current state). Recolored via CSS mask-image.
- **Colors:** `--accent` terracotta `#C97B4B` for customer/vendor; `--admin-purple` `#6E5BAD` for admin chrome
- **Voice:** EN-primary, luxurious-Filipino-modern. TL + CEB localizations for marketing-site copy.
- **Pricing:** -1 charm pricing across all SKUs (₱49, ₱99, ₱199, ₱499, ₱999, ₱1,499, ₱1,999, ₱2,499, ₱2,999, ₱4,999)

## When to use the .docx generator

After modifying any iteration `.md` file, regenerate the `.docx` mirror so stakeholders can review in Word:

```bash
pandoc 0024_save_the_date.md -o 0024_save_the_date.docx --reference-doc=/path/to/template.docx
```

Or use the docx skill (read `/var/folders/.../skills/docx/SKILL.md` for the best-practice approach).

## When NOT to do something

- **Don't delete files** — only mark them as retired/superseded with a tombstone notice. The Cowork delete-permission flow needs interactive approval which isn't always available.
- **Don't move files mid-conversation** unless the user explicitly requests reorganization. Moving breaks references in HTML/prototype files.
- **Don't introduce new vendors/services** without user dictation. If a feature needs an external SDK, flag it in the spec and ask before adding.
- **Don't generate production code from a chat session.** Code lives in the repo, built by Claude Code with the build prompt. Cowork prototypes are HTML mockups.

## Conversation patterns

When the user types:

- *"X is the rule, lock it"* → add to decision log + memory + relevant iteration spec(s)
- *"Build me iteration NNNN for [topic]"* → run the iteration drafting workflow above
- *"What does iteration NNNN say about Y?"* → read the spec + summarize; don't dump the full file
- *"Apply X to all prototypes"* → use Python/bash sweep with care; verify before mass-editing
- *"What's the price of Z?"* → check CLAUDE.md SKU table; if it says ₱X,000 round price, flag (should be -1 charm pricing)
- *"Show me a prototype of Y"* → open the iteration HTML in a browser; describe what's in it
- *"Save this to memory"* → write a new memory file + update MEMORY.md index

## Prototype interactivity rule (LOCKED 2026-05-12)

Every iteration's `.html` prototype MUST be **clickable and reactive**, not a static screenshot:

- Every button must have a hover state + active state (CSS or JS)
- Every tappable card opens a detail view, a modal, or transitions state
- Every navigation element actually navigates (or animates the transition)
- Every form field accepts input (visible focus state)
- Every toggle switches state
- Carousels auto-scroll OR respond to swipe
- Modals open with a click and close with X / Escape / backdrop tap

When Cowork generates a new iteration, the HTML prototype must demonstrate **how the app reacts**, not just what it looks like. Hover-reveal play arrows on template cards, click-to-open modals, animated state transitions — these are mandatory, not optional. The HTML mockup is the visual + behavioral contract for Claude Code's later implementation.

## Theming system (LOCKED 2026-05-12)

Customers and vendors can choose how their pages look. Five themes ship in V1 (canonical list per `02_Specifications/Theme_System_Implementation_Spec.md`):

1. **Setnayan Default** — warm cream + deep burgundy accent + Cormorant italic display + Manrope body. The platform brand baseline (accent swapped from terracotta to burgundy 2026-05-15; name unchanged).
2. **Victorian** — aged paper + deep burgundy + gold leaf + ornate Playfair italic + flourish dividers. For couples leaning Bridgerton / classical / heritage-formal.
3. **Classy** — ivory + champagne gold + Cinzel display + generous whitespace. For couples leaning understated elegance.
4. **iOS** — system-grey + system-blue + Apple-Settings rendering. For users leaning native-app convention. (Earlier drafts of this section incorrectly listed "Modern Minimalist" as the fourth theme; the shipped implementation is iOS per the Theme System Implementation Spec.)
5. **Forest Theme** — warm off-cream + deep forest accent + champagne gold secondary tint + modern editorial typography. For vendor-grounded / professional surfaces (added 2026-05-15).

Each theme is implemented as a CSS variable bundle that swaps the color tokens + font stack + key layout rules. Theme picker lives in:
- **Customer:** Settings → Appearance → Theme (affects landing page, dashboard chrome, render outputs where theming applies)
- **Vendor:** Vendor Pro Weekly subscription unlocks theme picker for the vendor landing page (`setnayan.com/v/{slug}`)

The Save-the-Date templates already have feel-categories (Bridgerton, Modern, Heritage Filipino, etc.) — those are *template* themes, not platform-level themes. The four themes here are the **chrome / dashboard / landing page** level.

## Minimalist icon system (LOCKED 2026-05-12)

All icons across the platform use **Apple Settings-style minimalist outline icons** — single-color line-based, consistent stroke weight, easy to recognize at small sizes. Forbidden:

- ❌ Emoji as icons (✦, ♥, 🏠, 📷, 💬)
- ❌ Filled / solid icons in customer-facing chrome (acceptable for active states only)
- ❌ Mixed icon families (don't combine Heroicons + Material + custom)

**Recommended icon library:** Lucide React (`lucide-react` — successor to Feather Icons, MIT licensed, ~1,500 icons, consistent 24×24 viewBox with 2px stroke). Loaded as React components in production; inlined as SVG in prototype HTML files for Cowork.

**Icon usage:**
- Stroke color inherits from CSS `currentColor` so theme switches recolor icons automatically
- Default stroke-width: `1.75` for body usage; `2` for emphasis
- Size: 16px / 20px / 24px (use these three; avoid arbitrary sizes)
- Always paired with a text label (no icon-only buttons in customer surfaces except universally recognized: search, close, menu)
- Decorative icons get `aria-hidden="true"`; meaningful icons get `aria-label`

## What's actually built vs. drafted

- **Drafted but not built (most iterations):** spec + HTML prototype + .docx mirror exist; production code does not
- **Sprint 0 prereq:** Iteration 0013 must build first (platform stack setup); see `API_Integration_Checklist.md`
- **No production code yet** — entire project is in design phase as of 2026-05-12

When the user asks about implementation status, default to: "drafted, not yet built." The build starts after API_Integration_Checklist.md is complete.

## Quick reference card

| User says | You do |
|---|---|
| "What's the price of [SKU]?" | Check CLAUDE.md table; quote in PHP with -1 ending |
| "Add a feature" | Spec it first in the appropriate iteration .md, then prototype |
| "Lock this decision" | CLAUDE.md decision log + memory file + iteration update |
| "Build me iteration X" | Folder + .md + .html + .docx; update CLAUDE.md table |
| "What does the spec say about Y?" | Read the iteration spec; quote the relevant section |
| "Apply X across all prototypes" | Use Python sweep with care; verify; commit summary |
| "Generate a stakeholder doc" | pandoc .md → .docx, or write a new .docx via docx skill |
| "Show me a prototype" | Open the .html file; describe what's there |
| "Delete this" | Tombstone with retirement notice — actual delete needs interactive permission |

## Setnayan's V1 north stars (preserve in every Cowork session)

1. **Apparatus pricing rule** — every SKU prices the tool, not time or labor. ₱49 unlocks a render; not "₱49 per share."
2. **PHP-direct apply-then-pay** — no token wallet, no PayMongo (V1.5+). Static BDO + GCash + manual reconciliation, 24-hr SLA.
3. **Mobile + web parity always** — every iteration ships both viewports.
4. **Charm pricing** — round numbers get -1 (₱500 → ₱499).
5. **Filipino warmth in EN voice** — luxurious, modern, not marketing-y. "Set na 'yan." is the heartbeat.
6. **Couple ≠ couple-only** — customer model supports 2 co-organizers, 1 user across many events.
7. **Privacy first** — RA 10173 compliant; face vectors per-event-scoped; 5-year event retention.
8. **0% commission · no Setnayan Pay convenience fee** — the 3%→5.0% fee was RETIRED at the 2026-06-07 reset (vendors settle off-platform).
9. **Tier-strict marketplace ranking** — Boosted > Certified > Standard Verified.
10. **Seven granular admin roles** with two-admin approval for provisioning + role changes.

---

*This file is the Cowork-mode contract for this project. Treat it as canonical for navigation rules. If a rule in here conflicts with CLAUDE.md, CLAUDE.md wins for substantive decisions; this file wins for workflow/navigation.*
