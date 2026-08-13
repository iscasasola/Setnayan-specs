# Prompts for Redesign 9 and Redesign 10 · 13 August 2026

> Paste the **SHARED HEADER**, then **one** session block. They do not collide: 9 is the People
> area, 10 is the public product pages.
> 🛑 Two at once is the cap, and the cap counts **running sessions**, not open PRs.

---

## SHARED HEADER — paste this first, in both

```
Read /Users/icecasasola/CLAUDE.md and ~/Documents/Claude/Projects/Setnayan/CLAUDE.md first.

RULES THAT OVERRIDE YOUR DEFAULTS:
- RULE 0 — FIND IT BEFORE YOU BUILD IT. This project is ~2 years old. Assume what you are
  asked for already exists and your job is to locate and extend it. The "already ships"
  lines below were read from origin/main and the live production DB on 2026-08-13.
- A DOCUMENT IS NOT EVIDENCE — including this prompt. Verify against shipped code and the
  live production database (Supabase project njrupjnvkjkitfctetvi) before acting.
- A rejected query is not a thrown error. A phantom column, enum value, function argument,
  a blocked iframe or a missing grant all fail the same way: the only symptom is an absence.
- ⚠ AND AN ABSENT SIGNAL IS NOT AN ABSENT THING. On 2026-08-13 a finished session was twice
  reported as having done nothing, because the checker looked for a PULL REQUEST and the
  specs repo commits straight to main and opens none. Verify in the repo the work lives in.
- Branch FIRST, then `git worktree add`. Never work in the shared main checkout.
- Prune your worktree the moment your PR merges.
- Add a changelog fragment in changelog.d/. Do NOT edit CHANGELOG.md or STATUS.md.
- `gh pr merge <PR#> --auto --merge` immediately after creating the PR. Standing default.
- "Auto-merge armed" is not "will merge" — read `gh pr checks <#>`, and confirm a landing
  with `git merge-base --is-ancestor`.
- After merge, VERIFY THE CHANGE REACHED PRODUCTION BY QUERYING THE OBJECT.
- A guard must be able to FAIL. Sabotage it and PRINT THE OCCURRENCE COUNT before and after
  — an unmeasured mutation proves nothing.
- A script that prints "ok" without measuring proves nothing. Assert the anchor, then count.
- ⚠ SEVERAL SESSIONS WRITE THE SPECS REPO AT ONCE. A file you appended to can be reverted
  under you between the write and the commit. After committing, VERIFY FROM GIT:
  `git show HEAD:<file> | grep -c <marker>`.
- NEVER auto-flip a production flag. Build up to it, stop, and list it.
- Reply to the owner in plain English: what a PERSON experiences. No file paths, function
  names, table names, SQL or flag names in your answer to him.
```

---

# REDESIGN 9 · Mutual stories

```
GOAL: opening a friend's page shows the days you were both there.

▶ THE BUILD IS UNBLOCKED. Owner 2026-08-13: "allow it. unblock it." Build it fully, now.
🔴 DO NOT SET THE PRODUCTION FLAG. NEXT_PUBLIC_PERSON_LIFE_STORIES is the owner's to set in
Vercel. It is NEXT_PUBLIC_*, so it inlines at BUILD time and needs a cache-free rebuild; the
value must be exactly '1' — 'true' reads as OFF. Build behind it, prove it works, stop there.

⚖ RECORD THE AUTHORITY HONESTLY. lib/person-life-stories.ts says the flow stays inert "until
PH counsel signs off AND the owner sets NEXT_PUBLIC_PERSON_LIFE_STORIES=1" — TWO conditions.
The owner is also the registered DPO (Indalecio Sacdalan Casasola II, NPC-registered
2026-07-07) so he may rule himself. If it was his own ruling, write THAT. Never write
"counsel cleared" for a DPO's own decision — a future reader will act on the stronger claim.

NOT A NEW IDEA — it is the intersection of two things that already ship:
- The Alaala lenses are already Recent · Owned · ATTENDED · People · WITH ME (owner-approved
  2026-07-15) — dashboard/(launcher)/_components/alaala-lenses.tsx.
- person_story_items already carries: person_id, event_id, item_kind, source_table,
  source_id, origin, source_tag_id, consented_at, hidden_at, removed_at.
- event_members already carries user_id, event_id, member_type.
- lib/person-life-stories.ts is the Phase-2 read model. EXTEND IT. Do not write a second one.

🔒 THE PRIVACY RULE IS THE DESIGN, NOT A FOOTNOTE:
A day appears ONLY when BOTH people are ALREADY VISIBLE IN IT — the photos consented, the
event public. NEVER derived from a private guest list. Then opening somebody's page can only
ever show what was already shown, and if EITHER person hides, the day leaves BOTH pages.
No shared days gets a WRITTEN INVITATION, never a zero. Without this rule the feature is an
attendance-disclosure engine — the same family as the slug-forwarding leak, where a 307
disclosed in its Location header whatever the target then returned.

🔒 CONSTRAINTS THE MODULE ALREADY ENCODES — do not relax any without the owner:
- Assembled from TAGS + QR + CONFIRMED IDENTITY only. NEVER cross-event face recognition —
  StoryOrigin has no face value by construction. Do not add one.
- REFERENCES, not copies — a story item is a soft ref (source_table + source_id) into the R2
  system of record, never a media copy.
- A participant can HIDE any item from THEIR story without touching the host gallery
  (hidden_at is per-person, on the person_story_items row).
- Opt-out / face-blur REMOVE the person (removed_at tombstone).
- Editorials propagate only on host publish AND the consented-guest gate.
- Adults-first.

📉 MEASURED 2026-08-13 — what exists to test against, so you do not report a false green:
person_story_items 0 rows · consented 0 · guest rows linked to a person 0 · papic_photos 14
(ALL on the owner's own event) · users with a public profile 1 · published chapters 1.
So on the owner's account Attended · People · With me are EMPTY and always will be until he
is a guest somewhere. YOU MUST SEED a second account + a shared event to test this at all.
Test accounts: testnayan1..5@test.com / 12345.

DONE = it works behind the flag; the flag is still OFF; a test proves the both-visible rule
in BOTH directions (a day appears when both are visible, and LEAVES BOTH PAGES when either
hides); the no-shared-days state renders a written invitation; and your report tells the
owner in plain English what he will see the day he switches it on.
```

---

# REDESIGN 10 · Public doorways + the pricing delta

```
GOAL: the product pages a stranger meets carry the new design, and the price pages stop
making people read a haystack.

⚠ THIS IS design#6 — THE NEXT UNIT OF THE PORT LIST, NOT THE WHOLE LIST.
✅ design#4 (reconcile the older prototypes) is DONE — 23 reconciled, 5 retired, in the SPECS
repo, which opens NO PRs. Do not re-run it.
⏭ After this unit: design#5 couple dashboard → design#7 the five gaps → design#8 vendor →
design#9 admin (internal-only, ships LAST). One at a time.

WHAT SHIPS TODAY — measured 2026-08-13, so you do not re-derive it:
- EIGHT public doorways, and a guard enforces that exact set
  (app/_components/marketing/doorway-invariants.test.ts): papic · panood · pawebsite · pa3d ·
  palogo · alaala · patiktok · setnayan-ai. Five of them already share the _doorway.tsx kit.
- /papic is 38 files and /panood 19 — those two are whole sub-trees, not one page each.
  pawebsite · pa3d · palogo · alaala · patiktok are ONE file each.
- /pricing is 3 files, /features is 12 and has a bilingual twin at /tl/features.
⛔ `/` IS NO LONGER EXCLUDED — the front door replaced the cinematic homepage on 2026-08-13
and is live. The old "/ is out of scope" line in the programme is dead; do not obey it.
🪤 PAKANTA IS SOLD AND HAS NO PUBLIC PAGE AT ALL. It is not one of the eight. Either leave it
alone or raise it — do NOT quietly add a ninth doorway to make the set look tidy.

🔑 THE PRICING FINDING, RE-VERIFIED TODAY — the job is PRESENTATION, not modelling:
The delta pattern ALREADY SHIPS in app/_components/home/vendor-benefits.ts — the tiers
already read "Everything in Free, plus…", "Everything in Solo, plus:", "Everything in Pro,
plus:". So the model is right and the presentation is not.
- THE OFFENDER: app/vendors/_components/vendor-tier-matrix.tsx — a matrix restates every row
  per tier, which is the haystack the delta pattern exists to kill.
- THE GENUINE GAP IS CUSTOMER-SIDE: Free → Setnayan AI is not framed as a delta anywhere.
  ⚠ Setnayan AI now has TWO prices (sign-up vs regular, owner 2026-08-12) — read them from
  platform_retail_catalog_v2, never from a document, and never type a peso figure into a
  component. A literal SETNAYAN price in code is a defect.

PORT FROM, DO NOT REDRAW: the reconciled prototypes in the specs repo (now on the locked
palette) and prototypes/front_door_and_seam_2026-08-12.html for the front-door language.
The 19 archetypes are BINDING and owner-approved — a delta between a ported screen and its
archetype is a DEFECT IN THE PORT, not a fresh design decision.

PALETTE — the app rule, NOT the front door's: the only action colour is terracotta #C24E25
with CREAM #FDFBF7 labels; gold #A9834B is UI and large text only and is NEVER a button;
destructive is #B65A3A, never terracotta; cream page and cards separated by border+shadow.
🪤 Size CTAs against CREAM, never white — #C75026 passes on white and FAILS on cream.
🪤 The app is LIGHT-ONLY. Design one theme.
⚠ The FRONT DOOR alone keeps gold #8C6932 buttons + its own typeface (owner 2026-08-11).
Do not spread that to the doorways, and do not "fix" the front door toward terracotta.

DONE = each of the eight doorways carries the locked palette and the shipped shell; /pricing
and the vendor tiers read as deltas rather than a matrix; the customer-side Free → Setnayan
AI step is framed as a delta with prices read live from the catalog; and no peso figure is
hard-coded anywhere you touched.
```
