# Iteration 0029 — Help Center / FAQ

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - The Help Center shipped as a **single page at `/help`** (`app/help/page.tsx`) — a role-filtered FAQ (`lib/help.ts` `HELP_TOPICS`/`HELP_ROLES`, couple/vendor/guest/admin) with FAQPage schema.org JSON-LD + an inline contact form (`submitHelpMessage`). The deep URL tree in this spec (`/help/[role]`, `/help/[role]/[section]/[slug]`, `/help/contact`, `/dashboard/[role]/help`) **does not exist**; articles are static topic blocks on the one page, not individually-routed.
> - There is **no SLA-tracked "Support Tickets" queue.** Admin support is a flat message list at `/admin/help` with three statuses (`new` / `in_progress` / `closed`) on a `help_messages` table — no ticket numbers, no SLA timers, no per-role auto-routing, no thumbs-up/down article feedback, no `view_count`/"Popular this week".
> - Article counts here (≈34 customer / 25 vendor / 15 guest / 20 admin) are aspirational; the shipped `HELP_TOPICS` set is much smaller and brand/discovery-led.
> - The **"3% Setnayan Pay convenience fee" FAQ article (§ 3.1 Customer Payments)** describes a RETIRED fee — **commission is 0%**. The **"Setnayan Concierge" section (§ 3.1 #6, 4 articles)** is stale: the planner SKU is **"Setnayan AI" ₱1,499**, the couple-app Concierge wizard is retired (`CONCIERGE_ENABLED=false`), and the 3-day-trial/enforcement/appeal flow it documents is off.
> - Payment-help copy must reflect **apply-then-pay + manual admin approval** (no card charge) and **off-platform vendor money** (Setnayan never holds it).
>
> When this body disagrees with the above, **the above wins.**

**Iteration number:** 0029
**Topic:** Per-role searchable knowledge base + FAQ + structured contact-support routing for Setnayan. Replaces "email Setnayan" with a tiered self-serve help surface that escalates into a ticketed, SLA-tracked admin queue.
**Surface:** Public `setnayan.com/help` (no login required) plus authenticated `dashboard/[role]/help` deep-links plus a new **Support Tickets** section inside the 0023 admin console.
**URL pattern:** `setnayan.com/help`, `setnayan.com/help/[role]`, `setnayan.com/help/[role]/[section]/[slug]`, `setnayan.com/help/contact`, `setnayan.com/dashboard/admin/support`
**Builds on:** 0000 (auth + role-router), 0015 (marketing site shell + locales), 0019 (chat — articles link back into chat threads), 0021 (couple dashboard), 0022 (vendor dashboard), 0023 (admin console — new ticket queue lives here), 0028 (email notifications — confirmation + SLA emails).
**Status:** Drafted 2026-05-12.
**Phase:** V1 launch-blocking. Setnayan cannot launch with "email Setnayan" as the only support channel — a multi-thousand-event marketplace generates support load that has to be tiered, searchable, and routed before it hits a human.

---

## 1. Why this iteration exists

Setnayan today has no structured customer support beyond "email Setnayan." For thousands of weddings, that won't scale.

**Couples, vendors, and guests will repeatedly ask the same things:**

- "How do I pay?"
- "Where's my payment confirmation?"
- "How do I add a +1?"
- "How do I change my wedding date?"
- "Why hasn't my vendor application been verified yet?"
- "How do I delete my account?"
- "How do I download my photos?"

**Centralizing FAQs + a guided contact-form-that-routes-to-the-right-admin-role removes the email-inbox-as-helpdesk pain:**

- Most repeated questions get answered before a human ever sees them — couples self-serve, admins don't burn cycles on copy-paste replies.
- The remaining questions arrive structured (category + subcategory + role context) so they route to the right admin role automatically.
- Every ticket has a number, an SLA timer, and a status — couples and vendors stop wondering "did anyone see my email?"
- The admin side stops triaging an undifferentiated inbox of "HELP" emails.
- SEO benefit: organic search traffic from couples Googling "how do I pay setnayan" lands on real answers, not a blank contact form.

**This iteration is the difference between a marketplace that can scale support and one that cannot.**

---

## 2. Surface architecture

### 2.1 Public help landing — `setnayan.com/help`

- No login required. Anyone can read help articles.
- Hero: search bar (always-present, sticky on scroll) + three role tiles below: **Customer · Vendor · Guest**. An **Admin** tile only renders after an authenticated admin lands on the page (server-side check on `users.account_type = 'admin'`).
- Below the tiles: "Popular this week" — the five most-viewed articles across all roles, surfaced by `view_count` rolling 7-day window.
- Footer: "Still need help? [Contact us]" → `/help/contact`

### 2.2 Per-role help home — `setnayan.com/help/[role]`

Same skeleton for each role:

- Search bar (role-scoped — only returns articles for this role + `multi_role`)
- 5–8 **popular topics** for this role (top by `view_count` in the last 30 days)
- **Categorized sections** (the 6/6/4/4 below) — each section shows up to 5 article titles + "View all (N)" link
- **Contact us** CTA at the bottom — opens the structured contact form, pre-tagged with the current role

### 2.3 Article page — `setnayan.com/help/[role]/[section]/[slug]`

- Breadcrumb: Help / [Role] / [Section] / Article title
- Article body (markdown rendered)
- "Did this help?" thumbs-up / thumbs-down widget (optional comment box appears on thumbs-down)
- "Related articles" — three other articles in the same section
- "Last reviewed [date]" — stamps `last_reviewed_at`; flagged stale internally after 90 days but never shown stale to end users (stale flag is admin-only)
- "Still didn't find it? [Contact us]" button at the bottom

### 2.4 Contact form — `setnayan.com/help/contact`

Reachable from every help page footer + every dashboard sidebar "Need help?" widget. Structured 6-field form, not a free-form email. Detail in section 6.

### 2.5 Authenticated deep-links — `setnayan.com/dashboard/[role]/help`

Logged-in users get the same help center but with role auto-detected (no role tile picker), a sidebar widget on every dashboard surface ("Need help? Open help center"), and contact form auto-fills role + user identity. Dismissible per-user via `dismissed_help_widget` flag on `users`.

### 2.6 Admin ticket queue — `setnayan.com/dashboard/admin/support`

New section inside 0023 Admin Console. Detail in section 7.

---

## 3. Per-role section structure

### 3.1 Customer (couple) — 7 sections, ~34 articles V1

| # | Section | Article count | Examples |
|---|---|---|---|
| 1 | Getting started | 5 | "How do I create my event?" / "What does co-organizer mean?" / "Can my parents log in to help me plan?" / "What if I'm planning a non-wedding event?" / "How do I switch between events?" |
| 2 | Guest list & invitations | 6 | "How do I add a guest?" / "How do I send invitations?" / "How does RSVP tracking work?" / "How do I manage +1s?" / "Where do I see dietary restrictions?" / "Can I import my guest list from a spreadsheet?" |
| 3 | Vendors | 6 | "How do I browse vendors?" / "What's the difference between Verified, Certified, and Boosted?" / "How do I book a vendor?" / "How do I message a vendor?" / "What's a coordinator and how do I add one to a thread?" / "What does my contract with the vendor look like?" |
| 4 | Payments | 6 | "How does Setnayan's payment process work?" / "How do I pay via BDO?" / "How do I pay via GCash?" / "What's the 3% Setnayan Pay convenience fee?" / "Where's my payment confirmation?" / "How do refunds work?" |
| 5 | Wedding day services | 4 | "What is Paparazzi?" / "What is Live Stream and how does my YouTube link work?" / "How do I make a Save-the-Date?" / "What's a Custom Monogram Pack?" |
| 6 | Setnayan Concierge | 4 | "What is Setnayan Concierge?" / "How does the 3-day free trial work?" / "Why is my trial unavailable?" *(explains account-level cap + enforcement states · links to appeal flow)* / "How do I appeal a Concierge enforcement?" *(added 2026-05-17)* |
| 7 | Account & privacy | 3 | "How do I delete my account?" / "How do I export my data?" / "How do I change my event URL slug?" |

### 3.2 Vendor — 6 sections, ~25 articles V1

| # | Section | Article count | Examples |
|---|---|---|---|
| 1 | Registration & verification | 5 | "How do I apply to be a Setnayan vendor?" / "What documents do I need?" / "What's the on-site visit?" / "How long does verification take?" / "What are the Boosted / Certified / Verified tiers?" |
| 2 | Services & pricing | 5 | "How do I create a service?" / "How do I build a custom plan?" / "What pricing models are supported?" / "Can I add custom service categories?" / "How do I price for peak season?" |
| 3 | Clients & bookings | 4 | "How does the booking pipeline work?" / "Where are my contracts stored?" / "How do I receive payment?" / "What if a couple disputes a booking?" |
| 4 | Pro subscription & boosts | 4 | "What's Vendor Pro Weekly?" / "What's a Sponsored Boost?" / "What's an HQ Pin?" / "How do Extended Pins work?" |
| 5 | Team & collaboration | 4 | "How do I add a team member?" / "What are vendor team roles?" / "Why does my logo show instead of my staff photo in chat?" / "How do I upload our company logo?" |
| 6 | Marketplace operations | 3 | "How do marketplace rankings work?" / "How do reviews work?" / "What if I get a bad review?" |

### 3.3 Guest — 4 sections, ~15 articles V1

| # | Section | Article count | Examples |
|---|---|---|---|
| 1 | Personal invitation | 5 | "What's the QR code I got?" / "How do I RSVP?" / "How do I claim my +1?" / "How do I see the wedding details?" / "Can I see the schedule?" |
| 2 | At the wedding | 4 | "Where's my table?" / "What's the photo wall?" / "How do I use the guest camera?" / "Why is there a QR code on each table?" |
| 3 | After the wedding | 3 | "How do I download my photos?" / "How do I request my personal Reel?" / "How do I leave a video message in the guestbook?" |
| 4 | Account | 3 | "Do I need a Setnayan account?" / "How is my privacy protected?" / "How do I delete my face data?" |

### 3.4 Admin (internal) — 4 sections, ~20 articles V1

Visible only to authenticated admin users (RLS-enforced).

| # | Section | Article count | Examples |
|---|---|---|---|
| 1 | Verification queue | 5 | "How do I process a vendor verification?" / "What documents are required for each vendor type?" / "How do I coordinate the on-site visit?" / "When do I reject vs request more info?" / "How long should verification take?" |
| 2 | Payment reconciliation | 6 | "How do I match a BDO transfer to an order?" / "How do I match a GCash payment?" / "What if the reference code doesn't match?" / "What's the 24-hr SLA and how do I track it?" / "How do I escalate a disputed payment?" / "How do I issue a manual payment confirmation?" |
| 3 | Disputes & refunds | 5 | "How does dispute mediation work?" / "How do I process a refund ≤ ₱25K?" / "How do I escalate a refund > ₱25K to two-admin approval?" / "What's the force-majeure policy?" / "How do I document a dispute resolution?" |
| 4 | Internal accounts | 4 | "What's the difference between Owner (🟣) and Team Member (🟢)?" / "How does the team shared monthly pool work?" / "How do I add a new internal account (two-admin)?" / "How do I review the audit log?" |

**Total V1 catalog: ~90 articles.**

---

## 4. Article structure spec

Each article is a markdown record with the following fields:

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | text | yes | Question form for FAQ ("How do I pay via GCash?") · Statement form for how-to ("Paying via GCash") |
| `role` | enum | yes | `customer` · `vendor` · `guest` · `admin` · `multi_role` |
| `section` | text | yes | One of the 6/6/4/4 per-role section names (e.g. "Payments") |
| `slug` | text | yes | URL-safe; unique; example `paying-via-gcash` |
| `tags` | text[] | no | Free-form tags for cross-section grouping (`payment`, `gcash`, `bdo`, `refund`) |
| `tldr` | text | yes | One-sentence summary surfaced in search results and rich snippets |
| `body_md` | text | yes | Markdown, target 200–800 words per article |
| `related_article_ids` | uuid[] | no | Up to 3 linked articles (manually curated; admin UI suggests by tag overlap) |
| `last_reviewed_at` | timestamp | yes | Stamped by Ops Lead "Mark as reviewed" button |
| `is_published` | boolean | yes | Drafts not visible publicly |

**Editorial conventions:**

- Every article opens with a one-sentence TL;DR before the deep dive. Same sentence stored in `tldr` field.
- No technical jargon. If a term must be used (RLS, R2, JWT), define it inline on first occurrence.
- Use H2 (`##`) for the main answer; H3 (`###`) for subtopics. No H1 in body (the page title is H1).
- Prefer numbered steps for procedural content ("How do I…"). Prefer prose for conceptual content ("What is…").
- Screenshots welcome but optional; stored as R2 objects under `help_articles/{article_id}/img/{filename}`.
- Embed deep-links to specific dashboard surfaces where helpful (`/dashboard/customer/guests`).
- End every article with a "Was this helpful?" widget (auto-injected by the renderer, not in `body_md`).

---

## 5. Search architecture

### 5.1 Full-text index

```sql
CREATE INDEX idx_help_articles_fts ON help_articles
  USING gin(to_tsvector('english', title || ' ' || tldr || ' ' || body_md));
```

Postgres `tsvector` powers full-text search. Bilingual support deferred to V1.1 (the Tagalog and Cebuano `to_tsvector` configurations are not bundled by default; for V1 we ship English-only search across all locales, which is acceptable because the TL/CEB locale work in 0015 primarily covers marketing copy, not help articles — V1 help articles ship EN-only and add TL/CEB translations in V1.1).

### 5.2 Role-scoped search

Search results filter by the requesting user's role:

- Customers see `role IN ('customer', 'multi_role')`
- Vendors see `role IN ('vendor', 'multi_role')`
- Guests see `role IN ('guest', 'multi_role')`
- Admins see `role IN ('admin', 'customer', 'vendor', 'guest', 'multi_role')` — admins need to read every article when answering tickets

### 5.3 Search-as-you-type

- Input debounced 200 ms (matches the existing Setnayan search debounce pattern)
- Returns up to 8 suggestions
- Result row: title (highlighted match) · section · tldr (truncated 80 chars)
- Empty state: "Didn't find what you needed? [Contact us]" → contact form pre-tagged with the search query

### 5.4 Ranking

Default rank = Postgres `ts_rank` on the tsvector match. Tie-break by `view_count DESC` so popular articles surface first when scores are close.

### 5.5 Synonyms

A static synonyms list (loaded into a small lookup table `help_search_synonyms (term, alias)`) expands common queries:

- "money" → "payment"
- "cancel" → "refund"
- "delete account" → "account deletion"
- "monggo" → "payment"  *(Tagalog slang where used in support history)*

Synonyms are admin-editable from the Ops Lead surface.

---

## 6. Contact form and support tickets

### 6.1 Contact form flow

When a user clicks "Contact us" anywhere in the help center:

1. **Role auto-detected** from `users.account_type` (or asked if unauthenticated).
2. **Category dropdown** — top-level routing key:
   - `Payments`
   - `Vendors`
   - `Account`
   - `Concierge` *(added 2026-05-17 — appeals and access issues for Setnayan Concierge)*
   - `Bug report`
   - `Feature request`
   - `Other`
3. **Subcategory dropdown** — depends on category:
   - `Payments` → `Haven't received my payment confirmation` · `Got charged the wrong amount` · `Want a refund` · `Payment failed` · `Other payment issue`
   - `Vendors` (customer) → `Vendor not responding` · `Vendor cancelled on us` · `Dispute over deliverables` · `Other vendor issue`
   - `Vendors` (vendor) → `Verification stuck` · `Application rejected — appeal` · `Customer not paying` · `Other`
   - `Account` → `Can't log in` · `Want to delete account` · `Want to export my data` · `Privacy concern` · `Other`
   - `Concierge` → `Trial unavailable — appeal` · `Concierge unavailable on my account — appeal` · `Question about Setnayan Concierge`
   - `Bug report` → `App crashed` · `Feature not working as described` · `Visual / layout issue` · `Other bug`
   - `Feature request` → free-form description, no subcategory
   - `Other` → free-form description, no subcategory
4. **Subject** — single text line, 100 char max.
5. **Description** — free-form text, **250-char minimum, 2000-char maximum.** Min length forces enough context for an admin to act; max prevents wall-of-text dumps.
6. **Attachment (optional)** — single file upload, ≤ 5 MB, types: `image/png`, `image/jpeg`, `application/pdf`, `text/plain`. Stored on R2 under `support_tickets/{ticket_id}/{filename}`.
7. **Submit** → `INSERT INTO support_tickets` → ticket number assigned (auto-incrementing SERIAL) → routed to the right admin role per the routing matrix → confirmation page with ticket number + SLA notice → confirmation email via 0028.

### 6.2 Routing matrix

| Category / context | Routed to admin role |
|---|---|
| `Payments` (any subcategory) | Transactions / Payments Handler |
| `Vendors` (customer reports vendor issue) | Disputes Handler |
| `Vendors` (vendor verification / vendor account issues) | Verification / Vendor Accounts Handler |
| `Account` (customer) | Customer Accounts Handler |
| `Account` (vendor) | Verification / Vendor Accounts Handler |
| `Concierge` → `Trial unavailable — appeal` OR `Concierge unavailable on my account — appeal` | **Abuse Review Handler** (single-admin authority per § 4.3 — admin opens 0023 § 3.11 Concierge Abuse tab, reviews flag history, can call `adminLiftConciergeEnforcement` to decrement strike count + reset enforcement level). Added 2026-05-17. |
| `Concierge` → `Question about Setnayan Concierge` | Customer Accounts Handler |
| `Bug report` | Ops Lead |
| `Feature request` | Ops Lead |
| `Other` | Ops Lead (triages and reassigns) |

Routing matrix is admin-editable via a small JSON config surface owned by Ops Lead — adding a new subcategory + routing target doesn't require a code change.

### 6.3 SLA + auto-response

- **SLA: 24-hr first response.** Stored as `support_tickets.sla_due_at = NOW() + INTERVAL '24 hours'`.
- **Auto-response** sent immediately via 0028: "Your ticket #[ticket_number] has been received. A Setnayan team member will respond within 24 hours. You can track this ticket at setnayan.com/help/tickets/[ticket_number]."
- **SLA breach notification** — at the 18-hr mark, an internal Slack/email pings the assigned admin (yellow warning); at 24-hr the ticket flips to `overdue` status (red flag visible to the Ops Lead).

### 6.4 User-facing ticket tracking

Users see their tickets at `setnayan.com/help/tickets` (requires login). Per-ticket view shows the full message thread + current status + SLA countdown.

---

## 7. Admin ticket queue (lives inside 0023)

New section in 0023 Admin Console: **Support Tickets**.

### 7.1 Inbox view

- Filters: status (`open` · `in_progress` · `waiting_user` · `resolved` · `closed` · `overdue`) · assigned-admin · role · category · date range
- Default view: tickets assigned to the logged-in admin, status `open` or `in_progress`, sorted by `sla_due_at ASC` (most urgent first)
- Visual SLA flag: green (>6 hrs remaining) · amber (1–6 hrs) · red (overdue)

### 7.2 Per-ticket view

- Full conversation thread (initial ticket + all reply messages)
- User account link (admin can click into the user's profile, event history, payment history without leaving the ticket)
- Linked records: if the ticket category is `Payments`, surface the most recent `service_orders` row for this user; if `Vendors`, surface their `vendor_registrations` row; etc.
- Admin response composer (markdown, with canned-response templates)
- Status dropdown: `open` → `in_progress` → `waiting_user` → `resolved` → `closed`
- Reassign-to-other-admin dropdown (Ops Lead only)
- Two-admin gate for resolutions that imply a refund > ₱25K — composer surfaces a "Requires second-admin approval" badge and routes through `admin_approval_requests`

### 7.3 Canned responses

Ops Lead maintains a library of canned response templates (stored in a `support_canned_responses` table — admin-editable). Admins pick a template, edit inline, send. Common templates: "Payment received — service activated," "Refund processed — funds returned to [bank/GCash]," "Verification request — please upload [doc list]," etc.

### 7.4 Routing rule editor

Ops Lead can edit the category → admin-role routing matrix from `/dashboard/admin/support/routing` — no code change required to add a new subcategory or reroute an existing one.

---

## 8. Schema

```sql
-- Knowledge base articles
CREATE TABLE help_articles (
  article_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT UNIQUE NOT NULL,   -- /help/customer/paying-via-gcash
  role              TEXT NOT NULL CHECK (role IN ('customer','vendor','guest','admin','multi_role')),
  section           TEXT NOT NULL,
  title             TEXT NOT NULL,
  tldr              TEXT NOT NULL,
  body_md           TEXT NOT NULL,
  tags              TEXT[],
  related_article_ids UUID[],
  is_published      BOOLEAN NOT NULL DEFAULT FALSE,
  view_count        INT NOT NULL DEFAULT 0,
  helpful_count     INT NOT NULL DEFAULT 0,
  unhelpful_count   INT NOT NULL DEFAULT 0,
  last_reviewed_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_help_articles_role ON help_articles(role) WHERE is_published = TRUE;
CREATE INDEX idx_help_articles_section ON help_articles(role, section) WHERE is_published = TRUE;
CREATE INDEX idx_help_articles_fts ON help_articles
  USING gin(to_tsvector('english', title || ' ' || tldr || ' ' || body_md));

-- Article feedback (thumbs up/down + optional comment)
CREATE TABLE article_feedback (
  feedback_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id     UUID NOT NULL REFERENCES help_articles(article_id),
  user_id        UUID REFERENCES users(user_id),   -- nullable for anonymous public reads
  helpful        BOOLEAN NOT NULL,
  comment        TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_article_feedback_article ON article_feedback(article_id);

-- Search synonyms (admin-editable lookup)
CREATE TABLE help_search_synonyms (
  term     TEXT PRIMARY KEY,
  alias    TEXT NOT NULL
);

-- Support tickets
CREATE TABLE support_tickets (
  ticket_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number       SERIAL UNIQUE NOT NULL,   -- friendly display number
  user_id             UUID NOT NULL REFERENCES users(user_id),
  role                TEXT NOT NULL,
  category            TEXT NOT NULL,
  subcategory         TEXT,
  subject             TEXT NOT NULL,
  description         TEXT NOT NULL,
  attachment_keys     TEXT[],                   -- R2 keys
  status              TEXT NOT NULL DEFAULT 'open'
                      CHECK (status IN ('open','in_progress','waiting_user','resolved','closed','overdue')),
  assigned_admin_role TEXT NOT NULL,            -- which of the 7 admin roles
  assigned_admin_id   UUID REFERENCES users(user_id),
  sla_due_at          TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  resolved_at         TIMESTAMPTZ,
  closed_at           TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_assigned ON support_tickets(assigned_admin_id, status);
CREATE INDEX idx_support_tickets_sla ON support_tickets(sla_due_at) WHERE status IN ('open','in_progress');

-- Ticket message thread (admin replies + user follow-ups)
CREATE TABLE ticket_messages (
  message_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id       UUID NOT NULL REFERENCES support_tickets(ticket_id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES users(user_id),
  sender_role     TEXT NOT NULL CHECK (sender_role IN ('user','admin')),
  body_md         TEXT NOT NULL,
  attachment_keys TEXT[],
  internal_note   BOOLEAN NOT NULL DEFAULT FALSE,   -- admin-only note, not visible to user
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ticket_messages_ticket ON ticket_messages(ticket_id, created_at);

-- Canned admin responses
CREATE TABLE support_canned_responses (
  canned_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  category     TEXT NOT NULL,
  body_md      TEXT NOT NULL,
  created_by   UUID NOT NULL REFERENCES users(user_id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Routing rule config (single-row JSON, owned by Ops Lead)
CREATE TABLE support_routing_config (
  config_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rules_json  JSONB NOT NULL,
  updated_by  UUID NOT NULL REFERENCES users(user_id),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**RLS policies:**

- `help_articles`: SELECT WHERE `is_published = TRUE` for everyone; admins SELECT all.
- `article_feedback`: INSERT for everyone (authenticated or anon); SELECT only for admins.
- `support_tickets`: SELECT WHERE `user_id = auth.uid()` for the ticket owner; SELECT all for admins; UPDATE admin-only.
- `ticket_messages`: SELECT WHERE `EXISTS (SELECT 1 FROM support_tickets WHERE ticket_id = t.ticket_id AND user_id = auth.uid())` OR admin; `internal_note = TRUE` rows visible only to admins.

---

## 9. Content management

### 9.1 Authoring

- Articles authored by Ops Lead (and any admin with content-edit permission) in a rich-text editor at `/dashboard/admin/help/articles`.
- Editor: markdown source view + WYSIWYG preview side-by-side.
- "Save draft" sets `is_published = FALSE`; "Publish" flips it to `TRUE`.
- Schema validation: title min 8 chars, tldr min 20 chars + max 200 chars, body min 100 chars.

### 9.2 Review cadence

- "Mark as reviewed" button stamps `last_reviewed_at = NOW()`.
- Articles older than 90 days without review show "Last reviewed [date]" badge **to admins only** (never shown to end users — stale-flag is an internal signal, not a customer-visible warning).
- Stale-list dashboard at `/dashboard/admin/help/stale` lists articles by `last_reviewed_at ASC`.

### 9.3 Bulk operations

- Bulk export articles as static HTML for SEO sitemap (see section 10) + offline mirroring.
- Bulk re-tag / re-categorize via CSV import.
- Admin-only "Soft delete" — sets `is_published = FALSE`, never hard-deletes (URL slugs preserved for inbound links).

### 9.4 Versioning

V1 ships single-version articles (current state only — no history). Versioning deferred to V1.1 (`help_article_versions` table). For V1, audit log captures `updated_by` + `updated_at` at the row level.

---

## 10. SEO + structured data

### 10.1 Sitemap

- Each published article gets a sitemap entry at `/help/{role}/{section}/{slug}`.
- Sitemap generated nightly + on-publish, written to `/sitemap-help.xml` (linked from the root sitemap).
- `lastmod` = `updated_at`.

### 10.2 Open Graph + Twitter cards

Every article page renders:

```html
<meta property="og:title" content="[title]" />
<meta property="og:description" content="[tldr]" />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://setnayan.com/help/[role]/[section]/[slug]" />
<meta property="og:image" content="https://setnayan.com/og/help/[article_id].png" />
<meta name="twitter:card" content="summary_large_image" />
```

OG images auto-generated by a Cloudflare Worker that renders title + Setnayan brand mark on a 1200×630 cream background, cached on R2.

### 10.3 Structured data — FAQPage schema

For articles where `title` is question-form (heuristic: ends with `?` or starts with "How" / "What" / "When" / "Why" / "Can"), render a JSON-LD `FAQPage` block:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "[title]",
    "acceptedAnswer": { "@type": "Answer", "text": "[tldr]" }
  }]
}
```

This unlocks Google rich snippets (the "People also ask" answer box). Helpful for organic traffic on high-intent queries like "how does setnayan pay vendors" or "is setnayan safe."

### 10.4 SEO posture summary

- **Public articles, no paywall.** Every help article is publicly readable — couples and vendors Googling the problem find Setnayan's answer.
- **Canonical URLs.** Each article has a single canonical URL; redirects from old slugs preserve link equity.
- **No-index on admin section.** `/help/admin/*` returns `X-Robots-Tag: noindex` (admin-only content, never SEO-eligible).
- **Hreflang for V1.1.** When TL/CEB translations land, `<link rel="alternate" hreflang="...">` tags pair English with Tagalog/Cebuano counterparts.

---

## 11. Composition with 0019 / 0021 / 0022 / 0023

### 11.1 0019 (Chat) integration

- Admins replying to chat threads can paste help center deep-links inline: "Here's the article about refunds — setnayan.com/help/customer/payments/refunds-how-they-work." The link unfurls in the chat bubble with the article's title + TL;DR + a thumbnail.
- A future V1.1 enhancement: an admin slash command `/help [search]` in the composer that surfaces matching articles for one-click insertion.

### 11.2 Dashboard sidebar widget

Every dashboard surface (0021 / 0022 / 0023) ships a small dismissible **Need help?** widget in the bottom-left or sidebar:

- Default state: a single line "Need help? [Open help center]"
- Dismiss flips `users.dismissed_help_widget = TRUE`; widget never re-appears for that user.
- Surface-aware deep-link: clicking the widget on `/dashboard/customer/payments/orders` opens `/help/customer/payments` directly (not the help home), so the user lands on the section closest to where they are.

### 11.3 Empty-state copy references

Iterations 0021 / 0022 / 0023 reference specific articles in empty states:

- 0021 Guests tab empty state → "Add your first guest. [Learn more →]" links to `/help/customer/guest-list/adding-guests`.
- 0022 Services tab empty state → "Create your first service. [Learn more →]" links to `/help/vendor/services/creating-services`.
- 0023 Verification queue empty state → "Nothing to verify right now. [Process guide →]" links to `/help/admin/verification/processing-vendors`.

Maintained as a registry — adding/changing empty-state copy in any iteration updates a central `empty_state_help_links.ts` map so help center URLs stay synchronized.

### 11.4 0023 admin console

The Support Tickets section is a new top-level surface in 0023, alongside the existing 7 surfaces. Spec details in section 7. Adds:

- `/dashboard/admin/support` — inbox
- `/dashboard/admin/support/:ticket_id` — per-ticket view
- `/dashboard/admin/support/routing` — Ops Lead routing rule editor
- `/dashboard/admin/help/articles` — article authoring
- `/dashboard/admin/help/stale` — stale-article queue
- `/dashboard/admin/help/feedback` — article feedback analytics (thumbs-down comment digest)

---

## 12. Voice + tone

Help center copy matches the existing Setnayan editorial register: **luxurious-Filipino-modern, EN-primary, plain English** (per decision 2026-05-11).

### 12.1 Rules

- One-sentence TL;DR at the top of every article.
- Plain English. No technical jargon. If a term must be used (RLS, JWT, R2), define it inline on first occurrence.
- Active voice. Direct address ("You can…" not "Users may…").
- Numbered steps for procedural content; prose for conceptual content.
- No emojis as decoration. Lucide icons render in the UI chrome; article body is prose-first.
- No exclamation marks. No marketing clichés ("revolutionize," "unleash," "game-changer").
- Tagalog phrases allowed where they land naturally and the article is in the EN bundle's PH variant — but the V1 catalog ships English-only with TL/CEB localization deferred to V1.1.

### 12.2 Example article structure

```
Title: How do I pay via GCash?
TL;DR: Apply for a service, copy the reference code from your email, send the payment from GCash to our static GCash number, and Setnayan confirms within 24 hours.

## Step 1 — Apply for the service
[1 paragraph]

## Step 2 — Get your payment instructions
[1 paragraph, screenshot]

## Step 3 — Send the payment from GCash
[step list]

## Step 4 — Wait for confirmation
[1 paragraph]

## What if it takes longer than 24 hours?
[Linked: contact form]

## Related articles
- How do I pay via BDO?
- Where's my payment confirmation?
- How do refunds work?
```

---

## 13. Acceptance criteria

This iteration is shippable when all of the following are true:

- [ ] The public `/help` page renders with a search bar, 3 role tiles (Customer / Vendor / Guest), and a "Popular this week" strip.
- [ ] Each per-role homepage (`/help/customer`, `/help/vendor`, `/help/guest`) renders the section structure (6/6/4) with article counts, plus search and Contact us CTA.
- [ ] The admin tile + `/help/admin` is server-side gated — invisible to unauthenticated users and non-admin roles.
- [ ] Full-text search works across title + tldr + body, role-scoped, with 200 ms debounce and up to 8 suggestions.
- [ ] An article page renders the title, breadcrumb, body markdown, "Did this help?" widget, and 3 related articles.
- [ ] The contact form requires role + category + subcategory + subject + 250–2000 char description; submission creates a `support_tickets` row.
- [ ] Auto-response email goes out via 0028 immediately on ticket creation, containing the ticket number + 24-hr SLA promise.
- [ ] Tickets auto-route to the correct admin role per the routing matrix; Ops Lead can edit the matrix without a code change.
- [ ] Admin inbox at `/dashboard/admin/support` lists tickets sorted by SLA-due ascending with green / amber / red flags.
- [ ] Admin can reply to a ticket via markdown composer; reply emails the user via 0028 and appends to `ticket_messages`.
- [ ] Internal notes (`internal_note = TRUE`) are visible to admins but never to the ticket owner.
- [ ] Status transitions (`open → in_progress → waiting_user → resolved → closed`) update `support_tickets.status` and timestamp fields correctly.
- [ ] SLA breach: at 18 hr a warning lands in the admin's inbox; at 24 hr ticket flips to `overdue` and surfaces on the Ops Lead dashboard.
- [ ] V1 catalog of ~90 articles is published before launch (30 customer + 25 vendor + 15 guest + 20 admin).
- [ ] Stale-article queue surfaces articles with `last_reviewed_at` > 90 days; never shown to end users.
- [ ] Sitemap `/sitemap-help.xml` lists every published article; rebuilt on publish + nightly.
- [ ] FAQPage JSON-LD renders on question-form article pages; OG cards render with title + TL;DR + auto-generated OG image.
- [ ] Sidebar "Need help?" widget renders on every dashboard surface (0021/0022/0023), is dismissible, and deep-links to the closest help section.
- [ ] RLS policies prevent ticket-owner cross-reading and admin-section public reads — verified with a Supabase RLS test suite.

---

## 14. Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-05-12 | **Help center is its own iteration (0029), not a sub-section of 0023.** | Help articles + ticket queue have enough surface area (public SEO pages, per-role taxonomy, content management, search infrastructure) that bundling into 0023 would balloon that iteration. 0023 absorbs the ticket queue as a new admin section, but everything customer-facing lives in 0029. |
| 2026-05-12 | **Public help articles + private admin section, role-gated.** | SEO benefits (couples Googling "how does setnayan refund work" → land on a real answer) require articles to be publicly indexable. Admin articles cover internal ops (BIR reconciliation rules, refund > ₱25K two-admin flow) and must never leak — gated server-side, `X-Robots-Tag: noindex` on `/help/admin/*`. |
| 2026-05-12 | **Structured contact form replaces email-Setnayan.** | Free-form email creates an undifferentiated triage queue. Structured form (role + category + subcategory + subject + description) routes automatically + populates `support_tickets.assigned_admin_role` correctly — admin queue is pre-sorted by responsibility before a human looks. Also enforces 250-char min so admins don't waste cycles asking for more context. |
| 2026-05-12 | **24-hr SLA with 18-hr warning + auto-flag at breach.** | Matches Setnayan's payment-reconciliation SLA (24 hours per the V1 payment model). One consistent SLA across all support routes — couples and vendors learn the rhythm once. Internal warning at 18 hr gives admins a 6-hr window to act before public-facing breach. |
| 2026-05-12 | **V1 ships English-only articles; TL/CEB deferred to V1.1.** | Postgres `to_tsvector` doesn't ship Tagalog or Cebuano configurations natively; full-text search would degrade if we try to ship multi-locale articles before solving the search-index problem. EN-primary is acceptable per the 0015 locale decision (EN is the default landing for every visitor regardless of geo-IP); TL/CEB localization batched into V1.1 as a content-translation project, not a launch-blocker. |
| 2026-05-12 | **No article versioning in V1.** | Versioning (history table + diff view + rollback) is a real engineering effort. V1 ships single-state articles with `updated_by` + `updated_at` audit trail. If we discover Ops Lead is reverting articles frequently, V1.1 adds full versioning. Speculative until then. |
| 2026-05-12 | **Stale-flag is admin-only.** | Showing "this article was last reviewed 7 months ago" to a couple reading about how to pay would undermine trust. Admins see it as a content-ops signal; users see only the article. If the article is actively wrong, the right fix is to update it, not warn the user. |
| 2026-05-12 | **Routing matrix is admin-editable JSON.** | Adding a new subcategory (e.g. "Custom Monogram Pack ordering issue" under `Other`) shouldn't require a code change + deploy. JSON config + a small editor UI for Ops Lead is the right escape valve. Audit trail captures who changed what. |
| 2026-05-12 | **Canned responses are first-class admins-only content, not hard-coded.** | Same logic as the routing matrix. Ops Lead curates a library of templates; admins use them inline. Cuts response-time for the most common categories of ticket. |
| 2026-05-12 | **FAQPage schema.org structured data on question-form articles.** | Google rich snippets ("People also ask") drive material organic traffic on high-intent support queries. Cheap to add (one JSON-LD block per article); meaningful SEO upside. |

---

## 15. Companion specs and cross-references

- `0000_app_shell_and_navigation/` — sidebar **Need help?** widget lives in the chrome.
- `0015_main_website/` — marketing site footer links to `/help`; `/help` shares the same brand chrome.
- `0019_communications/` — admins can paste help center deep-links into chat replies; future slash command for inline article picker.
- `0021_couple_dashboard_fully_purchased/` — empty-state copy references specific customer articles.
- `0022_vendor_dashboard/` — empty-state copy references specific vendor articles.
- `0023_admin_console/` — absorbs the **Support Tickets** section + article-authoring surface as new admin tabs.
- `0028_email_notifications/` — sends ticket creation auto-response + admin reply emails + SLA breach warnings.
- `CLAUDE.md` — decision log entry 2026-05-12 "0029 Help Center / FAQ drafted."

---

[View this iteration's Word document](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan%20App/0029_help_center/0029_help_center.docx)
