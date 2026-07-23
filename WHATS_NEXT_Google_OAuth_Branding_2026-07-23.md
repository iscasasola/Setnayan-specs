# WHATS_NEXT — Google OAuth branding verification fix (2026-07-23)

> **Self-contained handoff.** A fresh session/account can execute from this file alone. Owner triggered it from the Google Cloud Console "Branding verification issues" screen (screenshot 2026-07-23) with the ask: *"what is the best strategical way to execute this that would still complement our overall design for setnayan?"* → this doc records the **strategy**, the **work already committed (unpushed)**, and the **remaining steps**.

---

## 0 · TL;DR

Google's OAuth **branding/app verification** (Setnayan Google Cloud project — the consent screen for the **YouTube livestream** + **Google Drive photo-delivery** scopes) was **rejected** with two issues:

1. *"Your home page does not explain the purpose of your app."*
2. *"The app name 'Setnayan' configured for your OAuth consent screen does not match the app name on your home page."*

Both are real and rooted in `https://www.setnayan.com`. A design-preserving fix is **committed locally in a worktree but NOT pushed** (see §4). The **strategic recommendation** (§3) is a *two-layer* execution that satisfies Google **without** cheapening the owner-approved cinematic homepage — and turns the requirement into trust content Setnayan needs anyway.

**Good news:** all requested scopes are **sensitive-tier, none restricted** (`drive.file`, not full Drive) → **no CASA security assessment / annual cost.** The *only* blocker to Live Studio (YouTube) + Papic Drive handover going live is this brand/app verification.

---

## 1 · The diagnosis (verified against the live site, raw HTML as Google's bot sees it)

The homepage IS server-rendered with real text, so the raw-HTML content exists — but the **prominent, headline-level** signals mismatch:

| Google complaint | Root cause on `www.setnayan.com` |
|---|---|
| **Name mismatch** | `<h1>` = **"Keep your memories. Plan your moments."** (a tagline, not the name). The largest hero text is the brand-origin tagline **"Set na ’yan"** — literally ≠ "Setnayan". The floating glass nav rendered **icon-only** (`aria-label="Home"`), no textual wordmark. **No `og:site_name`** tag at all. So the matcher reads the page's name as "Set na ’yan" / "Keep your memories". (`application-name` + `apple-mobile-web-app-title` = "Setnayan" ✓ but those are weak signals vs. the visible H1 / og:site_name.) |
| **Purpose not explained** | Lead copy is poetic ("The independent hub to keep a lifetime of memories, and plan any event, free.") — never a plain "Setnayan is a **[what]** for **[whom]** that **[does what]**", and never names the two capabilities that consume the requested Google scopes. |

**OAuth scopes the app requests** (so you know what the "purpose" must cover):
- **Drive** — `https://www.googleapis.com/auth/drive.file` (deliver the couple's event photos to a Drive folder the app created; least-privilege). Routes: `/api/oauth/drive/{start,callback,disconnect}`; libs `drive-upload.ts`, `papic-drive.ts`, `photo-delivery-drive.ts`.
- **YouTube** — `https://www.googleapis.com/auth/youtube` + `youtube.upload` (broadcast the event livestream on the event page — Live Studio / "Panood"). Routes: `/api/oauth/youtube/{start,callback,disconnect}`; lib `panood-youtube.ts` (`YOUTUBE_OAUTH_SCOPES`).

---

## 2 · Owner's live decision this session (2026-07-23)

Asked how far to go on the locked homepage, owner picked **"Wordmark + purpose line"** (design-preserving) over meta-only or a fuller hero rewrite. All options kept the cinematic gate + the "Set na ’yan" tagline. **That is the committed work in §4.** Then owner asked for the *strategically best* execution (§3) and said **"save all for what's next — I will log in a new Claude AI account to continue."**

---

## 3 · The strategy — "complements the design" (RECOMMENDED)

**Key insight: the Google requirement and the brand are only in conflict if you cram both jobs into the same hero. Split them by altitude.**

The marketing homepage's job is emotional conversion (poetry works). The OAuth reviewer's job is verifying legitimacy + that scope usage matches a stated purpose. **Give each its own surface:**

### Layer A — Homepage = identity, light-touch compliance (NOT a Google concession)
- **Keep the "Setnayan" wordmark.** The reskin dropped the wordmark for an icon-only nav; the brand guideline actually *wants* "the SETNAYAN wordmark spelled in full" (CLAUDE.md brand lock). So restoring it **fixes a brand drift** — it complements the design, it doesn't compromise it.
- **Keep `og:site_name = "Setnayan"`.**
- **Soften the hero purpose line.** The committed version (§4) names "YouTube" + "Google Drive" *in the hero* — that reads transactional/SaaS-y in the cinematic gate. **Recommended refinement:** a plain-but-on-brand sentence that names the app + says what it does, WITHOUT the feature dump, e.g.
  > *"Setnayan is the Filipino app to plan your wedding and every celebration after — and keep it all, for life."*
  This satisfies "name matches" + "purpose at a glance" while staying in the ELN voice. **Move the explicit YouTube/Drive naming to Layer B.**

### Layer B — A dedicated "How your Google connection works" / data-transparency surface = the scope explanation
- Plainly explains, in trust language: *connect your YouTube to livestream your day (Live Studio); connect your Google Drive so your photos are delivered to a folder you own — we only touch files we create (`drive.file`).*
- This is where the concrete scope purpose lives. It **doubles as the reassurance couples need before granting Google access**, and it complements Setnayan's privacy-first / NPC / RA 10173 posture (a major corpus theme).
- Candidate homes: enrich `/how-it-works` (has a Live Studio + photo-delivery story already) or add a small `/connect` (or `/how-your-google-connection-works`) page; **link it from the Live Studio + Photo-Delivery feature pages and the footer.** Google's reviewers follow links, and the **scope-justification form + (if requested) the demo video** should point here.

### Layer C — Google Cloud console config (no code)
- Keep consent-screen **app name = "Setnayan"** (do not rename to the tagline).
- Keep **Application home page = `https://www.setnayan.com`** (now wordmark-compliant). Optionally *also* reference the Layer-B page in the scope justification.
- Confirm privacy-policy link (`/privacy`) is reachable and addresses Google user data + "Limited Use" for `drive.file`/YouTube (⚠ not flagged this round, but the sensitive-scope reviewer checks it — see corpus `project_setnayan_privacy_reconciliation` memory: `/privacy` currently omits some shipped SPI flows).

### Scope hygiene (strategic cost — already good)
- Drive is `drive.file` (**sensitive**, not the **restricted** full-Drive) → **no annual CASA security assessment.** Keep it that way; never widen to `auth/drive`.
- YouTube `youtube`+`youtube.upload` are **sensitive**, not restricted → also no CASA. If a narrower livestream-only scope ever suffices, prefer it, but current set is acceptable.

### Sequencing
Ship **Layer A now** (unblocks the resubmit) → build **Layer B** in parallel → set **Layer C** → *then* click **"I have fixed the issues"** in the console (each re-verification is a fixed cost + days of latency, so land A+B+C before resubmitting; don't burn a cycle on Layer A alone).

---

## 4 · Work ALREADY DONE this session (committed locally, **NOT pushed**)

- **Repo (canonical):** `/Users/icecasasola/Documents/Claude/Projects/setnayan-platform` (origin = `github.com/iscasasola/setnayan-platform`).
- **Worktree:** `/Users/icecasasola/setnayan-wt-oauth-branding`
- **Branch:** `claude/oauth-homepage-branding` (off `origin/main` @ `c982eac4a`)
- **Local commit:** `55bacb508` — *"fix(home): pass Google OAuth branding review — Setnayan wordmark + purpose line + og:site_name"*
- **⚠ node_modules in the worktree are SYMLINKS** to the main checkout (created to run checks fast). Do **not** `pnpm install` over them blindly; if the symlink is stale, remove it and `pnpm install --frozen-lockfile` in the worktree.

**Files changed (4):**
1. `apps/web/app/page.tsx` — added `openGraph.siteName: 'Setnayan'` → emits `og:site_name`.
2. `apps/web/app/_components/home/HomeReskin.tsx` — nav: added visible `<span className="hr-wordmark">Setnayan</span>` beside the mark; logo `aria-label`→"Setnayan — home", `title`→"Setnayan". Hero: replaced `HOME_HERO.sub` with a plain purpose line **that also names YouTube + Google Drive** (⚠ Layer-A refinement in §3 recommends softening this — drop the feature names from the hero).
3. `apps/web/app/_components/home/home-reskin.css` — `.hr-logo` → auto-width icon+wordmark pill (`gap`, side padding); new `.hr-wordmark` type spec (Geist 16px/600); ≤480px keeps the square 40px badge + hides the wordmark; `.hr-hsub` gained `max-width:54ch` + auto side-margins.
4. `changelog.d/oauth-homepage-branding.md` — fragment (`SPEC IMPACT: None`).

**Verified:** `pnpm typecheck` ✅ 0 · `pnpm lint` (next lint) ✅ 0 (only pre-existing warnings elsewhere) · `lint:masthead` / `lint:navicon` / `lint:legibility` ✅.
**NOT verified:** visual render — a local `next dev` screenshot pass was **interrupted before completion**. The nav pill widening + wordmark color adaptivity (white on gate → ink on open) + the longer sub wrap are **unseen**. **Verify the render before merging** (local dev screenshot, or the PR's Vercel preview) per the owner's "verify before arming auto-merge" rule.

---

## 5 · Remaining steps (execution metadata — §3 schema of WHATS_NEXT_INDEX)

```
- id: oauth-branding#1  (Layer A ship)
  title: Push branch, open PR, screenshot Vercel preview (desktop + ≤480px), THEN arm auto-merge
  type: code | verify
  depends_on: []
  parallel_safe: yes            # touches only homepage files, no migration
  safety_gate: NONE             # (the console "resubmit" click IS human — see #4 below)
  touches: apps/web/app/page.tsx · _components/home/HomeReskin.tsx · home-reskin.css · branch claude/oauth-homepage-branding
  verify: tsc✅ lint✅ done; REMAINING = visual (nav wordmark + white→ink switch + mobile square badge + sub wrap) via Vercel preview
  note: consider the §3 Layer-A refinement (soften hero sub — drop YouTube/Drive naming) BEFORE pushing

- id: oauth-branding#2  (Layer B — trust surface)
  title: Build/enrich "How your Google connection works" (YouTube livestream + drive.file delivery, trust-framed); link from Live Studio + Photo-Delivery pages + footer
  type: code
  depends_on: []
  parallel_safe: yes            # different files from #1 (how-it-works / new /connect page)
  safety_gate: NONE
  touches: apps/web/app/how-it-works/* OR new app/connect/* + footer links
  verify: tsc + lint + Vercel preview; reads as trust content, not a feature dump

- id: oauth-branding#3  (privacy check)
  title: Confirm /privacy addresses Google user data + Limited Use for drive.file/YouTube (ties to project_setnayan_privacy_reconciliation)
  type: verify | spec
  depends_on: []
  parallel_safe: yes
  safety_gate: DPO_COUNSEL      # privacy copy = DPO's call (owner-as-DPO)
  touches: apps/web/app/privacy/* (+ NPC dossier corpus)

- id: oauth-branding#4  (Layer C — resubmit; HUMAN)
  title: In Google Cloud console — keep app name "Setnayan" + home page URL; point scope justification at Layer B; click "I have fixed the issues"
  type: decision (human, in-console)
  depends_on: [oauth-branding#1, oauth-branding#2]   # land A+B live BEFORE resubmitting
  parallel_safe: no
  safety_gate: OWNER_DECISION   # ONLY the owner clicks resubmit; Claude cannot/should not touch the console
```

**Do NOT resubmit (#4) until #1 and #2 are LIVE on `www.setnayan.com`** — re-verification is a fixed cost + multi-day latency.

---

## 6 · Fast resume for a fresh session

```bash
# canonical repo + the in-flight worktree
cd /Users/icecasasola/setnayan-wt-oauth-branding
git log --oneline -1            # expect 55bacb508 (local, unpushed)
git -C /Users/icecasasola/Documents/Claude/Projects/setnayan-platform fetch origin main
# (optional) rebase the worktree branch onto fresh main if it drifted
# EITHER: refine the hero sub (Layer-A, §3) then:
gh pr create ... ; # screenshot Vercel preview ; then: gh pr merge <#> --auto --merge
```
Then build Layer B (#2), do #3, and hand the console resubmit (#4) back to the owner.
