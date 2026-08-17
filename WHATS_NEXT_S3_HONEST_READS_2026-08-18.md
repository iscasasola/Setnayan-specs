# S3 · "We couldn't load it" — the measured scope, 18 August 2026

> **What a person gets:** a screen stops saying *"nothing here"* when it simply could not read.
> S8 proved this is not a tidiness problem. On the admin tree alone the same defect appeared on
> **14 screens, four shared libraries, a health monitor, a payments meter, and one screen shipped
> the day before** — and every instance was invisible to a search for the obvious pattern, because
> it wears a different costume each time.

## The surface, MEASURED — and the first number was wrong

| | |
|---|---|
| matched by a crude `?? []` + empty-state scan | 108 |
| ⇒ **actually coerce a READ** | **73** |
| ⇒ noise: nullable columns (`extra_roles ?? []`) etc. | 35 |
| reads with **no error bound at all** | **146** |
| reads with one bound | 71 |
| files touching money/amounts | **25** |

🛑 **I SCOPED THIS AT 108 FIRST AND IT WAS WRONG BY A THIRD.** The crude scan counted every `?? []`
in a file that also rendered an empty state — including nullable COLUMN defaults, which are not
reads at all. Caught by reading two sample files instead of trusting the count. **This is the same
error S8 recorded seven times: counting a spelling instead of measuring the capability.** Re-measure
before acting on any number here, including these.

## Lanes — and this time the partition has no shared file

| lane | tree | files |
|---|---|---|
| **A** | `app/dashboard/` — the couple | **37** |
| **B** | `app/vendor-dashboard/` — the supplier | **24** |
| **C** | the scattered rest (`tour` · `v` · `papic` · `panood` · `proposals` · `explore` · `_components`) | **9** |
| ⏸ | `app/[slug]/` — the Event Hub | **3** · waits for S13 + S14 |

⚖ **THE HUB CONSTRAINT COSTS 3 FILES, NOT THE STREAM.** The register says S3 must land after S13
and S14 so it adopts on a tree that has stopped moving. Measured, that is **3 of 73**. Parking 70
files to protect 3 is the wrong trade; those 3 are picked up after S13/S14 land.

### 🔑 EVERY LANE GETS ITS OWN GUARD FILE. THERE IS NO SHARED LIST.

S8's lanes all edited one guard holding two hand-maintained sorted arrays, and it cost:
- **a false partition** — "everything else" is not a directory, so its lines interleaved with every
  other lane and it conflicted with all of them;
- **a silently shrinkable list** — deleting one line from `CONVERTED` left the guard GREEN, because
  every rule iterated it; a shorter list simply checked fewer files;
- a merge conflict on almost every push.

⇒ S3's guards are **per-tree files** (`app/dashboard/_components/reads-are-honest.test.ts`, and one
each for the other two trees) and each **derives its subject from disk** rather than from an array.
**Lanes then share no file at all.** A list that decides what gets checked has to be pinned to
something measured, or it narrows without a word — that is the single most repeated finding of S8.

## The per-file recipe

1. **Bind the error at every read.** 146 reads currently bind none.
2. **Let `null` survive to the render** — `const rows = data as T[] | null`. `?? []` at the read site
   puts the lie in before anything downstream can catch it.
3. **Three states, never two:** refused → say so · permitted-and-empty → teach what fills it ·
   otherwise the content. `resolveSurfaceState` in `app/_components/states/` already decides the
   precedence and is now proven on 33 admin screens.
4. **A stat or a count gets `null`, never 0.** A confident zero reads as authoritative.
5. **Disclose a cap** where the read is limited.

## The five traps S8 paid for — do not rediscover them

🔑 **THE TABLE IS NOT ALWAYS WHERE THE LIE IS.** On two admin queues the `<table>` was the audit
trail and the queue was a `<ul>` of cards. Converting the table fixed the trail and left the
reassuring sentence untouched. **Check which branch renders the sentence before ticking anything.**

🔑 **A REGISTRY-DRIVEN LIST MAKES A REFUSED READ LOUDER, NOT QUIETER.** The health monitor joined
rows to a fixed registry, so a failed read rendered **every** probe as "never run" — an absence that
looks like a catastrophe rather than like nothing, with a convincing explanation attached.

🔑 **THE SWALLOW IS OFTEN A CALL FRAME AWAY.** Four admin surfaces read nothing themselves; the
coercion was in `lib/`. **Trace to the actual read** — converting the screen fixes nothing.

⚖ **BINDING IS NOT THE FINISH LINE — AND THE OBVIOUS RULE FOR IT IS WRONG.** I built the check
*"the bound error must reach the render"*, measured it across 33 files, and **every survivor was
correct code**: they carry honesty through a flag derived from the DATA being null, not from the
error. The checkable invariant is *"something derived from not-having-measured reaches the render"*.
Also: a read inside a `try` whose `catch` resolves to zero makes the identical claim by another
route — any check must see both arms.

🪤 **`'—'` IS ALREADY THE LEGITIMATE VALUE** for a shop with no name or an account with no email. A
silent fallback is not merely quiet, it is **ambiguous with a real value**. Say it on screen.

## Worst first

```
  14 unbound / 27 reads  💰 dashboard/[eventId]/vendors/page.tsx
   8 unbound / 14 reads  💰 v/[slug]/page.tsx                    ← PUBLIC shop page
   7 unbound /  9 reads     [slug]/seat/page.tsx
   6 unbound / 18 reads  💰 dashboard/[eventId]/vendors/[vendorId]/workspace/page.tsx
   6 unbound /  8 reads  💰 vendor-dashboard/shop/page.tsx
   6 unbound / 21 reads     (shell)/explore/page.tsx             ← PUBLIC
```

⚠ **TWO OF THE WORST SIX ARE PUBLIC PAGES**, not admin. S8 was internal-only; S3 is not, so a wrong
empty state here is seen by a couple or a stranger, not by the team.
