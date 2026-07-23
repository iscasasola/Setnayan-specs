# User Home Redesign — Council Verdict (2026-07-14)

> The make-or-break screen: the signed-in **user home / account hub** — the switchboard that sits ABOVE every event, space, and memory (each event keeps its own dashboard). Current live surface = the `/dashboard` launcher (Your Events · Your Year · Your Spaces · Your Account {Profile · People · Memories Hub · Setnayan AI} · Life-Flash · Your Story).
>
> This verdict synthesizes a 5-member internal council **plus** an external take from Google AI. It resolves the two live disagreements, collapses the redundancy, and gives separate desktop + mobile directions. **Two items need owner sign-off before build — see § 11.**
>
> **✅ BUILT 2026-07-15** — the four-surface remodel shipped to `apps/web` as **PR #3240** (launcher `page.tsx` + `home-command-bar.tsx` + `account-switcher.tsx`), after the composable-event foundation (**PR #3239**, merged + prod-applied). 22-agent adversarial review, 15 findings fixed pre-PR. The expand-inline lock amendment is logged in `DECISION_LOG.md` (2026-07-15). People-model + Communities/Samahan + the premium mock's preview states remain design-only (next build). Final design artifact: `home-final-fable`.
>
> **⛔ SCOPE — this is an IN-PLACE FIX of the existing `/dashboard` home, NOT a new screen.** Everything below reorganizes the *current* home and its zones on the *same route and surface* — no parallel screen, no `-v2` route, no throwaway prototype layered on top. The § 12 table is the fix stated as *current-zone → target*. Mockups will be a **before/after of the live page**; implementation lands as a **refactor PR on the existing home**, never a new prototype route.

---

## 1. The panel

| Voice | Owns | Landed on |
|---|---|---|
| The Architect | Structure / IA spine | 3 lanes (Plan · Remember · Spaces) under a thin "You"; conditional Spaces; no global switcher |
| Google AI (external) | Framework | "Two Dialects" (Logistics vs Legacy); 4 pillars (Ledger · Studio · Flashback · Compass); persistent switcher |
| The Mobile Designer | Phone | 3 tabs + center Create; ONE hero next-action; conditional avatar-sheet switch |
| The Desktop Designer | Wide screen | Persistent rail + asymmetric multi-column body; "everything clickable enters its own shell" |
| The Emotional Designer | Feeling / memory | Rename memory → **Alaala**; **status-inverting home** (whisper while planning, sing when quiet) |
| The Strategist | Adjudication | ONE event lane (no hard split); **capability-gated** switcher; media has one home |

**The striking result:** the internal Architect and external Google converged on ~80% of the structure independently (split by psychological state · merge the event trio · merge the media trio · conditional business surface · demote governance to a drawer). That left exactly two real forks, both now settled below.

---

## 2. Headline verdict — the reconciled spine

**One user. One time-sorted event lane where each event is a single object that ages from task-list → gallery and keeps its own media. The home has two emotional postures that auto-swap by life-stage. The only thing that ever branches the home is CAPABILITY — a doorway switcher that exists solely for people who actually have more than one doorway.**

Three surfaces, not seven zones:

| Surface | The ONE job | Presence |
|---|---|---|
| **The Lane** (events) | The single place all your events live, sorted by time, rendered by lifecycle. Upcoming lead with open loops (actionable); concluded flow below as galleries. | Always |
| **Alaala** (memory) | Make you *feel* the accumulation of your life without organizing a thing — one gallery + lenses + the Life-Flash hero render. | Always (graceful empty state when new) |
| **Spaces / Switcher** (doorways) | Flip the whole home between Customer / Vendor / Admin contexts, or step into a backend. | **Conditional** — only if `doorways > 1` |

Everything else — Profile, People, Setnayan-AI governance — collapses into a **"You" drawer** behind the avatar. It is identity + settings, never a co-equal destination.

---

## 3. Fork #1 — how events are organized → **ONE lane, status-rendered** (not two lanes by status)

**Decision: reject the hard Plan/Remember split. One event object with a lifecycle.**

The decider is the **long post-event tail**. After the wedding day, an event still has open vendor payments, photo delivery, thank-you videos, reviews — *and* it's already becoming a gallery. Status isn't a binary switch, it's a gradient. A hard Plan→Remember "graduation" strands a just-concluded wedding half-in-both and manufactures the exact *"where did my wedding go?"* confusion this redesign exists to kill.

A couple never thinks "my wedding-the-tasklist" and "my wedding-the-gallery." They think **"our wedding"** — busy now, precious later. So it stays one card that slides down the timeline as it ages, open loops still on it, gallery filling in.

**But** we keep the split's best idea as *presentation*, not *structure*:
- **Desktop** renders the one lane asymmetrically — active events as the wide **"In Motion"** hero, concluded events + montage as a calm full-width **Alaala band** below.
- **Mobile** foregrounds active work on the default tab and lets Alaala be its own tab — but it's the same underlying object, never a duplicate.
- **Lenses** (By Time · By Person · With Me) give the "Remember" register without a separate destination.

**Where Google's "Flashback pillar" is rejected:** a cross-event media feed *beside* event galleries means "our wedding photos" are reachable twice — recreating the redundancy. Fix: **media has exactly one home (inside its event).** Life-Flash is a *derived render*, not a second copy of every photo — it earns a hero band, never a navigation pillar.

---

## 4. Fork #2 — doorways → **capability-gated switcher** (not "for everyone," not "never")

**Decision: switcher visibility is a computed property — `count(distinct doorway) > 1`.**

- **Single-doorway users (the ~95%)** see no switcher and no "Spaces" concept at all. Their home is only about them. A "Customer ▾" dropdown for someone planning one birthday is cognitive tax that implies hidden modes ("am I missing a feature?").
- **Multi-doorway users (the multi-hyphenate — bride who is also a florist; admin with a personal event)** get a **persistent, prominent switcher** that flips the entire home context. Digging into a card every time you flip between "my wedding" and "my shop's leads" is unusable at their frequency — Google is right about that.
- **Defaults to the personal / Customer context.** Going to a backend is a deliberate one-tap move — this preserves the persona / least-privilege boundary (an admin never *accidentally* acts as admin; personal events never leak into admin surfaces).
- Each context is clean: a bride's wedding and her shop's bookings are **never co-mingled in one feed.**

This honors Google's real point — *don't bury "Switch to Vendor" in a generic SaaS dropdown; it breaks the multi-hyphenate Filipino-creator identity* — while sparing the majority the clutter the Architect warned about.

---

## 5. The memory dimension → **Alaala**

The Emotional Designer's independent recommendation to name it **Alaala** (ah-lah-AH-lah — "remembrance / keepsake") **matches an existing owner-locked direction** (`Alaala consolidation`: memory = ONE gallery + a family of renders). The council arriving there blind is strong validation. → **§ 11 note A.**

**Structure of Alaala** (kills the 3-way media redundancy without flattening the magic):
- **Substrate:** the single gallery of every photo + 5s clip (Papic + delivered media).
- **Lenses:** By Time · By Person · **With Me** (absorbs *Your Story*). **People** is not a fourth zone — it's the primary *door into* memory ("everything with Lola," "everything with my inaanak").
- **Hero render:** **Life-Flash** survives — as the cinematic film that plays *on top* of the room, not a sibling zone.

"Memories Hub" and "Your Story" die as names. Alaala's one job: *the accumulation of your life, with zero organizing asked of you.*

**Reject "Flashback" as the name** — it's generic, Apple-derivative, and in English carries a faint trauma connotation. Alaala is unmistakably Setnayan.

---

## 6. The behavioral spine → the **status-inverting home**

This single rule resolves the delight-vs-utility war structurally instead of arguing it. The home has **two postures, auto-switched by life-stage:**

- **Planning (e.g. 5 months out, stressed):** Logistics leads. Top is one breath — *"here's what needs you"* — never a to-do avalanche. Alaala is a **thin warm ribbon** (*"12 moments gathered so far"*) — the emotional seed that today's chaos is already becoming tomorrow's film. It never nags.
- **Day-of:** Home dissolves into presence — *"Today is the day."* Everything collapses to the live event; Alaala goes to a quiet "moments are arriving" pulse. No scrapbooking prompts.
- **Years later / quiet (no active events):** The home **inverts** — Alaala rises to hero, full-bleed, anniversary- and season-aware (*"One year ago today — Maria & Jun, Tagaytay"*). This is where delight lives loudest.
- **Cold empty state:** Never show empty shelves labeled "Memories / Life-Flash" — that makes the product's heart look broken on day one. Show one warm promise: *"Your Life-Flash begins with your first photo."* Sell the film-to-come; never expose the void.

**Emotion whispers during logistics; it only sings once logistics is done.**

---

## 7. Desktop direction — kill the single centered column

The current desktop is one narrow centered column of stacked lists — *that* is why it reads like a settings page. Fix = **persistent rail + asymmetric editorial body**, and the rule **"everything clickable enters its own focused shell"** (event dashboard / shop backend / admin console); the home is the *only* convergence surface, and the rail persists across every shell so you can jump back or sideways.

```
┌────────────┬──────────────────────────────────────────────────────────────┐
│  SETNAYAN  │  Kumusta, Maria      [ ⌘K  Search everything ]      + Create ▾ │
│            │  Tuesday · Jul 14                                       🔔 3    │
│ ◐ You      ├──────────────────────────────────────────────────────────────┤
│  Maria C.  │  IN MOTION · active + upcoming             ┌─────────────────┐ │
│            │  ┌──────────────────────────┐ ┌─────────┐  │ THIS WEEK       │ │
│ ▸ Home     │  │ ♥ Maria & Ben Wedding    │ │ Nina 18 │  │ Thu Menu due    │ │
│            │  │ Nov 22 · 128d            │ │ Debut   │  │ Fri Ben tasting │ │
│ SPACES     │  │ ● 42 RSVP ● ₱18k due     │ │ Mar 3   │  │ Sun RSVP close  │ │
│ ▸ Bloom Co │  │ ● 3 vendor msgs          │ │ ●12 ips │  ├─────────────────┤ │
│   shop     │  └──────────────────────────┘ └─────────┘  │ SPACES          │ │
│ ▸ Admin    │  ┌──────────────────────────┐ ┌─────────┐  │ Bloom Co ·3 new │ │
│   console  │  │ ⚑ Lola's 80th            │ │ + Plan  │  │ Admin ·5 queue  │ │
│            │  │ Aug 9 · 26d · seating!   │ │ a new   │  ├─────────────────┤ │
│ ────────── │  └──────────────────────────┘ └─────────┘  │ ✦ SETNAYAN AI   │ │
│ ✦ Setna-AI │                                            │ "Book caterer   │ │
│ ⦿ People   │                                            │  — 26d left"    │ │
│ ⚙ Profile  │                                            └─────────────────┘ │
│            ├──────────────────────────────────────────────────────────────┤
│            │  ALAALA · your memories                           View all →  │
│            │  ┌──────────────────────────────────────────────────────────┐│
│            │  │ ▶ LIFE-FLASH 2026   your year in 90s   [cinematic band]  ││
│            │  └──────────────────────────────────────────────────────────┘│
│            │  [Jun·Binyag] [Apr·Reunion] [Jan·NYE] [2025·Wedding] →        │
└────────────┴──────────────────────────────────────────────────────────────┘
```

- **Left rail (~240px, persistent):** identity ("You") → Home → **SPACES** group (each shop + admin console you belong to — *conditional membership*) → utility footer (Setnayan-AI · People · Profile · ⌘K). The **rail is the switcher** — no global dropdown.
- **Body (asymmetric grid):** `2fr` **In Motion** (active events with live loop badges) · `1fr` stacked micro-cards (**This Week** dated agenda across events · **Spaces peek** with unread counts, deep-linked to the exact sub-surface · **Setnayan-AI** nudge). Full-width **Alaala** band beneath.
- **Detail scales UP, not out:** desktop *unfolds mobile's tabs into simultaneous panels* and reveals per-card metadata inline — additive panels, not a blown-up column.
- **Power-user affordances:** `⌘K` command palette (jump to any event/shop/guest/vendor/setting *and* run actions like "mark ₱18k paid"), `⌘1…⌘9` rail jumps, `⌘\` collapse rail to icons, notification badges on rail items.

> ⚠ The persistent rail collides with an owner lock — see **§ 11 note B**.

---

## 8. Mobile direction — ruthless thumb-first switchboard

**3 destinations + 1 action = the 4-target ceiling a phone can carry.** Turn the passive switchboard into a *do-next engine*: lead with the single most urgent open loop across all events.

```
┌─────────────────────────────┐
│ (M)  Kumusta, Maria      ⌄● │  avatar tap = You / switch (● = multi-doorway)
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ NEXT · Kasal M & Jomar  │ │  ← ONE hero next-action
│ │ 42 days · 3 overdue     │ │
│ │ ▸ Confirm caterer final │ │
│ │        [  Do this  ]    │ │
│ └─────────────────────────┘ │
│ Active events       see all │
│ ┌───────┐┌───────┐┌──────   │  ← horizontal swipe rail
│ │◐ 68%  ││◔ 20%  ││◕ 95%    │
│ │Kasal  ││Debut  ││Binyag   │
│ │42d·3! ││90d    ││8d       │
│ └───────┘└───────┘└──────    │
│ Your year   ‹ Jul Aug Sep › │  ← demoted to a date ribbon
│ ┌─────────────────────────┐ │
│ │ 🏪 Your Shop · 2 new    →│ │  ← CONDITIONAL (multi-doorway only)
│ └─────────────────────────┘ │
├─────────────────────────────┤
│  Plan   Alaala   (+)    You  │  ← 3 tabs + raised center Create
└─────────────────────────────┘
```

- **Bottom bar:** `Plan` · `Alaala` · **`(+) Create`** (raised center) · `You`. Create is the growth-critical, joyful "start something" action Google's `[Ledger | Flashback | Account]` bar omitted.
- **Doorway switch:** avatar tap → **bottom sheet**. Single-doorway = only account items. Multi-doorway = `Customer ✓ / Vendor / Admin`; picking one **swaps the entire chassis** to that backend's tabs (< 1.5s). No persistent switcher tab.
- **Above the fold:** identity strip → ONE hero next-action → active-events rail → *Your Year* demoted to a slim date ribbon → conditional Spaces card.
- **Accessibility + low-signal (PH venues):** ≥48dp targets, frequent actions in the lower-two-thirds thumb zone; **days-to-go and %-planned computed client-side** from cached event date + task state (correct with zero signal); cached poster frames render instantly; optimistic task check-offs queue to sync; **skeletons not spinners.**

---

## 9. Filipino-luxury signature (taste = subtraction)

- **Taglish at the emotional seams only.** Time-aware greeting (*"Magandang umaga, [name]"*) softening to English for function — never a fully Tagalog UI. And the brand's own gift: a soft **"Set na 'yan."** as the completion micro-moment when a task/event closes.
- **Memory organized the Filipino way — by kapamilya, across decades.** Ninong/ninang, inaanak, family clusters as first-class lenses; the graph *knows* a binyag → debut → kasal arc across fifteen years. The multigenerational life arc is the most Filipino thing to honor.
- **Motion of fabric and paper, not glass and neon.** Entering a memory is a soft **veil-lift** (echo the Save-the-Date veil), warm paper-grain, slow editorial cross-fades like turning album pages.
- **Gold, not chrome; serif for names and dates** ("the 14th of July"). One restrained recurring motif (capiz shimmer / sampaguita) used *only* as a "loading a memory" glimmer — never wallpaper.

---

## 10. What NOT to do (the failure modes)

1. **Don't hard-split events by status / build a "graduation."** The post-event tail strands events in both lanes → "where did my wedding go?" One lane, status-rendered.
2. **Don't give media two homes.** A cross-event Flashback feed beside event galleries duplicates every photo. Media lives inside its event; the montage is a *derived render* ("make a montage"), never a mirror library.
3. **Don't show the switcher to single-doorway users.** A "Customer ▾" for the 95% implies hidden modes. Capability-gate its very existence.
4. **Don't render conditional surfaces as empty shells.** For a first-timer, Spaces / dormant zones must *disappear*, not gray out. Empty pillars make a new home look broken.
5. **Don't turn the home into a settings page.** The moment Profile / People / AI-consent get top-level tiles, it stops feeling native. Governance lives behind the avatar.
6. **Don't let memory ambush.** No auto-play, no "On This Day!" confetti. Sensitive dates (death anniversaries, called-off weddings) surface only tap-to-enter, handled quietly.
7. **Don't tax the stressed planner with nostalgia,** and **don't go cheesy-Filipino** (no jeepney/tribal-pattern clichés, no Tagalog-everywhere).

---

## 11. ⚠ For owner sign-off before build

**Note A — "Alaala" as the memory name (low risk, reinforces a lock). ✅ CONFIRMED (owner, 2026-07-14).** The council independently landed on *Alaala*, which matches your owner-locked `Alaala consolidation` (memory = one gallery + a family of renders, Life-Flash among them). The user-home adopts the Alaala name/identity as the single memory dimension: **Life-Flash** = the hero render, **Your Story** = the "With Me" lens, **Memories Hub** = dissolved.

**Note B — persistent desktop rail vs. the "no account sidebar" lock (real conflict).** Your `account chrome launcher` decision (2026-07-12, PRs #3224/#3222) retired the universal `(account) SidebarShell` and locked: *"the `/dashboard` launcher is THE home; all account spokes render the slim chrome-less top bar (no sidebar); don't re-add an account sidebar — event/vendor/admin rails stay separate."* The Desktop council's highest-leverage move is a **persistent left rail on the home** — which is arguably re-adding an account sidebar. **This needs your call:**
   - **(i)** Keep the launcher chrome-less and express desktop density *without* a rail (multi-column body + `⌘K` + a top switcher strip only when multi-doorway); **or**
   - **(ii)** Revisit the lock — the rail here is *conditional* (populates only for multi-doorway/power users) and doubles as the switcher, which may be worth the exception.

   → **DEFERRED (owner, 2026-07-14): "show me both."** The mockup phase will present option (i) chrome-less and option (ii) rail **side by side**; the #3224 lock stays intact until that review picks a winner. **New evidence (owner-supplied inspiration, 2026-07-14):** the Leonardo.AI reference uses a **thin, icon-only *global* app rail** — arguably distinct from the fat "(account) SidebarShell" #3224 retired, so it may sidestep the lock's spirit rather than break it. The inspiration leans toward the rail; both variants still get built for the side-by-side. → see § 14.

**Status (2026-07-14):** Alaala adoption is confirmed. The desktop-chrome fork is deferred to a side-by-side mockup. The external **`setnayan-handoff.zip`** design package arrived and is folded in at **§ 15** — it validates the IA but introduces **three lock-conflicts (C1 theme · C2 command bar · C3 events split)**. **C1 (dark-studio vs locked warm/gold) now gates the mockup phase** and needs an owner call.

**Not yet logged to `DECISION_LOG.md`** — this is a still-open research verdict; the forks (one-lane events, capability-gated switcher, desktop chrome) and the confirmed Alaala adoption get logged as decisions once the direction is settled after the remaining external input + mockup review.

---

## 12. Zone-by-zone mapping (7 → 3 + drawer)

| Current zone | Verdict | Lands in |
|---|---|---|
| Your Events | Renamed → **In Motion** | The Lane (active/upcoming, foregrounded) |
| Your Year | Merged (demoted) | The Lane (past segment) · mobile: a date ribbon |
| Your Spaces | Conditional | **Switcher / Spaces** — desktop rail group · mobile avatar sheet; renders iff `doorways > 1` |
| Profile & Account | Demoted | **"You" drawer** |
| People | Becomes a lens (+ editable in drawer) | Alaala "By Person" lens · managed in "You" |
| Memories Hub | **Dissolved** | event-list half → The Lane; media half → event galleries + Alaala |
| Setnayan AI (governance) | Demoted | **"You" drawer** (data-governance checklist) |
| Life-Flash | Merged as artifact | **Alaala** hero render (derived montage) |
| Your Story | Merged as lens | Alaala **"With Me"** lens |

---

## 13. Sequenced build plan

1. **Master profile data model** — one user id with arrays of `customer_events` + `vendor_profiles` + `admin_permissions`. Prerequisite for the capability-gated switcher *and* the unified lane. (Both takes agree; sequence it first.)
2. **Unify event queries into ONE lane** by date/status, rendered by lifecycle. Highest-leverage user-visible win — retires Your Events + Your Year + the event-list half of Memories Hub in one move.
3. **Capability-gated switcher** — compute doorway count; render iff `> 1`; mobile bottom-sheet; default to personal context.
4. **Anchor media inside events; reframe Life-Flash / Your Story as the Alaala montage engine** — dedupe hard against event galleries; collapse Memories Hub.
5. **"You" drawer** — fold Profile · People · AI-governance off the main nav.
6. **Lenses** (time / person / with-me) on the unified lane.
7. **Status-inverting behavior + empty states** — the whisper-then-sing posture, per life-stage.

---

## 14. Inspiration references (owner-supplied, 2026-07-14) — Leonardo.AI

Two Leonardo.AI screens supplied as visual reference: their **Home** (→ the Setnayan user home) and their **AI Creation** working surface (→ the event / vendor / admin dashboards).

**Golden rule: borrow the chassis, invert the skin, swap the content model.** Leonardo is dark, neon-purple, tool-forward — a *generator*. Setnayan is warm, gold, editorial, paper-and-fabric — a *life-events OS*. And Leonardo's home launches you to *create assets*; the Setnayan home orients you across *events, memories, and spaces*. Take the structure; never the mood.

**Photo 1 (Leonardo Home) → the user-home chassis:**

| Leonardo element | Borrow as | Setnayan content |
|---|---|---|
| Thin left **icon rail** (Home/Library/Image/Video/…) | Persistent global app rail, icon-first | Home · Create · Spaces *(conditional)* · You + notifications / tokens / avatar |
| Hero "YOURS TO CREATE" | The greeting / status hero | "Kumusta, [name]" + the **status-inverting** hero (next-action while planning → Life-Flash film when quiet) |
| Prompt bar + action tiles (Image/Video/Blueprints…) | The **+ Create** launch row | New event · make a montage · invite people · quick services |
| Featured Blueprints horizontal **card rail** | The **In Motion** rail | Active/upcoming event cards with live loop badges |
| Community Creations + **filter chips** | The **Alaala** feed / discovery band | Memory feed by lens (Time · Person · With Me) |
| Credits "150" · Upgrade · What's New | Utility chrome | Tokens · Setnayan-AI / plan upgrade · What's New |

**Photo 2 (Leonardo "AI Creation") → the working shells (event / vendor / admin):**

Validates the council rule *"everything clickable enters its own focused shell"* and defines what a shell IS = **top context bar + optional left control panel + main work surface.**

| Leonardo element | Borrow as | Setnayan content |
|---|---|---|
| Top bar (logo · "AI Creation" · credits · **Get Started 1/6**) | Shell **context header** | Shell name + setup progress + "back to home" |
| Left **control panel** (Auto / Style / Dimensions / #gens / Private…) | Context **control rail** | Event tools (Guests / Vendors / Schedule…) · vendor controls · admin filters |
| Main canvas (generated image + prompt block) | The **work surface** | Guest list · seating chart · gallery · admin queue |
| "Get Started 1/6" stepper | Per-shell **setup progress** | Guided-setup progress (ties to the 0030 guided tour) |
| `←` back arrow | Return to home (rail persists) | Jump back / sideways between shells |

**Implication for the desktop-chrome fork (§ 11 note B):** Leonardo's rail is a *thin icon-only global* rail, not a fat account sidebar — this is the owner leaning toward the rail variant, and a plausible reconciliation with the #3224 lock. Still building both for the side-by-side.

**Aesthetic-translation checklist (so the borrow doesn't drag the mood with it):** warm paper background not near-black · gold/wine accents not neon purple · serif for names & dates not techy sans · fabric/paper motion (veil-lift) not glassy micro-bounces · celebratory/emotional copy not tool/utility copy. The *skeleton* is Leonardo; the *skin* is unmistakably Setnayan.

---

## 15. External design handoff reconciliation — `setnayan-handoff.zip` (owner-supplied, 2026-07-14)

An 8-file design package (brief · IA · concepts · design system · home spec · dashboard spec · mobile · build order + CSS/JSON tokens), independently derived. **It validates the council verdict almost point-for-point** — strong triangulation (council ≈ Google ≈ handoff) — but ships a visual skin that **conflicts with an owner lock.** Take its IA + structure; do not apply its theme without a decision.

### Convergence (handoff ≡ council ≡ owner terms)

| Handoff | Council verdict | Owner term |
|---|---|---|
| Two axes (Time Now→Then × Mode Personal⇄Business) + one primitive `Event` | one object / one lifecycle + capability-gated doorways | — |
| **Plan** = active *owned* events only | In Motion / the Lane (active) | The Lane |
| **Remember** = merged Year + Memories Hub, one timeline, media inline | Alaala (memory dimension) | **Alaala** |
| Life-Flash = a **Play button / lens** in Remember | Life-Flash = hero render, not a zone | Life-Flash |
| Your Story = a **filter** ("clips I appear in") | "With Me" lens | With Me |
| People = a **lens** (+ light home in settings) | People = lens into Alaala | People lens |
| **Run** = vendor + admin behind a **mode switch**, conditional | capability-gated switcher | Spaces |
| **Me** = Profile + AI controls (settings) | "You" drawer | You |
| Mobile tab bar `Home·Remember·Spaces·Me`, one hero + memory + nudge | 3-tab thumb switchboard | — |
| Dashboard shell = Leonardo "AI Creation" (panel + canvas), one shell for all 3 doorways | photo-2 shells; "everything enters its own shell" | — |

**Name reconciliation:** Remember → **Alaala** · Me → **You** · Run → **Spaces** (keep the owner-confirmed names).

### ⚠ Three conflicts with owner locks — do NOT auto-apply

**🔴 C1 — Theme: dark studio + violet vs the locked warm/gold atelier brand.** The handoff's design system + `tokens/` are **true-black `#050506` + violet `#7B6EF6`**, explicitly "Leonardo-cold, warmed only by photography." This contradicts (a) the **atelier+glass reskin owner-locked 2026-07-12** (Hanken Grotesk + Space Mono, **gold supersedes wine**) and (b) the **current live home** (warm/light paper + gold). The council already ruled "borrow the chassis, **invert the skin**" — the handoff kept the cold skin. **Recommendation:** adopt the handoff's *structure + component rules*, render them in the atelier **gold** system, not dark-violet. **Owner decision required — this gates any mockup.**

**🟠 C2 — "Ask Setnayan" command bar vs the deterministic-AI lock.** The handoff makes the hero prompt bar a free-text assistant ("Ask Setnayan — plan a task, find a vendor"). Setnayan AI is **owner-locked deterministic + free + no-LLM** — a natural-language "ask anything" bar implies an LLM chat that doesn't exist. **Recommendation:** keep the bar as a **deterministic global search + command** surface (find a vendor · jump to a task · new event), not a conversational prompt.

**🟡 C3 — Events split (Fork #1) — handoff disagrees with the council adjudicator.** Handoff: Plan = active-owned only; once past, an event lives **only** on the timeline. Adjudicator: **one lane, no hard graduation** (a just-concluded wedding still has open payments/thank-yous — the "post-event tail" — and would fall into a memory hole under a hard split). **Reconciliation (recommended):** "Plan" is a **smart filter** (`owned AND has-open-loops`), not a separate storage bucket; an event with open tasks stays surfaced in "needs you" **even after its date passes**, then settles into Alaala once its loops close. One object; Plan is a *view* of it.

### What to take now
- **Adopt:** the IA (§01), the concept blend (Rooms skeleton + Timeline inside Remember + editorial strip on Home), the component set (media card, filter pills, metric card, quick-action row, panel+canvas dashboard shell), the mobile priority order, the build order, the acceptance checks, the "what NOT to do" list.
- **Hold pending C1:** the dark-violet tokens — keep `tokens/design-tokens.*` as a *candidate dark theme* only.
- **Rewrite per C2:** the command bar's role (search/command, not chat).
- **Confirm C3:** the smart-filter reconciliation.
