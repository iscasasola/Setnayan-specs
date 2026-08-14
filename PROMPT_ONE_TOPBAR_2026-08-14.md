# Session prompt — one top bar · 14 August 2026

Runs **alone**. It edits the shared shell and all five page frames, and so does session 9
(retire the old sidebar) — which is **blocked until this lands**, because the old shell still owns
the sticky top bar.

Paste the shared header from
[`WEBSITE_ADJUSTMENT_PROMPTS_2026-08-14.md`](WEBSITE_ADJUSTMENT_PROMPTS_2026-08-14.md) above this
block.

---

```
Give every signed-in surface ONE top bar, the same one, owned by the shared shell.

WHAT A PERSON SEES TODAY — the owner's report, with his three screenshots:
  events board  → wordmark + a search box, no "+ Create"
  Alaala        → wordmark, NO search, no "+ Create"
  inside an event → NO wordmark, NO search, just chat + bell + avatar
Three screens, three different bars. He asked: "the issue is the top nav is not there?"
One shell has to mean one top bar too — a bar that changes shape as you move is the
same jumping-about the whole conversion exists to remove.

ALREADY SHIPS — DO NOT REBUILD:
- `app/_components/frontdoor/front-door-shell.tsx` is the shared shell and is MOUNTED IN ALL
  FIVE TREES already (launcher · account · event · vendor · admin). It has two variants:
  `front-door` (top bar + search + off-canvas rail) and `app` (RAIL ONLY, >=1024).
- Its top bar already renders wordmark · search · the gold "+ Create" · bell · avatar menu.
  You are EXTENDING which variant gets it, not designing a bar.
- `.fd-btn-gold` is the "+ Create" treatment. OWNER-LOCKED 2026-08-14: one chrome, one button
  colour, gold everywhere. Do not restyle it.
- `activeRailKey` / `railMatchRows` in `frontdoor/rail-active.ts` already do active-row matching.

🔴 READ THIS BEFORE YOU DELETE ANY EXISTING BAR — it is why the app variant has none.
The shell's own docblock (~line 56) states the reason, and it is a REACHABILITY CONTRACT:
the launcher's one-line bar holds the Cmd-K command palette, the notification bell, and the
account switcher — and SIGN-OUT EXISTS NOWHERE ELSE ON THAT SURFACE. Swapping it for the
front-door bar would trade a command palette over YOUR OWN EVENTS for a search box that goes
to the SUPPLIER MARKETPLACE, and drop two doors on the way.
⇒ THE NEW BAR MUST CARRY EVERY DOOR THE OLD ONES CARRIED, BEFORE ANY OLD ONE IS REMOVED.
Inventory each of the five surfaces' current bars first and put the list in the PR body. A
door that exists on exactly one surface is the one you will drop.

🔑 TWO SEARCHES, NOT ONE. The front-door search targets the supplier marketplace. The
launcher's Cmd-K is a command palette over the person's own events. They are different
questions. Decide ONE behaviour for the shared bar and say why in the PR body — do not
silently pick whichever was easier to wire. A search that answers the wrong question is worse
than no search, and this is the one judgement call in the session.

TRAPS:
- BELOW 1024 THE APP VARIANT MUST STILL PAINT NO CHROME. The phone's bottom-bar grammar is
  locked; a top bar plus a bottom bar is the double render. Guard it.
- `SidebarShell` still owns the sticky hide-on-scroll top bar AND the `<main>` carrying
  `.sn-vt-page` — the ONLY element with that view-transition name, which the mobile nav slide
  freezes the document around. When the shared bar takes over the FIRST job, say so explicitly
  in the PR body: that is what unblocks session 9. DO NOT touch the second job here.
- Render labels through `getNavSlotMap()` or an admin rename applies on the phone and not the
  desktop — two answers to one question, with no error.
- `slotLabel` FAILS OPEN on a registry miss, so passing a slot key that does not exist renders
  correctly forever while quietly never being renameable. If you need a new key, ADD THE
  REGISTRY ENTRY FIRST. (This exact trap was caught and avoided on 2026-08-14 — see
  `people-is-a-door.test.ts`.)
- Slice 0 + slice 1 shipped TWO NESTED `<main>` landmarks on ~125 screens and it took a
  follow-up PR (#4434) to catch. One landmark per page. Assert it.
- The native apps can never reach `/` (middleware bounces Capacitor/Tauri off marketing
  paths). The bar mounts IN the layouts, never "route everyone through /".

GUARD IT SO IT CANNOT FAIL SILENTLY:
1. Every signed-in surface renders exactly ONE top bar, and it is the shared one.
2. Every door present on any surface's OLD bar is present on the new one — enumerate them.
3. Below 1024 the app variant renders NO top bar.
4. Exactly one `<main>` per page.
Mutation-test each, PRINT THE OCCURRENCE COUNT before and after, and anchor with \b.

STOP AT: the top bar. Do not delete `SidebarShell` — that is session 9, and it is unblocked
by this landing, not by this doing it.
```
