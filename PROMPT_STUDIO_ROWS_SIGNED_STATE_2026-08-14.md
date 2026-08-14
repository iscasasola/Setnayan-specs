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

AND THE ROWS SHOULD SAY WHAT EACH APP IS — owner: "that is where we can talk about the
different apps." Signed out, seven bare names in a list teach a stranger nothing. Each row
gets a short line under it saying what the thing does.

🔑 RULE 0 — THE SEVEN SENTENCES ARE ALREADY WRITTEN. Every product page carries a
`PAGE_DESCRIPTION` const — e.g. /papic: "Papic turns your guests into your photo crew.
Everyone shoots, every photo finds the people in it, and each guest goes home with their own
gallery." These are the PUBLIC, SEO-indexed descriptions. DO NOT WRITE A SECOND SET.

⚠ BUT THEY LIVE AS SEVEN LOCAL CONSTS, one per page file, and they are written for a search
result — longer than a rail row wants. So:
  · Lift them to ONE shared source that both the page metadata and the rail read.
  · If the rail needs a shorter form, DERIVE it (first sentence) or store both fields in that
    one source. NEVER hand-type a second short version beside the long one — two hand-typed
    strings that must agree is not a mechanism, it is a future drift, and this repo has paid
    for that exact shape more than once (llms.txt drifted three weeks with green CI).
  · A guard: every RAIL_TOOLS entry resolves to a description from that source, and the
    source is the same one the page's metadata uses. Mutation-test it — break the link and
    the guard must go red, with the occurrence count printed before and after.

SIGNED IN, the line changes job: it stops selling and starts reporting. Say what THEY have —
"50 shots ready", "4 cameras out", "not set up yet" — or show nothing rather than sell a
person something they already bought. Only use counts you can resolve honestly; a count you
cannot read must render as nothing, never as 0. `count === null` means NOT MEASURED, and
filing an unmeasured thing under "you have none" puts it in the one place a person has been
told they need not look.

STOP AT: the Studio rows. Everything else in #4438 stands.
```
