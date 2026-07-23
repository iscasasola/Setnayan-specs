# Papic — Timeline Chaptering

**Spec · 2026-07-21 · owner session**

> **Status: SPEC. Not built.** Owner: *"timeline chaptering that can be done by both coordinator and
> host. They can update timeline in realtime so chaptering will be faster. They can name the timeline
> as well."*

---

## § 1 — What it is

The gallery organises itself by **what was happening**, not by upload order:

> **Preparation** · **Ceremony** · **Cocktails** · **First Dance** · **Send-off**

No tagging and no manual sorting — it is a join between two things already stored: the **run-of-show**
(PR #3412, with times) and every capture's **`captured_at`**.

**Why no competitor can copy it:** photoshare.ph, EventPix and Kuha all deliver an undifferentiated
ZIP because **none of them know the schedule.** A gallery that knows the ceremony started at 3:42pm
is a different product from a folder of 3,000 files.

It is also the input that makes everything downstream worth more — reels, Kwento, the anniversary
re-entry all get structure for free.

---

## § 2 — Planned times are not enough

**Every wedding runs late.** Chaptering on *planned* run-of-show times would mis-file the entire
event whenever the ceremony slips 45 minutes — which is the normal case, not the edge case.

So each chapter carries **two** times:

| | Source | Used when |
|---|---|---|
| `planned_start_at` | the run-of-show, set during planning | nothing was marked live |
| **`actual_start_at`** | **marked live by host or coordinator** | **whenever present — always wins** |

A chapter's window runs from its effective start to the next chapter's effective start. A photo
belongs to the chapter whose window contains its `captured_at`.

**⇒ Assignment is DERIVED, never stored on the photo.** That is the load-bearing design choice:

- Marking a chapter start **instantly re-chapters** every affected photo
- A late mark can be dragged back afterwards and everything re-sorts
- Nothing migrates, no re-tagging job, no backfill
- Getting it wrong is free to fix

---

## § 3 — Who can mark, and the lock it touches

**Both the host and the coordinator**, live, from the day-of surface. One tap: *"Ceremony — start
now."*

> ⚠ **This touches the coordinator lock.** The shipped coordinator model is **read-parity +
> PROPOSE-NOT-EXECUTE + a money wall** (`project_setnayan_coordinator_role`). Letting a coordinator
> write the live timeline directly is an **execute**, so it needs a conscious carve-out rather than
> being slipped in.
>
> **The carve-out is defensible:** the money wall is the real boundary, and marking *"the ceremony
> started"* spends nothing, books nothing and changes no agreement. It is pure day-of operations —
> exactly what the coordinator is there for, and it sits naturally beside the already-planned **P3
> day-of broadcast** capability.
>
> **Recommend: grant coordinators live chapter marking as an explicit, named exception. Record it in
> the coordinator spec so nobody later reads it as a leak in propose-not-execute.**

**Naming.** Both roles can rename chapters — planning-time or live. Renames are cosmetic and never
re-chapter anything (the window is what assigns photos, not the label).

---

## § 4 — Edge cases

| Case | Behaviour |
|---|---|
| Photos before the first chapter | fall into an implicit opening bucket — **"Before the day"** or the first chapter if it is `Preparation` |
| Photos after the last chapter | implicit **"After"** bucket. Non-empty by construction — send-off and after-party photos land here |
| A chapter never marked live | falls back to `planned_start_at`. **Never orphan a photo** |
| Marked out of order | last write wins per chapter; windows recompute. Ordering comes from the times, not the marking sequence |
| Marked late | drag the start back — everything re-sorts. **This is the normal correction path** |
| Two chapters marked at the same minute | the earlier `sort_order` takes the window; the other is zero-length and simply holds no photos |
| Multi-day event | chapters carry their own dates; the window logic is unchanged |
| No run-of-show at all | **one implicit chapter for the whole event.** The feature degrades to today's behaviour rather than breaking |

---

## § 5 — Realtime, precisely

**"Realtime" here means the mark is TIMESTAMPED ACCURATELY at the moment it is tapped** — not that
every viewer's screen syncs instantly.

- **Required:** an accurate `actual_start_at` written at tap time
- **Nice to have:** the **live photo wall** showing the current chapter name; Supabase Realtime is
  already in use elsewhere and would carry it
- **Not required:** live sync to the couple's gallery, which can chapter on read

Building the accurate mark first keeps this small. The wall integration is a follow-on.

---

## § 6 — What to build

| # | Item |
|---|---|
| 1 | `actual_start_at` on the run-of-show item (nullable) |
| 2 | Derived chapter resolver — `captured_at` → chapter, from the effective windows |
| 3 | Day-of marking UI — one tap per chapter, host + coordinator |
| 4 | Chapter rename, planning-time and live |
| 5 | Gallery grouped by chapter, with the implicit opening/closing buckets |
| 6 | *(follow-on)* current chapter name on the live photo wall |

**No migration of photo data. No new capture-path code. Nothing on the fail-closed money path.**

---

## § 7 — Open questions

1. **Does a coordinator get marking rights by default, or per-event grant?** Recommend default —
   requiring the host to enable it on the day defeats the purpose.
2. **Can a guest see chapter names live?** Probably yes on the wall; it adds to the room's energy.
   No consent implication — chapter names are the couple's own schedule.
3. **Do chapters apply to Pabati clips too?** They should — same `captured_at` logic, same windows.
   Verify the clip tables carry a comparable timestamp.
4. **Does chaptering feed the render templates?** It is the obvious input (a Kwento that follows the
   real running order). Out of scope here; note it for whoever builds the render pipeline.

---

*Compiled 2026-07-21. Builds on the shipped run-of-show (PR #3412) and existing capture timestamps.
The coordinator carve-out in § 3 is the only item that touches an existing lock.*
