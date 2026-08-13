# Prompt · Redesign 6b — a cold sign-in from the front door comes back to the front door

Paste the **SHARED HEADER** from `REDESIGN_SESSION_PROMPTS_2026-08-12.md` first, then this block.
Small and contained. Safe beside Redesign 9 and 10.

```
GOAL: signing in from the front door leaves you ON the front door, with your own sidebar —
not thrown into a console you did not ask for.

WHAT THE OWNER SAW, 2026-08-13: signed in and landed on /admin (Setnayan HQ), having expected
"it still looks like the public website, but we have added sidebar". He is right that the
second thing is what was designed.

⚠ SESSION 6 IS NOT AT FAULT — DO NOT REDO IT. Read app/_components/frontdoor/front-door-shell.tsx
around line 106 and app/_components/auth/sign-in-here-panel.tsx before touching anything:
- The front door's Sign-in controls already open an IN-PLACE panel (`useSignInPanel`), and on
  success the panel calls `router.refresh()` — deliberately, so a half-written enquiry stays in
  its box. That path is correct and already ships.
- Both controls are STILL real <Link href="/login"> on purpose: a <button> pressed before
  hydration is a dead control, and a link keeps middle-click and open-in-new-tab working.
So the in-page seam works. WHAT BROKE IS THE FALLBACK — the whole-page /login route.

THE ONE LINE THAT CONTRADICTS THE SEAM — app/login/actions.ts, in exchangeCredentials:

    let destination = fallbackNext;                 // fallbackNext = rawNext === '/' ? '/dashboard' : rawNext
    if (rawNext === '/' && userId) {
      ... select account_type ...
      destination = accountHomePath(profile?.account_type);   // vendor → /vendor-dashboard
    }                                                          // admin  → /admin
                                                               // else   → /dashboard

Arriving from `/` is SPECIFICALLY special-cased NOT to return you to `/`. Everything else
already honours `next` and comes back where it started.

🔑 THE RULE IS NOT WRONG — ITS PREMISE EXPIRED. Its own comment says it exists to avoid "the
double-hop where vendors landed on /dashboard then got bounced to /vendor-dashboard". That was
right when `/` was the ELN cinematic film page, which had NOTHING for a signed-in person — so
sending them to their account home was the only sensible move. `/` became the front door on
2026-08-13 and it now HAS a signed-in state: app/_components/frontdoor/front-door-shell.tsx has
four `account.signedIn` branches — My Home (Events · Alaala), the Marketplace group, the
account cluster. Nothing redirects a signed-in visitor off `/`. So the premise is gone.

THE CHANGE: when `next` is `/` (or absent), the destination is `/` — the front door, signed in.
Keep `accountHomePath` for every case where it is still right, and DO NOT delete it.

🪤 FOUR THINGS THAT MUST NOT BREAK — prove each:
1. An explicit `next=` still wins, always. That is the seam's main promise.
2. A VENDOR signing in cold must not be dumped on a customer board. Landing on `/` is fine —
   the rail carries their shop under Spaces. What must NOT return is the double-hop the old
   comment describes (/dashboard → bounced → /vendor-dashboard). Check dashboard/layout.tsx
   still owns that bounce and that you have not re-created it.
3. The OAuth callback has the SAME line — app/auth/callback/route.ts:18,
   `const fallbackNext = rawNext === '/' ? '/dashboard' : rawNext`. Fix both or the two doors
   disagree, which is exactly the "two answers to one question" failure this repo keeps paying
   for. Google sign-in must land where password sign-in lands.
4. lib/account-security.test.ts asserts "vendor → /vendor-dashboard · admin → /admin · else
   /dashboard". If you change accountHomePath's CALLERS the test still passes — good. If you
   change the FUNCTION, that test tells you you have changed something wider than asked.

📌 SEPARATE, AND THE OWNER'S TO SETTLE — do not decide it in code:
Whether an ADMIN should ever be auto-sent to HQ. Today account_type='admin' → /admin on every
cold sign-in, which is why the owner — who is also a couple with events, and the person who
most needs to see what a couple sees — starts every session inside the ops console. This fix
makes a front-door sign-in stay on the front door; it does NOT settle what happens when an
admin signs in from somewhere with no destination at all. Report it, do not rule on it.

DONE = signing in from the front door (in-place AND via the whole-page fallback AND via Google)
leaves you on the front door with My Home and Marketplace in the rail; `next=` still wins
everywhere; a vendor is not dumped on a customer board; and both sign-in doors agree.
```
