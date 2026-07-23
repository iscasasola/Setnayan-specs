# Samahan (Communities) — MINIMAL Build Plan · 2026-07-15

> **Executable build plan for Opus.** Turns the home's "Samahan · Communities — Coming soon"
> note (`app/dashboard/(launcher)/page.tsx:777-785` in `setnayan-wt-home-polish`) into a real
> door. Grounded in the shipped composable-event foundation (migration
> `20270807254184_composable_event_foundation.sql`, LIVE in prod) and the owner-locked model in
> `Composable_Event_Build_Map_2026-07-15.md` §6. Everything below cites the real file it copies.
>
> **Repo:** worktree off `/Users/icecasasola` git root · app at `apps/web` · migrations at
> `supabase/migrations` via `pnpm migration:new` (idempotent) · changelog.d fragment per PR ·
> auto-merge (`gh pr merge <#> --auto --merge`).

---

## 1 · SCOPE CUT

### Ships in the minimal cut

| # | Piece | Why it's in |
|---|---|---|
| 1 | `communities` + `community_members` + `community_invite_tokens` tables, `events.community_id` FK + class CHECK, 2 new RLS helper functions, full RLS | Owner-locked model; schema-first house rule. |
| 2 | `lib/communities.ts` + server actions (create · join · leave · promote/demote · remove · rotate invite · archive) | The working verbs behind every surface. |
| 3 | Routes: `/dashboard/samahan` (index) · `/dashboard/samahan/new` (create) · `/dashboard/samahan/[communityId]` (space page: Overview · Members · Events tabs) · `/samahan/join/[token]` (public accept) | The minimal real product. |
| 4 | Organizer **invite-by-link** (one rotating standing link per community, mirroring `event_join_tokens` one-row-per-event + the `/host/accept/[token]` accept choreography) | A community you can't invite anyone into is a fake door. |
| 5 | **Community event creation** — create-event gains a `?samahan=<id>` context: organizer-gated, type picker filtered to `eventClass === 'community_eligible'`, stamps `events.community_id` | Without it, the Events tab is permanently empty — no other code path sets `community_id`. An empty-forever tab violates the honesty rule harder than shipping this thin slice. See §7. |
| 6 | Home Spaces-tile wiring: real Samahan rows + "+ Create a Samahan" + HomeCommandBar entries; coming-soon note deleted | The whole point. Last PR; everything before it is behavior-neutral. |

### Deferred (each with the reason and the later landing path)

| Deferred | Why | Lands later as |
|---|---|---|
| **Nesting (`parent_community_id`)** — **DECISION: no column now** | (a) Additive later — `ADD COLUMN IF NOT EXISTS parent_community_id UUID REFERENCES communities(community_id)` needs zero backfill; (b) membership-cascade semantics (does joining a child join the parent? does a parent organizer govern children?) are UNDECIDED — a dormant column bakes in nothing and invites accidental writes; (c) house honesty rule: no dormant half-features. | One-line migration + RLS addendum when the semantics are owner-locked. |
| Conversation area (Usapan/chat) | Owner-locked to **reuse 0019 chat**, which needs thread-participant plumbing per community — a full PR series of its own. | Honest muted "coming soon" line on the Overview tab (house pattern, e.g. the People page preview). |
| Invite-as-group into guest lists (`guest_groups.source_community_id`) | Fan-out design (snapshot vs live membership, plus-ones, cap interactions) unresolved; `guest_groups` exists (`20260604170000_iteration_0001_guest_groups.sql`) and the column is additive. | Its own migration + guests-surface PR. |
| Memories tab | Corpus route tree lists overview/members/events/memories/chat; memories needs R2 + gallery reuse. Minimal = 3 tabs. | Post-minimal PR reusing the Alaala gallery primitives. |
| Community logo/avatar upload | R2 wiring + moderation cost for zero minimal value. | Initial-letter chip now (derived like `EventMonogram`); upload later. |
| Public slug / discovery / visibility column | All communities are **private, invite-link-only** in V1 — no public surface, so no slug, no `visibility` column (YAGNI; additive later). Route uses `community_id` UUID exactly like `/dashboard/[eventId]`. | Column + directory if/when discovery is a product decision. |
| Hard delete | Soft `archived` flag only (mirrors `events.archived`). Hard delete rides the existing account-deletion machinery review. | Admin-side lifecycle later. |
| Feature flag | **None needed.** PRs 1–3 ship dark (schema + unlinked routes); PR-4 *is* the flag flip — the link itself. Matches how `/dashboard/samahan` stays unreachable until the tile links it. | — |

---

## 2 · SCHEMA — one migration, PR-1

Create via `pnpm migration:new samahan_communities_foundation`. Idempotent style copied from
`20270801985629_dependents_guardian_held_people.sql` (CREATE TABLE IF NOT EXISTS + ENABLE RLS +
DROP/CREATE POLICY, `BEGIN;…COMMIT;`) and the `pg_constraint` guard from
`20270807254184_composable_event_foundation.sql:90-101`.

**public_id letter:** `'C'` → `S89C-…`. Letters are legitimately reused across tables in this
repo (`'G'` serves guests, guest_groups, godparents). ⚠ `generate_public_id` takes `CHAR(1)`
(`20260512000000_setnayan_base.sql:120`) — a two-letter code like the `'SO'` in
`20260519210000` silently truncates; use a single letter, deliberately.

```sql
-- samahan_communities_foundation
-- Samahan (communities) minimal foundation. Owner-locked model 2026-07-15
-- (Composable_Event_Build_Map_2026-07-15.md §6): communities +
-- community_members(role organizer|member) + events.community_id, class-gated
-- by the events_wedding_fields_consistency CHECK precedent. Private,
-- invite-link-only in V1 — no discovery, no nesting (parent_community_id is a
-- deliberate later migration once cascade semantics are owner-locked).
-- ₱0 rule: rows only — no compute, no R2 in the minimal cut.

BEGIN;

-- 1 · communities -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.communities (
  id            BIGSERIAL PRIMARY KEY,
  community_id  UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  public_id     TEXT NOT NULL UNIQUE DEFAULT public.generate_public_id('C'),
  name          TEXT NOT NULL CHECK (char_length(btrim(name)) BETWEEN 2 AND 80),
  kind          TEXT NOT NULL DEFAULT 'barkada'
                  CHECK (kind IN ('barkada', 'parish', 'clan', 'org', 'other')),
  description   TEXT CHECK (description IS NULL OR char_length(description) <= 280),
  -- Creator survives account deletion: community is a shared asset, not a
  -- per-user record (contrast dependents' owner-CASCADE).
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  archived      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS communities_created_by_idx ON public.communities(created_by);

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- 2 · community_members --------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.community_members (
  id            BIGSERIAL PRIMARY KEY,
  community_id  UUID NOT NULL REFERENCES public.communities(community_id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('organizer', 'member')),
  joined_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (community_id, user_id)
);

CREATE INDEX IF NOT EXISTS community_members_community_idx ON public.community_members(community_id);
CREATE INDEX IF NOT EXISTS community_members_user_idx      ON public.community_members(user_id);

ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- 3 · community_invite_tokens ---------------------------------------------------
-- One standing rotating link per community — mirrors event_join_tokens
-- (20260512000000 §6: UNIQUE event_id, service-role redemption). No expiry by
-- default (NULL); organizers rotate to kill a leaked link.

CREATE TABLE IF NOT EXISTS public.community_invite_tokens (
  id            BIGSERIAL PRIMARY KEY,
  community_id  UUID NOT NULL UNIQUE REFERENCES public.communities(community_id) ON DELETE CASCADE,
  token         TEXT NOT NULL UNIQUE,
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at    TIMESTAMPTZ,
  revoked_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS community_invite_tokens_token_idx ON public.community_invite_tokens(token);

ALTER TABLE public.community_invite_tokens ENABLE ROW LEVEL SECURITY;

-- 4 · Helper functions — mirror current_event_ids() exactly
--     (20260512000000 §7: SECURITY DEFINER STABLE, SET search_path = public).
--     SECURITY DEFINER is what breaks the community_members-policy-reads-
--     community_members recursion.

CREATE OR REPLACE FUNCTION public.current_community_ids()
RETURNS SETOF UUID
LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public
AS $$
  SELECT community_id FROM public.community_members WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.current_organizer_community_ids()
RETURNS SETOF UUID
LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public
AS $$
  SELECT community_id FROM public.community_members
  WHERE user_id = auth.uid() AND role = 'organizer';
$$;

GRANT EXECUTE ON FUNCTION public.current_community_ids() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_organizer_community_ids() TO authenticated;

-- 5 · RLS — Pattern B analog (membership-scoped read; organizer write; admin override)

-- communities: members read their own communities. No roster scraping vector —
-- a non-member can't even see the community row.
DROP POLICY IF EXISTS community_member_can_read ON public.communities;
CREATE POLICY community_member_can_read ON public.communities
  FOR SELECT TO authenticated
  USING (community_id IN (SELECT public.current_community_ids()) OR public.is_admin());

-- Creation: any authenticated user, stamped as themselves (tighter than the
-- events authenticated_can_create_event WITH CHECK (TRUE) — we know created_by).
-- The server action inserts the organizer membership in the same action
-- (create-event precedent: app layer adds the first member row).
DROP POLICY IF EXISTS authenticated_can_create_community ON public.communities;
CREATE POLICY authenticated_can_create_community ON public.communities
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS organizer_can_update_community ON public.communities;
CREATE POLICY organizer_can_update_community ON public.communities
  FOR UPDATE TO authenticated
  USING (community_id IN (SELECT public.current_organizer_community_ids()) OR public.is_admin())
  WITH CHECK (community_id IN (SELECT public.current_organizer_community_ids()) OR public.is_admin());
-- No DELETE policy: soft archive only; hard delete is service-role/admin-mediated.

-- community_members: the roster is visible ONLY to members of that same
-- community (RA 10173 guardrail — consent to be listed is granted BY joining,
-- and only fellow members can see the list).
DROP POLICY IF EXISTS community_roster_member_read ON public.community_members;
CREATE POLICY community_roster_member_read ON public.community_members
  FOR SELECT TO authenticated
  USING (community_id IN (SELECT public.current_community_ids()) OR public.is_admin());

-- Joins are token-redeemed via the service-role client (event_join_tokens
-- precedent: "redemption happens via a service-role … not direct RLS write").
-- No INSERT policy for regular users on purpose.
DROP POLICY IF EXISTS community_member_admin_insert ON public.community_members;
CREATE POLICY community_member_admin_insert ON public.community_members
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- Role changes (promote/demote): organizers of that community, or admin.
DROP POLICY IF EXISTS community_member_role_update ON public.community_members;
CREATE POLICY community_member_role_update ON public.community_members
  FOR UPDATE TO authenticated
  USING (community_id IN (SELECT public.current_organizer_community_ids()) OR public.is_admin())
  WITH CHECK (community_id IN (SELECT public.current_organizer_community_ids()) OR public.is_admin());

-- Leave (self) or remove (organizer/admin). Last-organizer guard is app-side
-- (server action re-checks organizer count in the same request).
DROP POLICY IF EXISTS community_member_leave_or_remove ON public.community_members;
CREATE POLICY community_member_leave_or_remove ON public.community_members
  FOR DELETE TO authenticated
  USING (
    user_id = auth.uid()
    OR community_id IN (SELECT public.current_organizer_community_ids())
    OR public.is_admin()
  );

-- community_invite_tokens: organizer-only, full control. Members must NOT see
-- the standing token (a member seeing it could mass-invite; the organizer gate
-- is the product boundary). Public redemption reads go through the admin client.
DROP POLICY IF EXISTS invite_tokens_organizer_all ON public.community_invite_tokens;
CREATE POLICY invite_tokens_organizer_all ON public.community_invite_tokens
  FOR ALL TO authenticated
  USING (community_id IN (SELECT public.current_organizer_community_ids()) OR public.is_admin())
  WITH CHECK (community_id IN (SELECT public.current_organizer_community_ids()) OR public.is_admin());

-- 6 · events.community_id + class CHECK ----------------------------------------

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS community_id UUID
    REFERENCES public.communities(community_id) ON DELETE SET NULL;
-- ON DELETE SET NULL: killing a community must never delete its events — they
-- fall back to their creator's personal ownership (creator keeps their
-- event_members 'couple' row).

CREATE INDEX IF NOT EXISTS events_community_id_idx
  ON public.events(community_id) WHERE community_id IS NOT NULL;

-- Class gate — copies the events_wedding_fields_consistency precedent
-- (20260521080000: hard-coded type list in a CHECK; deny-by-default). The
-- eligible list mirrors the event_class='community_eligible' seed in
-- 20270807254184 EXACTLY. Owner lock: a Samahan can NEVER own a personal
-- milestone (wedding · debut · christening · gender_reveal · birthday ·
-- graduation). Widening this list later = one small migration, same as the
-- profile seed it mirrors. App-side resolveProfile().eventClass is the UX
-- gate; this CHECK is the bypass-proof backstop.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'events_community_class_consistency'
       AND conrelid = 'public.events'::regclass
  ) THEN
    ALTER TABLE public.events
      ADD CONSTRAINT events_community_class_consistency
      CHECK (
        community_id IS NULL
        OR event_type::text IN
          ('simple_event', 'corporate', 'travel', 'celebration',
           'tournament', 'reunion', 'anniversary')
      );
  END IF;
END $$;

-- Community events are visible to the whole community (a member should see
-- the reunion exists even before they're an event guest). Additive SELECT
-- policy alongside event_member_can_read — read-only; event WRITE stays with
-- event membership.
DROP POLICY IF EXISTS community_member_can_read_events ON public.events;
CREATE POLICY community_member_can_read_events ON public.events
  FOR SELECT TO authenticated
  USING (
    community_id IS NOT NULL
    AND community_id IN (SELECT public.current_community_ids())
  );

COMMENT ON TABLE public.communities IS
  'Samahan — a standing group (barkada/parish/clan/org). Private + invite-link-only in V1. Owner-locked 2026-07-15: may own community_eligible event types only, never personal milestones.';
COMMENT ON COLUMN public.events.community_id IS
  'Owning Samahan for community-class events. NULL = personal event (default, unchanged). CHECK events_community_class_consistency mirrors the event_class seed in 20270807254184.';

COMMIT;
```

Push with `supabase db push --db-url "$SUPABASE_DB_URL"` after merge, per CLAUDE.md.

---

## 3 · LIB LAYER — `apps/web/lib/communities.ts` (PR-2)

Copy the `lib/events.ts` idioms exactly: React `cache()` on the shared fetch, graceful-degrade
to `[]`/`null` via `isMissingRelationError` + `logQueryError` (`lib/events.ts:135-181`), typed
rows, admin-client only where RLS is deliberately in the way.

```ts
import { cache } from 'react';
import { randomBytes } from 'node:crypto'; // token gen — mirrors lib/event-moderators.ts:176

export type CommunityKind = 'barkada' | 'parish' | 'clan' | 'org' | 'other';
export type CommunityRole = 'organizer' | 'member';

export type CommunityRow = {
  community_id: string; public_id: string; name: string;
  kind: CommunityKind; description: string | null;
  archived: boolean; created_at: string;
};
export type CommunityWithRole = CommunityRow & { role: CommunityRole; member_count: number };

// Roster entry — display-safe fields ONLY. member_row_id (bigserial id) is the
// action target so organizer forms never carry another user's UUID or email.
export type CommunityRosterEntry = {
  member_row_id: number; display_name: string;
  role: CommunityRole; joined_at: string; is_self: boolean;
};

export type CommunityEventRow = {
  event_id: string; display_name: string; event_type: string;
  event_date: string | null; archived: boolean;
};

// Fetchers (user-scoped client — RLS does the scoping):
export const fetchUserCommunities = cache(
  async (supabase, userId): Promise<CommunityWithRole[]> => {/* community_members
    JOIN communities via .select('role, communities:community_id ( … )')
    .eq('user_id', userId); filter archived; member_count via a second
    grouped count over community_members (RLS lets a member count only their
    own communities); graceful-degrade [] with logQueryError. */},
);
export async function fetchCommunity(supabase, communityId): Promise<CommunityWithRole | null> {}
export async function fetchCommunityEvents(supabase, communityId): Promise<CommunityEventRow[]> {}
  // plain events SELECT .eq('community_id', id) — works under the user JWT
  // thanks to community_member_can_read_events.
export async function fetchViewerEventIds(supabase, userId): Promise<Set<string>> {}
  // event_members rows for the viewer — decides which Events-tab rows LINK.

// Cross-user display names (users RLS is Pattern A owner-only — a member can't
// SELECT another member's users row). Precedent: resolvePrimaryHostEvent's
// "pass the admin client … RLS would otherwise hide the rows" (lib/events.ts:676-681).
// MUST verify the caller's membership with the user-scoped client FIRST, then
// read ONLY (user_id → display_name) via admin. Never select email.
export async function fetchCommunityRoster(supabase, admin, communityId, viewerId):
  Promise<CommunityRosterEntry[]> {}

// Invite (admin client — token table is organizer-RLS'd; redemption is public):
export function generateCommunityInviteToken(): string {
  return randomBytes(32).toString('base64url'); // = generateInvitationToken, lib/event-moderators.ts
}
export async function fetchPendingCommunityInvite(admin, token) {}
  // token → { community_id, name, kind, member_count } | null; checks revoked_at/expires_at.
```

**Server actions** live route-colocated per house style (`create-event/actions.ts`,
`host/accept/[token]/actions.ts`):

- `app/dashboard/(account)/samahan/actions.ts` (`'use server'`):
  - `createCommunity(formData)` — validate → `createAdminClient()` (create-event precedent
    `actions.ts:240-246`: user JWT can be stale at the edge) → insert `communities` (stamp
    `created_by`) → insert `community_members` organizer row → insert `community_invite_tokens`
    row → `redirect('/dashboard/samahan/<id>?created=1')`. Redirect-with-error-param validation
    style copied from `createWeddingEvent` (`?error=missing_name` etc.).
  - `leaveCommunity` — user-scoped DELETE of own row; **last-organizer guard**: if caller is an
    organizer and organizer-count === 1 and member-count > 1 → `?error=last_organizer`
    ("Promote someone first, or archive the samahan.").
  - `promoteMember` / `demoteMember` / `removeMember` — organizer-gated (RLS enforces; action
    re-checks + guards demoting/removing the last organizer). Targets by `member_row_id`.
  - `rotateInviteToken(communityId)` — organizer-gated UPDATE token = fresh, `revoked_at = NULL`.
  - `archiveCommunity(communityId)` — organizer-gated `archived = TRUE`.
- `app/samahan/join/[token]/actions.ts` — `acceptCommunityInvite` (see §6).

Every action `revalidatePath`s the surfaces it changed (accept-host precedent
`actions.ts:109-111`).

---

## 4 · ROUTES + PAGES (PR-2, dark until PR-4)

All dashboard pages sit inside the **`(account)` route group** → they inherit the chrome-less
slim top bar automatically (`app/dashboard/(account)/layout.tsx`: Wordmark → home · bell ·
AccountSwitcher, "CHROME-LESS, launcher-consistent … no persistent side rail"). Each page
carries its own "Back to home" pill + `mx-auto max-w-* px-4 py-10` container (People-page
pattern, `(account)/people/page.tsx:55-62`).

```
apps/web/app/
  dashboard/(account)/samahan/
    actions.ts                      ← server actions (§3)
    page.tsx                        ← INDEX: "Your samahans"
    loading.tsx
    new/page.tsx                    ← CREATE (§5)
    [communityId]/page.tsx          ← SPACE PAGE (tabs via ?tab=)
    [communityId]/loading.tsx
    _components/…                   ← copy-link button (client), roster row, tab bar
  samahan/join/[token]/
    page.tsx · actions.ts · loading.tsx   ← public accept (§6)
```

**Tabs = `?tab=overview|members|events` searchParam on ONE server page** (real `<Link>` hrefs —
back-button friendly, zero client state). Sub-routes are overkill for three tabs on a minimal cut.

### 4a · Index — `/dashboard/samahan`

- Header: "Back to home" pill · `<h1 className="font-serif …">Samahan</h1>` · sub "Shared
  spaces for the groups you belong to — barkada, parish, clan, org."
- List: one glass row per community (`rounded-2xl border border-white/70 bg-white/60 p-5
  shadow-[0_18px_40px_-26px_rgba(30,26,18,0.35)]` — the exact panel recipe from the launcher) —
  initial chip (gold `bg-mulberry/10 text-mulberry` like SpaceRow's icon chip) · name (bold ink)
  · `font-mono text-[10px] uppercase tracking-[0.18em]` kind badge · "Organizer · 12 members" /
  "Member · 12 members" subtitle (counts in Space Mono) · ArrowUpRight.
- Footer row: "+ Create a Samahan" (Plus icon, muted dashed-border row — the "New event" card
  idiom).
- Empty state: honest, warm — "Wala ka pang samahan. One shared space for your barkada, parish,
  or clan — their reunions, tournaments, and outings all in one place." + create button. Lucide
  `Users`/`HeartHandshake` at 1.75px stroke.

### 4b · Space page — `/dashboard/samahan/[communityId]`

Membership gate: `fetchCommunity` returns null (RLS) → `notFound()`.

- **Header band** (glass panel): 56px initial chip with a gold ring (jewelry-not-paint — a 1px
  `#A9834B` ring, not a gold fill) · serif name · kind badge + `S89C-…` public_id in Space Mono
  ink/45 · "N members · M events" mono metaline.
- **Tab bar**: three text tabs, active = ink underline w/ gold accent dot; inactive ink/50.
- **Overview**: description card (or muted "No description yet — organizers can add one." —
  organizers get an inline edit later; minimal = text only, set at create). Stat pair (Members /
  Upcoming events, Space Mono numerals). Muted honest note: "Usapan — group chat is coming
  soon." (no button). **Organizer panel** (organizer-only, obsidian-free glass card): invite
  link `setnayan.com/samahan/join/<token>` with Copy button (client component) + "Rotate link"
  (kills the old link, form-posts `rotateInviteToken`) + "Archive samahan" (confirm via
  `?confirm=archive` param pattern; copy: "Members keep their accounts and events — the samahan
  just goes quiet.").
- **Members**: roster list — initial chip · display_name · `ORGANIZER`/`MEMBER` mono chip
  (organizer chip in gold) · "Joined Jul 2026" ink/45. Organizer-only per-row actions (Promote /
  Demote / Remove, plain text buttons, form posts). Self row: "Leave samahan" (with
  last-organizer guard error banner). **No emails, no photos, no user IDs rendered — ever.**
- **Events**: rows of community events (type badge via the launcher's `eventTypeBadge()` ·
  name · `shortDate`). A row **links to `/dashboard/[eventId]` only when the viewer is an
  event member** (`fetchViewerEventIds`); otherwise a static row + ink/45 note "Ask an organizer
  to add you to this event." Organizer-only "+ Plan an event" button →
  `/dashboard/create-event?samahan=<communityId>` (PR-3; the button ships in PR-3, not before —
  no dead button in PR-2). Empty state: "Walang event pa. When an organizer plans a reunion or
  outing, it shows up here." (organizers see the Plan button as the empty-state CTA).

### 4c · Home Spaces tile (PR-4) — `app/dashboard/(launcher)/page.tsx`

- Add `fetchUserCommunities(supabase, user.id).catch(…graceful [] + logQueryError)` to the
  page's `Promise.all` (lines 164-209 pattern).
- **The Spaces tile now renders for everyone** — change the `spaces.length > 0` conditional
  (line 763): vendor/admin rows stay capability-gated *inside* it; the Samahan section always
  renders. This is deliberate: the create door must exist for a plain couple.
- Replace the coming-soon block (lines 777-785) with:
  - up to 3 `SpaceRow`s (icon `Users`, `tone: 'default'`, title = name, subtitle =
    `Organizer · 12 members` / `Member`), href `/dashboard/samahan/<id>`; a 4th "N more
    samahans" row → `/dashboard/samahan` when >3 (mirrors the MAX_SHOP_CARDS cap idiom,
    lines ~450-480).
  - a final "+ Create a Samahan" row (Plus icon chip, muted) → `/dashboard/samahan/new`.
  - **zero communities**: keep the section label + one line "A shared space for your barkada,
    parish, or clan." + the Create row. The note stays; only "Coming soon" dies.
- HomeCommandBar (line ~505): add each samahan as a jump item + a "Create a Samahan"
  destination, same mapping as `spaces.map(…)` (line 524).
- Update the page's four-surface doc comment (lines 76-79) — the Samahan note text is
  load-bearing documentation.

---

## 5 · CREATE FLOW — `/dashboard/samahan/new`

One glass card, three fields, zero friction:

1. **Name** (required, 2–80 chars — mirror the DB CHECK) — placeholder "Barkada ni Ice ·
   San Roque Parish Youth · Clan Casasola".
2. **Kind** — 5 chip-buttons (radio): Barkada · Parish · Clan · Org · Other. Default Barkada.
   Mono uppercase chip labels; selected chip gets the gold ring.
3. **Description** (optional, ≤280) — "Ano'ng samahan 'to? (optional)".

Submit: "Create samahan" (primary, ink button w/ gold hover per house buttons). Validation
errors via redirect params (`?error=missing_name`), inline banner like create-event.
On success: creator lands on `/dashboard/samahan/<id>?created=1` where the Overview tab shows a
one-time success banner: "Set na 'yan. Share the invite link to bring people in." — pointing at
the organizer panel's invite link (the natural next step).

Server action per §3: insert community + organizer membership + invite token in one action via
admin client. No payment, no gating — creating a samahan is free (₱0 rule).

---

## 6 · INVITE (minimal) — DECISION: ship it, as ONE standing rotating link

Per-invitee email rows (the `event_moderators` model) are wrong for a barkada — organizers paste
one link into their group chat (Messenger/Viber reality). So: `community_invite_tokens`, one row
per community (UNIQUE), minted at create, rotated on demand. This mirrors `event_join_tokens`'
one-active-token-per-event + service-role redemption, and reuses `/host/accept/[token]`'s accept
choreography (`app/host/accept/[token]/actions.ts`):

`/samahan/join/[token]` (public route, like `app/host/accept`):
- **Signed out** → page shows community name + kind + member count (fetched via admin client —
  token IS the secret, `fetchPendingHostInvite(admin, token)` precedent) + "Sign in to join" →
  `/login?next=/samahan/join/<token>` (exact `acceptHostInvite` lines 35-37 pattern).
- **Signed in** → "Join <name>?" card + Join / No-thanks buttons. `acceptCommunityInvite`:
  token resolves + not revoked/expired → admin-client **upsert** `community_members`
  (`onConflict: 'community_id,user_id', ignoreDuplicates: true` — accept-host lines 93-102
  precedent) → `revalidatePath` → `redirect('/dashboard/samahan/<id>?joined=1')`. Already a
  member → redirect with `?already=1`.
- Unlike host invites the token is NOT cleared on accept (it's a standing group link); rotation
  is the kill switch. No email-match check (there's no invitee email). Terminal states
  (`revoked`, `expired`, `not_found`) render honest error cards with a "Go home" link.

---

## 7 · EVENT LINK — DECISION: organizers CAN create community events (PR-3)

**Justification:** `events.community_id` has no other writer. Without creation, the Events tab
is an eternally-empty surface and "Samahan" ships as a glorified contact list — a fake door with
extra steps. The thin slice is genuinely thin because the create-event flow already exists:

- **Entry**: "+ Plan an event" (organizer-only) on the Events tab →
  `/dashboard/create-event?samahan=<communityId>`.
- **`create-event/page.tsx`**: when `searchParams.samahan` present → `fetchCommunity` +
  verify the viewer is an organizer (else drop the param silently and render the normal page) →
  render a context banner "Planning for <name> · SAMAHAN" + filter the type picker to
  `getCreatableEventTypes()` ∩ `resolveProfile(type).eventClass === 'community_eligible'`
  (`lib/event-type-profile.ts:62,248-251`) + hidden `community_id` field.
- **`createWeddingEvent` action** (`create-event/actions.ts`): read `community_id`; when
  present — (a) re-verify organizer membership via admin client (UI-bypass-proof, same posture
  as the `hasInPlanningWeddingForUser` gate, lines 208-214), (b) re-verify
  `resolveProfile(event_type).eventClass === 'community_eligible'` (the DB CHECK is the final
  backstop), (c) include `community_id` in the insert (lines ~245+). Wedding + samahan can't
  combine by construction (wedding is 'personal' class) — reject with `?error=invalid_type`.
- **Ownership semantics (minimal)**: the creating organizer gets the normal `event_members`
  'couple' row (unchanged create path) and runs the event exactly like any event. Fellow
  community members get **read visibility** via the `community_member_can_read_events` policy —
  not event membership. Auto-membership / invite-as-group is the deferred `guest_groups`
  work (§1).

What we do NOT build here: no community picker inside create-event when arriving without the
param (no "for my Samahan" dropdown — context flows one way, from the community's Events tab),
no transfer of existing personal events into a community (migration/ownership questions —
deferred, owner call).

---

## 8 · PHASED PRs

| PR | Contents | Behavior | Gates |
|---|---|---|---|
| **PR-1** `samahan-foundation-schema` | The §2 migration + `changelog.d/samahan-foundation-schema.md` | **Neutral** — nothing reads the tables; `community_id` defaults NULL everywhere. | typecheck/lint/build (trivially), migration re-run clean (idempotency), `supabase db push` post-merge. |
| **PR-2** `samahan-routes-and-lib` | `lib/communities.ts`, both `actions.ts`, the §4 route tree, `/samahan/join/[token]` | **Dark** — routes are real + functional but nothing links to them. No home change. | full checks + §10 items 1–12. |
| **PR-3** `samahan-community-events` | create-event `?samahan=` context (page + action), Events-tab "+ Plan an event" button | **Dark** — reachable only through PR-2's unlinked pages. | full checks + §10 items 13–16. |
| **PR-4** `samahan-home-door` | Launcher Spaces-tile rewiring (§4c), HomeCommandBar entries, delete the coming-soon note, doc-comment update | **THE FLIP** — the door goes live for every user. | full checks + §10 items 17–20 + live browser verify on the Vercel preview. |

Each PR: its own `changelog.d/<slug>.md` fragment with a `SPEC IMPACT:` line; PR-1's fragment
notes the corpus impact (append a `DECISION_LOG.md` row: "Samahan minimal cut shipped — schema
per Samahan_Minimal_Build_Plan_2026-07-15.md; nesting + chat + invite-as-group deferred").
Auto-merge each (`gh pr merge <#> --auto --merge`). **No env flags** — PR sequencing is the flag
(§1). Merge strictly in order; PR-2 depends on PR-1's tables existing in prod before the Vercel
deploy serves the routes (push the migration immediately after PR-1 merges).

---

## 9 · GUARDRAILS

- **RA 10173** — Joining via the invite link *is* the consent act for roster visibility, scoped
  to fellow members only (RLS §2 makes non-member roster reads impossible, and the roster
  fetch renders `display_name` + role + join date ONLY — never email, never photo, never user
  UUID in the DOM; action targets use the bigserial `member_row_id`). Leave = immediate roster
  removal (DELETE, not soft). Communities hold NO sensitive PI (no religion field on `kind` —
  'parish' is a group flavor the user self-declares for their group, not a faith record on a
  person; do NOT copy it into any person/faith field). No minors machinery: memberships attach
  to full Setnayan accounts only — dependents (`public.dependents`) can NOT be community
  members; nothing in this build touches that counsel-gated table.
- **No roster scraping** — the invite token page (pre-join) shows name + kind + member COUNT
  only, never member names. `current_community_ids()` is SECURITY DEFINER but returns only the
  *caller's* membership — no enumeration path. Members tab is server-rendered post-membership.
- **₱0 rule** — rows only. No R2 (no uploads in minimal cut), no render pipeline, no email
  sends (invite is a copy-paste link — 0028 Resend templates NOT touched), no LLM (Rule 1),
  no cron. Marginal cost per samahan: a few Postgres rows.
- **Owner locks respected** — personal-milestone types can never carry `community_id` (CHECK +
  app gate); the eligible list mirrors the prod seed byte-for-byte; only ORGANIZERS create
  community events; Events tab is a FILTERED list (no parallel event system); chat deferred to
  0019 reuse; nesting deferred with rationale (§1); guest-group fan-out deferred to
  `guest_groups.source_community_id`.
- **Honesty rules** — every rendered control works; chat is a note, not a button; non-member
  event rows are static text, not dead links; the empty Spaces section still tells the truth
  ("A shared space for your barkada…") while offering the real create door.
- **Design locks** — Atelier + glass only: warm paper, frosted `bg-white/60 border-white/70`
  panels, gold `#A9834B` as ring/accent (never fills), Space Mono for counts/badges/IDs, serif
  display names, Lucide 1.75px, chrome-less spokes. No sidebar anywhere in the tree.

---

## 10 · ACCEPTANCE CHECKS (tests.md-style — all must pass before each PR merges)

**Schema (PR-1)**
- [ ] 1. Migration applies clean on a fresh shadow DB AND re-applies clean (idempotent).
- [ ] 2. `INSERT INTO events (…, community_id) VALUES (…wedding…, <cid>)` → rejected by
      `events_community_class_consistency`; same insert with `event_type='reunion'` → accepted.
- [ ] 3. RLS matrix (4 personas: organizer · member · non-member · admin — run as JWT-scoped
      clients): non-member SELECT on `communities`/`community_members`/`community_invite_tokens`
      for a foreign community returns 0 rows; member SELECT returns the community + full roster
      but NOT the invite token row; organizer sees all three; admin override works.
- [ ] 4. Member (non-organizer) UPDATE on `communities` / `community_members.role` → denied.
- [ ] 5. Member can DELETE own membership row; cannot DELETE another's; organizer can.
- [ ] 6. Community event (reunion w/ `community_id`) is SELECT-visible to a community member
      who has NO `event_members` row; invisible to a non-member.
- [ ] 7. Deleting a community leaves its events alive with `community_id = NULL`.

**Routes + lib (PR-2)**
- [ ] 8. Create flow: submit name+kind → lands on space page `?created=1`; creator shows as
      ORGANIZER; invite link renders in the organizer panel; `S89C-` public_id renders.
- [ ] 9. Join flow: incognito open `/samahan/join/<token>` → shows name/kind/count (NO member
      names) → sign-in round-trips back → Join → lands `?joined=1`, appears on roster. Re-open →
      `?already=1`. After "Rotate link", the old token page shows the honest terminal card.
- [ ] 10. Last-organizer guard: sole organizer of a 2+-member samahan taps Leave →
      `?error=last_organizer` banner; after promoting someone, Leave succeeds.
- [ ] 11. Members tab page-source contains no email addresses and no auth user UUIDs.
- [ ] 12. Non-member hitting `/dashboard/samahan/<foreign-id>` → 404. Signed-out → login redirect.
- [ ] 13. All new pages render the slim `(account)` top bar, a "Back to home" pill, and pass
      `pnpm typecheck && pnpm lint && pnpm build`.

**Community events (PR-3)**
- [ ] 14. `/dashboard/create-event?samahan=<id>` as organizer → banner + picker shows ONLY
      community-eligible types (no wedding/debut/christening/gender_reveal/birthday/graduation).
- [ ] 15. Same URL as plain member / non-member → renders the normal personal create page
      (param silently dropped), and a forged POST with `community_id` → rejected.
- [ ] 16. Created community event appears on the Events tab: linked row for the creator, static
      row + "Ask an organizer" note for a plain member.

**Home door (PR-4)**
- [ ] 17. "Coming soon" string is gone from the launcher; grep confirms no dead-door copy left.
- [ ] 18. Plain couple (no vendor/admin/samahan): Spaces tile renders with the Samahan section +
      working "+ Create a Samahan"; vendor/admin rows correctly absent.
- [ ] 19. User with 4 samahans: 3 rows + "1 more samahan" row → index; ⌘K finds each samahan by
      name and "Create a Samahan".
- [ ] 20. Full loop on the Vercel preview: home → create → copy invite → second account joins →
      organizer plans a reunion → both accounts see it per their access. Changelog fragment in
      every PR; `DECISION_LOG.md` row appended (PR-1).

---

*Plan authored by Fable (design lead + product architect), 2026-07-15. Ground truth read from
`/Users/icecasasola/setnayan-wt-home-polish` @ main: launcher page, (account) layout,
lib/events.ts, lib/event-type-profile.ts, lib/event-moderators.ts, create-event actions,
host/accept/[token] actions, setnayan_base + dependents + composable-foundation + wedding-fields
migrations, changelog.d/README.md.*
