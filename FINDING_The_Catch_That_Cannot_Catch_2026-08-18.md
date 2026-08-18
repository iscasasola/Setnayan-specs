# FINDING · The catch that cannot catch — 18 August 2026

> **A `try/catch` wrapped around an awaited Supabase read in this repo cannot
> catch the read failing. Not a rejected query, and — in the version we ship —
> not a network failure either. The promise always resolves.**
>
> Measured, not remembered. **275 such blocks** have that catch as their **only
> stated defence**, and 89 of those catches are empty. This is a MEASUREMENT
> DOCUMENT. No code was changed for it.

---

## 1 · What the installed client actually does

Read out of the pinned dependency, `@supabase/postgrest-js@2.105.4`
(`src/PostgrestBuilder.ts`), not from memory of the library:

| failure | what happens | does `catch` fire? |
|---|---|---|
| **Rejected query** — phantom column, stale enum value, unapplied migration, missing grant | line ~534: `if (error && this.shouldThrowOnError) throw` — so it throws **only** when opted in. Otherwise it **resolves** with `{ data: null, error }`. | **NO** |
| **Transport** — DNS, socket, abort, header-limit, JSON parse | line ~371: `if (!this.shouldThrowOnError) { res = res.catch(fetchError => …` — the client **catches it internally** and returns a resolved `{ success: false, error, data: null, status: 0 }`. | **NO** |

`grep -rn "throwOnError"` across `apps/web` returns **zero hits**. Every read in
this codebase runs in the default, non-throwing mode.

⇒ **Both arms resolve. Nothing rejects.** A `catch` beside one of these reads can
only ever fire for what the surrounding code does *with the result* — a
`data.map()` on null, a `JSON.parse`, another awaited call in the same block.

### ⚠ A correction to the version of this that circulated first

The blunt claim was *"the catch never fires."* Then a sharper-sounding split was
offered — *rejected query resolves, transport genuinely throws, so the catch is
mislabelled rather than dead* — and it was written into a durable note.

**That split is wrong for the version we ship, and the blunt claim was closer.**
The refinement was a plausible inference about how HTTP clients usually behave;
reading `PostgrestBuilder.ts` shows this one swallows fetch errors itself. The
correct statement is the narrow one:

> **Nothing about the READ can reach the catch. Code around the read still can.**

That is the third time in this stream a correct fact acquired an invented
consequence. It is recorded here because the invented consequence had already
reached a durable note and would otherwise have hardened into fact.

---

## 2 · The measurement

**The question this number answers** — stated because the same subject yields
wildly different counts depending on what is asked:

> *How many `try` blocks in `apps/web` wrap an **awaited** Supabase read
> (`.from(` / `.rpc(`), and in how many is the **catch the only stated defence**
> against that read failing?*

Counted **by block**, not by read, and not by matching a spelling.

```
  try blocks wrapping an awaited Supabase read   591    across 310 files
  awaited reads inside them                      909

  ── an error IS checked inside the try            316   (already defended)
  ── CATCH IS THE ONLY STATED DEFENCE              275
        · try holds ONLY supabase awaits          146   catch unreachable, full stop
        · try also holds other awaited work       129   catch may fire for THAT;
                                                        the read stays unguarded
        · catch body EMPTY (silent swallow)         89
```

Where the 275 sit:

| area | only-defence blocks | of which empty catch |
|---|---:|---:|
| `lib/` | 131 | 45 |
| `app/` (other, incl. public) | 62 | 18 |
| `app/dashboard` | 57 | 19 |
| `app/admin` | 15 | 2 |
| `app/api` | 10 | 5 |

**It is large.** Roughly half of every `try` around a Supabase read in this
codebase is relying on a catch that cannot fire for the failure it appears to be
there for.

---

## 3 · The three shapes, because they need different repairs

Reporting these as one thing produces the wrong fix.

**(a) The catch IS the intended fallback — and is unreachable.** The purest case,
`lib/setnayan-ai-activity.ts:120`:

```ts
try {
  return await supabase.from('event_sponsors').select('sponsor_tier, invitation_status').eq('event_id', eventId);
} catch {
  return { data: [] as unknown[] };      // ← written for a failed read; can never run
}
```

The author wrote an empty-list fallback *for exactly this failure*. On a refused
read the `try` returns `{ data: null, error }` instead — a different shape from
the fallback, flowing on as if it were a real answer. **Repair: check `error` on
the result; the catch is not the mechanism.**

**(b) A silent swallow with an empty catch.** `lib/integration-config.ts:379` —
`const { data } = await admin.from('platform_integration_secrets')…`, empty catch.
Refused, the token reads as absent and the integration reports itself *not
configured*. **Repair: bind the error and say which.**

**(c) The catch is mislabelled but not useless.** 129 blocks also await something
else, so the catch can genuinely fire — for that other thing. **Repair: keep the
catch, add the missing `error` check beside the read.** Deleting it would remove
a real guard.

---

## 4 · What this measurement does NOT establish

- **Only 4 of the 275 were read by hand** (1 false positive found and corrected,
  3 confirmed). The rest are classified structurally. Treat 275 as a well-founded
  estimate, not a verified list.
- **The classifier was wrong on its first run and the correction moved the number
  down**, from 289 to 275. It matched only destructure-shaped error bindings
  (`{ error }`, `error:`) and missed **property** checks — `llms.txt/route.ts`
  legitimately tests `retailRes.error || vendorRes.error` and had been counted as
  undefended. Anyone re-running this must include `X.error`.
- **Synchronous throws are not modelled.** The `other_awaits == 0` split covers
  async only; a `data.map()` on null inside the same `try` would still reach the
  catch. So "catch unreachable" is exact for the *read* and approximate for the
  *block*.
- **Harm is not ranked.** This counts structure, not consequence. A `lib/` helper
  behind a login and a public page are one row each here.

---

## 5 · Recommended next step

**Do not sweep 275 blocks.** The lesson from the console-table and read-honesty
lanes is that the count is not the work — reading each surface is, and the same
structural shape carries wildly different costs.

Rank by **who sees the false absence**: public and link-reached surfaces first
(a stranger, or someone opening a link you sent them), then anything where the
absence reads as a *decision* — "not connected", "no cameras", "no requests".
`lib/` is the biggest bucket by count and mostly the smallest by consequence,
because a helper's caller usually decides what the absence means.

**A guard should come before the sweep**, and it should assert the narrow claim —
that a `try` wrapping an awaited Supabase read also checks `error` on the result —
rather than banning the pattern, since shape (c) is legitimate.

---

*Measured on `origin/main` = `b7cf19f69`. Comment stripping preserves newlines, so
every line number above points at the line that holds the code.*
