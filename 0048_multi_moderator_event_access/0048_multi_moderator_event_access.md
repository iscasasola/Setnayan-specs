# Iteration 0048 — Multi-Moderator Event Access with Surprise Restrictions

**Iteration number:** 0048
**Topic:** Multi-user event access model — events can have multiple moderators beyond the couple (parents, sponsors, maid of honor, family helpers, external planner) with role-based permissions + default-hide rules for surprise reveals (bridal gown, groom suit, designated surprise items)
**Surface:** Event creation flow ([0001_creating_guest_list](../0001_creating_guest_list/0001_creating_guest_list.md)) + couple dashboard role-aware view ([0021_couple_dashboard_fully_purchased](../0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md)) + moderator invitation flow + per-row visibility enforcement across cart, vendor chat, budget, calendar, notifications
**Status:** Drafted 2026-05-19 · V1.2 concept lock · spec-only, no engineering yet
**Owner:** Ice
**Phase:** V1.2 — engineering sequenced after V1.1 marketplace launches wrap
**Builds on:** 0001 (events table), 0007 (budget line items get visibility tags), 0019 (vendor chat respects moderator role), 0021 (event dashboard role-aware), 0028 (notifications routed by visibility), 0034 (cart line items get visibility + payment-attribution tags)
**Consumed by:** 0049 (multi-payer cart depends on moderator role model)
**Companion specs:** 0007, 0019, 0021, 0028, 0034, 0049

---

## What this iteration ships

Three structural primitives that unlock Filipino-wedding multi-user planning while preserving the cultural norm that some reveals (bridal gown, groom suit, surprise dances/songs/honeymoons) stay surprises for the partner:

1. **`event_moderators` table** — events have one row per moderator (including the couple themselves), each with `role_subtype` + `permissions_json`
2. **Row-level visibility tags** (`private_to_role[]` + `hidden_from_role[]` + `surprise_for_role`) — added to cart line items, vendor orders, vendor chat threads, calendar events, budget line items, file uploads. Enforced server-side via Supabase RLS
3. **Default surprise rules engine** — Bridal Gown / Groom Suit / Barong / designated `surprise_for_role` items auto-hide from the spouse target by default; either partner can override per item

Plus moderator invitation flow (email + SMS), permission templates per role, removal + access revocation flow.

V1.2 ships with **11 default role_subtypes**. The framework supports adding role_subtypes via owner spec edit; couples can also assign a free-text label per moderator (e.g., "Mom's cousin Tita Lita") on top of the canonical role.

---

## The role taxonomy (11 V1.2 default role_subtypes)

| `role_subtype` | Typical real-world | Default permissions |
|---|---|---|
| `bride` | Primary couple member, woman | Everything except `private_to_role='groom'` items |
| `groom` | Primary couple member, man (or partner 2 in non-traditional couples) | Everything except `private_to_role='bride'` items |
| `parent_of_bride` | Mom or dad of bride | Full edit (guest / budget / vendors / cart / checkout); sees everything except items explicitly `private_to_couple` |
| `parent_of_groom` | Mom or dad of groom | Same as parent_of_bride; visibility scope mirrored |
| `maid_of_honor` | Bride's primary attendant | Edit guest list (entourage rows), view budget, view vendor list, view cart (read-only); cannot check out by default |
| `best_man` | Groom's primary attendant | Same as maid_of_honor; visibility scope mirrored |
| `wedding_planner_external` | Couple's hired off-platform planner (NOT a Setnayan vendor) | Full edit on vendor list / schedule / seating / day-of timeline; budget view; cannot check out (separation of duties) |
| `ninong` | PH wedding sponsor (godfather) | View-only on schedule + venue + day-of timeline; cannot edit |
| `ninang` | PH wedding sponsor (godmother) | Same as ninong; visibility mirrored |
| `family_helper` | Sibling, cousin, aunt, family friend | Edit guest list (their assigned side), view schedule; cannot edit budget or vendors |
| `viewer` | Friend tracking wedding progress | Read-only event summary (no guest list / no budget / no vendor names) |

**Custom free-text label.** On top of the canonical role, each moderator carries a `display_label TEXT` field — e.g., "Tita Lita (Mom's cousin)" surfaces in the moderator list to help couples disambiguate multiple ninangs.

**Multi-couple support (V1.3+).** Non-traditional couples (same-sex, etc.) can use `partner1` + `partner2` instead of `bride` + `groom`. V1.2 ships with `bride` + `groom` as defaults; V1.3+ adds `partner1` + `partner2` as additional values to the enum.

---

## Permissions model

Each moderator has a `permissions_json` payload with boolean flags. Defaults per role_subtype templated below; couples can override any flag per individual moderator.

```jsonc
{
  "can_view_guests": true,
  "can_edit_guests": true,
  "can_view_budget": true,
  "can_edit_budget": true,
  "can_view_vendors": true,
  "can_message_vendors": true,
  "can_add_vendors_to_shortlist": true,
  "can_view_cart": true,
  "can_add_to_cart": true,
  "can_checkout": true,
  "can_view_dashboard_panels": true,
  "can_edit_event_settings": false,
  "can_add_moderators": false,
  "can_remove_moderators": false,
  "can_view_schedule": true,
  "can_edit_schedule": true,
  "can_view_seating": true,
  "can_edit_seating": false,
  "can_view_day_of_timeline": true,
  "can_view_showcase_consent": false,
  "can_modify_showcase_consent": false
}
```

**Permission templates per role:**

| Role | `can_edit_guests` | `can_edit_budget` | `can_message_vendors` | `can_checkout` | `can_add_moderators` |
|---|---|---|---|---|---|
| `bride` / `groom` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `parent_of_bride` / `parent_of_groom` | ✓ | ✓ | ✓ | ✓ | — |
| `maid_of_honor` / `best_man` | ✓ (entourage) | view-only | view-only | — | — |
| `wedding_planner_external` | view-only | view-only | ✓ | — | — |
| `ninong` / `ninang` | — | — | — | ✓ (their share) | — |
| `family_helper` | ✓ (their side) | — | — | — | — |
| `viewer` | view-only summary | — | — | — | — |

Only the couple (`bride` + `groom`) can `add_moderators` / `remove_moderators` by default. Couples can grant this to a parent if they want shared admin (e.g., parent of bride handles all entourage logistics).

---

## Surprise-restriction logic

### Default-hide rules (auto-applied when item is created)

| Trigger | Hidden from (default) | Override |
|---|---|---|
| Order in canonical_service `bridal_gown_custom` or `bridal_gown_rental` | `groom` | Bride flips "Share with Groom" toggle per item |
| Order in canonical_service `groom_suit_custom` / `groom_suit_rental` / `barong_tagalog_custom` / `barong_tagalog_rental` | `bride` | Groom flips "Share with Bride" toggle |
| Cart item tagged `surprise_for_role: 'groom'` | `groom` | Bride can untag |
| Cart item tagged `surprise_for_role: 'bride'` | `bride` | Groom can untag |
| Vendor chat thread for any of the above canonical_services | Same as the order it relates to | Same as above |
| Calendar event linked to a hidden order (e.g., "Bridal Gown Fitting") | Same as the order | Title sanitized to "Personal Appointment" in the hidden role's calendar view |
| Budget line item linked to a hidden order | Same as the order | Aggregate total shows; per-line breakdown hidden |
| Notification (email/push) about a hidden order | Sent only to roles that can see it | n/a |

### Manual visibility tags

Anywhere a cart item / vendor order / chat thread / calendar event / budget line is created, the creator can tag visibility:

- `private_to_role: ['bride']` — only this role sees it; everyone else (including groom + moderators) is blind to it
- `hidden_from_role: ['groom', 'parent_of_groom']` — bride + bride-side moderators see; groom-side doesn't
- `surprise_for_role: 'groom'` — explicit surprise badge; hidden from groom, shown to all other moderators as **🎁 Surprise for Groom**

These tags surface as a small badge on the item: **🔒 Private to Bride** / **🎁 Surprise for Groom**.

### Aggregate budget handling (the leak-prevention rule)

Critical edge case: if Bride spends ₱120K on a hidden gown, Groom's budget view must NOT show "Bridal Gown — ₱120K" as a line item. But the **aggregate total** should still reflect actual spend so couples can see real-time financial state.

Solution: per-line breakdown respects visibility tags. Groom's budget view sees:
- ₱120K in a row labeled "Reserved — Bride's items" (line items hidden but total preserved)
- All other lines normally

Bride's budget view sees all lines normally.

Parents see the full breakdown by default (they're often co-funding the gown and need to know what they're paying for).

### Calendar leak-prevention

Bridal Gown fitting on Bride's calendar shows as "Bridal Gown Fitting" with the vendor name. On Groom's calendar view, the same event title is sanitized to "Personal Appointment" and the vendor is hidden. Time block is preserved (Groom knows Bride is busy, doesn't know with what).

### Notification routing

Notifications check role visibility before delivery:
- "Your bridal gown is ready for fitting" — emails only to Bride + moderators who can see bridal_gown orders (default: parents of bride)
- Groom does NOT receive this notification
- Shared-inbox forwarding risk: emails are sent to per-user email addresses, never to a shared event inbox

### Photo / file upload leak-prevention

If a vendor uploads photos of bride's gown try-ons to the chat thread:
- Photos inherit the thread's visibility tags
- Groom cannot access the thread, so cannot view photos
- If photo is shared elsewhere (e.g., couple's shared Google Drive via [0009 photo delivery](../0009_photo_delivery/0009_photo_delivery.md)), couple must explicitly tag share scope — Drive folder structure respects role-based folders

---

## Moderator invitation flow

### Couple invites a moderator

1. From event dashboard, Bride/Groom (or any moderator with `can_add_moderators=TRUE`) navigates to `/dashboard/{eventId}/moderators/invite`
2. Picks role_subtype from dropdown (Parent of Bride / Maid of Honor / Ninang / etc.)
3. Customizes permissions (defaults pre-filled from role template; checkboxes editable)
4. Enters invitee's email + optional phone number + display label ("Tita Lita")
5. Optional: writes personal note ("Mom, can you help us coordinate with the caterers?")
6. Submits → invitation email + SMS sent

### Invitee accepts

1. Email/SMS link → opens to a Setnayan landing page with invitation context: "[Bride Name] invited you to help plan their wedding as **Parent of Bride**"
2. Page shows what they'll be able to do (permission summary in friendly language)
3. Click "Accept Invitation" → creates Setnayan account if not exist (email + password OR magic link OR Google OAuth) → adds row to `event_moderators` with `accepted_at = now()`
4. Lands on event dashboard with their role-restricted view

### Decline / ignore

- Invitation links expire after 30 days
- Couple sees pending invitations in `/dashboard/{eventId}/moderators` with "Resend" + "Cancel invitation" CTAs
- No-reply for 14 days triggers a polite reminder email

### Mobile-first invitation

PH parents often prefer SMS (older demographics, slower email adoption). SMS link with shorter copy works the same way; PH SMS sender ID configurable per [API_Integration_Checklist](../API_Integration_Checklist.md). Messenger integration deferred V1.3+ (per memory: Messenger is primary support channel in PH).

---

## Removal + access revocation

### Couple removes a moderator

From `/dashboard/{eventId}/moderators` → tap moderator → "Remove from event"
- Soft modal: "Are you sure? [Mom of Bride] will lose access immediately. Their past payments stay attributed; their cart items remain in the cart but you'll need to pay or remove them."
- Confirm → `event_moderators.removed_at = now()`; their `auth.uid()` no longer satisfies the RLS policies
- Polite removal notification email auto-sent: "You've been removed from the event. Thank you for helping plan [Couple]'s wedding."

### Self-leave

Moderators can leave on their own from their event-switcher: "Leave this event"
- Same data preservation rules
- Couple notified by email

### Data preservation rules

- Past payments stay attributed (don't strip history)
- Cart items they added stay in the cart with their `paid_by_role` tag — couple must re-pay or remove
- Chat threads they initiated stay; future replies go to remaining moderators with chat access
- Calendar events they created stay
- Budget lines they entered stay

---

## Schema

### `event_moderators` table (NEW)

```sql
CREATE TABLE event_moderators (
  moderator_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(user_id),
  role_subtype TEXT NOT NULL CHECK (role_subtype IN (
    'bride','groom','parent_of_bride','parent_of_groom',
    'maid_of_honor','best_man','wedding_planner_external',
    'ninong','ninang','family_helper','viewer'
  )),
  display_label TEXT,                                  -- e.g., "Tita Lita (Mom's cousin)"
  permissions_json JSONB NOT NULL,                     -- per-role overridable; see § Permissions model
  invited_by_user_id UUID NOT NULL REFERENCES users(user_id),
  invitation_email TEXT,
  invitation_phone TEXT,
  invitation_sent_at TIMESTAMPTZ,
  invitation_expires_at TIMESTAMPTZ,                   -- 30 days from invitation_sent_at
  accepted_at TIMESTAMPTZ,
  removed_at TIMESTAMPTZ,                              -- soft delete
  removal_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

CREATE INDEX event_moderators_event_user_idx ON event_moderators (event_id, user_id) WHERE removed_at IS NULL;
CREATE INDEX event_moderators_pending_invites_idx ON event_moderators (event_id) WHERE accepted_at IS NULL AND removed_at IS NULL;
```

### Visibility tags added to multiple tables

```sql
-- Mirror columns on each table that holds couple-private data
ALTER TABLE service_order_line_items
  ADD COLUMN private_to_role TEXT[],                   -- e.g., ARRAY['bride']
  ADD COLUMN hidden_from_role TEXT[],                  -- e.g., ARRAY['groom', 'parent_of_groom']
  ADD COLUMN surprise_for_role TEXT,                   -- e.g., 'groom'
  ADD COLUMN visibility_set_by_user_id UUID;           -- which moderator set the tags (audit)

ALTER TABLE vendor_orders
  ADD COLUMN private_to_role TEXT[],
  ADD COLUMN hidden_from_role TEXT[],
  ADD COLUMN surprise_for_role TEXT;

ALTER TABLE vendor_chat_threads
  ADD COLUMN private_to_role TEXT[],
  ADD COLUMN hidden_from_role TEXT[],
  ADD COLUMN surprise_for_role TEXT;

ALTER TABLE event_calendar_blocks
  ADD COLUMN private_to_role TEXT[],
  ADD COLUMN hidden_from_role TEXT[],
  ADD COLUMN surprise_for_role TEXT,
  ADD COLUMN public_title TEXT;                        -- sanitized title shown to hidden-from roles (e.g., "Personal Appointment")

ALTER TABLE budget_line_items
  ADD COLUMN private_to_role TEXT[],
  ADD COLUMN hidden_from_role TEXT[],
  ADD COLUMN surprise_for_role TEXT,
  ADD COLUMN amount_revealed_to_aggregate BOOLEAN NOT NULL DEFAULT TRUE;  -- if false, line excluded from totals shown to hidden role
```

### Supabase RLS policies (illustrative)

```sql
-- Generic visibility filter helper function
CREATE OR REPLACE FUNCTION moderator_can_see_row(
  p_event_id UUID,
  p_user_id UUID,
  p_private_to_role TEXT[],
  p_hidden_from_role TEXT[],
  p_surprise_for_role TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql STABLE
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role_subtype INTO v_role
  FROM event_moderators
  WHERE event_id = p_event_id
    AND user_id = p_user_id
    AND accepted_at IS NOT NULL
    AND removed_at IS NULL;

  IF v_role IS NULL THEN RETURN FALSE; END IF;

  -- private_to_role: only specified roles see it
  IF p_private_to_role IS NOT NULL AND NOT (v_role = ANY(p_private_to_role)) THEN
    RETURN FALSE;
  END IF;

  -- hidden_from_role: my role is in the hide list
  IF p_hidden_from_role IS NOT NULL AND v_role = ANY(p_hidden_from_role) THEN
    RETURN FALSE;
  END IF;

  -- surprise_for_role: I am the surprise target
  IF p_surprise_for_role IS NOT NULL AND v_role = p_surprise_for_role THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$;

-- Apply to cart line items
CREATE POLICY service_order_line_items_visibility ON service_order_line_items
  FOR SELECT TO authenticated
  USING (
    moderator_can_see_row(
      event_id,
      auth.uid(),
      private_to_role,
      hidden_from_role,
      surprise_for_role
    )
  );

-- Same policy structure applied to vendor_orders, vendor_chat_threads,
-- event_calendar_blocks, budget_line_items
```

### Default-hide trigger (for canonical_service-driven auto-restrictions)

```sql
CREATE OR REPLACE FUNCTION apply_default_surprise_restrictions()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- If creating a cart item for a bridal gown / groom suit / etc., apply default-hide
  IF NEW.canonical_service IN ('bridal_gown_custom', 'bridal_gown_rental') THEN
    -- Hide from groom by default unless creator explicitly set private_to_role
    IF NEW.hidden_from_role IS NULL AND NEW.private_to_role IS NULL THEN
      NEW.hidden_from_role := ARRAY['groom', 'parent_of_groom'];
    END IF;
  ELSIF NEW.canonical_service IN ('groom_suit_custom', 'groom_suit_rental', 'barong_tagalog_custom', 'barong_tagalog_rental') THEN
    IF NEW.hidden_from_role IS NULL AND NEW.private_to_role IS NULL THEN
      NEW.hidden_from_role := ARRAY['bride', 'parent_of_bride'];
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER service_order_line_items_default_surprise
  BEFORE INSERT ON service_order_line_items
  FOR EACH ROW EXECUTE FUNCTION apply_default_surprise_restrictions();
```

---

## UX surfaces

### `/dashboard/{eventId}/moderators` (couple-side)

Lists all moderators with:
- Avatar + name + display_label
- Role badge
- Status (accepted / pending invitation / removed)
- Permissions summary ("Can edit budget, can checkout, sees everything")
- Actions: "Edit permissions" / "Remove from event"

CTA at top: "+ Invite moderator"

### `/dashboard/{eventId}/moderators/invite`

Inline form:
- Role dropdown (11 options)
- Permissions checkboxes (pre-filled per role template)
- Email + phone fields
- Display label field
- Optional personal note
- Submit → invitation sent

### Visibility badges across the app

Wherever a cart item / vendor order / chat thread / budget line / calendar event has visibility tags set, a small badge appears next to it:
- **🔒 Private** — only to the role(s) in `private_to_role`
- **🎁 Surprise for Groom** — `surprise_for_role` badge
- **👁️ Visible to all moderators** — implicit; no badge

Tap the badge → modal showing "Who can see this? [list of roles]" + "Change visibility →" CTA (creator + couple can edit).

### Per-item visibility editor

Cart line item modal (and equivalent on other surfaces):
- Visibility section with three controls:
  - Toggle: **Private (only me)** / **Visible to all moderators** (default for most items)
  - Or: **Hide from [multi-select role list]**
  - Or: **Mark as surprise for [role dropdown]**
- Save → visibility tags updated; server enforces on next render

### Event dashboard header — moderator-aware

Top of every event dashboard surface shows the current user's role:
- **"Viewing as [Bride]"** badge
- Tap → switch between roles if user has multiple roles on the same event (rare but possible — e.g., couple member who's also a sponsor on a friend's event)

---

## Edge cases

1. **Existing events with only couple users.** Backfill via migration: bride + groom each get a row in `event_moderators` with default permissions. Their existing access semantics preserved.
2. **Vendor messaging without explicit moderator role.** Vendors (`role=vendor` in `users`) are not moderators; their visibility into events is governed by the existing event_vendor_relationships table, not `event_moderators`. RLS policies must NOT include vendors in the moderator visibility check — vendors see their own service orders + chat threads they're part of, nothing else.
3. **Couple removes a parent who has hidden gown orders attributed to them.** Past payments preserved, future cart items they tagged become orphaned (paid_by_role still references the removed user but checkout fails for that line). Couple must re-attribute or pay themselves.
4. **Parent of Bride invited but they live abroad and use different timezones.** Calendar events should respect viewer's timezone (existing infra from [0021](../0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md)). Invitation emails localized per detected language.
5. **Same person invited to multiple events (e.g., wedding planner working with multiple couples).** Each `event_moderators` row scoped to its `event_id`. Same `user_id` can have multiple rows across events. Role-switcher in event picker handles this.
6. **Couple disagrees on visibility (Bride wants to share dress, Groom wants surprise).** UI surfaces conflict only if needed: when Bride toggles "Share with Groom" on an item that defaulted to hidden, a small note appears: "Groom will see this from now on. You can hide it again anytime." Either partner can override their own surprise default; the other can't force visibility against their wishes.
7. **Aggregate budget total leak via reverse-calculation.** Groom can theoretically see total budget minus their own visible items → infer hidden item total. Acceptable risk: aggregate is rounded to nearest ₱5K in the hidden role's view; per-line precision preserved for non-hidden viewers. Couple aware of this trade-off via help-text in budget UI.
8. **Moderator removed mid-invitation cycle.** If a parent declined an invite but later regretted it, couple can re-invite (new row in `event_moderators` with a new invitation_id).
9. **Couple deletes the event.** All `event_moderators` rows cascade-delete (per ON DELETE CASCADE). Moderators get notification: "[Couple] has cancelled their event."

---

## Memory rule update flag

Current memory rule: **"Customers initiate vendor chat — only couples can open a thread with a vendor"** ([feedback_setnayan_customer_initiates_chat.md](../../../.claude/projects/-Users-icecasasola/memory/feedback_setnayan_customer_initiates_chat.md)).

**Proposed update:** "Couple OR authorized moderator initiates vendor chat. Moderator must have `can_message_vendors=TRUE` permission. Vendor sees the event context (not the moderator's personal context); replies route to all moderators in the thread with chat-read access (respecting visibility tags)."

**Owner sign-off required** before [0019](../0019_communications/0019_communications.md) amendment proceeds.

---

## Phasing

**V1.2 base ship:**
- `event_moderators` table + 11 default role_subtypes
- Permission templates per role
- Visibility tags on cart line items + vendor orders + vendor chat threads + calendar events + budget line items
- Default-hide trigger for bridal_gown / groom_suit / barong canonical_services
- Moderator invitation flow (email + SMS)
- `/dashboard/{eventId}/moderators` + invite/edit UI
- Per-item visibility editor across applicable surfaces
- Aggregate budget handling (rounded for hidden viewers)
- RLS policies enforced server-side

**V1.3:**
- Messenger integration for moderator invitations (PH-primary channel)
- `partner1` / `partner2` role options for non-traditional couples
- Custom role subtypes (couples can define their own roles beyond the 11 defaults)
- Granular calendar event title sanitization (vs the V1.2 generic "Personal Appointment")
- Multi-event multi-role consolidation view (one user with moderator roles across 5 events sees a unified inbox)

**V1.5+:**
- Audit log surface for moderators (who edited what / when)
- Time-bounded moderator access (e.g., Pre-Cana counselor only has access during T-90d to T-7d)
- Moderator-driven analytics ("Mom of Bride spent 12 hours in the app this week — average for parent-of-bride is 5 hours")

---

## Open questions

1. **Should the couple be hard-coded as two `event_moderators` rows automatically on event creation?** Yes (per design above). Migration backfills existing events.
2. **What if a couple has no parents involved?** Fine — `event_moderators` table has no rows for parents; UI doesn't require them.
3. **Sponsor (ninong/ninang) count cap?** PH weddings can have 8-20 ninongs/ninangs. No hard cap recommended; soft warning at 10 sponsors ("Most weddings have 4-8 sponsors — are you sure?").
4. **Cross-account visibility leak via shared phone numbers.** If Mom of Bride and Mom of Groom share a household phone for SMS, both get the same invitation links. Mitigation: phone-based invitations include the recipient's name + role in the SMS copy, and the landing page asks for email confirmation before accepting.
5. **Can a vendor be both a vendor AND a moderator (dual-role per existing memory)?** Yes — per "dual-role pattern" memory rule. A florist who's also the Maid of Honor on a friend's wedding can have moderator access on that event + vendor access on others. Roles are per-event.
6. **Notification preference per moderator.** Should each moderator be able to mute certain notification types? Recommend yes — `notification_preferences_json` per moderator (subset of [0028](../0028_email_notifications/0028_email_notifications.md) template list).

---

## Cross-references

- Consumes: [0001](../0001_creating_guest_list/0001_creating_guest_list.md) (events table), [0007](../0007_budget_expenses/0007_budget_expenses.md) (budget line items gain visibility tags), [0019](../0019_communications/0019_communications.md) (vendor chat respects moderator roles), [0021](../0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md) (couple dashboard becomes event dashboard with role context), [0028](../0028_email_notifications/0028_email_notifications.md) (notifications routed per visibility), [0034](../0034_payments_and_cart/0034_payments_and_cart.md) (cart line items gain visibility tags)
- Provides: `event_moderators` table + 11 default role_subtypes + permission templates + visibility tag schema + RLS policies + default-hide trigger + moderator invitation flow + per-item visibility editor UI
- Consumed by: [0049](../0049_multi_payer_cart/0049_multi_payer_cart.md) (multi-payer cart depends on moderator role + payment attribution)

---

## Decision log

- **2026-05-19 — Iteration drafted.** Multi-moderator event access concept locked. 11 role_subtypes covering PH wedding multi-user reality (couple + parents + entourage attendants + sponsors + external planner + family helpers + viewers). Default-hide rules auto-apply to bridal_gown / groom_suit / barong / surprise-tagged items per "Default-hide on attire + designated surprise items" owner choice. Manual visibility tags (`private_to_role` / `hidden_from_role` / `surprise_for_role`) extend per-row. RLS policies enforce visibility server-side. Aggregate budget rounded for hidden viewers to prevent reverse-calculation leak. Memory rule update flagged: "Customers initiate vendor chat" → "Couple or authorized moderator initiates vendor chat" (owner sign-off pending).
