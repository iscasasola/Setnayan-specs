# THE BUILD SEQUENCE — what goes first, and the prompt, model and effort for every session (2026-09-10, 23:30 Manila)

> Companion to **`WHATS_NEXT_Build_Plan_2026-09-10.md`** (the register: why each session exists,
> what ships, the chains) and **`WHATS_NEXT_Build_Plan_PROMPTS_2026-09-10.md`** (the full prompt for
> every session). This file is **the order**. Where the three disagree, re-measure — never trust a row.
> ⚠ A plan goes stale in hours: three sessions in wave 1 found their work already done by another
> session. Every prompt tells the session to re-verify first and stop if it is done.

---

## For the owner — one screen

**Already live today:** the gift is optional (a supplier can publish without it) · "Lock this deal"
can no longer lie about a booking · a locked shop leads its group · no email or phone for couples to
tap · a meeting can be moved from Decisions · the critical Next.js security update · coordinator
access you can take back.

**Moving by itself now:** the next step after accepting a quote (#5412) · the test watcher (#5413).

**What goes first — in this order:**

| # | Session | What a person gets | Model · effort | Waits on |
|---|---|---|---|---|
| **1** | **N0** | Our cleanup jobs can never delete someone else's file | Opus · high | its build finishing (running now) |
| **2** | **N1** | The chat can't be used to swap numbers, open WhatsApp, or post into someone else's conversation | Opus · high | **you:** is the chat contact filter on in Vercel? |
| **2b** | **N3** | A mood-board render can't be used to read a stranger's payment receipt | Opus · high | nothing |
| **3** | **B1** | No service card goes live without a name | Opus · high | nothing |
| **4** | **B2** | After a lock, a price change shows both numbers | Opus · high | **your look** before merge |
| **5** | **C3** | The admin verification desk | Sonnet · medium | nothing |
| — | **TEST ROUND 1** | Your first live two-sided test | — | 3 + 4 live, **your prep** |
| **6** | **C1** | The Setnayan gift actually reaches the couple | Opus · high | B2 |
| **7** | **C2** | Marketplace cards show their photo and a proper name | Sonnet · medium | nothing |
| **8** | **D2** | The shop page tells the truth (songs only for musicians) | Sonnet · medium | nothing |
| **9** | **F0** | Correct the six-door My Shop drawing | Fable · medium | nothing |
| **10** | **H2** | A card also needs a cover photo and what's included | Opus · high | C1 |
| **11** | **H3** | Drag your suppliers into your own order | Opus · xhigh | nothing |
| **12** | **D1** | Fold 5: "Want to add them to your event?" | Opus · medium | **your look** at the shop-page drawing |
| **13** | **D3** | The old verify page leads to the new papers section | Sonnet · medium | nothing |
| **14** | **D4** | Every film of your day (#5140) | Sonnet · medium | B2 |
| — | **TEST ROUND 2** | Test with a couple who has two events | — | D1 live |
| **15** | **E1** | A shop's link preview never breaks | Sonnet · medium | D2 |
| **16** | **E2** | No phone or email in a shop's own About | Sonnet · medium | nothing |
| **17** | **E3** | Verify the government-ID delete guard | Opus · high | C3 |
| **18** | **E4** | Close the database door to shop email and phone | Opus · high | nothing |
| **19** | **N2** | The last two email leaks on couple screens | Sonnet · medium | nothing |
| **20** | **F1 → F2** | The new shop page, top then body | Opus · high | E1, your look at the drawing |
| **21** | **G1 → G2 → G3** | Six-door My Shop, in three parts | Opus · high (G3 Sonnet · medium) | your look at F0 |
| **22** | **H4** | A supplier can say a payment never arrived | Opus · xhigh | **your question 9**, B2 |
| **23** | **H5** | "Lock this" stops showing for a supplier who declined | Sonnet · medium | **your question 10**, H3 |

**What only you can do, in the order it unblocks things:**
1. Tell me whether **NEXT_PUBLIC_CHAT_CONTACT_FILTER_ENABLED** is on in Vercel (unblocks 2).
2. **Look at "both numbers after a lock"** when B2 is ready (unblocks 4, then the test).
3. **Prep the test:** rename the "(FIXTURE)" band shop, real titles + cover photos on its two cards,
   a GCash QR, leave the gift at "no", play the couple on **testnayan4** (give its event a date).
4. **Look at the corrected shop-page drawing** (unblocks 12 and 20) — and rule on the **stock photo**
   while you are there: keep it (your 4 June order) or replace it?
5. **Look at the corrected six-door drawing** once F0 finishes (unblocks 21).
6. Questions 9 and 10 in the register (unblock 22 and 23) — both can wait.

---

## How to launch any session — the one prompt

Every session's full instructions are committed in the PROMPTS file, so the prompt to paste is the
same shape for all of them — change only the ID:

```
You are a build session for the Setnayan platform.

1. Open /Users/icecasasola/Documents/Claude/Projects/Setnayan/WHATS_NEXT_Build_Plan_PROMPTS_2026-09-10.md.
   Read the "## SHARED HEADER" section in full and obey every rule in it.
2. Then read and execute ONLY the section headed "## <ID> —" in the same file. Nothing more.
3. Read the register WHATS_NEXT_Build_Plan_2026-09-10.md for context, including the CORRECTION block
   at its very top (the stock photo is an OPEN owner question — no session removes it).
4. Before building, re-verify your section's "what exists" against origin/main and the live site.
   Other sessions merge constantly. If it is already done, prove it (served by ancestry) and stop.
5. Build BESIDE the repo (a worktree under /Users/icecasasola/Documents/Claude/Projects/), never in
   /tmp, and commit early. Never git stash. Never git add -A. Never read code from /Users/icecasasola
   itself. Money, security-grant or owner-gated work opens as a DRAFT PR.
6. Done means production's /api/health contains your merge commit by ancestry — not "PR opened".
   When done, mark your row in WHATS_NEXT_Build_SEQUENCE_2026-09-10.md.
```

Set the model and effort from the table above. **If a prompt section carries its own `MODEL:` line, it agrees with this table** — checked 2026-09-10 (H2 re-signs the SECURITY DEFINER save function where two silent defects were found; H3 is the hardest UI piece left, with a new RLS table). **Opus** for anything touching money, the lock,
database grants, migrations or deletion; **Sonnet** for screens, copy, wiring and landing finished
work; **Fable** only for drawings.

---

## Run order and parallel rules

**At most three code sessions at once. Never two on the same file.** These chains are strict:

- **Public shop page** (`app/v/[slug]/page.tsx`): D2 → D1 → E1 → F1 → F2 (D1 may go before D2 only
  if your drawing look comes first).
- **Chat lock card / booking:** B2 → C1.
- **Service-card files:** B1 → C1 → H2.
- **The couple's supplier list (bench):** H3 → H5.
- **Admin verification area:** C3 → E3.
- **My Shop page file:** D3 → E2 → G1 → G2 → G3.
- **Security baseline** (a generated file): whoever merges second regenerates it — N0, N1, B2, D4, C1,
  E4 all touch it. Regenerate from the merged tree, never pick a side, then check header = body.

**Safe trios to run together** (no shared files):
- Round A: **N0 · B1 · C3**
- Round A2: **N3** alongside Round A if a slot frees (touches mood-board files only)
- Round B: **N1 · B2 · C2**
- Round C: **C1 · D2 · H3** (+ F0, a drawing, alongside anything)
- Round D: **H2 · D3 · E4**
- Round E: **D1 · N2 · E3**
- Round F: **E1 · E2 · D4**
- Round G: **F1 → F2** alongside **G1 → G2 → G3**
- Gated, whenever answered: **H4**, **H5**

---

## Status — update this table, never trust it

| Session | State | Proof |
|---|---|---|
| A1 gift optional | ✅ SERVED | #5373 · a2cc050 in prod |
| A2 lock needs a price | ✅ MERGED 2026-09-10 | #5408 — confirm served |
| A3 no door out | ✅ SERVED | #5404 |
| A4 next step after accepting | ⏳ auto-merge | #5412 |
| A5 locked shop leads | ✅ SERVED | #5406 |
| B3 deploy headroom + security | ✅ SERVED | #5407, #5397 |
| H1 meeting from Decisions | ✅ SERVED | #5411 · 55e2d4d |
| L1 · P1 · T1-script | ✅ done | corpus; T1 watcher #5413 auto-merge |
| N0 cleanup-delete pin | 🔨 building | branch `claude/every-cleanup-delete-is-pinned` |
| everything from B1 down | ⬜ not started | — |

**Rescue copies** of every unsaved workspace from today: `/Users/icecasasola/Documents/Claude/Projects/setnayan-rescue-2026-09-10/` (restore guide inside).
