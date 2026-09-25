# Guest sign-up / link flow — as shipped on origin/main b5364abb1 (2026-09-25)

I read `origin/main` at `b5364abb1` (today) with `git show`. I did not create `/tmp/wt-flow`, because my session runs read-only and can't create files, so there is nothing to remove. All paths are under `apps/web/`.

## A. Guest from an invitation

There are two ways in, and they meet at `/{slug}`.

**Personal link `/{slug}?invite={qr_token}`**
1. `app/[slug]/page.tsx` `PublicInvitationPage` redirects to `app/[slug]/redeem/route.ts` `GET`, which calls `setGuestSession` (a cookie that covers one event) and `recordScan`.
2. An unnamed +1 goes to `app/[slug]/welcome/page.tsx` and types a first and last name (`confirmPlusOneName`).
3. Back on `/{slug}`, `_components/site-body.tsx` `guestTree` shows, in order:
   - `ArrivalActionRow`
   - `GuestHubCard`
   - `KeepOnHomeScreen`
   - the **"Keep this on your phone"** email box (`claimAccountAction`)
   - the reply sheet `RsvpSheet` (`#your-details`), which wraps `RsvpWidget` and posts to `submitRsvp` in `app/[slug]/actions.ts`.
4. The form fields are:
   - `rsvp_status` (3 radios)
   - selfie (only if attending)
   - `meal_preference` and `dietary_restrictions` (only if attending)
   - `contact_email`, `contact_mobile`, `contact_display_name`
   - `plus_one_first_name_N` and `plus_one_last_name_N`
   - `guest_note`
5. After "attending", `GuestToHostCta` links to `/signup?ref=guest`. `GuestHubBar` also shows "Link to account", which jumps to `#claim-account`.

**Shared link `/{slug}/invite` (three steps the code calls "doors": Name, Reply, Enter)**
1. `invite/page.tsx` renders `JoinFlow` (`join/[eventId]/_components/join-flow.tsx`). Door 01 has one field, `name`, posted to `selfJoinAction`.
2. There is **no "is this you?" screen**. `classifyClaimMatch` / `seedBindAllowed` either quietly match the name to a guest, or add a new guest flagged `self_added_unlisted`.
3. Door 02 is `invite/reply/page.tsx` `InviteReplyPage`:
   - Google/Apple buttons (`OAuthButtonRow next=/join/{id}/connect?then=reply`)
   - the same `RsvpWidget` with no selfie, posting to `submitInviteReply` (`invite/actions.ts`), which emails a sign-in link before calling `submitRsvp`
   - a "Have an account? Sign in" link.
4. Door 03 is `invite/enter/page.tsx`: the QR, "Your sign-in link is on its way", and a button to `/{slug}`.

**How a guest gets linked to an account**
- There is **no `guests.user_id` column.** The link is a row in `event_members` holding `user_id` and `guest_id`. It is written by:
  - `linkGuestSessionToUser`, which uses the cookie. It runs from `signUp`, from login and from the connect route.
  - `connectEventForUser`, which matches on email.
  - `joinEventAction`, which matches on email or name.
- The magic link comes from `sendEventAccountMagicLink`. It calls `admin.createUser` (marked `needs_password`) and sends a link to `/auth/callback?next=/join/{id}/connect`. From there the route goes to `/set-password` and then to `/{slug}` (or back to the reply door).

**Order: form first, then sign up**
- **Through the Reply door:** saving sends the link. But when the guest reaches `/{slug}`, it still asks for the email again in "Keep this on your phone", until they click the link.
- **Through the `/{slug}` sheet:** `contact_email` is saved but **no link is sent**. The separate box asks for the same email again.

**Order: sign up first, then the form**
- **Google/Apple on the Reply door:** the account is linked through the cookie, the guest returns to the reply door with `profileDetails` pre-filled, and still has to fill the form.
- **Through `/signup`:** the account is linked through the cookie, then the guest goes to `/signup/you`, and ends up on `/` (the homepage), **not the event**.

**A guest who is already signed in**
- **Same device (cookie present):** the contact boxes fold into "Your details are filled in", and the claim box is hidden.
- **New device (no cookie):** this is a dead-end loop.
  - `page.tsx` hits `if (!session) return renderAnonymous(...)`: no reply form, no QR, even though the account is linked. On private events the guest gets past the gate through `isSeatHolder`, but still sees the anonymous page.
  - Their dashboard card (`lib/event-board.ts` `eventBoardHref`) links to `/{slug}` and shows the same anonymous page.
  - `/{slug}/invite` shows `JoinFlow`, which sees the existing member and sends them to `/join/{id}/success`. Its "Your invitation is ready" button goes back to `/{slug}`, still anonymous.
- **Second event:** the cookie holds one event, so they see the `wrong_event` message.
- **Signed-in `JoinFlow`:** they must retype their name, and there is no Name/Reply/Enter step bar.

**Other problems**
- Up to **five account prompts** can appear: the claim box, "Link to account", the Google/Apple buttons, the host pitch after "attending", and the "Keep this event" / vendor-save notes.
- `PrivateLanding` has no sign-in link: a dead end for an existing account on a new device.
- `selfJoinAction` sends errors to the opaque `/join/{id}?token=` address instead of `/{slug}/invite`. It also still reads an `email` field that Door 01 no longer renders.

## B. New account created via an event

1. **Magic link:** there is no sign-up screen. The account is created without a password, without a Terms checkbox and without a welcome email. Then:
   - `auth/callback/route.ts`: if the account is under 120 seconds old (`isBrandNewAccount`), the guest goes to `/signup/you`, otherwise straight on.
   - `join/[eventId]/connect/route.ts`, then `/set-password`, then `/{slug}`.
2. **Google/Apple:** `/auth/callback`, then `/signup/you` (`YouPage`/`saveYou`), then connect, then the reply door.
3. **`/signup` from an event** (the `JoinFlow` fallback when the event has no public page yet, or `GuestToHostCta`): see C.

**Couple onboarding by mistake?** Not automatically: `signupLanding` sends people to `/signup/you`, and the dashboard's auto-jump (`landingJumpTarget`) only fires for the person's own event. But it comes close:
- the account type is the same `customer` as a couple's;
- the welcome email sent by `signUp` says "Your couple account is ready… create your event";
- `GuestToHostCta` leaves the guest on `/`, whose main button is `/onboarding/wedding`.

**Problem:** whether a guest sees `/signup/you` depends on how fast they click the email (the 120-second window).

## C. New account created via the website

**`/signup`**
1. `signup/page.tsx` `SignupPage`: email, password, Terms, "stay signed in", and Google/Apple.
2. `signUp` sends the user to `/signup/you`. That screen asks for photo, display name, `@handle`, name parts, phone and a consent checkbox.
3. Then `next`. When `next` is `/`, the user lands on the homepage. `auth/callback` maps `/` to `/dashboard` (`signInDestination`), but `signupLanding` does not, so the two doors end in different places.

**Homepage button**
1. `FrontDoorAnchor` "Start your celebration — free" goes to `/onboarding/wedding?from=home`. It is wedding-only, because the generic `/onboarding/[type]` flow is behind a feature flag that is off.
2. `OnboardingShell` runs about 40 screens (`FLOW_IDS`) before an `account` screen. That screen is skipped if the user is signed in or if `NEXT_PUBLIC_ANON_ONBOARDING_ENABLED` is on.
3. **Bug:** the account screen's email form posts to `signUp` with **no `terms_agreed` field**, so it always bounces to `/signup?error=terms_required` and the user retypes email and password. It also sends no `remember`, so the login only lasts the browser session.
4. Then `/signup/you`, then `/onboarding/wedding?resume=1`.

**B versus C**
- **Shared code:** `signUp`, `/signup/you`, `/auth/callback`, `OAuthButtonRow`.
- **Differences:** the event path has no password until later, no Terms and no welcome email. The website path requires a password and Terms. The website asks the event-type questions before sign-up, while `/signup` asks none.

## DECISION_LOG and prototypes

`DECISION_LOG.md` rows:
- **L4195 (2026-09-25):** the owner calls this flow "messy". The target is "Fill up your form and sign up, or sign up then the form", with one link step and a shared sign-up for the invitation and the website.
- **L3839 (2026-09-10):** the three doors. The ruling is "the email IS the login", the separate account step is cut, and Google/Apple go at the top.
- **L1622 and L1636 (2026-06-25):** matching by name and admitting the guest straight away (not a blocking review).
- **L1647 (2026-06-26):** the claim-account box.
- **L1386:** joining without an account.
- **L1430:** anonymous onboarding, built behind a flag that is off.
- **L4198:** the page editor will ask the couple what to ask their guests.

Prototypes: **none covers the guest reply or sign-up flow.** Related ones:
- `one_door_FINAL_2026-09-22.html` and `one_door_signin_signup_shop_2026-09-22.html` cover website sign-in and sign-up.
- `guest_card_panel_2026-09-22.html` and `guests_living_roster_2026-07-10.html` are host-side guest-list screens.
- The "2 · RSVP sheet" board that the code cites is not in that folder.