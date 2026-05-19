[Setnayan
· Help](/)

[Sign in](/login)[Create account](/signup)

Help & support

# How can we help?

Step-by-step guides for everything Setnayan ships today. Don’t see what
you’re looking for? Send us a message at the bottom of the page — we’ll
reach back within one business day.

Topics

[Getting started](#getting-started)[Guest list](#guests)[Invitation
site](#invitations)[Vendors & budget](#vendors-budget)[Mood
Board](#mood-board)[Messaging](#messaging)[Orders &
payments](#orders-payments)[Account & privacy](#account-privacy)[Contact
support →](#contact)

## Getting started

- ### Sign up as a couple

  On the sign-up page, pick "Couple" as your account type, enter your
  email, and choose a password (≥ 8 characters). You'll land on the
  dashboard immediately — V1 auto-confirms accounts so you don't need to
  wait on a confirmation email. Once Resend SMTP is wired, real email
  verification returns.

- ### Sign up as a vendor

  Same form, pick "Vendor" instead. You'll land on /vendor-dashboard
  with a profile editor. Fill in your business name, services, and
  contact email — couples find you by the contact email you set there.

- ### Create your event

  From /dashboard, click "Create event". Pick the event type (Weddings
  only in V1), enter a display name (this is what guests + vendors see),
  and the date. You can edit everything later from the Invitation tab.

- ### Event ID vs slug

  Every event has a Setnayan ID like S89E-AB12CD3456 (used internally)
  and a public slug like maria-and-juan (used in your invitation URL).
  The slug is editable on the Invitation tab. Old slugs auto-redirect
  for 90 days.

## Guest list

- ### Filipino wedding roles

  V1 ships 18 canonical roles: maid/matron of honor, best man,
  bridesmaids, groomsmen, principal sponsors, candle/veil/cord/coin
  sponsors, ring/bible/coin bearers, flower girl, officiant, lectors,
  soloists, and generic guest. Each is assignable from the Add Guest
  form.

- ### How plus-ones work

  When you tick "Allow plus-one" on a guest, Setnayan creates a second
  guest row linked to the primary. The +1 has its own QR code and can
  RSVP independently. If the +1 is TBA, the primary names them on first
  scan via the welcome flow.

- ### Import guests from CSV

  On the Guests page, hit "Import CSV". Paste your spreadsheet (max 200
  rows per import). Required columns: first_name, last_name. Optional:
  side, role, group_category, email, mobile, meal_preference,
  plus_one_allowed. Bad rows are flagged; valid rows insert atomically.

- ### Share an invite link

  Each guest gets a personal URL with their QR token. From the
  Invitation tab, you can either print the entire QR sheet (one per
  guest, A4 layout) or copy individual links from the guest table.
  There's also a generic "anyone with the link" event-join URL for
  ad-hoc invites.

## Invitation site

- ### What's the invitation site?

  The public URL at setnayan.com/\[your-slug\] is where every invitation
  goes. Guests land here when they tap their personal link or scan their
  QR. The site shows your event details, an RSVP form, countdown, venue
  map, dress code, and more.

- ### Customize the QR monogram

  From the Invitation tab → Branding section. The monogram is the text
  in the center of every guest's QR code (default: first letter of each
  side joined by &, e.g. "M & J"). Override the text and pick an accent
  color. Every guest's QR rebuilds instantly.

- ### Print the QR sheet

  From the Invitation admin, click "Print sheet" — opens an A4 grid with
  each guest's branded QR + name + role. Print at 100% scale, no
  margins. Cut along the dashed lines or fold into card inserts.

- ### Re-issue a guest's QR code

  If a guest loses their link or shares it, you can invalidate the old
  token. On the Invitation admin, find the guest row → "Re-issue token".
  Old QR stops working immediately; new QR is ready to share.

## Vendors & budget

- ### Track a vendor

  On the Vendors page, click Add a vendor. Pick a category from the 28
  standard options (or pick "Miscellaneous" for anything off-list). Set
  a total cost + deposit if you have them. Vendors move through a
  6-stage flow: considering → shortlisted → contracted → deposit paid →
  delivered → complete.

- ### Budget line items

  On the Budget page, each vendor card has two columns. Left: itemized
  line items (Deposit, Balance, Tip, etc.) with optional due dates.
  Right: actual payments you've logged. Stats at the top roll up total
  budget, paid, remaining, and what's due in the next 30 days.

- ### Export budget due dates to your calendar

  On the Budget page header, click "Export upcoming dates (.ics)". You
  get an RFC 5545 calendar file with one event per unpaid line-item due
  date. Import to Google Calendar, Apple Calendar, or Outlook — any
  standard ICS-aware app.

## Mood Board

- ### Palette tiers

  Mood Board groups your palettes into three families: Venue (Ceremony
  1-3 colors, Reception 3-6 with dominant/supporting/accent slots),
  Couple (Bride 1-3, Groom 1-3), and Roles (Wedding Party 3-6, Sponsors
  1-3 each, Plain guests 3-6). Role palettes only show when you have
  guests in that role.

- ### How the palette shows up in the guest list

  Each role chip in the Guest List grows a small colored dot when you've
  set a palette for that role. The dot shows the first color of the
  palette as a visual signal — see the full palette on the Mood Board
  page.

## Messaging

- ### Start a thread with a vendor

  On the Messages tab, type the vendor's contact email. If they have a
  Setnayan vendor profile with that email, Setnayan creates a thread
  between you both. Re-opening a thread between the same event + vendor
  resumes the existing conversation — no duplicates.

- ### Vendors don't see your email

  When a vendor opens a thread, they see only your event's display name
  and date — never your email or personal name. You control how you're
  identified by the display_name you set on your event. This is locked
  behavior in V1.

## Orders & payments

- ### How to order a Setnayan service

  Open the Orders tile from Home. Hit "New order", describe what you
  need, and propose a budget. The Setnayan team reviews and confirms the
  price; you receive a notification with the confirmed total and a
  reference code.

- ### How payments work

  Once your order is quoted, the order detail page shows payment
  instructions. Send the amount via BDO or GCash (merchant details
  emailed once your order is confirmed). Always include the reference
  code in transfer notes so we can match it automatically. Then log the
  payment on the same order page with the bank reference + a screenshot
  URL.

- ### Reference codes

  Every order has a short reference code (looks like SNAB12CD34). It's
  how Setnayan matches your bank transfer to your order. Paste it into
  the transfer notes — bank statements ingest it automatically and admin
  reconciles within one business day.

## Account & privacy

- ### Switch your dashboard theme

  On Profile, pick one of four themes — Setnayan Default, Victorian,
  Classy, iOS. The whole dashboard re-skins instantly. Public invitation
  site stays on Setnayan Default regardless.

- ### Export your data

  On Profile → Privacy & data → "Download .json". You get a JSON file
  with your profile, event memberships, vendor profile (if any), and
  every chat message you authored. Audit log, R2 media, and payment
  records aren't in V1 (flagged in the export).

- ### Delete your account

  On Profile → Privacy & data → expand the Delete my account block →
  type DELETE to confirm. We soft-delete the account and sign you out.
  Internal admins can restore within 30 days; after that, deletion
  becomes permanent. RA 10173 right-to-erasure compliant.

## Reach the team

Send us a note and we’ll reply to the email you provide. Useful for
anything not covered above — billing questions, vendor onboarding,
custom quotes, bug reports.

Your emailYour name (optional)

TopicChoose one (optional)I’m a couple planning an eventI’m a
vendorBilling or paymentsBug reportFeature requestOtherSubjectMessage

Send
message

Setnayan
· setnayan.com

[Home](/)[Help](/help)[Sign in](/login)
