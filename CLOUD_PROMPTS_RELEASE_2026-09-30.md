# Cloud session prompts — Oct 1 release + after (2026-09-30)

How: Claude app → New session → **Cloud** → repo **iscasasola/setnayan-platform** → paste ONE prompt. It opens a PR labelled `do-not-auto-merge`; the local controller folds, merges and deploys.

---

## CLOUD 1 — Invitation text fixes (Oct 1 release)

```
Model: Opus · effort medium. You are a builder in iscasasola/setnayan-platform (Next.js monorepo, apps/web). Read CLAUDE.md first and obey it.
RULES: never merge, never `gh pr merge`, never --admin, never arm auto-merge. ONE PR to main with `gh pr create --label do-not-auto-merge`; confirm `gh pr view --json autoMergeRequest` is null. No production migrations, no deploys. Plain English; never "website"/"site" (it is the Event Hub); "supplier" never "vendor" in UI. Phone first (390 px). Changelog fragment `changelog.d/<branch-slug>.md` only. From apps/web run install, typecheck, lint, every CI guard script in .github/workflows/ci.yml, nearby tests (escape `[[]slug]`). Guards per fix, sabotage once.
TASK — guest-side text fixes found by an audit of origin/main (verify each first). Branch rd/invitation-text-fixes.
1 Programme (`app/[slug]/_components/schedule-widget.tsx`, `lib/schedule.ts`): "YOUR TIME" only when the viewer's timezone differs from the event's, once; "UP NEXT" only on the event day; hide the raw "CUSTOM" label; hide the small kicker when it equals the title.
2 Hero shows the first schedule time (guests-arrive): label it "Guests arrive 2:30 PM" (from data), never an unlabeled time.
3 `get-inside.tsx`: button offers only what exists ("Upload your QR · Sign in"), no "Scan · Tap NFC".
4 `login/sign-in-card.tsx`: when `next` points at an event, a guest version — no "WELCOME BACK", no "couples and vendors", placeholder "you@email.com".
5 SECURITY `login-data.ts getLoginView`: never render free text from `?error=` — map to fixed codes/messages.
6 `lib/entourage.ts` "Parents of the Groom/Bride" beside ONE person → "Father/Mother of the Groom/Bride" (plural only for two).
7 ONE spelling on guest pages: US English ("Honor", "color", "program"); curly apostrophes (’) in guest copy.
8 `site-body.tsx`: the love story renders twice (OurStory + OurLoveStoryWidget) → render one; `our-story.tsx` never fills a missing "met" year with the proposal year, and don't lowercase a first word that is a name.
9 One term "E-Gifts" (room-links "Send a gift", card "Send a blessing", pabuya "A blessing"/"e-gifts"); `pabuya/page.tsx` mentions only methods that exist, no "handle".
10 RSVP (`rsvp-sheet.tsx`, `rsvp-sheet-state.ts`, `invite/reply/page.tsx`): the top control says "Close" (it doesn't save); heading "Your reply" (don't ask "Will you be there?" twice); one date formatter for reply-by and event date; "Open your invitation" instead of "Go to your QR and open the wedding".
11 `lib/uploaded-qr.ts`: a blurry/unreadable photo gets its own message, not "That code isn't an invitation to this event."; `add-name-in-place.tsx` shows the real reason; `selfie-capture.tsx` don't say "in my settings" to a guest without an account.
12 `site-body.tsx` "Vendors who made this day · Loved a vendor? Keep them." → only after the event, and "supplier".
13 `your-photos-widget.tsx` remove roadmap text ("Shutter ships with the Setnayan native app (Phase 2)").
14 NO CASUAL GREETINGS (owner rule, DECISION_LOG 2026-09-30): remove "Hi, {first}", "Welcome, {first}", "See you on the 18th, {first}!", "{first}, your camera's ready", "Before you start shooting, {name}" etc. across app/[slug], app/papic, seat/find-seat pages, `_lib/thank-you-words.ts`, `arrival-greeting.tsx`, `arrival-bloom.tsx`, `welcome/page.tsx`; where a name is truly needed use the formal name (`composeFormalName`, lib/formal-name.ts). `lib/guest-invite-message.ts` (message the couple copies): formal name, no emoji.
DO NOT TOUCH (other branches own them): guest-hub-card.tsx, pahina-keepsake, scan-trail-notice, Me/ticket, dress-code-widget, role-dress-code, venue-widget, pro-site-vars, seat/find-seat gating + everything-else-rows + invite-destination, entourage ordering, role labels/renames. List any overlap as "left to its branch".
Report: PR number + phone check card.
```
