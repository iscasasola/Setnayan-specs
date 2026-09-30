# Cloud prompts ready for Thu 1 Oct (Thursday account, $250 credit)

How: Claude app → New session → **Cloud** → repo **iscasasola/setnayan-platform** → paste the COMMON RULES + ONE prompt. The local controller merges, batches and deploys. Start **G1–G4 at once** (they touch different code); **G5** after the onboarding engine (G1) merges.

## COMMON RULES (paste first, every time)
```
Model: Opus · effort high. You are a builder in iscasasola/setnayan-platform (Next.js monorepo, apps/web). Read CLAUDE.md at the repo root and obey it. Clone iscasasola/Setnayan-specs and read INTERACTION_RULES.md (one way to ask/choose/navigate/search/do; two looks) plus every DECISION_LOG row named below before coding.
RULES: never merge, never `gh pr merge`, never --admin, never arm auto-merge. ONE PR to main with `gh pr create --label do-not-auto-merge`, then `gh pr view --json autoMergeRequest` and if not null `gh pr merge <n> --disable-auto`. No production migrations (new ones only via `pnpm migration:new`, RLS at CREATE TABLE, pipeline only). No deploys. Plain English; "Event Hub" never "website"; "supplier" not "vendor"; no casual greetings on guest pages; 3+ choices = ONE PickMenu dropdown; no "edit elsewhere ↗"; Pro is ◆ and never blocks trying. Phone first (390 px). Fewest screens; title ≤5 words + one line ≤12 words; details behind ⓘ; no confirm dialogs unless destructive. Changelog fragment only. From apps/web: install, typecheck, lint, every CI guard in .github/workflows/ci.yml, nearby tests (escape brackets with ?). Budgets: shared bundle ≤202KB (0 KB spare — lazy-load, never raise), Maker ≤505KB, server actions ≤1225 (at the ceiling — reuse). RULE 0: find and extend what exists; never a second registry or mechanism. Guards + sabotage once per rule. Report PR + a 3-step phone check card.
```

## G1 — Event onboarding engine + Wedding + simple types
```
SPEC: DECISION_LOG 2026-09-30 "THE SETUP LIVES AT THE END OF CREATING THE EVENT…", "…EVERY SETUP CARD NEEDS AN ANSWER…", "THE EVENT TYPE SHAPES EVERYTHING…", "GUEST-LIST ROLES AND GROUPS FOLLOW THE EVENT TYPE", "APPROVED — THE EVENT ONBOARDING CONCEPT", "BUILD ORDER FOR THE SIMPLIFICATION". Design: prototypes/event_onboarding_concept_2026-09-30_fable.html (sections A, B, W, B-birthday, H1, M).
BUILD: one onboarding engine at the end of create-event, steps chosen by the event-type profile (extend event_type_profiles / EventWords / STAGE_BAR — add the five fields guest_word · gifts_mode · team_first · look_set · camera_default on the same profile). The 7 essentials (name · when · where · photo · look/theme · how guests get in [Ask guests to reply? + personal QRs / one QR for everyone, DECISION_LOG "THE RSVP IS OPTIONAL"] · guests — never re-ask what creation already asked) + 0–2 type steps from the shipped specialty/honoree screens + the Yes/No list (logo · questions · Papic · gifts). Every card needs an answer (quick answers allowed), changeable later. Styled per type. THIS PR: Wedding + Birthday + Hangout + Date + Get-together (simple_event); roles + default groups per type for these. Wake/Corporate/others come in G5. Branch rd/onboarding-engine.
```

## G2 — Venue styles (design → build)
```
SPEC: the controller's 3 venue styles (Photo card = today's, fixed · Full photo with the name over a dark fade · The journey = Ceremony → Reception route with one map, both pins) + a switch "One map for both venues / none". First draw them (static HTML/CSS, the Fable look of prototypes/guest_landing_page_2026-09-30_fable.html) into prototypes/venue_styles_2026-10-01.html and STOP for owner approval in the PR description; build after approval as a Style ▾ on the Venue scene. Branch rd/venue-styles.
```

## G3 — Ship the held step-4 PRs
```
Rebase each onto origin/main, resolve keeping both intents, regenerate generated baselines with their generators, re-run CI to green, keep do-not-auto-merge: #6175 (dropdowns + first-visit tours — add `after=` so it doesn't open alongside the Guest list's Invite tour), #6179 (dead ends), #6180 (supplier paywalls obey the switch — owner OK'd Branches/payment links open to every plan while the flag is off), #6162 (Partner + label handshakes), #6161 (Patiktok: free to use, pay to save/share). One PR each (push to their branches); report each PR's state.
```

## G4 — Lane 2: demo shops, /for-suppliers, region pages
```
SPEC: DECISION_LOG "LANE 2 §2C — ALL FIVE OWNER QUESTIONS ANSWERED". BUILD: (1) a forward data migration setting is_demo = true for SetnaProd and Saysay (count first read-only; pipeline only); Discover's Shops shelf and the marketplace may go empty — say so. (2) /vendors → /for-suppliers with a permanent redirect (keep legal pages' defined term "vendor"). (3) Region supplier pages under the same "≥3 cards from ≥2 shops" rule as the city pages. Branch rd/lane-2.
```

## G5 — (after G1 merges) Onboarding: Wake, Corporate, the rest + wording sweep
```
SPEC: same rows as G1 + the concept's K (wake, solemn skin) and C1 (corporate). BUILD on the merged engine: Wake (who we are remembering; quiet tone everywhere — no confetti/emoji, abuloy/condolences instead of gifts, no RSVP pressure, sensitive photo defaults), Corporate (company name + logo; an event FOR a business pre-fills from the shop), then Reveal · Birthday variants (debut court) · Celebration · Travel · Tournament · Anniversary · Graduation · Reunion · Gala; roles + default groups per type; sweep event-type wording across Hub/Guest list/Your Team. Branch rd/onboarding-types.
```
