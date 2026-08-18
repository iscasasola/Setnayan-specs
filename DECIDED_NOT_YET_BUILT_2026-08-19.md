# Decided, not yet built — 2026-08-19

Two items the owner ruled on at the end of a long session. **Both are decided.
Neither is a question.** They were not built in the same run because each
deserves its own careful pass, and rushing them would produce the exact class of
defect the session spent the day removing.

---

## 1 · Empty categories are SHOWN, not hidden

**Owner, verbatim:** *"all categories can be filled and chosen by vendors. to
make it easier no need to hide, just say we do not have vendors for this at the
moment."*

### This SUPERSEDES the 2026-05-30 directive

That earlier ruling — *"Only show categories with vendors"* — is written into
`apps/web/app/(shell)/explore/page.tsx` (~line 3700) as a four-way rule:

| state | today |
|---|---|
| populated (vendors > 0) | SHOW |
| recruiting (live phase, 0 vendors) | SHOW |
| setnayan (first-party) | SHOW |
| **future phase (V1.2+)** | **HIDE** |

The new ruling removes the HIDE branch. Its premise — *"all categories can be
filled and chosen by vendors"* — was **spot-checked and holds**: no phase filter
was found on the vendor's own category picker, so a vendor is not blocked from
choosing one.

⚠ **VERIFY THAT PROPERLY BEFORE BUILDING.** If some category genuinely cannot be
signed up for, then *"we do not have vendors for this at the moment"* is a
different untruth — it would read as "nobody has joined yet" when the real state
is "you cannot join this yet". Confirm the picker offers every category; if it
does not, the copy must say so instead.

### What to build

- Drop the future-phase HIDE branch.
- An empty category renders with **"We do not have vendors for this at the
  moment."** — the owner's own words.
- `CATALOG_LIVE_PHASES` is kept in sync with the same constant in
  `category-tile.tsx`; the file says so itself. **Change both or the tile says
  "Coming soon" while the grid shows it.**

🔑 **The principle, and it is the session's whole theme: do not hide an absence,
name it.** A hidden category tells a vendor nothing. A named one tells them there
is an opening.

---

## 2 · A way to report a vendor

**Owner, on the fraud queue:** *"there must be a button to report them."*

### What exists

Reporting exists for **guest-gallery content** (`/admin/user-reports`), and
`lib/reports.ts` is the shared path. There is **no way to report a SUPPLIER.**
The fraud queue is fed by scoring, not by people.

### The open design question — decide it, do not default it

**Who may report a shop?** Not a blocker on the owner, but state the choice in
the PR:

- **Anyone browsing** — catches the most, invites the most abuse and competitor
  sabotage.
- **Only a couple who has messaged or booked them** — far fewer false reports,
  and misses a shop that is obviously fake to a passer-by.

Recommendation: **signed-in accounts only, with the reporter recorded**, and the
report lands in the existing fraud queue rather than a new surface. A report is a
judgement queue — per the 2026-08-05 lock, judgement queues get **a sentence, not
a one-click button.**

⚠ Whatever is built must **not** tell the reporter what happened next. A shop
learning it was reported, or a reporter learning a shop was suspended, are both
disclosures nobody agreed to.

---

## Where the session ended

**Merged and live:** the song-list repair (93 songs restored, and the rule that
was eating them fixed) · the curate switch · confirmations before deleting or
merging a song · the two mislabelled admin cards.

**In flight, merging themselves:** a band linking a video of itself playing each
song, shown on its public page · the work list counting four more queues.

**Verified in production by querying the objects, not by reading a green tick.**
