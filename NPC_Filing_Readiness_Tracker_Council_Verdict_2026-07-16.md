# NPC Pre-Filing Readiness Tracker — Council Verdict (2026-07-16)

## 1. Verdict summary

- **Build a new table, `npc_filing_tasks` — do NOT extend `data_privacy_controls`.** Unanimous across architect, UX, and skeptic seats. The privacy board is a *gate*: its `status` is read by `isDataPrivacyControlActive()` (`apps/web/lib/data-privacy-controls.ts`) and flipping a row changes live product behavior, fail-closed. A filing task turns nothing on — conflating "capability is live" with "paperwork is adopted" would poison the gate.
- **Clone the shipped *pattern*, not the table.** Reuse every mechanic proven on the Data Privacy board: repo-root migration with RLS at `CREATE TABLE` via `public.is_admin()` (`supabase/migrations/20270814219429_data_privacy_controls.sql`), code-catalog-mirrored-into-DB-seed, service-role upsert via `createAdminClient()`, `requireAdmin()`/`requireAdminAction()`, `FormFlash` + `?flash`/`?error` redirect.
- **Surface at a new sibling page `/admin/npc-readiness`**, cross-linked to `/admin/data-privacy`. Register BOTH doorways or it orphans (memory: `project_setnayan_wayfinding_rule`): a nav item in `admin-nav-groups.tsx` beside Data Privacy AND a `<Tile>` in the "More queues" grid of `apps/web/app/admin/page.tsx`.
- **Deduplicate to ~15 canonical rows.** The audit's three lists (15 Tier items · 13 missing docs · B1–B5/W1–W7) are the same ~15 obligations counted three ways. The **Tier 0–3 "Before Filing" spine is the canonical row-set**; the 13 missing docs fold into item `detail` + `source_refs`; the B/W issues become a `severity` flag, not rows. Ruled against seeding all ~40 verbatim.
- **Status vocabulary is a filing worklist, not a gate.** Five values: `not_started → in_progress → blocked_on_counsel → resolved`, plus `not_applicable`. The gate vocabulary `active/inactive/blocked` is wrong here (architect + UX, 3–1 over skeptic's reuse-verbatim; ruling below).
- **The tracker stores work-state, not audit findings** (skeptic). Rich prose stays in the corpus `.md`, linked out. Re-seed is additive via `ON CONFLICT (task_key) DO NOTHING` — a future audit adds rows, never overwrites owner status.
- **The catalog lives in version control** (`apps/web/lib/npc-filing-tasks.ts`), which directly answers audit finding **W6** (the most-relied-on compliance docs are untracked).
- **False assurance is prevented structurally, not with a banner** (skeptic + UX): the page has **no terminal green state**. The header string is *computed* from the counsel-review row (`t0-1`) and reads "counsel review outstanding" no matter how many other rows resolve. Counsel-gated rows cannot reach `resolved` without a written counsel reference in their note.
- **No auto-derived "ready to file" verdict, ever.** Legal readiness is never rolled up from all-resolved. Counsel remains the explicit human gate.
- **Keep it a solo-operator worklist** (all seats): no assignee user-management, no due dates/SLA timers, no burndown charts, no dependency graph, no per-item file upload, no document generation, no invented download panel (`lib/npc-documents.ts` does not exist per scout — do not fake-door it).

## 2. The tracked-item catalog (seed list — implement verbatim)

Canonical spine = the audit's §5 Tier 0–3 checklist. `source_refs` preserves every original id so audit traceability survives in the detail drawer. `is-blocker` is derived from `severity='blocking'` (the B-cluster).

| id | title | tier | kind | is-blocker | counsel-gated | source_refs |
|---|---|---|---|:---:|:---:|---|
| **t0-1** | Route the full packet to external PH counsel (§3(l)/minors, vendor AMLC/PEP + gov-ID basis, NPCRS threshold, automated-decision provisions) — **the terminal gate** | 0 | counsel | Y | Y | t0-1 |
| **t0-2** | Pick ONE authoritative filing backbone: use the NPC pack, demote the dossier to summary, **fix dossier SPI under-declaration** (restore vendor gov-ID + AMLC/PEP), reconcile to ONE RoPA | 0 | reconciliation | Y | N | t0-2, B4, W7 |
| t0-3 | Reconcile single-source conflicts: one DPO email, one DSR SLA, one device-fingerprint live/off state; **commit the 3 untracked canonical docs** | 0 | reconciliation | N | N | t0-3, W1, W2, W3, W6 |
| **t1-4** | Publish Anti-Fraud disclosure + record its LIA + document a formal §16(c)/§34 automated-decision contest path | 1 | document | Y | Y | t1-4, m-6, m-8, B2 |
| **t1-5** | Publish faith/minors/e-gift/device-fingerprint disclosures on the public notice + matching RoPA rows; **fix the biometric "we do not collect" denial**; publish Person-Graph + Anti-Fraud policy amendments; add consent templates | 1 | document | Y | Y | t1-5, m-4, m-5, m-13, B3 |
| **t1-6** | Gate or consent-instrument `events.signature_details` honoree-SPI (child DOB/gender, pregnancy due-date) — currently unflagged, unconsented, no timestamp | 1 | remediation | Y | Y | t1-6, m-5, B3 |
| t1-7 | Confirm true prod flag state of `NEXT_PUBLIC_DEPENDENT_PEOPLE` + `PABUYA_PUBLIC_ROUTE_ENABLED`; if ON, add live SPI/minors + financial-PI RoPA rows | 1 | remediation | N | N | t1-7 |
| **t2-8** | Execute DPAs/SCCs for every named sub-processor (Supabase, Vercel, Cloudflare, Resend, Sentry, PostHog, Anthropic, Persona, Google, TikTok, Suno); attach executed refs | 2 | document | Y | N | t2-8, m-3, B5 |
| t2-9 | Write outstanding DPIAs — R-03 Vendor Verification (HIGH, live) + R-05 Minors/Legacy (HIGH, counsel-first); decide R-04/R-06/R-07 standalone-vs-folded | 2 | document | N | Y | t2-9, m-7 |
| t2-10 | Record the Device-Fingerprint LIA + get DPO sign-off before flipping the flag | 2 | document | N | N | t2-10, m-6 |
| t2-11 | Adopt light NDA / privacy-training / device-hygiene notes for the 2-person team | 2 | document | N | N | t2-11, m-9 |
| **t3-12** | Sign + date the DPO Designation (with DPO acceptance), Privacy Manual, Breach Policy, and the three completed DPIAs; set effectivity dates | 3 | document | Y | Y | t3-12, m-1, m-12, B1 |
| t3-13 | Resolve remaining [TO CONFIRM] NPCRS fields (business address, DPO title/phone, BIR TIN/Form 2303) + **FILE the DPS via NPCRS** + capture the ack/registration number | 3 | document | N | N | t3-13, m-2, m-11 |
| t3-14 | Reconcile binding Privacy & Security Policy §4 retention (10-year floor + vendor-verification class) + stand up retention ENFORCEMENT (R2 lifecycle, retention sweep, fix chat-PII hard-delete residue) | 3 | reconciliation | N | N | t3-14, W4, W5 |
| t3-15 | Initiate operational breach-management records (register live, first table-top drill, annual-report cadence) | 3 | document | N | N | t3-15, m-10 |

**15 rows.** Every §B missing doc (m-1…m-13) and every §C issue (B1–B5, W1–W7) folds into a row's `detail` + `source_refs`. Nothing is lost; the triple-count is collapsed.

*Note on `t3-13`:* the filing action itself lives here. Its `resolved` state means "DPS filed, ack number captured in `evidence`" — but it is structurally forbidden from resolving before `t0-1` is `resolved` (see §5).

## 3. Data model

New table, cloned structurally from `data_privacy_controls` (`supabase/migrations/20270814219429_data_privacy_controls.sql`), migration placed at **repo-root** `setnayan-platform/supabase/migrations/<timestamp>_npc_filing_tasks.sql` (NOT under `apps/web`).

```sql
CREATE TABLE public.npc_filing_tasks (
  task_key        TEXT PRIMARY KEY,                 -- 't0-1', 't3-13', …
  title           TEXT NOT NULL,
  detail          TEXT NOT NULL,                    -- what "resolved" concretely means
  tier            SMALLINT NOT NULL,                -- 0..3 (the audit's own priority spine)
  kind            TEXT NOT NULL
                    CHECK (kind IN ('counsel','document','reconciliation','remediation')),
  severity        TEXT NOT NULL DEFAULT 'normal'
                    CHECK (severity IN ('blocking','weakening','normal')),  -- is_blocker = (severity='blocking')
  counsel_gated   BOOLEAN NOT NULL DEFAULT FALSE,   -- "waiting on the lawyer" is one WHERE clause
  source_refs     TEXT[] NOT NULL DEFAULT '{}',     -- ['m-4','B3','W7'] provenance into the audit
  source_audit_ref TEXT NOT NULL
                    DEFAULT 'NPC_Submission_Completeness_Audit_2026-07-16.md',
  related_control_key TEXT,                          -- soft ref to data_privacy_controls.control_key (no FK)
  status          TEXT NOT NULL DEFAULT 'not_started'
                    CHECK (status IN ('not_started','in_progress','blocked_on_counsel','resolved','not_applicable')),
  note            TEXT,                              -- dated working note; counsel reference required to resolve gated rows
  evidence        TEXT,                              -- NPCRS ack no., executed-DPA ref, adopted-doc path
  resolved_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at     TIMESTAMPTZ,
  sort_order      INTEGER DEFAULT 100,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.npc_filing_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY npc_filing_tasks_admin_read  ON public.npc_filing_tasks
  FOR SELECT USING (public.is_admin());
CREATE POLICY npc_filing_tasks_admin_write ON public.npc_filing_tasks
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
-- No INSERT policy: seed + first-write upserts run under service-role (createAdminClient bypasses RLS),
-- exactly as data_privacy_controls does.
```

Seed the 15 rows in the same migration via `INSERT … ON CONFLICT (task_key) DO NOTHING`, so re-runs preserve owner edits (matches the shipped board).

**Status enum ruling.** Purpose-built five-value enum, ruling against the skeptic's reuse-`active/inactive/blocked`-verbatim (3–1). The gate vocabulary carries the wrong meaning for a worklist, and `blocked_on_counsel` (distinct from the `counsel_gated` flag — one is "parked behind the lawyer *now*," the other is "will eventually need the lawyer") plus `not_applicable` (the audit itself leaves R-04/R-06/R-07 scope open per t2-9) are load-bearing. We keep the shipped *action shape*, just widen the enum.

**Code-catalog vs DB.** Mirror the Data Privacy board: `apps/web/lib/npc-filing-tasks.ts` holds the canonical `NPC_FILING_TASKS` catalog (the 15 defs), migration seed mirrors it, and a `fetchNpcFilingTasks(supabase)` helper SELECTs DB rows and merges them *over* the catalog by `task_key`, sorted by `sort_order` — identical to `fetchDataPrivacyControls`. **Critical difference: there is NO gate function.** Nothing reads task status to flip a capability (no `isNpcTaskResolved()`), so there is no fail-closed requirement. Committing the catalog to code is itself the fix for W6.

## 4. Where the council disagreed

- **Status vocabulary — skeptic (reuse 3-state verbatim for build speed) vs architect + UX + compliance (purpose-built).** *Ruled:* purpose-built 5-value enum. The extra CHECK constraint is cheap; shipping gate-vocabulary onto a worklist invites exactly the "what does `active` mean here?" confusion the new-table decision exists to avoid. Skeptic's underlying win — reuse the action *logic and shape* — is preserved.
- **Row count — skeptic (15, §5 only) vs compliance (18, reorganized as B0–B5 blocker-first) vs architect (~25–28).** *Ruled:* 15, on the audit's Tier 0–3 spine (skeptic). Compliance's blocker-first reorg is excellent but discards the tier ordering the UX seat builds the page around; its content survives as the `severity` flag + pinned blocker strip. Architect's 25–28 re-expands docs into rows we deliberately fold. The tier spine is provably complete — all 13 missing docs and all 12 B/W issues map onto a tier item (§2).
- **Counsel enforcement — skeptic (hard block: gated rows need a counsel reference to resolve; header computed from t0-1) vs UX (separate "Counsel Cleared" track + banner).** *Ruled:* adopt skeptic's data-model enforcement as primary (it survives a distracted owner), and keep UX's pinned NOT-FILED banner + separate-track *presentation* on top. Both, not either.
- **Assignee / ownership modeling — architect proposed an `owner_role` enum; others silent.** *Ruled:* cut entirely for phase 1. Two-person team; a role tag is unearned structure. Add later only if the owner asks.
- **New `file` kind for t3-13 — compliance proposed it.** *Ruled:* keep the four kinds from the brief (`counsel/document/reconciliation/remediation`); filing is a `document`-kind action whose `resolved` state carries the NPCRS ack number in `evidence`. Fewer enum values, same information.

## 5. Anti-false-assurance design (structural, not cosmetic)

The single biggest risk (skeptic) is **liability laundering**: the board becomes the artifact that makes the owner file *prematurely*, an internal green light standing in for the counsel review that B1/t0-1 says has never happened. Four structural defenses, in the data and the action — not just a banner:

1. **No terminal green state.** The page never renders "READY TO FILE." The header renders a computed string: while `t0-1.status !== 'resolved'`, it can only read **"N of 15 worked down · external counsel review outstanding — NOT cleared to file."** No combination of the other 14 rows resolving can change that suffix, because it is derived from that one row.
2. **Counsel-gated rows cannot self-resolve.** In the cloned action (`actions.ts`), enforce: if `task.counsel_gated && status === 'resolved' && !note.trim()` → `fail('Counsel-gated items need a written counsel sign-off reference (name + date of memo) to resolve.')`. ~4 lines. The owner physically cannot mark the minors/DPIA/notice rows done without citing counsel.
3. **t3-13 (FILE) is fenced behind t0-1.** The action refuses to move `t3-13` to `resolved` unless `t0-1` is already `resolved`. Filing the DPS on an unreviewed, self-contradicting packet is the one irreversible mistake; the surface is structurally incapable of recording it out of order.
4. **Pinned blocker strip + standing banner.** The B-cluster (`t0-2, t1-4, t1-5, t1-6, t2-8, t3-12`) renders as a red pre-flight strip above the tiers regardless of tier order. A persistent top banner — *"NOT FILED. External PH counsel review is a required gate; a green count here means work is staged, not that Setnayan is compliant or cleared to lodge."* — never disappears until t0-1 resolves.

If we cannot guarantee the surface structurally refuses to imply readiness, we should not ship it — a stale spreadsheet is safer than a false green light.

## 6. Owner sign-offs (yes/no)

1. **Dedup to the 15-item Tier 0–3 spine?** (Missing docs fold into `detail` + `source_refs`; B/W issues become a `severity` flag + pinned blocker strip — not 40 verbatim rows.) **Y / N**
2. **New table `npc_filing_tasks`, cloned from the Data Privacy board — never extend `data_privacy_controls`?** **Y / N**
3. **Confirm the no-readiness guard:** even at 15/15 resolved, the header reads "counsel review outstanding" until `t0-1` is resolved-with-reference, and `t3-13` (FILE) is fenced behind `t0-1`? **Y / N**
4. **Counsel-gated rows require a written counsel reference in the note to resolve?** **Y / N**
5. **Catalog committed to `apps/web/lib/npc-filing-tasks.ts`** (the durability fix for W6 — checklist lives in the repo, not just the DB)? **Y / N**
6. **Cut for phase 1:** no assignees/due-dates/SLA/burndown/upload/doc-generation/download-panel — link out to existing surfaces only? **Y / N**
7. **Load-bearing input the audit flags:** confirm true prod flag state of `NEXT_PUBLIC_DEPENDENT_PEOPLE` + `PABUYA_PUBLIC_ROUTE_ENABLED` (t1-7) — decides whether live-SPI RoPA rows exist. **ON / OFF / UNKNOWN**

## 7. Build plan (PR-sized, reuse-first)

**PR-1 — schema + catalog (no UI).**
- Add migration `setnayan-platform/supabase/migrations/<ts>_npc_filing_tasks.sql`, structurally cloning `20270814219429_data_privacy_controls.sql`: table + RLS-at-CREATE via `public.is_admin()` (SELECT + UPDATE policies only) + seed the 15 rows `ON CONFLICT (task_key) DO NOTHING`.
- Add `apps/web/lib/npc-filing-tasks.ts`, mirroring `apps/web/lib/data-privacy-controls.ts`: `NPC_FILING_TASKS` catalog, `NpcTaskKey`/`NpcTaskDef`/`NpcTaskRow` types, `fetchNpcFilingTasks(supabase)` (DB-over-catalog merge). **No gate function** — deliberately unlike `isDataPrivacyControlActive`.
- `changelog.d/` fragment; `SPEC IMPACT:` links the audit doc.

**PR-2 — admin page + action.**
- `apps/web/app/admin/npc-readiness/page.tsx`, cloned from `apps/web/app/admin/data-privacy/page.tsx`: `dynamic='force-dynamic'`, `metadata.title='NPC Filing Readiness · Admin'`, `await requireAdmin()`, `createAdminClient()`, `fetchNpcFilingTasks(admin)`. Render: standing NOT-FILED banner → computed header string (gated on `t0-1`) → pinned red blocker strip → cards grouped by Tier 0→3, each a `<form action={setNpcFilingTask}>` with hidden `task_key`, a dated note input, `evidence` input, and `SubmitButton`s posting the five status values. Use `FormFlash` (`@/app/_components/forms/form-flash`) + `SubmitButton` (`@/app/_components/submit-button`); design tokens `var(--m-ink)`, `sn-tile`, `sn-eye` as on the shipped board.
- `apps/web/app/admin/npc-readiness/actions.ts`, cloned from `apps/web/app/admin/data-privacy/actions.ts`: `'use server'`, `requireAdminAction()`, validate `task_key` against `NPC_FILING_TASKS` + status against the enum, upsert via `createAdminClient()` `onConflict:'task_key'` (self-seeds title/detail/tier/kind/severity from the code def), stamp `resolved_by`/`resolved_at` only when `status==='resolved'`. **Add the three enforcement guards (§5.2, §5.3):** counsel-gated resolve requires non-empty note; `t3-13` resolve requires `t0-1` resolved; `revalidatePath('/admin/npc-readiness')` + `?flash`/`?error` redirect.

**PR-3 — doorways (both, or it orphans).**
- Add a nav item to `apps/web/app/admin/_components/admin-nav-groups.tsx` in the `queues`/Overview group beside Data Privacy: `{key:'npc-readiness', label:'NPC Filing', href:'/admin/npc-readiness', icon:ListChecks, matchPrefix:'/admin/npc-readiness'}`. **Do NOT add `'use client'`** to this module (RSC gotcha — memory `project_setnayan_rsc_client_data_export`; the `/admin/money` crash). `ListChecks` is already imported from `lucide-react` per scout.
- Add a `<Tile>` to the "More queues" grid in `apps/web/app/admin/page.tsx` beside the Data Privacy tile: `<Tile href="/admin/npc-readiness" icon="list-checks" title="NPC Filing" body="Work down the NPC pre-filing checklist (RA 10173) — counsel review is the gate." />`. Confirm `list-checks` resolves in `_overview-tile`; if not, add the key or reuse `'shield-check'`/`'file-text'`.
- Optional: add a description in `apps/web/app/admin/_components/admin-nav-descriptions.ts` for the FAB.
- **Deep-link, don't re-host** (UX — no fake doors): remediation rows link to the matching `/admin/data-privacy` control; NPCRS-field rows (t3-13) link to `/admin/settings?tab=compliance` and the existing `apps/web/app/admin/compliance/data-sheet/page.tsx` export; doc rows link to their corpus `.md` path. There is **no** NPC document-download route (`lib/npc-documents.ts` absent) — do not build one.

Each PR carries a `changelog.d/` fragment; none edits `CHANGELOG.md`/`STATUS.md` directly. Corpus decision logged at the bottom of `DECISION_LOG.md`.