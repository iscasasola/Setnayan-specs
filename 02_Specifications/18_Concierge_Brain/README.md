# 18 — Setnayan Concierge AI Brain

Curated knowledge base that powers the Setnayan Concierge conversational
surface (iteration **0016 § 0a**). The brain is the structured "what the
concierge knows" content layer; the synthesis model is the runtime LLM
that paraphrases brain content into a personalized answer.

**Status:** Locked 2026-05-18 (architecture). Content authoring is a
parallel content workstream — folder ships with skeletons + topic stubs
so engineering can wire the retrieval pipeline against a stable shape
while content is filled in iteratively.

## Folder contents

| File | Purpose |
|---|---|
| `README.md` (this file) | Overview, chunk authoring template, governance |
| `00_Architecture.md` | RAG pipeline · embedding model · synthesis model · free-tier vs paid-tier · cache strategy |
| `01_Filipino_Cultural_Reference.md` | Pamamanhikan · ninang/ninong roles · despedida · principal vs secondary sponsors · Catholic / Muslim / Civil tracks |
| `02_Regional_Pricing_Benchmarks.md` | NCR vs Cebu vs Davao vs Tagaytay vs Boracay venue + vendor pricing tiers |
| `03_Seasonal_Weather_Reference.md` | Dry vs wet season · peak-month (May/Dec) pricing pressure · rain risk by region |
| `04_Planning_Timelines.md` | 12-month / 6-month / 90-day / 30-day / day-of checklists · book-order dependencies |
| `05_Legal_BIR_Reference.md` | Marriage license process · prenup customs · BIR/EWT cross-ref to 0026 |
| `06_Setnayan_Feature_Reference.md` | What Panood/Papic/LED/Pakanta do · pricing · how to access (cross-ref iteration tree) |
| `07_Vendor_Decision_Logic.md` | What to book first · category dependencies · price-vs-tier guidance (cross-ref 0006) |
| `08_Budget_Allocation_Reference.md` | Working-budget tier definitions · category allocation tables (mirrors 0016 § 5) |
| `09_Date_Selection_Cultural_Logic.md` | 5-layer cultural reasoning for wedding dates (Catholic · Chinese-Filipino numerology · Filipino folk · practical reality · Western astrology) · powers Wizard Card 01 Set Wedding Date |

## Chunk authoring template

Every brain entry is a single markdown file (or top-level `##` section
inside a topic file) shaped for retrieval. Use this template:

```markdown
## {Topic title — specific, e.g. "Ninang and Ninong sponsor roles"}

**Tags:** {comma-separated retrieval tags — e.g. "sponsors, ninang, ninong, principal, secondary, catholic, civil"}
**Applies to:** {audience filter — e.g. "all couples", "Catholic ceremony", "Cebu region"}
**Cross-ref:** {iteration spec links or other brain files — e.g. "0016 § 1, 01_Filipino_Cultural_Reference.md#sponsors"}
**Last verified:** {ISO date · who reviewed}

{Plain-Filipino-context answer body. 2–8 short paragraphs.
First paragraph must stand alone as a verbatim fallback response
(used when synthesis model is rate-limited or fails).
Subsequent paragraphs add depth the LLM can paraphrase from.}

### Common follow-ups
- {Anticipated next question 1}
- {Anticipated next question 2}

### Caveats / what NOT to say
- {Things that are wrong or context-dependent}
```

## Governance rules

1. **Single-admin authority for brain edits.** Same pattern as the
   review-gate appeal in 0006. Multiple admins editing the brain
   simultaneously creates inconsistency that the LLM will amplify.
   Audit-logged in `admin_audit_log` with `target_table = 'concierge_brain_chunks'`.
2. **Every chunk must cite its source.** Filipino cultural facts come
   from named reference (UCCP / CBCP / DSWD bulletins / DOT regional
   guides / Setnayan internal vendor data). No anonymous "common
   knowledge" — the brain is Setnayan's IP and its accuracy is the
   product.
3. **Embedding hash invalidation.** When a chunk's text changes, its
   pgvector embedding regenerates on next nightly sweep. Manual
   "regenerate now" admin action available for time-sensitive fixes.
4. **Paid-tier only chunks.** Some brain content (priority vendor
   match logic, the 9-step journey detail, honeymoon planning depth)
   is paid-tier only. Each chunk has `paid_tier_only BOOLEAN DEFAULT FALSE`.
   Retrieval filters by user's `concierge_status`.

## Free tier vs paid tier — which chunks each can reach

| Chunk category | DIY (3-question free) | Trial (3 days) | Concierge Complete (₱4,999/12mo) |
|---|:---:|:---:|:---:|
| Filipino cultural reference (01_) | ✓ | ✓ | ✓ |
| Regional pricing benchmarks (02_) | ✓ | ✓ | ✓ |
| Seasonal weather (03_) | ✓ | ✓ | ✓ |
| Planning timelines (04_) | first-pass only | ✓ | ✓ |
| Legal / BIR (05_) | high-level only | ✓ | ✓ |
| Setnayan feature reference (06_) | ✓ (drives upsell) | ✓ | ✓ |
| Vendor decision logic (07_) | generic only | personalized | personalized + priority match |
| Budget allocation (08_) | tier overview | full tables | full tables + event-data integration |
| Date selection cultural logic (09_) | ✓ (card view + 3 free follow-up questions) | ✓ (unlimited follow-ups) | ✓ (unlimited follow-ups + intake-personalized primary-layer resolution) |
| Honeymoon planning | ✗ | ✗ | ✓ |
| 9-step journey deep-dive | ✗ | ✓ | ✓ |

## Non-goals

- The brain is NOT a chatbot trained on dialog. It's a structured
  knowledge base the LLM retrieves from.
- The brain does NOT replace iteration specs. Iteration specs are
  source-of-truth for product behavior; brain chunks paraphrase or
  cross-reference them for couple-facing explanations.
- The brain does NOT contain vendor-specific marketing copy. Vendor
  profiles live in 0006 marketplace; the brain talks about
  *categories* and *decision logic*, not individual vendors.

## Pricing posture — Concierge stays paid

The 2026-05-18 launch promo makes 16 zero-marginal-cost SKUs FREE
until 2027-03-31. **`concierge_complete` ₱4,999/12mo is EXCLUDED
from that promo and stays paid throughout** — see CLAUDE.md
decision-log rows 1 and 3 of 2026-05-18 + iteration 0016 § 0a
"Launch-promo exclusion" subsection.

The exclusion holds because the paid tier's value is the
event-data-personalized, 12-month-persistent, nudge-driven planner
+ paid-tier-only chunks (honeymoon planning · priority vendor
matching). The free DIY tier (3 questions per event, stateless,
generic-but-Filipino-fluent) demonstrates the brain's quality;
the paid tier demonstrates **your-wedding-specific** personalization.
Both run on the same retrieval pipeline; the synthesis model and
prompt scaffolding differ by tier.
