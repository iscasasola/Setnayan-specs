# Seat_Plan_Controls_Council_Verdict_2026-07-17

**Scope:** Seat-plan control-surface redesign, presentation/interaction only. No route, action, or schema changes — `changeStyle`, `toggleSeat`, `doUnlink`, `linkTables` server actions are untouched. Recon baseline: origin/main @ c84a6ed (post-#3330). Files: `apps/web/app/dashboard/[eventId]/seating/_components/seating-editor.tsx` (SE), `seating-frame.tsx` (SF), `lab/_components/seating-lab-3d.tsx` (L3) in `~/Documents/Claude/Projects/setnayan-platform`.

**The organizing ruling (unanimous across all four proposals):** the canvas today grows four competing contextual surfaces — the table-anchored popover (SE:5749-5953), the floating picked-guest/group/notice pills (SE:4430-4492), the always-on marker micro-control scatter (SE:4574-5213), and the per-seat × chips (SE:5452-5467). All four collapse into **one Context Dock**: a single docked contextual surface at bottom-center of the canvas, in the exact slot the floating pills already own. One place to look, one glass recipe, structurally incapable of occluding the selection. The phone bottom sheet stands (constraint) and becomes the dock's sibling — one component family, two densities, identical verb order.

---

## 1 · Per-object control surface — the Context Dock

### 1.1 Placement rule ("never occludes")

- Delete the anchored popover and its POP_H=52/380 flip heuristic entirely (SE:5749-5953, SE:5761-5767). No anchored per-object chrome survives except the rotate handle (§2).
- The Context Dock renders **fixed bottom-center of the canvas viewport**, width-clamped, refactored out of the floating-pill slot (SE:4430-4492).
- **Occlusion rule — deterministic flip, no camera movement:** if the selected object's screen-space AABB intersects the dock rect, the dock renders **top-center** instead. Two positions, zero measurement guesses, zero auto-pan. (Kit-coherence's auto-nudge pan is REJECTED — §9.)
- Attached panels (SeatPeoplePanel, shape picker) expand **away from the occupied edge** — upward when the dock is bottom, downward when top — with a **real measured max-height** (gap to the command bar / canvas edge) and internal scroll. The 380px height constant dies.
- The dock always echoes the selected object's **type glyph + name** so the referent is never lost; the selection ring + `.sn-bounce` remain the on-canvas anchor.
- **State precedence — exactly one dock state at a time:** picked-guest pill > picked-group pill > selected-object bar (edit-chairs banner is a variant of this state) > notice. When the dock is occupied by a higher state, notices fall back to the command-bar "N notices" expander (SE:4169-4179). The picked-guest/group pill content is unchanged (avatar, "tap a chair or a table", Unseat, X).

### 1.2 Selected TABLE — desktop dock, one row, in this order

1. **Type glyph + Name** — inline click-to-edit field; blur/Enter=commit, Esc=revert unchanged (SE:5845-5859).
2. **Seat people** — icon + label, the dock's emphasized verb (NOT gold — gold stays on Auto Arrange, §8). Opens `SeatPeoplePanel` (SE:6554-6748) **attached to the dock**, expanding away from the edge per §1.1. Panel contents unchanged: Guest/Group/Role tabs, type-ahead search, `seated/cap · N free` readout, tap-to-seat rows, "Seat a tier here" rows. **Addition:** seated rows inside the panel gain a per-row Unseat for parity with List rows.
3. **Seats stepper** — `− 8/10 +` mono readout (new presentation over `toggleSeat`; semantics in §3).
4. **Rotate cluster** — ⟲ · mono `{deg}°` · ⟳ (±15°); the readout is click-to-type exact degrees (§2).
5. **⋯ overflow** — always labeled text items, never bare icons:
   - **Change shape…** (§4)
   - **Edit chairs…** (§3, surgical mode)
   - **Rotate 180°** (§2)
   - **Break apart** — legacy `link_group_id` only (SE:5875-5885), re-iconed `Ungroup`; the row is hidden entirely when the event has no legacy groups.
6. **| divider · Trash2 · X Done** — delete keeps confirm-if-seated / instant-if-empty (SE:988-1001, dialog 6258-6307), destructive tint, separated from the high-frequency verbs by the overflow + divider. Delete stays top-level (one-tap delete matters during drafting; the confirm is the guard).

**Removed from the toolbar:** the row-2 `TableStylePicker` native `<select>` (SE:5930-5932 → §4), the top-row Flip button (SE:5904-5911 → §2), the per-seat ×/+ chips as a default state (→ §3).

**Canvas keyboard parity:** Delete/Backspace deletes the selected object (same confirms); Esc deselects / exits edit-chairs mode; Enter commits the name field.

### 1.3 Phone (<768px) — the existing bottom sheet, reordered to dock parity

Sheet rows (SE:5625-5747 pattern stands, all targets ≥44px / h-11; forced drawer-peek on select SE:3470 unchanged):

1. Name field · 2. **Seat people** (labeled — expands the sheet to the half snap with SeatPeoplePanel; Done returns) · 3. Seats stepper row · 4. Rotate row: ⟲ · `{deg}°` · ⟳ · **180°** chip (phone keeps 180° at one tap — twelve taps to flip is unacceptable) · 5. ⋯ row: Change shape… / Edit chairs… / Break apart (legacy) · **8px gutter** · 6. **Delete** (labeled, destructive tint, last actionable row) · 7. Done.

### 1.4 Markers, booths, signs — join the same selection model

Tap = select (ring) → that object's verbs render in the dock. The always-visible ×/toggle scatter (SE:4574-5213) is **deleted**. Drag-to-move always works without selection (unchanged). Resize grips render **only while selected**. Per-type dock contents:

| Object | Dock contents (in order) |
|---|---|
| **Booth** (SE:4930-5161) | Label echo (vendor name / "SETNAYAN") · the existing type-picker content as dock panel: booked-vendor rows (`setBoothVendor`), Station rows (`STATION_BOOTHS`), Offerings textarea 280ch · **Remove** · Done. Perimeter-snapped drag + metric footprint unchanged. |
| **Entrance** (SE:4808-4899) | **[Door \| Walk-through]** segmented · depth stepper −/+ (1.5–8m ×0.5, tunnel only) · **Remove** · Done |
| **Cocktail** (SE:4648-4716) | **[With entrance \| Separate]** — *text* segmented, Link2/Unlink glyphs deleted (SE:4673-4693) · **Remove** · Done · grip while selected |
| **Dance floor** (SE:4574-4617) | **Remove** · Done · grip while selected |
| **Service door** (SE:4903-4928) | **Remove** · Done |
| **Sign** (SE:5164-5213) | Inline **rename field** — the double-click `window.prompt` (SE:5173-5176) is deleted · rotate cluster at **45° steps** (§2) · **Remove** · Done. Cap 24 unchanged. |
| **Stage** (SE:4720-4752) | "Stage · permanent" note · Done · grip while selected — **still no remove** (honest permanence) |

Room-size W/L MetreSizeFields stay in the room-size popover (SE:4352-4417) — the dock does not duplicate them (one verb, one home).

### 1.5 View-only honesty (all four proposals)

Tables-pane row click currently opens enabled-looking controls that silently no-op in view-only (SE:942-1014, 3714-3720). Ruling: when `!canEdit`, the dock renders a **read-only summary** (name · seated/cap mono) plus exactly one **"Edit / Take over"** button. Disabled must look disabled; silent no-op is banned.

---

## 2 · Rotation ruling — canonical set

**KEEP — four affordances, one increment law:**

1. **Drag rotate-handle pill** (desktop, on-object — the only surviving on-object chrome). 15° snap, **Shift = 1°**, group-aware orbit + blocked-rotation notice unchanged (SE:5775-5838). New canonical position: **12 o'clock** on the object — "opposite the popover" (SE:5775) dies with the popover. First-hover tooltip: "Drag to rotate · Shift = 1°".
2. **Two-finger twist** (touch), 15° snap — unchanged (SE:2186-2215).
3. **Dock/sheet ⟲ / `{deg}°` / ⟳ cluster**, ±15°, press-and-hold repeat — the accessible/keyboard path. The mono readout is **click-to-type exact degrees** on desktop (Enter commits, Esc reverts) — precision without more buttons.
4. **3D lab ⟲/⟳ ±15°** (L3:5057-5058) — kept; the lab has no pointer handle.

**Increment law:** tables/booths = 15° snap · 1° fine (Shift or typed) · 180° as a named verb. **Signs = 45° steps** via the same dock cluster (their ⟲/⟳ step 45°) — the coarse tier matches shipped muscle memory; only the control's *home* moves (the ambient on-pill 45°/tap at SE:5192-5201 is deleted).

**Flip 180°:** loses its top-row seat everywhere. Desktop → overflow item **"Rotate 180°"**. Phone → **180° chip** in the sheet's rotate row (one-handed twist through 180° is awkward; 12 taps is worse).

**DELETE:** the desktop Flip button (SE:5904-5911) · the sign ambient tap-to-rotate (SE:5192-5201) · nothing else — no proposal's suggestion to delete the desktop ±15° buttons or the handle survived (§9).

---

## 3 · Seat-chip ruling

The per-empty-seat delete-× chips (SE:5454-5467) and restore-+ ghosts (SE:5375-5392) are **deleted as a default state**. They read as "remove this guest slot" and blanket the canvas. Two replacements, frequency-ordered:

1. **90% path — Seats stepper** in the dock (`− 8/10 +`, mono): `−` calls `toggleSeat` on the **highest-index empty** seat (disabled when every remaining seat is occupied); `+` restores the **lowest-index removed** seat (disabled when none removed). Every removal fires a transient inline notice in the dock: **"Seat N removed · Undo"**.
2. **Surgical path — "Edit chairs…" mode**, entered from the dock overflow. In-mode: the canvas tints, the dock shows a banner — *"Editing chairs — tap a chair to remove, a ghost to restore · Done"* — and ONLY THEN do the ×/+ chips render, with hit-areas padded to **≥44px** regardless of rendered chair size at `DETAIL_AT` zoom (SE:2168). Exits on Done, Esc, deselect, or guest-pick. This is the 3D lab's shipped grammar ("tap a chair to remove or restore") — 2D/3D become consistent for free.

**Ambiguity killed structurally:** chairs are edited only in edit-chairs mode; people are unassigned only via the picked-occupant pill Unseat, the List-row Unseat (SE:6109-6116), and the new per-row Unseat inside SeatPeoplePanel. Outside the mode, chair taps mean only people: occupied = pick occupant, empty = seat the picked guest (SE:5400-5450, unchanged).

---

## 4 · STYLE / shape-change home

Out of the toolbar entirely (SE:5930-5932; phone SE:5703). New home: dock **overflow → "Change shape…"** (3-of-4 majority over a top-level slot), opening a **visual shape picker** — desktop: panel attached to the dock; phone: sheet page 2:

- The 13-type catalog in its 5 family groups (from SE:6440-6470's data), each type a **footprint glyph + mono capacity**, current type ringed.
- Selecting a type **ghost-previews the new footprint on canvas** and shows a one-line impact readout: "keeps all 8 seated" or warm "2 guests will need reseating".
- **Commit gate:** single-tap apply when the table is empty; explicit **Apply / Cancel** when anyone is seated. `changeStyle` fires only on Apply — never on select (today's instant-swap native `<select>` is one mis-click from a destructive re-instantiation, and a poor touch target besides).
- **Reuse the same picker in `AddTablePanel`** (SE:6813-6934) so shape choice looks identical at create time and change time. The Chinese-#4 advisory and capacity cap stand.
- The 3D lab's table-type `<select>` gains the same seated-guard copy (copy only).

---

## 5 · Page-toolbar refinements

1. **BarMenu close bug — the highest-leverage fix** (SF:190, `onClick={() => set(false)}` on the container). Menus close only on **leaf action activation** (`data-close` per item); steppers, radios, checkboxes, and text inputs keep the menu open. Arrange's walkway ±0.1m stepper and the Share menu's 3D-photo-visibility radios must survive a click.
2. **Arrange becomes what it is — a stay-open settings panel** (one trigger, panel semantics, Done to dismiss; sheet on mobile). It holds **policies only**: Auto-seating On/Off, Keep-groups-together, Walkway presets + stepper + "N too close" audit, **plus "Room size & scale…"** (moved in from + Add — it's policy, not a placeable). Badge-dot logic unchanged.
3. **Auto verbs consolidate into a gold split-button.** Primary = **Auto Arrange** ("Auto" on phones), with the 3-step confirm modal (SE:6170-6219) compressed to **one dialog** — the three facts as bullet lines + one gold Confirm. Caret = **"Build my seating draft"** + **"Fill around N locked"** (moved out of Arrange SE:4022-4092; Fill-around keeps its own confirm SE:6223-6254). *Implementer check:* if "Build my seating draft" invokes the identical flow to Auto Arrange, delete the caret duplicate and rename the primary "Auto-arrange" (flag the label to the owner — §12).
4. **+ Add is purely additive** — loses "Room size & scale…"; the passive scale bar (SE:5534-5544) becomes **clickable → room-size popover** as the spatial doorway to the same popover.
5. **Stats chip → doorway** (SE:4123-4140): shows the one actionable number — **"N to seat"** mono. Tap flips the People pane to the unseated filter ("Only show unseated" on); full readout (`seated/cap · tables · unseated`) in the press/hover popover. **Phone:** "N to seat" moves onto the **drawer peek handle** (SE:6144-6167) — prime thumb real estate, replacing the <sm-hidden chip.
6. **SaveStatusChip — permanent, tiered** (SF:278-331): Saved = quiet muted text · "N unsaved" = ink/70 + dot · Saving = spinner · **Retry = warm, the only loud state**. Phone: condenses to icon + state dot, tap to expand. ⌘S, beforeunload guard, lab dirty-marker unchanged (SE:3320-3378).
7. **Peer pills** collapse to an avatar stack + "+N" (still hidden <md). View-only pill with Edit/Take-over unchanged.
8. **Phone right edge:** ≥8px gutter between ⋯ More and the gold Auto button — a mis-tap neighboring a bulk-reseat verb is expensive even with a confirm.
9. **Zoom cluster:** targets ≥44px, **Fit** first/largest. Wheel/pinch/wall-grips unchanged.
10. **Mobile ⋯ More** keeps the 3-body concatenation, gains **Add / Arrange / Share section headers**.
11. Banner slot + priority (DayOf > shortfall > walima, SE:3412-3445), view segment incl. 3D Save-&-view, Share & print body: **unchanged**.

---

## 6 · Legacy / link-era deletions (honesty rule)

Linking is a removed feature (owner 2026-07-16, "connect by drag snap, not by linking" SE:5873); creator UI for removed features is deleted, presentation-only:

1. **DELETE the 3D lab "Link to another table" arm-then-tap flow (L3:5095-5110).** The `linkTables` server action stays untouched. "Break apart" stays in both views for legacy groups.
2. **Break apart** (2D + 3D): overflow item, labeled, **`Ungroup` icon**, rendered only when `st.link_group_id` exists; the row disappears entirely when the event has no legacy groups.
3. **Glyph de-collision — `Unlink` currently carries 4 meanings; after this pass it carries zero:** break-apart → `Ungroup` + label · keep-apart rule rows (SE:3841) → text badge **"Keep apart"** · relax-rule (SE:3877) → text button **"Relax"** · cocktail dock toggle (SE:4690) → the worded **[With entrance | Separate]** segmented, no chain glyphs. `Link2` survives only as the passive grouped badge on legacy Tables-pane/List rows (SE:3730, 5999), retitled **"Grouped (legacy)"**.
4. Tap-to-link on canvas: already retired (SE:2699-2701) — stays dead.

---

## 7 · Empty state + first use

**Empty floor** — replace the CTA card (SE:5216-5246) with a **blueprint-styled starter card** (faint dashed room outline + ghost table) sequencing three existing verbs as check-off steps (checked as state changes; no new actions):

1. **Set room size** → room-size popover (SE:4262)
2. **Add your first table** → AddTablePanel with the shared shape picker
3. **Build my seating draft** — **gold on this view**: gold transfers here because Auto Arrange is meaningless on an empty floor; the command-bar Auto button renders **disabled-with-reason ("Add tables first")** — honest, not hidden. Still one gold per view.

**One-time coach layer** — max 4 hints, localStorage-flagged (same mechanism as the tab-persist key SE:751-767), dismiss-forever, no tour library, no motion under reduced-motion:

1. First table selection, on the rotate handle: *"Drag to rotate · Shift = 1° · drag tables near each other and they snap together"* — teaches connective snap, the mental model linking used to own.
2. First zone/marker added: *"Tap anything on the floor to edit it"* — the discoverability bridge for the newly selection-gated marker controls.
3. First edit-chairs entry: the mode banner copy IS the hint.
4. Phone only, once ≥1 table exists (List default SE:715-722): one nudge on the [2D·3D·List] segment — *"See your floor plan."*

First guest pick already self-teaches via the pill — unchanged.

---

## 8 · Kit-compliance notes (Atelier-Glass)

- **Gold budget:** one gold per view. Command bar = Auto Arrange split-button. Empty floor = the starter card's "Build my seating draft" (command-bar gold disabled-with-reason). The dock's "Seat people" is emphasized, never gold.
- **Blur budget:** the dock is sn-glass and **replaces** a blur surface (the popover); SF's command bar remains the page's only other chrome blur. Net blur count unchanged.
- **Targets:** every touch control ≥44px — phone sheet rows h-11, edit-chairs chair hit-areas padded ≥44px independent of zoom, zoom cluster, drawer handle.
- **Labels vs icons:** overflow items are always labeled text; destructive verbs are labeled + warm-tinted and never adjacent to high-frequency verbs (divider/gutter separation); primary dock verbs are icon+label ("Seat people" always labeled). One glyph = one meaning (§6.3).
- **Mono for numerics:** `{deg}°`, `8/10` seats, "N to seat", capacity per shape swatch.
- **Warm/danger reserved** for: Retry save, delete confirms, reseating-consequence lines.
- **Reduced-motion:** no `.sn-bounce`, dock transitions, or coach animation under `prefers-reduced-motion`.

---

## 9 · REJECTED ideas (with reasons)

| Rejected | Source | Why |
|---|---|---|
| Re-home SeatPeoplePanel into the left panel / drawer "target mode" | canvas-tool, ia-simplicity | Entangles the single most-used verb with persisted tab state (SE:751-767) + phone drawer choreography (SE:3470, 3472-3493) — the highest regression surface in the file, for zero occlusion gain over the dock-attached panel (canvas-tool's own risk #3 concedes this). |
| Auto-nudge camera pan on select | kit-coherence | A pan that fights the user's own pans reads as jumpy; the deterministic bottom/top dock flip covers occlusion without moving the camera. |
| Modeless chair-as-control (tap empty chair toggles removed when nothing picked) | ia-simplicity | Empty-chair tap flipping meaning on pick state invites accidental capacity edits right after seating someone (ia's own risk #3). |
| Delete Flip/180° entirely, rely on a presets menu | canvas-tool | "Face the other way" is a real one-tap verb on asymmetric tables; overflow item + phone chip keeps it at low cost. |
| Flip visible only on orientation-bearing table types | touch-ergonomics | Per-type conditional control visibility costs more in implementation + learnability than one overflow slot saves. |
| Unify signs to 15° rotation | canvas-tool, kit-coherence | 45° is the correct coarse tier for signage and matches shipped muscle memory; only the control's home moves to the dock. |
| Delete desktop ⟲/⟳ ±15° buttons (handle + typed field only) | ia-simplicity | The button pair is the accessible/keyboard path; removing it excludes non-drag users. |
| Preset menu 0/90/180/270 on the angle readout | canvas-tool | Typed exact-degree entry + the 180° verb cover it with less chrome. |
| Anchored popover with true 2D quadrant collision avoidance | touch-ergonomics (fallback) | Kept only as the documented fallback if the dock fails its owner screen-check — not built now. |
| Seats/"Edit chairs" as a top-level dock item | canvas-tool | The stepper covers the frequent case at the top level; mode entry is rare enough for the overflow. |
| Delete Delete from the top row (overflow-only delete) | ia-simplicity, touch-ergonomics | One-tap delete matters during drafting (40-table rearrangement); the seated-confirm is the guard, the divider/gutter is the separation. |

---

## 10 · Implementation notes — ONE reviewable PR

**Branch:** `claude/seating-context-dock`. Presentation/interaction only; zero route/action/schema changes. Suggested commit order inside the PR (each independently revertible):

1. **SF fixes** — BarMenu leaf-only close (SF:190, `data-close` per item); SaveStatusChip tiers (SF:278-331).
2. **ContextDock extraction** — refactor the floating-pill slot (SE:4430-4492) into a precedence-driven `ContextDock` renderer (picked-guest > picked-group > selected-object > notice); bottom/top flip rule; read-only variant for `!canEdit` (kills the silent no-op path SE:942-1014).
3. **Table state → dock** — delete the anchored popover (SE:5749-5953) keeping its handlers (rename, rotate, `requestRemoveTable`, `doUnlink`); build the §1.2 row; SeatPeoplePanel (SE:6554-6748) becomes dock-attached with measured max-height + per-row Unseat; rotate handle to 12 o'clock (SE:5775-5838); overflow (Change shape… / Edit chairs… / Rotate 180° / Break apart w/ `Ungroup`); phone sheet reorder (SE:5625-5747); keyboard Delete/Esc/Enter.
4. **Seat chips → stepper + mode** — gate ×/+ chips (SE:5375-5392, 5452-5467) behind `editChairs` state; Seats stepper over `toggleSeat`; banner + tint + ≥44px hit padding + "Seat N removed · Undo" notice; exits (Done/Esc/deselect/guest-pick).
5. **Shape picker** — new grouped-glyph picker with ghost preview + impact line + Apply gate over the SE:6440-6470 catalog; wire into overflow + `AddTablePanel` (SE:6813-6934); L3 type-select seated-guard copy.
6. **Marker selection-gating** — selected-marker state; move zone/booth/sign controls (SE:4574-5213) into dock variants per §1.4 table; delete ambient ×s/toggles/`window.prompt` (SE:5173-5176); selection-gate resize grips; sign rotate 45° via dock cluster.
7. **Command bar** — stats chip → "N to seat" doorway (SE:4123-4140) + drawer-handle count; Auto Arrange gold split-button + one-step confirm (SE:4222-4233, 6170-6219); Arrange → stay-open policies panel + Room size in (SE:3955-4092); + Add minus Room size (SE:3935-3954); clickable scale bar (SE:5534-5544); peer avatar stack; phone gutter; ⋯ More section headers; zoom ≥44px/Fit-first.
8. **Icon debt** — `Unlink` retirement per §6.3 (SE:3730, 3841, 3877, 4690, 5999).
9. **3D lab** — delete link-creation UI (L3:5095-5110) only; align L3's selected-table card ordering to §1.2.
10. **Empty state + coach marks** — starter card (SE:5216-5246), gold transfer + disabled-with-reason Auto, 4 localStorage hints.

**Verification gates before merge:** phone sheet + drawer half-snap coexistence for "Seat people" on a real device; dock flip on a table dragged to the bottom edge; edit-chairs entry/exit on all four exits; view-only dock; Arrange stepper surviving clicks; L3 still builds with link UI removed.

---

## 11 · Capability-parity audit

| Current control (anchor) | New home |
|---|---|
| Table name input (SE:5845-5859) | Dock name field — semantics unchanged |
| UserPlus "Seat people" → SeatPeoplePanel (SE:5860-5872, 6554-6748) | Dock labeled primary → dock-attached panel, measured height; content unchanged + per-row Unseat |
| Unlink break-apart, legacy (SE:5875-5885) | Overflow "Break apart", `Ungroup` icon, hidden when no legacy groups |
| ⟲ −15° / `{deg}°` / ⟳ +15° (SE:5887-5903) | Dock rotate cluster; readout now click-to-type exact |
| Flip 180° (SE:5904-5911; phone 5665) | Desktop: overflow "Rotate 180°" · Phone: 180° chip in rotate row |
| Trash2 delete + confirm (SE:5913-5920, 988-1001) | Dock far end, tinted, confirm unchanged |
| X Done (SE:5921-5928) | Dock |
| TableStylePicker `<select>` (SE:5930-5932, 6440-6470) | Overflow "Change shape…" — glyph picker, ghost preview, Apply gate |
| Rotate handle pill (SE:5775-5838) | KEPT — 12 o'clock, 15°/Shift 1°, group-aware unchanged |
| Empty-chair × chips (SE:5454-5467) | Edit-chairs mode only; bulk via Seats stepper − |
| Restore-+ ghosts (SE:5375-5392) | Edit-chairs mode only; bulk via Seats stepper + |
| Phone bottom sheet (SE:5625-5747) | KEPT, reordered to dock parity (§1.3) |
| Two-finger twist (SE:2186-2215) | KEPT unchanged |
| Canvas tap-to-link (SE:2699-2701) | Already retired — stays deleted (feature removed) |
| Booth drag / footprint (SE:4944-4988) | Unchanged |
| Booth always-visible × (SE:5008-5016) | Dock Remove, selection-gated |
| Booth tap → type-picker (SE:5019-5158) | Tap = select → picker content in dock (vendors/stations/offerings) |
| Dance drag / × / grip (SE:4574-4617) | Drag unchanged · Remove in dock · grip while selected |
| Cocktail drag / Linked-Separate / × / grip (SE:4648-4716) | Drag unchanged · "[With entrance \| Separate]" text segmented in dock · Remove in dock · grip while selected |
| Stage drag / grip, no remove (SE:4720-4752) | Unchanged; grip while selected; still no remove |
| Entrance drag / × / Door\|Walk-through / depth (SE:4808-4899) | Drag unchanged · segmented + depth stepper + Remove in dock |
| Service door drag / × (SE:4903-4928) | Drag unchanged · Remove in dock |
| Sign drag / dbl-click prompt / 45° tap / × (SE:5164-5213) | Drag unchanged · inline rename in dock (prompt deleted) · 45° via dock cluster · Remove in dock |
| View segment + Save-&-view 3D (SE:4115, 3387-3407) | Unchanged |
| Merged stats chip (SE:4123-4140) | "N to seat" mono doorway → People unseated filter; full readout on press; phone: drawer peek handle |
| Peer pills (SE:4143-4153) | Avatar stack + "+N" |
| View-only pill (SE:4154-4167) | Kept; + dock read-only variant |
| Notices expander (SE:4169-4179) | Kept; dock-overflow notices land here |
| + Add menu (SE:3935-3954) | Kept minus "Room size & scale…" |
| Arrange menu (SE:3955-4092) | Stay-open policies panel; + Room size; − auto verbs |
| Build my seating draft (SE:4022+) | Gold split-button caret (collapse if code-identical to Auto) |
| Fill around N locked + confirm (SE:6223-6254) | Split-button caret, own confirm kept |
| Share & print (SE:4093-4107) | Unchanged |
| Mobile ⋯ More (SE:4202-4210) | Kept + Add/Arrange/Share headers |
| SaveStatusChip (SE:4213-4219, SF:278-331) | Kept, tiered; phone condensed; ⌘S/beforeunload unchanged |
| Auto Arrange + 3-step modal (SE:4222-4233, 6170-6219) | Gold split-button primary, one-dialog confirm |
| Banner slot + priority (SE:4237-4244, 3412-3445) | Unchanged |
| Floating pills (SE:4430-4492) | Become ContextDock states (precedence §1.1) |
| Room-size popover (SE:4262-4428) | Kept; opened from Arrange + clickable scale bar |
| Zoom cluster / scale bar / wall grips (SE:5547-5611, 5534-5544) | Kept ≥44px, Fit first · scale bar clickable · grips unchanged |
| Left panel tabs/search/People/Tables/Rules (SE:3525-3883) | Unchanged, except: keep-apart rows → "Keep apart" text badge (SE:3841) · relax-rule → "Relax" text button (SE:3877) · passive Link2 → "Grouped (legacy)" (SE:3730, 5999) |
| AddTablePanel (SE:6813-6934) | Gains the shared shape-glyph picker; advisory + cap unchanged |
| Drawer snaps + forced peek (SE:6144-6167, 3470-3493) | Unchanged; peek handle gains "N to seat" |
| L3 "Link to another table" (L3:5095-5110) | **DELETED — creator UI for a removed feature** (owner 2026-07-16); `linkTables` action untouched |
| L3 Break apart / ⟲⟳ ±15° (L3:5057-5058) | Kept |
| L3 table-type select | + seated-guard copy |

---

## 12 · Owner sign-offs

1. **Dock placement screen-check (blocking):** 5-minute owner pass on the bottom-center dock + top flip vs the old anchored popover, specifically on a large monitor with a table at the far top. Documented fallback if it fails: occlusion-aware quadrant-anchored popover (touch-ergonomics) — not built unless the check fails.
2. **Empty-floor gold transfer:** gold moves from Auto Arrange to the starter card's "Build my seating draft" when 0 tables (Auto renders disabled-with-reason). One-glance kit-budget confirmation.
3. **"Build my seating draft" label collapse:** only if the implementer confirms it invokes the identical flow to Auto Arrange — then one verb, labeled "Auto-arrange". Owner confirms the visible label change.
4. **Day-of watch item (non-blocking):** marker Remove and shape-change each gain one tap vs today's ambient ×/instant select. Watch the day-of editing path (DOB banner active) for one release cycle before locking; if coordinators signal friction, the scoped relief valve is keyboard Delete + long-press-to-remove on markers — not a return of the ambient scatter.