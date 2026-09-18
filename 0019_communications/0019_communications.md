# Iteration 0019 — Communications (Chat + ~~Video Meetings~~ + File Sharing + Coordinator Join)

> ## 🗄 ARCHIVE — original iteration spec · NOT current truth
>
> This file is the **original `0019` iteration spec**, kept only for lineage. It has **drifted** from what actually shipped (prices, SKU names, retired features, flows) and **must not be used to answer "what does Setnayan do today."**
>
> ### Where current truth lives (in this order)
> 1. Live site — https://www.setnayan.com
> 2. Shipped code — `apps/web` @ `origin/main`
> 3. Prod database
> 4. [`AS_BUILT_GROUND_TRUTH_2026-06-07.md`](../AS_BUILT_GROUND_TRUTH_2026-06-07.md) — the single living as-built doc
> 5. [`DECISION_LOG.md`](../DECISION_LOG.md) — newest decisions at the bottom
>
> ### The full original spec body
> Preserved verbatim in git — nothing was deleted:
> ```
> git show 573a96c:0019_communications/0019_communications.md
> git log --follow -- 0019_communications/0019_communications.md
> ```
>
> _Stubbed 2026-07-02 · corpus de-drift (append-and-banner → single living main). Rationale in [`DECISION_LOG.md`](../DECISION_LOG.md)._

## § Gate — pinned privacy notice, vendor-side string (2026-09-18)

The notice is pinned on BOTH sides (locked 2026-05-14). The EN canonical string above is addressed to the
couple; until 2026-09-18 the same sentence was pinned above the SUPPLIER's conversation ("your vendor sees
what they need from your profile"). The supplier now reads a line addressed to the supplier — same lock, same
placement, same non-dismissibility, same list of items:

> *"Everything you need for this event is already in Setnayan — their profile and this conversation carry it.
> Never ask for private info in chat. government IDs · card numbers · full addresses · OTPs · passwords.
> Couples are told to report a vendor who asks for these."*

The couple's canonical string is unchanged, byte for byte (`apps/web/app/_components/chat-privacy-notice.tsx`,
`viewer` prop; `lib/one-chat-box-everywhere.test.ts` asserts both).

