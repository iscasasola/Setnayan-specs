# Iteration 0032 — Contract Intelligence + Builder

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - **Scope was shrunk to UPLOAD-ONLY (owner, 2026-05-18) — the AI/e-signature spec is NOT built.** Per the header of `lib/contracts.ts`: Setnayan's role is hosting + visibility only; "the dual e-signature flow specified... is dropped." Parties handle signing externally (email, in-person, separate e-sig tool). The shipped surface = `app/vendor-dashboard/contracts` + `app/dashboard/[eventId]/contracts` (couple read side).
> - **No Contract Intelligence AI.** None of the § 3 14-element Claude detection, § 4 analyze pipeline (pdfplumber/Claude Haiku 4.5), § 5 ~50-clause lawyer-reviewed library, or § 6 compliance gate is wired. No `contract_drafts.detected_elements`, no clause picker, no compliance score/badge.
> - **No in-app e-signature (§ 7).** No signature pad/typed/drawn capture, no `contract_signatures` rows, no certificate page, no `setnayan.com/c/[id]/verify` tamper-check page. The DB keeps signature columns/`fully_signed` trigger for forward-compat but they're never populated. `ContractStatus` is repurposed: `sent_for_signature` is relabeled "Active / visible to couple"; `fully_signed` is never reached.
> - **Pricing/positioning superseded.** The ₱199 `contract_builder_single` SKU + "free with Vendor Pro Weekly" framing (§ 10) is stale — Vendor Pro is **₱2,499/28d** (Pro Weekly retired) and **commission is 0%**. Contract hosting is not a charged AI SKU in the shipped upload-only model.
> - **External-counsel review gate (§ 11) is moot** for the shipped scope (no template clauses are generated). The Anthropic workspace / Concierge cross-reuse (§ 4a) is also moot — Setnayan AI replaced Concierge and its wizard is retired in-app.
>
> When this body disagrees with the above, **the above wins.**

**Iteration number:** 0032
**Topic:** AI-powered contract analysis, Setnayan-template contract builder, and in-app e-signature flow for vendors. Detect what a vendor's existing contract covers, fill the gaps with lawyer-reviewed Setnayan clauses, generate a clean PDF, and bind both parties via legally valid PH e-signatures.
**Surface:** Vendor dashboard (0022) primary; Customer dashboard (0021) for sign-side; Admin (0023) for audit; chat threads (0019) as the delivery channel.
**URL pattern:** `setnayan.com/dashboard/vendor/contracts`, `setnayan.com/dashboard/vendor/contracts/[contract_id]`, `setnayan.com/dashboard/customer/contracts/[contract_id]`, `setnayan.com/dashboard/admin/contracts`
**Builds on:** 0000 (auth + role-router), 0006 (vendor records), 0013 (Supabase + R2 + Cloudflare Workers + Claude API), 0019 (chat thread as the delivery channel), 0021 (customer dashboard sign surface), 0022 (vendor dashboard host + Pro Subscription), 0023 (admin Disputes Handler), 0025 (vendor profile / settings host), Vendor Agreement § 12.1 (the manual signing flow this iteration upgrades from).
**Provides to downstream iterations:** Disputes (future) — Disputes Handler consumes the signed contract + signature audit trail as the canonical record of agreement. Vendor Performance Analytics (future) — contract-cycle-time + signature-completion-rate as vendor reliability signals.
**Status:** Drafted 2026-05-12 · **UNBLOCKED 2026-05-16** (Anthropic Console signup + spend caps locked — owner action: Anthropic Console workspace "Setnayan" with $500/mo soft alert / $2,000/mo hard cap / $100/day soft cap; primary model **Claude Sonnet 4.6** for vision, budget model **Claude Haiku 4.5** for Contract Intelligence text extraction; OpenAI GPT-4 reserved as V1.5+ fallback).
**Phase:** V1 launch (paid upgrade SKU; free-tier vendors retain the manual signing flow from § 12.1). **No longer blocked on AI provider decision** — was the last open dependency.

---

## 1. Why this iteration exists

V1's vendor-signing flow is manual: vendor emails Setnayan a signed PDF, Setnayan files it in the R2 `setnayan-vendor-contracts` bucket, and the vendor's own client contracts run entirely outside the platform — over Messenger, email, paper. That's documented in Vendor Agreement § 12.1 as the V1 default, with PandaDoc / DocuSign tagged as the V1.5 digital-signing plan.

This iteration does **not** replace § 12.1 for the vendor's onboarding agreement with Setnayan. § 12.1 stays the way vendors sign onto Setnayan. **This iteration is about the vendor's own contracts with their customers** — the photographer's wedding-day agreement, the caterer's package contract, the venue's reception booking. Those are currently a mess of Google Docs, paper, and "I'll send you the contract by Friday" promises that disappear into Messenger.

Setnayan can monetize a substantial vendor pain point — and pull more of the bookflow into the platform — by offering AI-powered contract assistance as a paid feature:

- **Detect** what the vendor's existing contract already covers (14 standard elements)
- **Fill gaps** with lawyer-reviewed Setnayan clauses the vendor can edit in place
- **Audit** against PH legal minimums (5 hard requirements + 5 soft recommendations)
- **Generate** a clean branded PDF
- **Bind** both parties via in-app e-signature (per RA 8792 — PH E-Commerce Act of 2000)
- **Store** the signed PDF with an audit-trail certificate page in R2 permanently
- **Surface** the signed contract in chat (0019) and admin Disputes Handler view (0023)

Operationally, this iteration is Setnayan moving from "marketplace + payment rails" → "marketplace + operational SaaS for vendors." Pro Subscription's value prop shifts from "marketing perks" to "operational tools the vendor would otherwise pay PandaDoc / SignNow / DocuSign for."

---

## 2. User flow (vendor side)

The flow is designed so a vendor who has never used a contract tool before can produce a binding contract in under 10 minutes for their first booking, and under 2 minutes for subsequent bookings (because their template + signature are cached).

**Entry point.** In the vendor dashboard (0022), a new **Contracts** tab appears in the primary nav. Initial state: empty list + a single primary CTA, `+ Create contract`.

**Step 1 — Pick the booking.**
Vendor clicks `+ Create contract` → modal asks "Which booking is this for?" → vendor picks from their active Clients surface (0022 Clients tab). The booking row carries the customer's identity, the event date, and any line-item totals already negotiated in chat (0019). Vendor can also choose `Not a Setnayan booking` to create a contract for an off-platform client — but only Standard Verified+ tiers can do this (a guardrail against the platform becoming a contract-mill).

**Step 2 — Pick the entry path.** Three buttons:

- **(A) Upload existing contract** — vendor uploads a PDF or .docx of the contract they normally send. Runs the AI analysis path.
- **(B) Start from template** — blank canvas. Vendor picks from the Setnayan template clause library (Section 5) to assemble a contract from scratch.
- **(C) Edit a prior contract** — duplicates one of the vendor's previously generated contracts as a starting point. The most common path after the first contract is generated.

**Step 3 — AI analysis (path A only).**
Vendor uploads PDF/docx. Worker extracts text, sends to Claude API. ~10–20 second progress card animates with rotating status messages ("Reading the contract…", "Checking what's covered…", "Comparing to PH legal minimums…"). On completion, the **Detection Panel** opens.

**Step 4 — Detection panel review.**
Lists the 14 contract elements from Section 3 with status icons:

- **Green check** — element detected and lawyer-reviewed-equivalent. No action required.
- **Amber warning** — element detected but weak (e.g., cancellation policy present but vague, "we'll refund what's fair").
- **Red X** — element missing entirely.

For each row the vendor can:

- **Keep** what they wrote — the panel shows the extracted snippet as evidence.
- **Replace with Setnayan's recommended version** — opens the clause-picker for that element.
- **Remove** — marks the element as intentionally omitted (the compliance gate will warn if it's a hard requirement, see Section 6).
- **Edit in place** — opens an inline editor with markdown-style formatting.

The detection panel is the heart of the iteration. It's where the AI does work the vendor would otherwise do by reading their own contract carefully — except the vendor never does that, which is why their contracts are full of gaps.

**Step 5 — Compliance checklist.**
A persistent sidebar runs the compliance check from Section 6 against the current contract state. Green / amber / red summary updates live as the vendor edits. The vendor cannot proceed to Send while any **red** (hard requirement missing) item is unresolved. Amber items show as warnings but are bypassable with an explicit "Send anyway" acknowledgment.

**Step 6 — Clause-fill from Setnayan library.**
For each gap the vendor wants to fill from the Setnayan library, the clause-picker shows:

- **Plain-English explanation** at the top — "This clause says you're not liable for damages above the contract amount."
- **The actual legal text** below — editable inline.
- **Service-category match** — clauses tagged "photography" surface first if the vendor is a photographer; the vendor can still pick from any category.
- **Lawyer-reviewed badge** with the date the clause was last reviewed by external counsel.

**Step 7 — Preview PDF.**
Vendor clicks **Preview**. A modal renders the generated PDF in-browser with both signature blocks visible (vendor side filled with their business name, customer side blank with the customer's legal name placeholder). The vendor can scroll the full PDF — header is the vendor's logo (mandatory per § 2.1b), footer is `Generated by Setnayan · setnayan.com/c/[contract_id]`.

**Step 8 — Send to customer.**
Vendor clicks **Send for signature** → the system creates a chat-card in the existing 0019 thread between vendor and customer, with a thumbnail of page 1 + a `Sign this contract` CTA. The contract enters `status='sent'`. A 30-day expiry starts from this moment.

If the vendor is on Vendor Pro Weekly, this step is free. Otherwise the vendor is charged ₱199 (the `contract_builder_single` SKU) before the contract sends — payment goes through the same apply-then-pay flow as any other in-app SKU (decision 2026-05-11), with the wrinkle that the contract sits in `status='draft'` until payment confirms. Pro Subscription vendors skip this entirely.

**Step 9 — Customer signs.**
Customer opens the chat-card → preview modal → reviews → signs via signature pad (touch device), typed-name-in-cursive-font, or drawn-with-mouse (Section 7). Signature captures user_id, IP, user-agent, timestamp. Contract enters `status='customer_signed'`. Vendor receives an in-app notification.

**Step 10 — Vendor signs.**
Vendor receives notification → opens contract → signs via the same options → contract enters `status='both_signed'`. A signed PDF is generated server-side embedding both signature images + a signature certificate page (Section 7). The PDF is stored permanently in R2 at `vendors/{vendor_id}/contracts/{contract_id}/signed.pdf`. A copy of the contract chat-card in the thread updates to show both signatures applied with the timestamps.

**Step 11 — Audit trail.**
Both the vendor and the customer can re-download the signed PDF from their dashboards forever. The admin Disputes Handler can view the full audit trail (every signature event + their metadata) for disputes mediation per Section 9.

---

## 3. The 14 detected contract elements

The Claude analysis prompt evaluates every uploaded contract for these 14 elements. They're not arbitrary — they're the categories that the external counsel (Section 11) identified as the standard PH wedding-vendor contract structure.

| # | Element | Why it matters | Severity |
|---|---|---|---|
| 1 | Parties identified — vendor legal name + customer legal name | Required for the contract to be binding under PH Civil Code Art. 1318 | Hard |
| 2 | Service description | Defines what the customer is purchasing; ambiguity here is the #1 disputes source | Hard |
| 3 | Pricing model + total amount | Required for binding; ambiguity is the #2 disputes source | Hard |
| 4 | Payment schedule (milestones / deposit / balance / due dates) | Disputes-blocker if absent; PH vendors typically use 3-stage but variations are common (see decision 2026-05-09 on flexible milestones) | Soft |
| 5 | Cancellation policy (windows + refund rules) | Required by PH consumer law minimum; sets expectations both ways | Hard |
| 6 | Force majeure clause | Wedding-specific high-risk (typhoons, Taal eruption, COVID-class events); without it the vendor bears all risk for events outside their control | Soft |
| 7 | Liability cap / disclaimer | Vendor protection; caps damages at the contract amount or specified ceiling | Soft |
| 8 | Deliverables timeline (turnaround days, revision rounds, file format) | Disputes-blocker; "edited photos delivered 8 weeks after wedding" is the standard, but many vendors don't write it down | Soft |
| 9 | Crew size + roles | Operational clarity; matches the crew-meal headcount in 0006 | Optional |
| 10 | Travel terms + fee (outside Metro Manila / Cebu Metro radius) | Common dispute source; often the vendor agrees verbally then bills travel after | Optional |
| 11 | Ownership / IP (who owns the photos / raw footage / RAW files / out-takes) | Photography/video specific; PH default per IP Code is photographer-owns, but customers regularly assume they own — write it down | Soft (if photo/video) |
| 12 | Warranty / re-shoot guarantee | Builds trust; some vendors offer it, many don't | Optional |
| 13 | Governing law + jurisdiction | Defaults to PH if absent — Setnayan's recommended template specifies Philippine law + venue at the city of the wedding | Soft |
| 14 | Signature blocks (both parties + dates) | Required for binding | Hard |

**Hard** = compliance gate red if missing. **Soft** = compliance gate amber if missing (Section 6). **Optional** = surfaces in the detection panel but doesn't gate.

The detection panel groups these by severity (Hard at the top, then Soft, then Optional) so the vendor's eye lands on the blockers first.

---

## 4. AI analysis architecture

**Provider.** Anthropic Console (locked 2026-05-16). Workspace **"Setnayan"** · spend caps **$500/mo soft alert · $2,000/mo hard cap · $100/day soft cap**. **Primary model for Contract Intelligence: `claude-haiku-4-5`** (cheaper text-extraction tier — analysis runs at ~80% lower cost than Sonnet while retaining comparable extraction accuracy on Filipino-language wedding contracts per the Setnayan benchmark suite). `claude-sonnet-4-6` reserved for vision tasks (AI Video Highlight + AI Edited Highlight when Papic ships V1.5+). OpenAI GPT-4 reserved as V1.5+ fallback. Setnayan billing consolidates AI Highlights + Contract Intelligence into one Anthropic Console invoice.

**Pipeline.**

1. Vendor uploads PDF/docx to a Cloudflare Worker endpoint `POST /api/contracts/analyze`. Max 10 MB per file. Larger files reject with "Please upload a smaller file or paste the text directly."
2. Worker stores the source file in R2 at `vendors/{vendor_id}/contracts/{contract_id}/source.pdf` (or `.docx`).
3. Worker invokes a Python sub-worker running `pdfplumber` (for PDFs) or `python-docx` (for .docx) to extract text. Output is a JSON of `{ page_number, text }` pairs.
4. Worker calls Claude API with the extracted text wrapped in the structured-output prompt (template below). Tokens budget ~6K input + ~2K output (typical 4–6 page vendor contract).
5. Claude returns JSON matching the schema in step 6. Worker validates the schema; on validation error, retries once with a corrective prompt; on second failure, surfaces "We couldn't analyze this contract automatically. Please contact support."
6. Worker writes the analysis to `contract_drafts.detected_elements` JSONB column (Section 8) and returns it to the vendor's browser. Total round-trip target: under 20 seconds at p95.

**Claude prompt template (abridged).** The full prompt is versioned in `/contracts/prompts/analyze_v{n}.md`. The structural shape:

```
SYSTEM
You are a Philippine contract law specialist analyzing a vendor's contract for completeness.
You return JSON only — no prose, no markdown. Schema below.

USER
Here is the extracted text of a vendor's contract for a wedding (or event) booking:

<contract>
{extracted_text}
</contract>

Analyze it for these 14 elements: { ... list from Section 3 ... }.

For each element return:
{
  "element": "<element_name>",
  "status": "present" | "weak" | "absent",
  "evidence": "<verbatim snippet from contract that supports the status, max 300 chars; empty if absent>",
  "page_number": <int | null>,
  "rationale": "<one-sentence explanation of why this status, max 200 chars>",
  "recommendation": "keep" | "strengthen" | "add"
}

Return a top-level object:
{
  "analyzed_at": "<ISO timestamp>",
  "model_version": "claude-haiku-4-5",
  "elements": [<14 element objects in the order listed>],
  "overall_compliance_score": <0–100 int computed as: (#hard_present × 15) + (#soft_present × 5) + (#optional_present × 2), capped at 100>,
  "general_observations": "<2–3 sentences of overall feedback, max 600 chars>"
}
```

**Cost.** Updated 2026-05-16 — at Claude **Haiku 4.5** input pricing (~$0.80/M tokens) and output (~$4/M tokens), a typical 6K-input + 2K-output analysis runs **~$0.013** ≈ ₱0.65 per call (80% lower than the prior Sonnet 4.6 estimate of ~$0.03–$0.05 / ₱1.50–₱3.00). We round up to **~₱1 per analysis** in the cost model to absorb retries and longer contracts. Projected V1 spend at 500 contract analyses/month = ~$6.50/mo · well within the $500/mo soft alert (4× safety margin). ~~Prior Sonnet 4.6 estimate retired 2026-05-16.~~

**Latency.** PDF text extraction ~1–3 seconds (pdfplumber on a Cloudflare Worker is fast for typed PDFs; scanned PDFs trigger an OCR fallback that takes ~10s and bumps the total to ~30s — we surface a longer progress message for OCR'd files).

**Retry / failure handling.** Vendor sees one of three outcomes after upload:

- **Success** — detection panel opens with results.
- **OCR fallback** — "We're reading a scanned contract — this takes a bit longer." Continues to detection panel.
- **Failure** — "We couldn't analyze this automatically. You can still build a contract from scratch using Setnayan's templates [B button], or contact support." The vendor isn't charged for the analysis attempt (the ₱199 SKU charge only fires on Send, not on analysis).

---

## 4a. Cross-iteration model reuse — Concierge synthesis (Locked 2026-05-18)

The Anthropic workspace established in § 4 (Claude Console workspace
"Setnayan" · spend caps locked $500/$2K/$100 · primary text model
**Claude Haiku 4.5** · Sonnet 4.6 reserved for vision) is **also
the synthesis backend for the paid-tier Setnayan Concierge**
conversational planner introduced in 0016 § 0a (locked 2026-05-18).

**No new workspace, no new spend caps, no new model approval.**
Concierge paid-tier requests flow through the same workspace
already approved for contract intelligence; cost per concierge
question (~₱0.50) is one-eighth the per-contract analysis cost,
so the existing $500 hard cap covers both surfaces with significant
headroom even at peak.

**Free-tier Concierge synthesis** (DIY 3-question taste + 3-day
trial) does NOT touch this workspace — it runs against Cloudflare
Workers AI free tier (`@cf/meta/llama-3.1-8b-instruct-fast`). Only
the Active Concierge tier (₱4,999/12mo) routes through Anthropic.
See `02_Specifications/18_Concierge_Brain/00_Architecture.md` § 4
for the full model-by-tier matrix.

**Failure mode crossover.** When Haiku is rate-limited or the
Anthropic API returns 5xx for Concierge requests, the synthesis
falls through to Cloudflare's free Llama 8B (logged as a
degradation event in `admin_audit_log`). Contract Intelligence
itself does NOT have this fallback — contract analysis is paid
and synchronous; couples paying for Contract Intelligence get the
error toast and a refund-eligible retry, not a degraded fallback.

**Cost watch integration.** Concierge per-message cost
(`concierge_messages.cost_centavos`) joins the existing
`service_catalog_cost_watch` health surface in 0023 § 3.12 admin
add-on management, broken down by tier (DIY vs Active) and by
synthesis model. The same surface watches Contract Intelligence
per-analysis cost. One pane of glass for all Anthropic spend.

---

## 5. Setnayan template clause library

A curated library of lawyer-reviewed PH-compliant clauses across the 14 elements (Section 3). V1 ships ~50 master clauses. Each clause has:

- **`title`** — short label shown in the picker ("Standard cancellation — 60-day refund window")
- **`element_type`** — which of the 14 elements this clause fills (`cancellation`, `force_majeure`, `liability`, `ip_ownership`, etc.)
- **`plain_english`** — 1–2 sentence vendor-friendly explanation. The vendor sees this BEFORE the legal text.
- **`legal_text_en`** — the actual contract language in English. Designed to be paste-able verbatim, with `{vendor_name}` / `{customer_name}` / `{event_date}` / `{total_amount}` placeholders that the system fills.
- **`legal_text_tl`** — Tagalog translation (nullable in V1; flagged for future locale work matching the 0015 EN/TL/CEB pattern). Most clauses ship English-only at V1 launch.
- **`applicable_categories`** — service categories where this clause is relevant (`photography`, `videography`, `catering`, `venue`, `flowers`, `coordination`, `mua`, `gown`, `entertainment`, `*` for universal). Drives the surfacing-order in the clause picker.
- **`clause_version`** — integer, increments when external counsel updates the legal text. Existing contracts keep their version snapshot; new contracts get the latest. We never silently mutate a signed contract.
- **`is_active`** — boolean. Setnayan can retire a clause without deleting it (existing contracts still reference the historical row).
- **`reviewed_by_legal_at`** — timestamp of the most recent external counsel review.

**Distribution across the 14 elements (V1 target, ~50 total):**

| Element | Clause count V1 | Notes |
|---|---|---|
| Parties identification | 2 | Standard (with full legal name) + with-rep (business represented by an officer) |
| Service description | 6 | Photography full-day, videography full-day, catering pax-based, venue reception, flowers + setup, MUA per-head |
| Pricing model | 4 | Fixed-fee, pax-based, per-hour, package-with-add-ons |
| Payment schedule | 4 | 3-stage (50/30/20), 2-stage (50/50), 4-stage (25/25/25/25), single-payment |
| Cancellation policy | 5 | 60-day refund, 90-day refund, sliding-scale, non-refundable deposit, force-majeure-clause-pointer |
| Force majeure | 3 | Standard (acts of God + government action), wedding-specific (typhoons + venue closure + travel restrictions), broad (everything outside party control) |
| Liability cap | 3 | Contract-amount cap, specified-amount cap, no-cap-with-disclaimer |
| Deliverables timeline | 6 | Photography 6-8 weeks, videography 8-12 weeks, SDE 24-48hrs, catering same-day, flowers setup-day-only, gown 3-week-fitting-cycle |
| Crew size + roles | 4 | Photography (lead + 2nd shooter + assistant), videography (cinematographer + audio + drone), catering (chef + servers + bar), coordination (lead + 2 assistants) |
| Travel terms | 3 | Inside Metro Manila no-fee, outside-Metro distance-based, separate-day overnight |
| IP ownership | 4 | Photographer-owns-RAW-customer-owns-edits, customer-owns-everything, shared-ownership, social-media-usage-license |
| Warranty / re-shoot | 2 | Standard re-shoot (vendor-fault only), goodwill (vendor + customer mutual cause) |
| Governing law | 2 | Philippine law + city-of-wedding venue, Philippine law + NCR venue |
| Signature blocks | 2 | 2-signer (vendor + customer), 3-signer (vendor + customer + witness) |

This distribution is the V1 target. The actual seeded clauses are reviewed by external counsel (Section 11) before launch and stored in `contract_clause_library` (Section 8). The legal team workstream is a separate effort — Setnayan provides the structure and the clause-prompts; the lawyer writes the binding English text.

**Editing a clause in place.** Vendors can edit any clause they insert. The system tracks this as a vendor-customized clause linked to the parent template clause (so we can see how many vendors edit a given clause — signal for the legal team to revise it). Vendor edits do NOT change the master library; they're per-contract overrides.

**Plain-English-first surfacing.** The clause-picker leads with the plain-English explanation. A vendor browsing the cancellation-policy clauses sees:

> **Standard cancellation — 60-day refund window**
> If the customer cancels more than 60 days before the event, they get a full refund minus the deposit. Between 30–60 days, 50% refund. Within 30 days, no refund.
> _[Click to see full legal text →]_

This pattern shifts the vendor from "I'm not a lawyer, I don't know what this means" to "OK that's what I want, insert it."

---

## 6. Compliance checklist — the bare-minimum gate

The compliance check defines what "bare minimum PH-compliant contract" means for Setnayan's purposes. It's a deliberate floor, not a ceiling — vendors can add anything they want above this; the check just prevents shipping a contract that's missing core elements.

**Hard requirements (compliance gate red if missing — vendor cannot Send):**

1. Both parties identified by full legal name (element #1)
2. Service description present (element #2)
3. Total price specified (element #3)
4. Cancellation policy present — any policy, the content doesn't have to match Setnayan's templates (element #5)
5. Both signature blocks present (element #14)

**Soft recommendations (compliance gate amber if missing — vendor can Send with an acknowledgment):**

6. Force majeure clause (element #6)
7. Liability cap (element #7)
8. Deliverables timeline (element #8)
9. Governing law clause (element #13)
10. Payment schedule (if total > ₱30,000 — small bookings often pay in full upfront, so this is conditional) (element #4)

**Compliance badges:**

- **✓ Compliant — Recommended** — all 5 hard + 3+ soft present. Renders a green "Compliant — Recommended" badge on the contract PDF footer.
- **✓ Compliant — Minimum** — all 5 hard + fewer than 3 soft. Green check but no "Recommended" label.
- **✗ Not Compliant** — any hard requirement missing. Send button is disabled. Vendor must resolve before sending.

The compliance badge appears on the generated PDF footer (small text, alongside the Setnayan-generated marker). This is intentional — customers reading the contract see at a glance whether the contract hits Setnayan's recommended bar. It nudges vendors toward the Recommended tier.

**Compliance score** (separate from the gate). A 0–100 numeric score stored in `contract_drafts.compliance_score` for analytics. Formula:

```
score = min(100, (#hard_present × 15) + (#soft_present × 5) + (#optional_present × 2))
```

A perfect contract (5 hard × 15 + 5 soft × 5 + 4 optional × 2) = 75 + 25 + 8 = 108, capped at 100. A bare-minimum compliant contract = 75. The dashboard surfaces this score so vendors can see trend (`your average contract score this quarter is 82, up from 71`).

---

## 7. E-signature mechanics

Per RA 8792 (Philippine E-Commerce Act of 2000), electronic signatures with a reliable audit trail are legally equivalent to wet-ink signatures for non-real-estate contracts. Wedding-vendor contracts fall squarely within this scope.

**Signature capture methods (vendor picks at signing time):**

1. **Signature pad** — touch-device users draw their signature with their finger or stylus on a canvas element. The canvas is 600 × 200 pixels, rendered at 2x for retina. Stroke smoothing applied via Catmull-Rom spline.
2. **Typed name** — desktop users without a stylus can type their full legal name; the system renders it in a cursive web font (`Great Vibes` from Google Fonts) and displays "I, [Name], affirm this is my signature" above the rendered image.
3. **Drawn-with-mouse** — desktop users with a mouse can draw their signature on the same canvas as method (1). Strokes smoothed identically.

All three methods produce a transparent-background PNG signature image, stored at `vendors/{vendor_id}/contracts/{contract_id}/signatures/{signature_id}.png` in R2.

**Metadata captured per signature event** (stored in `contract_signatures`):

- `signer_user_id` — auth-verified Setnayan account
- `signer_role` — `vendor` or `customer`
- `signature_method` — `signature_pad` | `typed` | `drawn`
- `signature_image_r2_key` — pointer to the PNG
- `ip_address` — captured at the moment of signature
- `user_agent` — full UA string (browser + OS + device class)
- `geo_lat` / `geo_lon` — captured only with explicit consent at the signing modal (a checkbox: "Capture my location to strengthen the audit trail")
- `signed_at` — server-side timestamp (UTC, rendered as PHT in displays)

**Signature certificate page.** When `both_signed` triggers, the system generates a final PDF that contains:

- The full contract (vendor's content + Setnayan template clauses, fully composed)
- Both signature images applied to the signature blocks
- A **Signature Certificate** page appended as the last page, containing:
  - Contract ID (UUID)
  - Vendor full legal name + signed-at timestamp + IP + UA
  - Customer full legal name + signed-at timestamp + IP + UA
  - Signature method for each signer
  - Setnayan platform identifier + RA 8792 reference
  - QR code linking to `setnayan.com/c/[contract_id]/verify` (public verification page that confirms the contract was signed on Setnayan and matches the stored signed_pdf hash)

**Verification page.** `setnayan.com/c/[contract_id]/verify` is a public read-only page that shows:

- The contract ID + signed-at timestamps for both parties (no PII beyond what's on the certificate page)
- A `Verified by Setnayan` badge
- A SHA-256 hash of the signed PDF for tamper-detection

This page is the equivalent of DocuSign's verification page. Either party (or anyone with the link) can confirm the contract is genuinely Setnayan-signed and hasn't been altered.

**Storage and retention.** Signed PDFs are stored permanently in R2 (no expiry, no compression — these are legal records). Source PDFs (the vendor's uploaded original, if any) are retained for 1 year then archived to R2 cold tier. Signature images are retained as long as the parent contract is retained.

**Access control.** Signed PDFs are accessible by:

- The vendor (any team member with vendor-account access)
- The customer (the specific user_id who signed)
- The admin Disputes Handler role (any contract, for mediation)
- The public verification page (read-only confirmation that the contract exists, no content access)

R2 access enforced via signed URLs from the Setnayan backend, never via public bucket policy.

**Legal validity disclaimer.** Every generated contract footer reads:

> This contract was generated using Setnayan's template clause library and signed electronically via Setnayan in compliance with the Philippine E-Commerce Act of 2000 (Republic Act 8792). Setnayan is not a law firm and this contract may not address all your specific legal needs. For specialized advice consult a Philippine attorney.

---

## 8. Schema

Four new tables. All UUIDs use `gen_random_uuid()` default. All timestamps are `TIMESTAMPTZ`. RLS policies follow the same pattern as 0019 chat threads — vendor + customer + admin Disputes Handler only.

```sql
-- The main contract record. Created when the vendor starts a draft;
-- mutated through the status lifecycle (draft → sent → customer_signed → both_signed).
CREATE TABLE contract_drafts (
  contract_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id            UUID NOT NULL REFERENCES vendors(vendor_id),
  customer_user_id     UUID NOT NULL REFERENCES users(user_id),
  booking_id           UUID,  -- nullable; contracts can be drafted before a booking is firm
  thread_id            UUID REFERENCES chat_threads(thread_id),  -- the 0019 thread the contract was sent through
  title                TEXT NOT NULL,  -- vendor-facing label, e.g. "Cruz-Reyes Wedding Photography Contract"
  source_pdf_r2_key    TEXT,  -- nullable; only present if vendor uploaded an existing contract (path A)
  entry_path           TEXT NOT NULL CHECK (entry_path IN ('upload','template','duplicate')),
  source_contract_id   UUID REFERENCES contract_drafts(contract_id),  -- if duplicated from another contract (path C)
  status               TEXT NOT NULL DEFAULT 'draft'
                       CHECK (status IN ('draft','sent','customer_signed','both_signed','rejected','expired','cancelled')),
  detected_elements    JSONB,  -- Claude API output cached; null if entry_path != 'upload'
  contract_body        JSONB NOT NULL DEFAULT '{}'::jsonb,  -- the editable composed contract (sections + clauses + variable fills)
  compliance_score     INT,  -- 0-100; computed at send time
  compliance_badge     TEXT CHECK (compliance_badge IN ('not_compliant','compliant_minimum','compliant_recommended')),
  generated_pdf_r2_key TEXT,  -- the unsigned-but-finalized PDF generated at send
  signed_pdf_r2_key    TEXT,  -- the both-signed final PDF; populated at both_signed
  signed_pdf_sha256    TEXT,  -- SHA-256 of the signed PDF for tamper-detection on the verify page
  rejection_reason     TEXT,  -- customer-supplied reason if status='rejected'
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at              TIMESTAMPTZ,
  customer_signed_at   TIMESTAMPTZ,
  vendor_signed_at     TIMESTAMPTZ,
  expires_at           TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX contract_drafts_vendor_status_idx ON contract_drafts (vendor_id, status, created_at DESC);
CREATE INDEX contract_drafts_customer_idx ON contract_drafts (customer_user_id, created_at DESC);
CREATE INDEX contract_drafts_expires_idx ON contract_drafts (expires_at) WHERE status = 'sent';

-- One row per signature event. Two rows per fully-signed contract (vendor + customer).
CREATE TABLE contract_signatures (
  signature_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id            UUID NOT NULL REFERENCES contract_drafts(contract_id) ON DELETE CASCADE,
  signer_user_id         UUID NOT NULL REFERENCES users(user_id),
  signer_role            TEXT NOT NULL CHECK (signer_role IN ('vendor','customer')),
  signature_method       TEXT NOT NULL CHECK (signature_method IN ('signature_pad','typed','drawn')),
  signature_image_r2_key TEXT NOT NULL,  -- PNG of the signature
  signer_full_name       TEXT NOT NULL,  -- captured at sign time (legal name as displayed on signature block)
  ip_address             INET NOT NULL,
  user_agent             TEXT NOT NULL,
  geo_lat                NUMERIC,  -- captured only with explicit consent
  geo_lon                NUMERIC,
  geo_consented          BOOLEAN NOT NULL DEFAULT FALSE,
  signed_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (contract_id, signer_role)  -- one signature per role per contract
);

CREATE INDEX contract_signatures_contract_idx ON contract_signatures (contract_id);

-- The master library of lawyer-reviewed PH-compliant clauses.
-- ~50 rows at V1 launch (Section 5 distribution).
CREATE TABLE contract_clause_library (
  clause_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  element_type          TEXT NOT NULL,  -- 'force_majeure', 'liability_cap', 'cancellation', 'ip_ownership', 'governing_law', etc.
  title                 TEXT NOT NULL,
  plain_english         TEXT NOT NULL,  -- vendor-facing explanation, shown first in the picker
  legal_text_en         TEXT NOT NULL,  -- the binding contract language (with {placeholders})
  legal_text_tl         TEXT,  -- Tagalog future; null at V1 launch for most clauses
  applicable_categories TEXT[] NOT NULL DEFAULT ARRAY['*'],  -- service categories; '*' = universal
  clause_version        INT NOT NULL DEFAULT 1,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_by_legal_at  TIMESTAMPTZ,  -- timestamp of most recent external-counsel review
  reviewed_by_legal_id  TEXT,  -- identifier of the external counsel firm (e.g., 'disini-disini-2026-05')
  retired_at            TIMESTAMPTZ
);

CREATE INDEX contract_clause_library_element_active_idx
  ON contract_clause_library (element_type, is_active);

-- Tracks vendor purchases of the contract-builder SKU.
-- Either a one-time ₱199 purchase or a no-op row referencing a Pro subscription.
CREATE TABLE contract_purchases (
  purchase_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id           UUID NOT NULL REFERENCES contract_drafts(contract_id) ON DELETE CASCADE,
  vendor_id             UUID NOT NULL REFERENCES vendors(vendor_id),
  sku                   TEXT NOT NULL CHECK (sku IN ('contract_builder_single','pro_inclusion')),
  amount_php            INT NOT NULL,  -- 19900 (₱199 in centavos) or 0 (Pro inclusion)
  service_order_id      UUID REFERENCES service_orders(order_id),  -- nullable for Pro inclusion
  pro_subscription_id   UUID,  -- nullable for pay-as-you-go; references the vendor's active Pro subscription
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (contract_id)  -- one purchase row per contract
);

CREATE INDEX contract_purchases_vendor_idx ON contract_purchases (vendor_id, created_at DESC);
```

**`contract_body` JSONB structure** (the canonical editable form of the contract):

```jsonc
{
  "schema_version": 1,
  "sections": [
    {
      "section_id": "parties",
      "element_type": "parties",
      "title": "Parties",
      "content_markdown": "This contract is entered into by **{vendor_name}** ('the Vendor') and **{customer_name}** ('the Customer') on {contract_date}.",
      "source": "setnayan_clause",
      "clause_id": "uuid-of-clause",
      "clause_version_snapshot": 2
    },
    { ... services description section ... },
    { ... pricing section ... },
    /* ... up to 14 sections matching the 14 elements ... */
  ],
  "variables": {
    "vendor_name": "Sample Studio, Inc.",
    "customer_name": "Maria Cruz",
    "event_date": "2026-11-22",
    "total_amount_php": 8500000
  }
}
```

The PDF generator reads this structure, substitutes variables, and produces the final PDF.

---

## 9. UI surfaces

**Vendor dashboard (0022) — new `Contracts` tab.**

- Top: search + filter (status: All / Draft / Sent / Signed / Expired).
- Primary CTA `+ Create contract`.
- List of contracts as rows: title, customer name, event date, status pill, compliance badge, last-action timestamp.
- Row click → contract detail view (the same screen used during creation, but in read or edit mode based on status).
- Empty state: explainer + the 3 entry-path buttons inline. First-contract experience.

**Vendor — contract detail view.**

- Left column: the composed contract (read or edit mode).
- Right column: detection panel (collapsible) + compliance checklist sidebar (persistent).
- Top toolbar: Status pill, `Preview` button, `Send` button (disabled if compliance gate red), `Cancel`, `Duplicate`.
- After both signed: `Send` becomes `Download signed PDF` + `View audit trail`.

**Customer dashboard (0021) — Vendor profile gains a `Contracts` sub-tab.**

- Lists contracts the vendor has sent to this customer.
- Each row: contract title, vendor, status, expires_at countdown if `sent`.
- Click → preview modal with `Sign` CTA at the bottom.
- Sign CTA opens the signature modal (Section 7) with the three method tabs.

**Chat thread (0019) — contract chat-card.**

- When a contract is sent, the system posts a chat-card to the existing vendor↔customer thread.
- Card shows: thumbnail of page 1 of the generated PDF, contract title, status pill, primary CTA (`Sign this contract` for the customer / `View status` for the vendor).
- Card updates in place as the status changes (customer signed → vendor turn → both signed).
- Final signed state: card shows `Signed · [date]` with a `Download` CTA.

**Admin (0023) — Contracts audit log.**

- Admin > Disputes > Contracts view (Disputes Handler role).
- Lists all contracts across the platform, filterable by vendor, customer, status, compliance score range.
- Click any → admin contract detail with full audit trail visible:
  - Source PDF (if any)
  - Detection results
  - Composed contract body
  - Both signature events with full metadata (IP, UA, geo if consented)
  - Signed PDF
- Used during disputes mediation — the Disputes Handler can confirm "yes, the customer signed this on [date] from this IP" or "no, this contract was never signed by the customer."

**Notifications.**

- Contract sent → customer in-app notification (V1) + email (when 0028 ships in parallel)
- Customer signed → vendor in-app notification + email
- Both signed → both parties in-app notification + email with the signed PDF attached
- Contract expiring in 3 days → vendor + customer reminder
- Contract expired → vendor in-app notification (offer to resend)

---

## 10. Pro Subscription positioning

Pro Subscription's value prop is restructured. Pre-this-iteration, Pro was framed as "marketing perks" (analytics, landing styling, boost eligibility). With this iteration, Pro becomes "operational SaaS" with marketing perks as a side benefit.

**New Pro Subscription benefit list (replaces the 0022 version):**

- Unlimited contract generation + e-signature **(NEW)**
- Vendor analytics dashboard
- Landing styling (custom theme picker from the four themes)
- Boost purchase eligibility (Boost is a separate SKU; Pro just unlocks the right to purchase it)
- Verified-badge gold tint (cosmetic, identifies Pro vendors visually in marketplace listings)
- Priority verification re-review (admin Verification Handler bumps Pro applications to the top of the queue)

**ROI math** (the pitch on the Pro subscription upgrade modal):

> Pro is ₱499/wk = ₱25,948/yr.
> If you generate **3+ contracts per month** at ₱199 each, Pro pays for itself on contracts alone.
> The analytics, theme picker, and verified-badge gold tint are bonus.
> _3 contracts × ₱199 × 52 weeks = ₱31,044 > ₱25,948._

This shifts the upgrade-trigger from "I want to look fancier" to "I run a real business and 3+ bookings/month is normal." Vendors generating fewer than 3 contracts/month stay on pay-as-you-go; vendors generating more upgrade naturally.

**Pro subscription badge differentiation.** In the vendor's Contracts tab list, a contract generated under Pro shows a `Pro` flag on the row. In the vendor's Pro Subscription detail page, a "Contracts this billing period" counter shows usage — useful for the vendor's own internal accounting.

---

## 11. Compliance + legal posture

**External counsel review (gate to V1 launch).** Setnayan engages a PH labor / contracts law firm to review the ~50 master clauses before this iteration ships. Candidates: **Disini & Disini Law Office** (well-known for tech / e-commerce), **ALA Law** (broad commercial practice), **Romulo Law** (large firm experience). Estimated one-time fee: **₱30,000–₱50,000** for a single review pass. Each clause receives the firm's stamp in `contract_clause_library.reviewed_by_legal_id` + `reviewed_by_legal_at`. A re-review is triggered annually or whenever PH contract law changes (new RA, Supreme Court ruling) — re-review fee likely ₱15,000–₱25,000.

**Setnayan is NOT a law firm.** Disclaimer on every generated contract footer:

> This contract is a template provided by Setnayan and may not address all your specific legal needs. Consult a Philippine lawyer if you have specific concerns about your booking or your legal exposure.

This is non-removable. Vendors cannot edit it out. The disclaimer is part of the rendered PDF template at generation time.

**AI analysis is advisory only.** The detection panel and compliance checklist are described as "Setnayan's read" — not "the legal verdict." The vendor accepts final responsibility for the contract content via an "I confirm this contract is accurate and reflects my agreement with the customer" checkbox before Send. Without that checkbox, Send is disabled even with green compliance.

**Liability invariant.** If a vendor signs a Setnayan-generated contract that turns out to have a defect (e.g., a force majeure clause Setnayan's template forgot to cover the typhoon that hit on the wedding day), the dispute is between the vendor and customer — Setnayan is the tool, not the party. The Terms of Service explicitly disclaim Setnayan from contract content liability when the vendor exercised final-confirmation. The external counsel review is what gives this disclaimer real-world weight (we did our diligence).

**Data privacy (RA 10173).** Contracts contain PII (full legal names, signature images, optionally geolocation). All four tables in Section 8 are subject to the same Supabase RLS + R2 signed-URL controls described in the Setnayan Privacy & Security Policy (2026-05-12). Customer can request deletion of their PII via the 0025 Privacy & Data tab — but contracts under PH law are retention-required for the duration of the obligation period (typically 5 years post-event). The deletion-request flow surfaces this and offers anonymization-instead-of-deletion (replace customer name with `[Customer — Deletion Requested]` in the public verify page, keep the contract intact in the audit trail for legal compliance).

**RA 8792 e-signature posture.** Per RA 8792 §§ 5 + 7 + 8, an electronic signature is valid if it is uniquely linked to the signatory, capable of identifying the signatory, made under the signatory's sole control, and linked to the data in a way that any change is detectable. Our implementation satisfies all four:

- Uniquely linked: tied to `signer_user_id` (auth-verified Setnayan account)
- Identifies the signatory: full legal name + IP + UA + signed-at
- Sole control: auth gate at signing time (re-auth required for the signature step)
- Change detection: SHA-256 hash of the signed PDF stored at `contract_drafts.signed_pdf_sha256`; the public verify page exposes this for tamper checks

The signature certificate page renders this all visibly so any reader of the PDF can see the audit trail without needing access to Setnayan's database.

---

## 12. Acceptance tests

V1 ships when all of these pass:

1. **Upload PDF → detection panel.** A vendor uploads a sample wedding photography contract (3 pages, typed PDF). Within 20 seconds (p95), the detection panel renders with all 14 elements showing accurate status.
2. **Upload scanned PDF → OCR fallback.** A vendor uploads a scanned-paper-contract PDF. The progress card shows the OCR message. Within 35 seconds (p95), detection panel renders.
3. **Upload .docx → detection panel.** Same as test 1 with a .docx upload.
4. **Start from template path.** A vendor picks "Start from template" → assembles a 6-section contract → compliance gate goes green → can Send.
5. **Compliance gate red — Send disabled.** A vendor creates a contract missing a cancellation policy (hard requirement). Send button is disabled. Tooltip explains why.
6. **Compliance gate amber — Send with acknowledgment.** Vendor missing only force majeure. Send button shows a warning modal: "This contract is missing recommended clauses. Send anyway?" Acknowledgment proceeds.
7. **Pay-as-you-go vendor pays ₱199 before Send.** A non-Pro vendor clicks Send. System charges via apply-then-pay (24-hr SLA). Contract stays `draft` until payment confirms, then auto-sends.
8. **Pro vendor sends free.** A Pro-Subscription vendor clicks Send. No payment flow. Contract sends immediately. `contract_purchases` row written with `sku='pro_inclusion'` + `amount_php=0`.
9. **Customer signs via signature pad.** On an iPad, customer draws signature → submits. `contract_signatures` row written with `signature_method='signature_pad'`. Contract enters `customer_signed`.
10. **Vendor signs → both_signed → PDF generated.** Vendor signs. System generates signed PDF with both signatures + certificate page. `signed_pdf_r2_key` populated. `signed_pdf_sha256` populated.
11. **Verify page resolves.** `setnayan.com/c/[contract_id]/verify` loads, shows both timestamps + the SHA-256, matches the stored hash.
12. **Admin Disputes Handler view.** Admin loads `/dashboard/admin/contracts/[contract_id]`, sees full audit trail including both signature events' IP + UA.
13. **Customer rejection.** Customer opens the contract in their chat-card, clicks Reject with a reason. Contract enters `rejected`. Vendor receives notification with the reason. Contract is not sendable as-is again (vendor must duplicate to retry).
14. **30-day expiry.** A contract sent and unsigned for 30 days enters `expired` via the scheduled job. Vendor sees expired notification + offer to resend.
15. **Compliance score accuracy.** A contract with all 5 hard + all 5 soft + 0 optional elements computes `compliance_score = 100` (capped: 75 + 25 = 100). A contract with 5 hard + 0 soft + 0 optional computes `compliance_score = 75`.

---

## 13. Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-05-12 | **Pricing locked: ₱199 pay-as-you-go + free for Vendor Pro Weekly.** SKU `contract_builder_single` registered in `service_catalog` at ₱199. Vendor Pro Weekly subscription unlocks unlimited generation. | ₱199 is the same charm-priced tier as the Pro Widget (₱99) and Pro Bundle (₱199) — vendor-facing pricing already established at that level for individual feature unlocks. Pro inclusion converts the Pro Subscription pitch from "marketing perks" to "operational SaaS" — substantially stronger upgrade hook (Section 10 ROI math). |
| 2026-05-12 | **All verification tiers can purchase.** Standard Verified / Certified / Boosted all access the SKU. | Even Standard Verified vendors close real bookings and need contracts. Restricting to higher tiers would gate the feature behind progression that's slow at launch. |
| 2026-05-12 | **AI analysis via Claude Sonnet 4.6.** Same provider as AI Video Highlight + AI Edited Highlight; consolidated billing relationship. ~~Sonnet 4.6 for Contract Intelligence~~ **SUPERSEDED 2026-05-16 — see next row.** | No new vendor relationship. Existing Claude API quota covers the additional load (analysis runs ~₱5 per call). |
| 2026-05-16 | **Contract Intelligence model switched to Claude Haiku 4.5; Anthropic Console workspace "Setnayan" with spend caps ($500/mo soft / $2K/mo hard / $100/day soft); Sonnet 4.6 reserved for vision tasks; OpenAI GPT-4 reserved as V1.5+ fallback. Unblocks 0032 for V1 ship.** | Haiku 4.5 cuts per-call cost ~80% (₱5 → ~₱1) while retaining extraction accuracy on Filipino-language wedding contracts (benchmark suite passes). Sonnet 4.6 stays the vision/highlights model; the budget tier is correct for text-extraction at scale. The Anthropic Console signup with hard $2K/mo cap was the last blocking dependency on 0032 V1 ship — closed. |
| 2026-05-12 | **14-element detection schema locked.** The list is exhaustive enough to cover PH wedding-vendor contracts (cross-checked against the seed template set the legal team will draft). Optional elements (#9 crew size, #10 travel, #12 warranty) don't gate compliance. | A larger element list would balloon the Claude prompt and slow analysis. A smaller list would miss things vendors care about. 14 is the goldilocks. |
| 2026-05-12 | **5 hard + 5 soft compliance requirements.** Hard requirements gate Send. Soft requirements are warning-only with acknowledgment. | Hard requirements track the actual legal-binding floor (parties, service, price, cancellation policy, signature). Soft requirements track best practices that responsible vendors include. This split avoids forcing template-perfection on vendors with simple bookings while still flagging weak contracts. |
| 2026-05-12 | **PH E-Commerce Act of 2000 (RA 8792) as the e-signature basis.** Three signature methods (signature pad / typed / drawn). All capture user_id + IP + UA + timestamp; geolocation optional with explicit consent. SHA-256 hash on the signed PDF for tamper detection. | RA 8792 is the binding PH law for e-signatures. Three capture methods cover the full device matrix (touch, keyboard, mouse). Optional geolocation respects the privacy invariants in the Setnayan Privacy & Security Policy without sacrificing audit-trail strength. |
| 2026-05-12 | **External counsel review gate before V1 launch.** ~50 master clauses + the certificate-page boilerplate + the Terms of Service disclaimer reviewed by a PH contracts firm (Disini & Disini / ALA Law / Romulo Law). Estimated cost ₱30K–₱50K one-time + ₱15K–₱25K annual re-review. | Without external counsel review, "Setnayan template clauses" is marketing copy. With it, the templates have legal weight + Setnayan's liability disclaimer holds up. The cost is small relative to the SKU's revenue potential. |
| 2026-05-12 | **Setnayan is NOT a law firm — disclaimer on every contract.** Non-removable footer + "I confirm this is accurate" checkbox before Send. | Liability invariant. Vendor accepts final responsibility for contract content. Setnayan provides the tool, not the legal opinion. The external counsel review is the diligence that supports this disclaimer. |
| 2026-05-12 | **Signed contracts stored permanently in R2.** No expiry, no compression on signed_pdf. Source PDFs retained 1 year then cold-tier. Signature images retained with parent contract. | Legal records. PH retention requirement is typically 5+ years post-event; over-retention is the safe default. R2 storage cost is negligible relative to legal risk of premature deletion. |
| 2026-05-12 | **30-day default expiry for sent-unsigned contracts.** Vendor can resend (which creates a duplicate, resetting the 30-day clock). | A sent-unsigned contract that sits for months is more confusing than helpful. 30 days is enough for most customers to act. Resend is one click. |
| 2026-05-12 | **Customer rejection requires a reason.** Rejection enters `status='rejected'` + `rejection_reason` populated; vendor must duplicate to retry rather than re-editing the rejected one. | Force a clear break between "this contract was discussed and rejected" and "this is the new offer." Audit trail clarity. |
| 2026-05-12 | **Chat-card delivery via 0019 thread, not standalone email.** Email is a secondary notification (when 0028 ships); the canonical delivery is the chat thread. | Keeps the booking conversation + contract in one place. Customers don't have to context-switch to email + back. Aligns with the 0019 "all communications in one place" pattern. |
| 2026-05-12 | **Public verify page at `setnayan.com/c/[contract_id]/verify`.** Shows minimal PII (just the IDs + timestamps + SHA-256 hash). | Equivalent to DocuSign's verification page. Either party can confirm a contract is real without exposing customer/vendor identities to anyone with the link. The SHA-256 hash supports tamper detection. |
| 2026-05-12 | **Compliance score 0–100 stored for analytics.** Formula in Section 6. Surfaced on the vendor dashboard as a trend. | Vendor self-improvement signal. Doesn't gate anything; just informs. Lets us track platform-wide contract quality over time as a Setnayan-wide health metric. |
| 2026-05-12 | **PII-deletion conflict resolution: anonymization, not deletion.** If a customer requests RA 10173 deletion of contract PII while the contract is still under PH retention requirement, we anonymize the customer name on the public verify page + the audit trail keeps the original for legal compliance. | PH contract law retention requirement (5+ years post-event) conflicts with RA 10173 deletion right (§ 16 e). Anonymization splits the difference — public-facing PII removed, legal record preserved. |

---

## 14. Companion docs

- **Vendor Agreement § 12.1** — the manual signing flow for the vendor's onboarding agreement with Setnayan. NOT replaced by this iteration. V1.5 plan via PandaDoc / DocuSign for vendor-onboarding sits alongside this iteration's vendor↔customer flow.
- **0019 Communications** — the chat thread is the delivery channel; contract chat-card pattern lives alongside other 0019 message types.
- **0021 Couple Dashboard** — Customer-side signing surface (Contracts sub-tab under each Vendor profile).
- **0022 Vendor Dashboard** — Primary host for the Contracts tab + Pro Subscription value-prop refresh (Section 10).
- **0023 Admin Console** — Disputes Handler role consumes the full audit trail; Verification Handler is unaffected.
- **0025 Profile Settings** — Privacy & Data tab handles the RA 10173 deletion-request flow that interacts with contract retention (Section 11).
- **0026 BIR / Tax Compliance** — Generated contracts are evidence supporting Official Receipt issuance; the contract total_amount_php matches the OR amount.
- **0028 Email Notifications** — When email notifications ship (in parallel), this iteration's contract-state transitions trigger the appropriate templates (contract_sent / contract_signed / contract_expired). V1 ships in-app notifications only.
- **Setnayan Privacy & Security Policy (2026-05-12)** — Data scope, retention windows, RLS + R2 controls all defined there.
- **Pricing Workbook** — `contract_builder_single` (₱199) registered in `service_catalog` + Pro Subscription value-prop updated to include "unlimited contracts" benefit.

---

**End of iteration 0032.**
