# Video Render Pipeline — Options Brief (decision-grade)

> **For:** Owner. **Date:** 2026-06-28. **Author:** Claude Code (research + options; **not** a decision).
> **Purpose:** Lay out the choices crisply so you can pick. The render pipeline is the **#1 infra gate** — it currently blocks SDE auto-render, Guest Stories full render, AI Highlights, Personal-Reels-as-video, "Kwento words baked into a film," and the Living-Memories (Alaala) manifesto film.
> **Lens order (per project values):** UX-best + long-term ownership lead. Cost is secondary but called out everywhere. OSS/self-host is the default; commercial needs a WHY.
> **Currency note:** USD figures from 2026 vendor pages (sourced at bottom). ₱ conversions at ~₱58/USD, ~₱63/EUR. Anything I could not verify is labelled **(est.)**.

---

## 1. The decision in one paragraph

Setnayan needs a way to turn photos + 5-second Papic clips + owned music into short vertical (1080×1920 H.264) films, **without** breaking the near-zero marginal-cost moat (today the only per-couple cost is R2 storage; renders and egress are ~₱0 because of R2's free egress). The good news: **a working client-side render path already ships** — `apps/web/lib/patiktok-render.ts` (WebCodecs `VideoEncoder` → `mp4-muxer`, MediaRecorder fallback, 1080×1920 @ 30fps, owner-locked client-side 2026-06-18). That path can carry the *free, short* products (Guest Stories 30s, Personal Reels 1–30s) at literally ₱0 server cost **right now**. The open question is the *long, paid, or AI* products — the ~3-min SDE, Thank-You 5-min, and AI Highlights — where a 180-second render on a guest's phone is risky. So this is really **three sub-decisions**, not one:

**Sub-decision A — Render host** for the long/paid/AI tier (the short free tier stays client-side regardless). Options A–F below.
**Sub-decision B — Owned-music library** — how (and whether) to generate + own the ~400-track catalogue, and what the interim is until it exists.
**Sub-decision C — AI-Highlights spend cap** — a hard per-render and monthly ceiling, and how to enforce it, before any Anthropic/LLM key is wired.

My recommended answers are in §3–§5. **None of these are urgent-blocking for the free viral loop** — Stories ships client-side today; the host decision only gates the paid SDE/long/AI lane.

---

## 2. Render-host options

### Comparison table

| # | Option | Per-render cost (3-min SDE) | Monthly floor | Integration effort (Claude-Code build) | External setup (calendar-bound) | Control / ownership | Scaling | Quality for our format | R2-moat interaction |
|---|---|---|---|---|---|---|---|---|---|
| **A** | **Client-side WebCodecs / ffmpeg.wasm** (extend existing path) | **₱0** | **₱0** | **S–M** (path exists; add audio-encoder + long-render chunking) | None | **Total** (our code) | Per-device; scales free but caps on long renders | Excellent for ≤30s; **risk** at 180s on weak phones | **Perfect** — never leaves the device; only the finished MP4 hits R2 |
| **B** | **Cloudflare Containers + FFmpeg** (Workers-orchestrated) | ~**₱0.10–0.50** compute (est.) | ~**₱290** ($5 Workers Paid) | **M–L** (new worker + container image + queue) | Cloudflare Containers enable (GA Apr 2026) | High (our FFmpeg, our image) | Burst-scales to zero; per-instance ≤0.5 vCPU / 4 GiB | Full FFmpeg fidelity | **Best server fit** — same vendor as R2, intra-Cloudflare = ₱0 egress |
| **C** | **Self-hosted Hetzner FFmpeg pool** | **₱0 marginal** (fixed box) | **~₱2,700** (CCX13 €42.99 post-Jun-15 hike) | **M–L** (provision box, queue, worker daemon, ops) | Hetzner account + server provision; **APAC latency** (EU/US/SG-none) | **Total** (our box, our FFmpeg) | Fixed ceiling; must size for peak; you babysit it | Full FFmpeg fidelity | Egress Hetzner→R2 is small (finished MP4 only); fine |
| **D** | **Mux** (managed encode + stream) | ~**₱1.3** encode ($0.0225) | **₱0** (usage-only) | **S–M** (API + webhook) | Mux account + keys | **Low** (their pipeline, their player) | Fully managed, infinite | Excellent, but it's a *streaming* product not a *compositor* | **Bad** — Mux delivery is metered ($0.025/min after 100k); pulls traffic **off** the R2-free moat |
| **E** | **Creatomate / Shotstack** (template render API) | **₱10–70** (Creatomate ~$0.06–0.28/min; Shotstack ~$0.11–0.40/min) | **₱2,400–2,900** ($41–49) | **S** (JSON template + API — fastest to ship) | Vendor account + keys | **Low** (their renderer, their template schema) | Fully managed, infinite | Excellent, purpose-built for exactly our format | Neutral (they push the file to R2; you pay their per-min) |
| **F** | **Remotion** (self-host **vs** Remotion Lambda) | self-host **₱0** marginal / Lambda **"pennies"** + S3 (est.) | self-host = host's floor; **+₱5,800/yr license** if 4+ devs ($1,000/yr min) | **M** (React-video components; nice DX) | AWS (for Lambda) or any host (self-host) + **license check** | Med-High (our React comps) but **license is a commercial dependency** | Lambda scales infinitely; self-host = host's limits | Excellent; React/CSS compositing is the best authoring DX | Lambda pulls S3 egress unless assets on R2; self-host on Cloudflare = clean |

> **₱ math shown for a single 3-min SDE.** At the volumes implied by the marginal-cost model (low hundreds of couples, a handful of SDEs each), **every option's variable cost is rounding error** — the real differentiators are *floor*, *control*, *ops burden*, and *moat-fit*, not per-render cents.

### Prose, one each

**(A) Client-side WebCodecs / ffmpeg.wasm — extend what exists.** This is already shipping (`patiktok-render.ts`): WebCodecs `VideoEncoder` → clean H.264 MP4 via `mp4-muxer`, MediaRecorder/webm fallback, 1080×1920 @ 30fps, owned-music mixed in on the MediaRecorder path. Marginal cost is a true **₱0** (the device burns the cycles), the moat is *perfectly* preserved (nothing but the finished MP4 touches R2), and it's owner-locked as the render posture (2026-06-18). **The catch is duration:** a 30s Story is trivial; a 180s SDE is 6–12× the compute budget and a weak mid-range Android could stall, overheat, or drop frames. Two known gaps: (1) the WebCodecs path can't mux audio yet (today music forces the slower MediaRecorder/webm path) — a follow-up `AudioEncoder` gives clean MP4-with-audio; (2) long renders need **chunking** (ffmpeg.wasm `concat`, or a "designated device" booth-tablet render). **Verdict: keep it as the permanent home for the short free tier; it is *not* a safe sole home for the 3-min paid SDE.**

**(B) Cloudflare Containers + FFmpeg — the server option that respects the moat.** Containers went **GA on 2026-04-13**. You orchestrate from a Worker, spin a container running real FFmpeg, render, push to R2, sleep. Because it's the **same vendor as R2**, the finished file moves intra-Cloudflare at **₱0 egress** — this is the *only* server option that doesn't poke a hole in the free-egress moat. Pricing is burst-billed (CPU $0.000020/vCPU-s, memory $0.0000025/GiB-s, billed per 10ms of active CPU, sleeps to ₱0), so a few hundred SDEs/month is cents of compute over the **$5/mo (~₱290) Workers Paid** floor. Caveats: instances cap at **0.5 vCPU / 4 GiB** today (fine for a 3-min 1080p encode, snug for 5-min Thank-You — chunk it), and the HN crowd flags Containers as pricey for *sustained 24/7* loads (irrelevant to us — our loads are bursty and sleep). **Verdict: the best long-term server host for SDE/long/AI — OSS FFmpeg, our code, our vendor, moat intact.**

**(C) Self-hosted Hetzner FFmpeg pool — maximum ownership, real ops.** A dedicated-vCPU box (CCX13) running a queue + FFmpeg worker daemon. Marginal cost per render is **₱0** (fixed box), full FFmpeg fidelity, total control. But: (1) Hetzner **just raised CCX prices ~169% on 2026-06-15** (CCX13 €15.99 → €42.99/mo ≈ **₱2,700**), so the floor is now meaningful and *always-on* whether you render 1 or 1,000; (2) **no APAC region** (EU/US only) — fine for async batch renders, bad if you ever want low-latency; (3) **you own the ops** — provisioning, patching, scaling for peak, on-call. This is the OSS-purist pick but it trades the moat's "zero fixed infra" for a standing monthly box and ops you babysit. **Verdict: only if you specifically want a render box you fully own and will operate — otherwise (B) gives you the same FFmpeg ownership with no standing box and better moat-fit.**

**(D) Mux — wrong shape of tool.** Mux is excellent and cheap to *encode* ($0.0075/min; a 3-min SDE encode ≈ ₱1.3) and its first 100k delivery-minutes/month are free. But Mux is a **streaming/transcoding** product, not a **compositor** — it doesn't stitch your clips+photos+music+template into a film; you'd still need a renderer first, then Mux just for delivery. And its **metered delivery** ($0.025/min after the free tier) deliberately pulls traffic **off** the R2-free-egress moat you built on purpose. **Verdict: skip for V1; it solves a problem (adaptive streaming at scale) we don't have, and erodes the moat.**

**(E) Creatomate / Shotstack — fastest to ship, least owned.** Template render APIs purpose-built for *exactly* our format (vertical, template-driven, music track, captions baked in). You POST a JSON template + asset URLs, they return an MP4. **Shipping effort is the lowest of any option (S)** — no FFmpeg, no infra, days not weeks. Cost: Creatomate ~$0.06–0.28/video-min ($41/mo floor); Shotstack ~$0.11–0.40/min ($49/mo floor) — a 3-min SDE lands ₱10–70. The downside is **ownership**: their renderer, their template schema, their uptime, their pricing roadmap, vendor lock-in — the exact thing the OSS-first directive warns against, and their per-minute meter compounds against margin as volume grows. **Verdict: a strong *bridge* if you want SDE live this week, but not the long-term home; treat as a de-risking option, not the destination.**

**(F) Remotion — best authoring DX, watch the license.** Remotion lets you build the film as **React components** (the nicest authoring/iteration experience by far, and it composes cleanly with our existing React stack). Two deploy modes: **self-host** (render on any box/Container — free license for ≤3-person for-profit teams) or **Remotion Lambda** (renders cost "pennies" but adds S3 egress + CloudWatch). **The commercial gotcha:** a for-profit company of **4+ people** needs a Remotion **company license — min $100/mo or $1,000/yr (~₱5,800/yr)**. That's a standing commercial dependency the OSS-first directive specifically asks us to flag. **Verdict: the most pleasant to build with; if the team stays ≤3 it's free + self-hostable on Container (B) and very attractive; once you cross 4 people it carries a recurring license — decide with eyes open.**

---

## 3. Recommended DEFAULT path

**Lead with UX-best + long-term ownership (per the project's stated values); cost is the tie-breaker, and here it barely moves the needle.**

> ### Recommendation: a **two-tier, phased** pipeline — **Client-side (A) for the short free tier, Cloudflare Containers + FFmpeg (B) for the long/paid/AI tier** — with **Remotion-on-Container as an optional authoring upgrade** and **Creatomate as an emergency bridge** if SDE must ship before B is ready.

**Why this default:**

1. **It protects the moat by construction.** (A) never leaves the device; (B) is the *only* server option co-located with R2, so finished films move at ₱0 egress. No metered-delivery tax (rules out D), no per-minute renderer meter compounding against margin (de-prioritises E).
2. **It honours OSS-first.** Both tiers are our own code over open-source codecs/FFmpeg. No commercial renderer in the critical path, no standing license (unless you later choose Remotion at 4+ devs — an explicit opt-in).
3. **It's the long-term-ownership pick without the ops tax of (C).** Containers give you the same FFmpeg ownership as a Hetzner box but with burst-to-zero billing, no always-on €42.99/mo floor, no peak-sizing, no on-call. (C) only wins if you *want* a box you fully operate.
4. **UX-best per surface:** short Stories/Reels render instantly on-device (no upload-wait, no queue); the long SDE renders server-side where a 180s encode belongs (no phone stall, no overheating), then notifies the couple.

**Phasing (maps to the stories_sde P0–P4 plan):**

| Phase | Ship | Host | Why now |
|---|---|---|---|
| **Now** | **Guest Stories (free, 30s)** + Personal Reels (1–30s) | **(A) client-side** — already built | ₱0, no host decision needed, this is the **viral loop** — ship it first |
| **Next** | **SDE (₱7,999, ~3-min)** | **(B) Cloudflare Containers + FFmpeg** — *or* (E) Creatomate as a 1-week bridge if you want it live sooner | Long render belongs server-side; B keeps moat + ownership |
| **Then** | **AI Highlights** (60s / 3-min) | **(B)** render + Anthropic/LLM for shot-selection, behind the §5 spend cap | Reuses the SDE host; only adds the metered-AI line |
| **Later** | Thank-You 5-min · Living-Memories/Alaala manifesto film | **(B)** (chunk 5-min into segments); manifesto film may use external gen tools (Higgsfield/Kling) per its own shot list | Polish tier; not blocking |

**Owner call to make:** *Do you want SDE live this week via the Creatomate bridge (E), accepting temporary vendor lock-in, or wait ~the extra build time to ship it natively on Containers (B)?* Both end at the same place (B is the destination either way).

---

## 4. Owned-music library (Sub-decision B)

**The problem:** the rendered film needs a backing track, and the rule is **Setnayan-owned music only — no major-label, no per-render license fee** (server-side rendering with licensed music makes Setnayan the direct infringer). The catalogue the specs describe (~400 owned AI tracks across 6 feel-categories) **does not exist yet** — there is no `music_catalogue/` or `catalogue_manifest.json` in the repo. The generation method is already written up in `02_Specifications/14_Music_Catalogue_Cowork_Playbook.md` (now marked HISTORICAL but the *method* is sound).

### Interim (ship without the library) — **already in the build plan, use it**
**Run every render on the couple's own Pakanta song** (`events.pakanta_song_r2_key` → `musicUrl`, the existing music seam in the renderer). Pakanta songs are Suno-generated and Setnayan-owned, so they're clean to render with. This **unblocks Stories + SDE today** with zero catalogue. Couples without Pakanta get a small **starter set** (below) or a silent render (the renderer already falls back to silent safely).

### Options to generate + own the catalogue

| Option | What | Cost | Ownership / licensing caution | Effort |
|---|---|---|---|---|
| **Suno Premier** (the playbook's pick) | ~1 month sub, batch-generate via Chrome+Cowork, download MP3s, cancel | **~$30 (~₱1,725)** one-time for the run + Cowork time | ✅ Premier grants **commercial ownership** of generations. ⚠ **Never name an artist/song in a prompt** (describe the *sound*); soundalikes legal, copies not. Keep prompts `instrumental`. ⚠ Re-confirm Suno's 2026 commercial-rights terms before the run — TOS shift. | M (one Cowork session) |
| **Udio / other AI** | Same idea, different engine | similar | Same ownership-terms diligence required | M |
| **Commission a composer** | Human-made royalty-free tracks | ₱ thousands+ per track | ✅ Cleanest ownership; ✗ doesn't scale to 400 | L / $$ |
| **Royalty-free libraries (Artlist/Epidemic)** | License a catalogue | recurring ₱100k–200k/yr | ✗ **Rejected by design** — recurring license, not owned, the exact cost the strategy avoids | — |

### Minimal viable starter vs eventual ~400
- **Eventual target:** ~400 keepers (the playbook's 600-generate → 60–80% keep-rate math) across the 6 feel-categories.
- **MVP starter to launch SDE/Stories:** **~30–60 tracks** — roughly **5–10 per feel-category** — is plenty to make reels feel varied at launch (a couple sees only a handful per render). Generate the MVP starter in one short Cowork block; grow to 400 opportunistically.
- **Recommended sequence:** **(1)** ship on **Pakanta-song interim now** → **(2)** generate a **~40-track Suno starter** in one Cowork session → **(3)** wire `beat_grid` analysis (the stories_sde P0 job: detect beats **once per track**, store as metadata — never per-render, that's the ₱0 lock) → **(4)** grow toward 400 as a background content task.

> **Owner sign-off flag:** confirm you're OK committing to **Suno Premier as the owned-music engine** and that we re-verify its 2026 commercial-ownership terms at run time. This is load-bearing (it's what makes server-side rendering legally safe).

---

## 5. AI-Highlights spend cap (Sub-decision C)

AI Highlights uses an LLM (Anthropic) to **select/order the best moments** before the film is rendered (the render itself is FFmpeg/client, ₱0). The metered cost is the LLM call + optional vision. This is the **only metered-AI line** in the catalogue, so it needs a hard cap *before* the key is wired.

### Proposed caps

| Cap | Value | Rationale |
|---|---|---|
| **Per-render hard cap** | **₱20 / render** (~$0.35) | A shot-selection pass over an event's clip/photo metadata is a few LLM calls; ₱20 is generous headroom. If a render's projected token cost exceeds the cap, **fall back to the deterministic best-first ranking** the SDE already uses (no LLM) — the render still ships, just without the AI curation premium. |
| **Per-event cap** | **₱60 / event** | Caps re-rolls (≤3 AI passes per event before forcing deterministic). |
| **Monthly platform cap** | **₱5,000 / month** | Hard ceiling; at ₱20/render that's ~250 AI renders/mo — well above projected V1 volume. On breach, **AI Highlights degrades to deterministic ranking platform-wide** and alerts admin; no surprise bill. |

### How to enforce (no new infra)
1. **Pre-flight estimate:** before each AI call, estimate tokens (use the Anthropic token-count endpoint) → if projected ₱ > per-render cap, **skip the LLM, use deterministic rank.**
2. **Ledger row per call:** write actual cost to a `service_render_costs` / `ai_spend_log` row (the telemetry table noted as *never built* in the stories_sde plan — **this is the moment to ship the logger**). Sum-by-month enforces the monthly cap with a cheap query.
3. **Admin kill-switch + alert:** surface the running monthly total in the admin console (0023) with a one-click "force deterministic" toggle, mirroring the existing two-admin gate pattern for spend.
4. **Default safe:** if the key is missing/over-cap/errors, **always** fall back to the deterministic best-first selection — AI is a *premium enhancement*, never a hard dependency for the render to complete.

> **Owner inputs needed:** confirm the three numbers (₱20 / ₱60 / ₱5,000) or set your own; confirm AI Highlights stays a *premium enhancement over a deterministic baseline* (recommended) rather than AI-or-nothing.

---

## 6. "What I'd do first" — execution list (IF you pick the recommended path)

Mapped to the stories_sde **P0–P4** plan (the build is ~70% pre-built — reuses `patiktok-render.ts`, the SDE commercial spine, the `eventSkuActive`/`InlineCheckoutDrawer` gates, the `saveSdeFilm` publish loop):

1. **[P0 · no host needed] Beat-grid job + interim music.** Ship the one-time `scripts/` beat-analysis job → store `beat_grid` JSONB on `patiktok_music_tracks` (beats detected **once per track**, never per render). Wire the **Pakanta-song interim** as the default `musicUrl`. *(Owner-parallel: generate the ~40-track Suno starter in one Cowork session.)*
2. **[P1 · client-side / Option A] Engine tweaks in `patiktok-render.ts`.** Add the photo `drawImage` branch + beat-schedule cut logic (replacing the even-split at L193–197) + the WebCodecs `AudioEncoder` so music renders as **clean MP4** (not the MediaRecorder/webm fallback). Honour the **5s-clip cap** in the beat rule (low BPM → pull-next/shorten/freeze, never stretch past 5s).
3. **[P2 · client-side / Option A] Ship Guest Stories FREE — the viral loop, FIRST.** Auto-select + rank + min-photo floor over `getGuestLiveGallery()`, one-auto-template-by-tempo, one-tap `navigator.share`. **This is the highest-leverage ship and needs no host decision.**
4. **[pre-P3 · the host decision] Stand up Option B.** Provision **Cloudflare Containers + an FFmpeg image**, a render queue, and an R2 write-back. Spike the **3-min (180s) render** here first to confirm it's comfortably inside budget (it will be). *(If you chose the Creatomate bridge instead, wire its API + webhook here — same slot.)*
5. **[P3 · server / Option B] Ship SDE (paid ₱7,999).** Clip-compile from `fetchPapicGallery()` clips with the **mandatory dual-consent filter** (RA 10173 — mirror `lib/alaala-orb.ts`), best-first rank → 3-min beat manifest → render on B → `saveSdeFilm` → public page + /recap auto-revalidate. Set the SDE price in the **admin catalog** (never hardcode).
6. **[P3.5] AI Highlights behind the §5 cap.** Add the Anthropic key, the pre-flight token estimate, the `ai_spend_log` ledger + monthly-sum enforcement, the admin kill-switch, and the deterministic fallback. Reuse the B render host.
7. **[P4 · polish] Thank-You 5-min (chunked on B) + ingest the growing owned-music masters** as the catalogue fills toward ~400.

**Net:** Steps 1–3 ship the **free viral loop on ₱0 client-side** with no host decision at all. The host decision (step 4) only gates the **paid** SDE/long/AI lane — so you can green-light Stories immediately and take your time on B vs the Creatomate bridge.

---

## Sources (2026 pricing, fetched 2026-06-28)

- Mux Video pricing — https://www.mux.com/docs/pricing/video · https://www.mux.com/pricing
- Creatomate pricing — https://creatomate.com/pricing · comparison https://json2video.com/how-to/creatomate-alternative/
- Shotstack pricing — https://shotstack.io/pricing/
- Cloudflare Containers pricing + GA — https://developers.cloudflare.com/containers/pricing/ · https://developers.cloudflare.com/changelog/post/2026-04-13-containers-sandbox-ga/ · CPU repricing https://developers.cloudflare.com/changelog/2025-11-21-new-cpu-pricing/
- Cloudflare Workers pricing — https://developers.cloudflare.com/workers/platform/pricing/
- Hetzner CCX pricing + June-2026 hike — https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/ · https://wz-it.com/en/blog/hetzner-price-increase-june-2026-cpx-ccx-alternatives/
- Remotion Lambda cost — https://www.remotion.dev/docs/lambda/cost-example
- Remotion company license — https://www.remotion.pro/license · https://www.remotion.dev/docs/license

**Internal sources:** `apps/web/lib/patiktok-render.ts` (shipped client render path) · `02_Specifications/14_Music_Catalogue_Cowork_Playbook.md` · memory: `project_setnayan_no_video_render_pipeline`, `project_setnayan_stories_sde_buildplan`, `project_setnayan_marginal_cost_model`, `project_setnayan_alaala_next_steps`, `feedback_setnayan_oss_self_host_preference` · `03_Strategy/Alaala_Pillar_2026-06-15.md`.
