# The Story & the Story Maker — build documentation
**Dated 2026-09-07 · Setnayan · supersedes the newspaper spine of `Editorial_Experience_Spec_2026-06-18.md`**

---

## What this is

Everything needed to build two surfaces:

| | What | Who it is for | Where it lives |
|---|---|---|---|
| **The Story** | The public page an event becomes | guests, then anyone | `/[slug]` (public) |
| **The Story Maker** | The desk where the host makes it | the host only | `/dashboard/[eventId]/story` |

Two working prototypes are in `prototypes/`. Open them in a browser; they are the design,
not decoration. Everything in these documents is either **(a)** verified against shipped code,
**(b)** an owner ruling with its date, or **(c)** marked as an open question. Nothing else.

## The one-sentence thesis

Every gallery on the market is a grid, every video is a bar, every wedding page is a list of
sections. **Nobody has put the photos, the words, the suppliers, the room and the films on one
axis: the clock of the event.** So the page *is* the event — everything filed under the moment
it happened, and the light of the page moves from morning to night as you read.

Checked against YouTube chapters and its product shelf, live blogs (BBC/Guardian "as it
happened"), Polarsteps, Pic-Time Scenes, The Knot Real Weddings, Spotify Wrapped, and
scrollytelling practice. None of them combines time-as-spine + per-moment supplier credit +
the room lit by the minute + colours from the host's own saved board.

## Read in this order

| File | What it settles |
|---|---|
| `01_The_Story.md` | Everything the public page is and does |
| `02_The_Story_Maker.md` | Everything the host's desk is and does |
| `03_Data_Requirements.md` | Every read and write, and the seven things that do not exist yet |
| `04_Consent_And_Privacy.md` | RA 10173, surface by surface — read before any of the rest |
| `05_Occasions_Registers_MultiDay.md` | Words follow the occasion; the solemn register; days |
| `06_Supplier_Tiers.md` | Listed vs Featured, and the rule that never bends |
| `07_Open_Questions.md` | Eight decisions that are the owner's, not engineering's |
| `08_Build_Order.md` | The sequence, with acceptance criteria per step |

## Rename — decision, 2026-09-07

**"Editorial" is retired from customer language.** The surface is **the story**; the tool is
**the Story Maker**. The owner already used both words in a code comment on the shipped editor
(*"the story maker should be very easy to handle"*), and the dashboard already sorts events onto
**Untold** and **Told** shelves. The route follows: `/dashboard/[eventId]/website/editorial` →
`/dashboard/[eventId]/story`.

`Editorial` survives only as internal vocabulary already baked into table and function names
(`event_editorial`, `editorialAllowsEventType`, `EditorialSections`). Renaming those is not part
of this build and must not be attempted inside it.

## The six locks (owner, 2026-09-07)

1. **Grows privately, publishes once.** Three layers, one URL — see `01` §2.
2. **Colours come from the host's saved mood board**, neutral fallback, contrast-corrected.
3. **Supplier tiers** — Listed (free) / Featured (paid). Paying never changes *whether* a
   supplier is credited, only how richly.
4. **A few written minutes + every bar on the dial opens**, with or without a write-up.
5. **A per-guest 9:16 share card** is in scope.
6. **Assigned seats exist only while the reception venue is in use.**

## The five in-session rulings (owner, 2026-09-07)

- **A person's day is exclusive to their own account.** No name field, for anyone, ever.
- **A capture's minute is the shutter, not the upload** — *"when we get the photos and snippets,
  we know. but the guest does not need to know."* Read it on ingest; never ask, never surface.
- **Print-ready and social share are first-class.**
- **The next-event teaser is the BACK COVER, outside the locked close** — and **naming a next
  event is the host's choice**, never a default. A story that ends at the last word is finished.
- **Choosing the next event happens in the Story Maker, never on the published page.**

## Provenance

Design and review, 2026-09-07. A seven-lens adversarial review (101 raw findings → 45 merged →
39 confirmed + 11 completeness-critic findings, each verified by an independent skeptic) is
folded in; where a finding changed the design it is cited inline as **[review]**. Three of its
findings were blockers and are the reason several rules below read as strictly as they do.
