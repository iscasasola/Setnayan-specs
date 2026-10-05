# Maker chrome — top nav · workspace · bottom nav (2026-10-05, Fable)

Prototype: `maker_keynote_chrome_2026-10-05_fable.html` (CSS only, no script) · JPGs `-1` … `-5` (≤ 900 px wide, ≤ 2,500 px tall, ≤ 600 KB each).
Extends `maker_toolbars_keynote_pages_2026-09-27.html` — does not contradict it: the part sheet's Text · Motion · Arrange sections (DECISION_LOG 2026-09-27) stay; "one picker, Stages + Pages" (2026-09-27) becomes the bottom nav's first item.

**Owner, verbatim, in order:** "only adapt what is favorable for us" · "all tools can only reside on the thumb area / lower third" · "i haven't changed the top nav" · "What I want is the shared pill style concept" · "apply should show a green color? exit on the left side is red with an X icon" · "top is addressing the overall of the event hub · bottom nav is addressing what and where we are editing" · "this is just repositioning mostly."

## The three zones (owner's words)

- **Top nav — the whole Event Hub.** ✕ Exit (red, its own pill) · the hub's name ("Maria & Jose · Event Hub", truncates) · [ ↺ Undo | 👁 Preview ] one shared pill · ✓ Apply (green, its own pill, with the change count). No "Invitation · as a guest sees it" title — it was cut at 375 px and the stage now reads in the bottom nav.
- **Workspace — the page being edited, full width.** Everything between the two navs. Its lower third holds the scene strip (always directly above the bottom nav, with "Add" as the last tile) and any open sheet (181 px, over the strip; rows scroll inside; only a drag raises it). Nothing floats over the page.
- **Bottom nav — what and where you are editing.** One bar in the shipped `BottomNav` look (`app/_components/nav/bottom-nav.tsx`: 64 px, 22 px icon + 10 px word, filled pill on the active item): [ Invitation · Welcome ▾ · Look · Details · Event Bar ]. The first item reads the current stage · scene (or the part being edited, e.g. "The Day · Guest's ticket ▾") and opens the one picker; Look opens the Look tools; Details opens Event Details; Event Bar is a show/hide switch (filled = on).

## The pill system (one component, used everywhere icons are grouped)

From Keynote's toolbar (the owner's reference `24.png`): a lone control gets its own soft rounded pill · related controls share ONE pill (thin divider between sub-groups) · a dropdown is value + chevron in its pill · the active one is a filled circle · even spacing, no labels. Applied to the top nav, the desktop bar, and (as words) the bottom nav. The only new code is this wrapper. No family colour on the Maker; if one is ever wanted it is Setnayan gold, never Apple purple.

## Kept / not kept, item by item

| Keynote idea | Verdict | Why |
|---|---|---|
| Shared pill style | **Kept** | Our own buttons in Keynote's shape — ✕ · [↺ \| 👁] · ✓ on the phone; the full bar on the desktop. |
| Exit as red ✕ at the left | **Kept** (owner) | "‹" read as *back one step*; ✕ in red reads *leave*. "‹" stays only inside a menu. |
| Apply as green ✓ with count, top-right | **Kept** (owner) | Still the one button that publishes; the count is the only "it changed" sign. Keynote's top-left ✓ is "Done" — not ours. |
| The "as a guest sees it" title | **Dropped** | Cut at 375 px; the stage reads in the bottom nav. |
| Keynote's mode icons (brush · diamond · rectangle) | **Not kept** | Owner: "not the point of the screenshot." No new modes; Look and Details stay what they are. |
| Keynote's icon group at the TOP (Preview · Undo · Add · Look · ···) | **Not kept** | Owner: tools live in the lower third; the top nav is the hub's four buttons only. |
| ··· menu card | **Not kept as a control** | The bottom nav holds the four doors; Page ▾'s non-page rows go to homes they already have (table below). |
| Tap a part → handles + its sheet (Text · Motion · Arrange) | **Kept** (from 2026-09-27) | Shipped `MakerHalfSheet` + `ISegmented`; now opens in the workspace's lower third. Not redrawn here (frame budget) — unchanged from the 2026-09-27 design. |
| Page stays visible above the sheet; live preview; Apply publishes | **Kept** | Already the rule (INTERACTION_RULES § 8); the sheet never grows upward on its own. |
| Guest's ticket: the real ticket + one dropdown | **Kept** | Daniel Ramos's Digital ticket with a real QR; the shipped `PickMenu` (Classic · Ticket · Photo poster) opens down inside the sheet; the pick waits for Apply (owner 2026-10-02, Q7). No sentences, no "Open your guest list" link. |
| Event Bar view | **Fixed by structure** | The blue scene block is intended (owner: "the blue is the scene showing or what is being edited") and stays. The switch is the bottom nav's 4th item, so it no longer floats over the page; strip → bottom nav is one fixed order, so the bar cannot jump above the strip or overlap a button. |
| Keynote's left slide rail | **Not kept** | Narrows the body. The scene strip is the rail. |
| Keynote's dark chrome · purple family colour | **Not kept** | Paper and ink; gold if ever. |
| Keynote's Arrange (position · rotate · lock · group) | **Not kept** | Arrange stays what ships; free dragging is a hard task ("FREE very easy, nothing hard"). |

## What moved from where (for the builder — repositioning only)

| Control | Shipped source | Goes to |
|---|---|---|
| ✕ Exit (red) | Exit link in `maker-shell.tsx` (`data-maker-tool="exit"`), icon `ChevronLeft` → `X` | Top nav, left, own pill |
| Hub name | the toolbar's title slot (`openStageWord` · "as a guest sees it"), `maker-shell.tsx` | Top nav: event name + "Event Hub" |
| ↺ Undo · ✓ Apply (green, count) | `hub-draft-bar.tsx`, mounted in the shell's `applySlot` | Top nav: Undo in the shared pill; Apply own pill, right |
| 👁 Preview + its menu | `maker-shell.tsx` `previewRows` / `MakerState.previewMenu` | Top nav, shared pill with Undo; the menu unchanged on the phone; on the desktop its rows become pills |
| Invitation · Welcome ▾ | Page ▾ (`makerPageMenu` · `PickMenu`), the phone bottom bar in `maker-shell.tsx` | Bottom nav item 1; its list opens as a lower-third sheet (Stages, with the open stage's scenes as chips) |
| Look · Details | the doors (`makerPressDoor`, `MAKER_LOOK_LABEL` / `MAKER_DETAILS_LABEL`) | Bottom nav items 2–3 (label "Details"; the page it opens stays "Event Details") |
| Event Bar switch | the canvas's "Event Bar" switch, `editor-shell.tsx` (`grep -n '"Event Bar"'`) | Bottom nav item 4, filled when on |
| Bottom nav look | `app/_components/nav/bottom-nav.tsx` (`BottomNav`, as `CustomerBottomNav` uses it) | the Maker's bottom nav, same component |
| Scene strip + "Add" tile | the phone navigator tiles, `editor-shell.tsx`; "＋ Add a scene" from `makerPageActions` | bottom of the workspace, directly above the bottom nav |
| Sheets | `MakerHalfSheet` (`maker-sheet.tsx`), sections on `ISegmented` (`inspector-kit.tsx`) | the workspace's lower third, over the strip (181 px) |
| Pass / Ticket style ▾ | `PassCardDesignPicker` (`pass-card-design-picker.tsx`) + `PickMenu`; words in `lib/pass-card.ts` | the Guest's ticket scene's sheet; the pick goes through the hub draft (Q7), not the prints door |
| Page ▾'s other rows — Reset · Prints · Restore · address · who can view · About | `makerPageActions`, `maker-bar.ts` | Prints → Details (the Prints group it already opens); address · who can view → Details › Your Event Hub (already there); Reset · Restore · About → 👁 Preview's menu under a "This stage" heading |
| Shared icon pill | new wrapper only | top nav, desktop bar |

## For the owner to settle

1. **"Pass style" or "Ticket style"?** Drawn as "Pass style" per the owner's note today; the shipped label is `PASS_CARD_WORDS.style = "Ticket style"` (owner 2026-09-29: it is a *ticket*, never a *pass*). One word, one line.
2. **Where Reset · Restore · About land** (👁 Preview's menu, as proposed) — or Details.
3. **Desktop:** the four bottom-nav doors sit in the top bar's middle pill (there is no bottom nav on a desktop) — fine, or keep a bar under the canvas?

## Not drawn (frame budget: "finish fast")

Look sheet open · part sheet open · Event Bar on — all follow the same rule (a sheet in the workspace's lower third; the blue scene block stays) and the 2026-09-27 designs.

## Round 2 (same day) — the lower third, re-ruled by the owner · frames 6–9

**Owner, verbatim gist:** "top nav handles the overall like apply, what screen we are working on. On the bottom third, the menu on the left part will have Global Settings (Theme · Settings · Details) and Stages (Save the Date · RSVP · Invitation · The Day · Post Event). Then on the navigator, the first part will be what specific part of the menu picked — e.g. on RSVP there is the RSVP, when yes, when no — then the different scenes." · "when we pick on an element, the scenes will then become a slim toolbar? and the functions on the element chosen will show?" → then: "instead of showing a slim version, just collapse it on the left" · "we are only working on the lower third for all editing on mobile view" · "make sure it doesn't feel too cramped" · "find the best approach for this".

**What changed vs round 1:** the bottom nav (Look · Details · Event Bar) is gone — those are now rows of ONE menu. The top nav's label is the screen you are on ("RSVP · RSVP form"). Everything editable lives in the lower third; nothing opens upward over the page, not even the menu.

**Two arrangements tried at 375 × 667 (frame 9):**
- A · menu button (72 px) beside the strip: 3 tiles of 76 px, labels 9.5 px — runner-up.
- **B · a "where you are" row (menu ▾ + current pick, 44 px) above full-width 96 px tiles, 3½ showing — winner** (calm: bigger tiles, readable labels; reach: everything in two thumb rows; clarity: one line of words says where you are).

**The element-picked state (frame 8, 375 × 667) — the owner's left-collapse, chosen:** menu + navigator collapse sideways into a ≈ 56–60 px left column (the element's mini-picture, its short name, ‹ › to step, × to finish; tap the picture = back to the navigator); the tools take the rest (≥ 285–300 px): shipped `Text · Motion · Arrange` segments + grouped rows (label left, dropdown/toggle right; sliders span; wide pickers scroll sideways inside); ~3 rows at rest without scrolling. The slim-bar variant (frame 9, lower pair) is the runner-up: full width for the tools but the bar eats 52 px, so only 2 rows at rest on a 667 phone.

**Shipped sources for the new rows:** RSVP parts = `RSVP_STAGE_SCENES` (`lib/rsvp-stage.ts`: RSVP · After they submit · When they decline = the owner's "RSVP · when yes · when no"); RSVP scenes = `stage-scenes.ts` `rsvp:` list; stages = `MAKER_PAGE_STAGES` (maker-bar.ts); Theme = the Look door; Settings = the Event Bar switch (editor-shell.tsx) + "Who can view" + Prints (makerPageActions); Details = the Event Details door.

**Interactive prototype (CSS only, animated):** `maker_lower_third_interactive_2026-10-05_fable.html` — see its own notes at the top of the file.

### The interactive prototype — `maker_lower_third_interactive_2026-10-05_fable.html`
CSS only (no `<script>`; hidden radios + `:checked`), animated (200–280 ms, ease-out in / ease-in out, instant under Reduce Motion), self-contained except Google Fonts. Real: the menu (Global settings · Stages) as a sheet inside the lower third; picking a stage switches the top-nav label, the page and the navigator (RSVP · Invitation · Theme · Settings · Details · Save the Date · The Day · Post Event all have navigators; RSVP's three screens and the Invitation's four pages are real pages); navigator tiles show their part on the page; tapping a part of the Invitation page (Your mark · Names · Invitation line · Date) → handles, the navigator collapses sideways into a 52 px left column (mini-picture · name · ‹ › · ×), the tools slide in (Text · Motion · Arrange, grouped rows; wide pickers scroll sideways); × / the picture / empty page → back. An auto-demo strip at the top loops menu → RSVP → tap names → tools → ×. Undo · Preview · Apply are drawn only.
**Fit:** at 375 px with no scrollbar the tools area is 307 px (lower-third padding 4 px, column 52 px, gap 8 px); on screens ≤ 420 px the phone bezel is dropped so the frame is the real 375.
