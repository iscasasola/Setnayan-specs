# Papic Open → **Papic Lite** — Council Verdict + Red-Team (2026-07-17)

> **⚠ FINAL SHAPE (owner-locked 2026-07-17): the SKU is "Papic Lite," PHOTOS-ONLY, no gate.** This doc keeps the "Open" filename for continuity, but the owner reshaped it: **renamed Open → Lite · dropped VIDEO (photos only) · dropped the size/type gate (feature-loss is the sole firewall) · volume-discount PHOTO ladder.** Canonical current state: **`Pricing.md` § 2.1a.** Sections below are the council/red-team record; where they say "Open / 300+ gate / video / capture-points," read the § 2.1a Lite version.
>
> **Status:** 5-lens council → judge → red-team (7 agents). The red-team's holes (`verdict_solid: false`) were resolved by the owner's reshaping (no gate = feature-loss firewall · photos-only · photo-pool pricing). **OWNER-LOCKED 2026-07-17; canonical in `Pricing.md` § 2.1a. NOT YET BUILT (`apps/web`).** Canonical Papic model: [`Papic_Good_Better_Best_Pricing_2026-07-17.md`](Papic_Good_Better_Best_Pricing_2026-07-17.md).
>
> **Papic Lite** = open **photos-only** pool, unlimited guests, no gate. No guest list, no face tag/block/Kwento/reels — just accumulated High-Efficiency photos, pooled to the host. **Photo ladder: 200 = ₱100 · 1,250 = ₱500 · 3,000 = ₱1,000 · 25,000 = ₱5,000 · 100,000 = ₱15,000** (+₱7,500/50k top-up · Enterprise above). Storage: R2 hot → R2-IA/B2 cold.

## Council verdict (judge synthesis)

- **Q1 — separate flat "Papic Open" SKU** (unanimous). Ltd/Unli are per-camera against a bounded seat list; Open has anonymous walk-ups and no seat accounting → "Unli-per-shooter × unbounded crowd = unbounded forever-storage." Open is one host purchase, **denominated in storage, not cameras.**
- **Q2 — bill on STORAGE, moderate on the QR token.** Storage ceiling is the only real cost bound (cost = bytes-on-R2, not headcount; reuses the shipped `papic-storage-telemetry.ts` byte counter). The per-participant QR token is kept as the **moderation/accountability + RA 10173 consent unit**, NOT a billing/"event full" gate. Host sees "**event size / ~N photos**," never raw GB.
- **Q3 — default photos + 5s clips, with a host "photos-only" toggle** for a cheaper price (video is the dominant storage multiplier). Hidden default quality = High-Efficiency ~2560px.
- **Q4 — flat per-event-day SKU, storage-sized rungs:** Gathering ₱1,999 (~50 GB) / Public ₱3,999 (~100 GB) / Festival ₱7,999 (~250 GB) per day · photos-only ~25% off · +₱999/50 GB top-up · >250 GB = Enterprise custom (two-admin gate). Margin ~98% (compressed on R2, full-res offloads to host Drive).

## Red-team — the verdict is NOT solid (critical holes)

1. **Top-up arbitrage collapses the ladder.** Base ≈ ₱40/GB but top-up ₱999/50 GB = ₱20/GB (half). So everyone buys Gathering + tops up: 100 GB = ₱2,998 (vs Public ₱3,999); 250 GB = ₱5,995 (vs Festival ₱7,999). **No one buys Public/Festival.**
2. **Wedding-firewall hole — cannibalization.** "celebration"/"reunion" are fuzzy self-declared types; a budget couple picks Open Festival ₱7,999 → **uncapped unlimited crowd capture for ~half the ₱15k wedding Unli**, minus only features they don't want. Open is cheaper *and* less limited than the hero product.
3. **"Kept forever" violates the 5-yr retention policy** ([data-retention](../../.claude/projects/-Users-icecasasola-Documents-Claude-Projects-Setnayan/memory/project_setnayan_data_retention.md)) + unbounded liability: a one-off ₱3,999 event whose 100 GB pool is kept forever (~₱1,020/yr) costs more than its fee after ~4 yrs, across thousands of relationship-less one-offs.
4. **Bystander/subject consent unaddressed** — only the shooter consents. Biometric-free makes RA 10173 "erase photos of me" *harder* (no face search). Public-space justification is strong for concert/festival, **weak for reunion/corporate/celebration** (rented halls; minors at tournaments).
5. **Byte cap bounds storage, not compute** — transcode + NSFW + CSAM scan scale with *submission* volume; a retry-storm at a full cap fans out inference cost.
6. **Tiers undersized/mislabeled** — 100 GB "~100k photos" is ~40k *with clips*; a 10k-person concert fills it in hour 1 → visible mid-event failure / bait-and-switch feel.
7. **Same-day payment latency** — apply-then-pay 24-hr SLA vs same-day tournament/pop-up decisions. Near launch-blocker for the core use-case.
8. **Sybil/grief drain** — device-binding resets on reinstall; per-IP limits false-block a venue sharing one NAT.
9. Mixed units (never-show-GB vs "+₱999/50 GB" top-up + "70%/90%" meter). 10. Multi-day cap on a cumulative pool is incoherent. 11. Anonymous tokens = lose your photos on reinstall (breaks "each keeps their own"). 12. Free preview = anonymous unpaid upload endpoint (abuse surface).

## Merged recommendation (council + red-team fixes)

- **Flat storage rate everywhere (fixes #1):** **₱1,999/day includes 50 GB; ALL more storage = ₱999/50 GB**, whether pre-bought as a "size" or added mid-event. → Gathering ₱1,999 / Public ₱2,998 / Festival ₱5,995 / Enterprise custom. Pre-buy = top-up, so no arbitrage. (Alt: keep rungs but raise top-up to the base rate.)
- **Wedding firewall (fixes #2):** drop celebration/reunion from self-serve Open **or** gate them behind attestation + admin review; refuse Open if the event has a guest list / RSVP / wedding-honoree signal; keep uncapped mega behind the Custom two-admin gate.
- **Retention (fixes #3):** **align to the 5-yr media default (or shorter for one-offs)** + paid Keep-Full-Res extension; auto-demote R2-IA; never promise "forever."
- **Bystander consent (fixes #4):** split **truly-public** (concert/festival) vs **closed-audience** (reunion/corporate/tournament — host attests a posted capture notice); a **public takedown form** (host+admin) as the RA 10173 objection path; minors-present warning at setup.
- **Bound compute (fixes #5):** rate-limit accepts/sec per token + per event; return "pool full" fast *before* transcode; cap concurrent transcode.
- **Right-size (fixes #6):** collect **expected attendance** at setup as a *sizing hint only* (never billed, never a join cap); show capacity as a **range per media mode**; soft-stop + one-tap top-up (optional auto-top-up-with-consent).
- **Same-day activation (fixes #7):** ship the free "capture-now" preview (gated behind NSFW+CSAM+moderation) + prioritize an instant-pay rail (GCash Merchant / PayMongo) for Open.
- **Join identity (fixes #8, #11):** lightweight **email / magic-link claim** to join → durable personal access + Sybil cost + a real consent record; per-claim + device limits (not naive per-IP).
- **One human unit end-to-end (#9)** · **multi-day = one cumulative pool, day-fee = per-day access fee (#10)** · **gate the free preview behind the full trust stack + ephemeral auto-purge (#12).**

## Owner decisions — RESOLVED 2026-07-17

The owner reshaped the model during navigation and confirmed the dials:

1. **Bound = CAPTURE POINTS, not GB** — the pool is sized in capture points (1 photo = 1 pt · 1×5s video = 3 pts, unified with the wedding tiers). **Ends at points-exhausted OR day-end**, soft-stop + one-tap top-up. Fixes both the arbitrage (one flat rate) and the never-show-GB problem (hosts see a capture count, the unit they think in).
2. **Pricing (confirmed 2026-07-17) — a capture-point pool with a volume discount:** **3,000 pts = ₱1,000** (₱0.33/pt) · **25,000 pts = ₱5,000** (₱0.20) · **100,000 pts = ₱15,000** (₱0.15). Top-up **+₱7,500/+50,000 pts** (₱0.15/pt); >100k or mega = **Enterprise Open** custom (two-admin gate). Photos-only = host toggle at the SAME price (no −25% — the points weighting already rewards it). The earlier per-pax and flat-₱1,999/50k ideas are both superseded.
3. **Wedding firewall — RESHAPED 2026-07-17: SIZE/TYPE GATE DROPPED. Feature-loss is now the SOLE firewall.** Open is a point-pool add-on available to **any event** (positioned for large/crowd events), but it ships **none** of the premium features (no face-sort / blocking / reels / Kwento / personal galleries / guest list; High-Efficiency only), which makes it unsuitable as a wedding product. **⚠ Owner accepted the residual cannibalization risk the red-team flagged** — judged low-value/low-likelihood since a featureless, guest-list-less, screen-grade pool isn't what a couple buys. **Single shared pool:** anyone who scans contributes, each keeps their own contributions, host collects all.
4. **Quality: HIGH-EFFICIENCY ONLY (~2560px)** — screen/social/crowd grade, **NOT high-res** (owner-confirmed 2026-07-17). This is what makes crowd-scale affordable: 100k full-res ≈ 800 GB (~₱27,840/5yr, a loss) vs 100k High-Eff ≈ 40 GB (~₱1,500/5yr, ~90% margin). Kept 5-yr. No full-res kept by us; optional host-Drive full-res sync at the host's own cost. (The 6-month high-res window + Full/Optimal quality tiers belong to the WEDDING Papic model, not Open.)
5. **Concurrency cap (confirmed):** for smaller events the host sets a **max concurrent shooters** number — the QR accepts up to N at once (beyond = waitlist); **OFF (unlimited)** for open 300+ events. Free crowd-control lever, separate from the paid points pool.
6. **Activation (confirmed):** free capture-now preview (trust-stack-gated) + push the instant-pay rail (GCash Merchant / PayMongo).

**Build-time recommendations still flagged (lower-stakes, applying as recommended):** retention **5-yr default, not "forever"** (aligns the data-retention policy); **join = lightweight email/magic-link claim** (durable ownership + Sybil cost + consent record); the silent per-token fair-use sub-cap size (admin-dialable, telemetry-locked after ~20 real Open events).

## Reuse map (grounding — mostly a mode flag)

Reuses: capture → upload → born-AVIF compressed → download/Drive · the shipped **byte-accounting** (`papic-storage-telemetry.ts` #3063) as the metered ceiling · event-scoped session **tokens** (paparazzi-seat primitive) · capture-window time-fence · NSFW filter. **Disables:** face enrollment/tagging/blocking, personal reels, Kwento, guest list. **New build:** flat storage-metered billing, host moderation/takedown tool, join consent gate + email claim, expected-attendance sizing hint, compute rate-limits, Enterprise-Open quote path.
