# Setnayan Disaster Recovery Playbook

**Locked 2026-05-12. V1 posture: Vercel stateless + offline-first PWA only.**

## V1 disaster recovery posture (locked)

Setnayan V1 ships with a deliberately lightweight DR setup. Skip Supabase Pro PITR upgrade + R2 cross-region replication for V1 — they're worth ₱3K-5K/month and we don't have enough scale to justify yet. Revisit at V1.5 when wedding-day traffic exceeds 5 simultaneous events.

**What we rely on:**

| Layer | Mechanism | Why it's sufficient for V1 |
|---|---|---|
| Vercel | Stateless — all deploys are immutable snapshots; Vercel auto-failover handles regional outages | Zero state → zero backup needed → Vercel's Pro plan handles availability |
| Supabase | Free-tier daily backups (7-day retention) | V1 launches with <100 events; data loss window of <24hr is acceptable while we're small |
| Cloudflare R2 | Single-region (PH-primary) | R2 has 99.99% SLA + 11×9 durability; single-region is sufficient until we have >10K customers |
| Wedding-day landing pages | **Offline-first PWA shell** (this is the key V1 reliability investment) | Guests at venues with weak signal still see schedule + table assignment + their personal QR even fully offline |

## Offline-first PWA shell (the V1 reliability bet)

Setnayan's most critical user experience is **the wedding day itself**. If our service is down or the venue has no signal, the personal invitation page + day-of guest experience MUST still work. The PWA shell handles this.

**Service Worker cache strategy:**

- **Precache on RSVP confirmation** (or first landing-page visit): HTML shell + CSS + Lucide icon SVGs + couple's monogram + theme bundle + the published schedule + venue map PDF + dress code copy + reserved table assignment for this guest
- **Stale-while-revalidate** for guest list, table assignment, schedule changes — show cached version immediately, update in background
- **Network-first with cached fallback** for live signals: photo wall + broadcasts + video guestbook submissions
- **Background sync** for outbound writes: queued video guestbook submissions upload when connectivity returns

**Cache budget:** ~5 MB per guest (HTML 200KB + CSS 80KB + monogram 50KB + schedule JSON 5KB + venue PDF 3MB + dress-code 5KB + buffer for theme assets).

**Cache versioning:** SW invalidates cache on `events.updated_at` changes; only the changed sections re-download.

## Runbooks (per failure mode)

### Supabase outage
1. Detect: Supabase status page red OR our health-check 5xx rate > 50% for 5 minutes
2. Trigger: page Ops Lead on-call
3. Customer-facing copy: status banner on dashboards — "We're experiencing issues with our database. Wedding-day guests viewing their invitation pages are unaffected. We'll update every 15 minutes."
4. Mitigation: Vercel serves cached responses for unauthenticated routes; authenticated routes return a maintenance page
5. Recovery: Supabase restores → automatic; we don't need to do anything
6. Postmortem: write incident report within 7 days

### R2 outage
1. Detect: 5xx from R2 endpoint
2. Customer-facing impact: media uploads fail; existing media still served by Cloudflare's CDN cache (R2 reads are CDN-fronted)
3. Mitigation: queue uploads client-side, retry when R2 returns
4. Recovery: automatic when R2 returns

### Vercel outage
1. Detect: deployment unreachable
2. Customer-facing copy: page unavailable
3. Mitigation: none in V1 (Vercel's own redundancy handles regional failures; multi-cloud is V2+ scope)
4. Recovery: automatic when Vercel returns

### Wedding-day total internet outage at venue
1. Detect: guest report or schedule absence of pings
2. Customer-facing impact: photo wall + broadcasts + video guestbook degrade; static schedule + table + QR + venue map still work via PWA cache
3. Mitigation: offline-first PWA is the entire mitigation; no actionable response from Setnayan side
4. Recovery: when venue signal returns, queued submissions upload automatically

## Recovery time objectives (V1 targets)

| Failure | RTO target | RPO target |
|---|---|---|
| Supabase outage | 4 hours | 24 hours (free-tier daily backup) |
| R2 outage | 1 hour | 0 (R2 is durable) |
| Vercel outage | 30 minutes | 0 (stateless) |
| Venue offline | N/A (PWA handles it) | 0 (PWA cache) |

## Backups + retention

- Supabase: free-tier daily backups, 7-day rolling window (V1)
- R2: 5-year retention per wedding-photo retention rule; cold tier after 90 days
- Audit logs: indefinite retention (legal requirement for the 5-year vendor data window)
- User-deleted data: 30-day soft-delete window, hard-delete after 30 days (per 0025 deletion flow)

## V1.5 upgrade plan

When usage exceeds the V1 envelope (>10 simultaneous weddings, >5K customers, >1K active vendors):
- Upgrade Supabase Free → Pro (₱1,500/mo) for 30-day PITR + read replicas
- Enable R2 cross-region replication (PH primary + SG secondary, ~₱500/mo at our scale)
- Add a multi-region Cloudflare DNS failover for setnayan.com (₱200/mo)
- Total upgrade cost: ~₱2,200/mo, justified when monthly platform revenue exceeds ₱200K

## On-call rotation

- Ops Lead is primary on-call 24/7 in V1
- Secondary admin (typically Verification Handler) backs up on weekends
- PagerDuty / OpsGenie integration deferred to V1.5
- For V1: SMS alerts via Globe Labs API directly to Ops Lead's phone for any 5xx rate >50% sustained 5min
