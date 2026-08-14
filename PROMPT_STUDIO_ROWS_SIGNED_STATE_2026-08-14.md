# Follow-up for the running one-top-bar session · 14 August 2026

Paste this **into the session already working on PR #4438**. It is the same file that session is
holding (`front-door-shell.tsx` / `rail-data.ts`), and it just restored the demo openers — so it
has the context and no other session may touch this.

---

```
Next, from the owner, pointing at the Studio group in the rail: "the side menu when signed
out, it will be able to show demo. when logged in, it will be different view."

TODAY: all seven Studio rows go to the same place whether you are signed in or not — the
public product page (/setnayan-ai · /pawebsite · /papic · /panood · /patiktok · /pa3d ·
/palogo, from RAIL_TOOLS in rail-data.ts).

THE RULE HE IS ASKING FOR:
  SIGNED OUT → the row is a shop window. It must be able to OPEN THE DEMO — the overlays you
               just gave their openers back to in `feat(demos)`. A stranger's question is
               "what is this?", and the demo answers it better than a page of copy.
  SIGNED IN  → the row is a door into a thing they already own. It must NOT send them back
               out to a marketing page to read about a product they are paying for.

THE JUDGEMENT THIS NEEDS — do not skip it:
- ONLY SOME PRODUCTS HAVE A DEMO. Your own commit names Papic, Live Studio and 3D Plan; the
  owner also named Setnayan AI. Enumerate which overlays actually exist and say so in the PR
  body. A row that offers a demo that does not exist is a fake door — `doorway-invariants.test.ts`
  exists because this page forbids exactly that. Rows with no demo keep today's behaviour.
- SIGNED-IN DESTINATION IS NOT TRIVIAL. "Your Papic" needs an event. Resolve it honestly:
    · exactly one event  → go straight into it
    · several            → the event picker, not a guess
    · none               → the product page is still the right answer, and it should say so
  Whatever you choose, it must never 404 and never land on a page the person cannot open.
  The guest-doors work already ruled that a door which opens onto a refusal is worse than no
  door.

TRAPS:
- `RAIL_TOOLS` is pinned by `doorway-invariants.test.ts` — eight public doorways, deliberately.
  Changing where a row GOES is fine; adding a row with no public page is not.
- Palogo is in the rail; the LED backdrop was removed from the product on 2026-08-11. Confirm
  each row still points at a live page before you rewire it.
- The rail renders for signed-out visitors too, so anything you read for the signed-in branch
  must be guarded — a null session must fall back to the shop-window behaviour, not throw.
- Do not make the demo a second row. One row, two behaviours, decided by who is looking —
  the same shape the shop and HQ rows already use.

STOP AT: the Studio rows. Everything else in #4438 stands.
```
