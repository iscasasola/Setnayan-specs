# TWO MORE SESSIONS, SAFE TO RUN NOW

> Paste the **shared header** from `SESSION_PROMPTS_2026-09-09.md` first, then one block.
>
> **A** touches the supplier's customer card. **B+C** touches the supplier's thread page.
> They do not overlap each other, S6 (the bench), S7 (bench sort) or S9 (follow gate).
>
> ⚠ **B+C must not run beside S2 (Decisions)** when that starts — same file.

---

## A · A FILE SHARED IN CHAT CAN BE FOUND AGAIN — sonnet · medium

```
A supplier's customer card has a Files tab. It lists contracts and handover deliverables —
and NOT the files the couple actually sent them in the conversation. So a supplier hunting
for the contract a couple attached last week cannot find it there, and the tab gives no
hint that it is looking in the wrong place.

The tab's own comment explains why, and the reason has expired:
  "(a light 'files shared' view alongside contracts, since 0019 thread attachments are
   deferred in V1 — there is no thread-attachments table to read)"
Thread attachments SHIPPED. `chat_messages` carries `attachment_name`, `attachment_mime`,
`attachment_size_bytes` and the stored reference. Read
apps/web/app/vendor-dashboard/clients/[eventId]/page.tsx (`FilesTab`, and the empty state
that currently says "share other files in your chat").

BUILD: the Files tab also lists every file shared in that couple's conversation — name,
type, size, who sent it, when — newest first, alongside the contracts already there.

🔒 THE ONE RULE THAT MATTERS: NEVER RENDER THE STORED REFERENCE, AND NEVER A PUBLIC URL.
Chat attachments moved to private storage on 2026-09-09. A file is fetched ONLY through
`/api/chat/attachment/<message_id>`, which re-proves the caller is a party to that thread
on EVERY request and then redirects to a short-lived signed URL. Read that route before
you write a link. A raw reference in an <img> renders a broken glyph; a stored public URL
is the exact defect that route exists to prevent.

⚠ TWO COLUMNS, AND YOU MAY MEET EITHER. `attachment_r2_key` is the private reference
written since 2026-09-09; `attachment_url` is the legacy public column, which no writer
sets any more and which production has never used. Handle both — the route already does.
If `attachment_r2_key` does not exist in your checkout, PR #5339 has not merged yet: say
so and build against `attachment_url` alone rather than guessing.

⚠ MEASURE BEFORE YOU BUILD AN EMPTY SCREEN. Production has ZERO chat attachments, ever.
So you cannot verify this by looking — the empty state is what everyone will see today.
Make the empty state honest ("No files shared yet") and make sure a REFUSED read does not
render as an empty one: in this app a denied query returns no rows, so "no files" and "you
were not allowed to see them" look identical unless you check the error.

⚠ Do not widen any read. The card is already scoped to this supplier's own booking; the
attachment list must ride that same scope, not a new one.
```

---

## B+C · EVERY GUEST COUNT SAYS WHICH COUNT, AND THE DATE SAYS WHO ELSE WANTS IT — opus · high

```
TWO changes on the supplier's conversation page,
apps/web/app/vendor-dashboard/messages/[threadId]/page.tsx.

── B · WHICH GUEST COUNT IS THIS? ──────────────────────────────────────────────────────
Two different numbers are stored: what the couple asked with (`pax_at_inquiry`) and what
they are planning now (live pax / `pax_current`). The page shows BOTH, in different places,
and only one of them says so:

 • the header labels it — "~170 guests · was 150 at inquiry"
 • the accept card does NOT — `const pax = thread.pax_at_inquiry ?? thread.pax_current`
   renders a bare "150 pax" beside a header saying 170
 • the quote builder is seeded from `pax_at_inquiry ?? headerPax`
 • the customer rail's Guests row comes from `buildCustomerEventSummary`
   (apps/web/lib/customer-event-summary.ts)

The owner caught this on a drawing and it is real in the shipped page. MONEY RIDES ON IT:
a supplier quotes against one number and is paid against the other, which is why a
"guest count changed — accept or hold your price" card already exists.

BUILD: every place that shows a guest count says WHICH number it is. Do not delete either
one — both are true, and the difference is the point. One helper that formats a count with
its provenance, used everywhere, so a fifth surface cannot invent a sixth wording.

⚠ Do not "simplify" by showing only the live count. The quote was made against the old
one; hiding that is how the two numbers silently diverge.

── C · WHO ELSE WANTS THIS DATE ────────────────────────────────────────────────────────
Owner: "Target date for vendors will show who are also inquiring for that day so they do
not need to browse their calendar?"

On the TARGET DATE row of the customer rail, and on the accept card, say how many OTHER
couples are asking this supplier about the same date, and how many dates they already hold
that week.

🔑 RULE 0 — HALF OF THIS ALREADY EXISTS AND YOU MUST NOT REBUILD IT.
`get_vendor_same_day_bookings(p_event_id uuid, p_day date)` is a shipped SECURITY DEFINER
function that returns this shop's OTHER bookings on a given day. It is used today by
apps/web/app/[slug]/_lib/supplier-desk.server.ts, but only when the event is happening
TODAY — it takes a day parameter and generalises. Read that call site and its db test
(apps/web/tests/db/the-supplier-bridges-two-rooms.db.test.ts) before writing any SQL.
⚠ It deliberately does NOT union `vendor_team_members`, and that exclusion is load-bearing
— do not "fix" it.

The other half — how many other couples are ASKING about that date — is the supplier's own
inquiries and is a NEW, SMALL, BATCHED read. One query, not one per row.

🔒 THREE BOUNDARIES, ALL ABSOLUTE:
 • COUNTS, NEVER NAMES. "2 other couples asking about 18 Dec", never who they are. This is
   the supplier's own pipeline, so the data is theirs — the names are not ours to spread.
 • SUPPLIER SIDE ONLY. This line must never render on the couple's view of the same
   thread. Write a test that fails if it does.
 • ⚠ A COUPLE-FACING VERSION ALREADY SHIPS ELSEWHERE — a "N couples inquired for your date"
   line on the marketplace bench, floored at 3. That runs the OPPOSITE direction and was
   never ruled on. Do NOT touch it, and do NOT reuse its shape as permission.

── BOTH ──────────────────────────────────────────────────────────────────────────────
Design is BINDING: prototypes/chat_interface_v4_2026-09-09.html — the supplier frames show
both of these. Port them; do not redraw.

Guard what you build, then MUTATION-TEST each assertion by occurrence count. In particular
write one that fails if any surface renders a guest count without its provenance, and one
that fails if the who-else-wants-it line appears in the couple's tree. A guard that matches
a string anywhere in a file is decoration — anchor it to the render.
```
