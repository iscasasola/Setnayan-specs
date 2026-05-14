# Mobile Bar / Bartender — Vendor Intake Form

Form ID: `vendor_intake.mobile_bar.v2`
Estimated completion time: 12–18 minutes
Save behavior: every section saves on next/blur; vendor can leave and return.
Auth: token link from coordinator's invite (no password required for first pass; vendor sets a 4-digit pin after Section 1 to return).

---

## Section 1 — Business + contact

| # | Field | Type | Required | Notes / validation | Maps to JSON |
|---|---|---|---|---|---|
| 1.1 | Business name | text | yes | 2–80 chars | `business_name` |
| 1.2 | Setnayan vendor ID | auto-assigned | — | format `v_<slug>` | `vendor_id` |
| 1.3 | Years operating | int | yes | 0–50 | `bar_details.experience_years` |
| 1.4 | Service area | multi-select | yes | NCR, Cavite, Tagaytay, Batangas, Laguna, Pampanga, Cebu, other | (vendor profile, not packet) |
| 1.5 | Travel fee policy | text | no | "Free within 50km of Makati; PHP 1500 beyond" | (profile) |
| 1.6 | Primary contact name | text | yes | — | `primary_contact.name` |
| 1.7 | Primary contact role | dropdown | yes | Owner / Manager / Lead Bartender / Coordinator | (profile) |
| 1.8 | Mobile (PH format) | tel | yes | regex `+639\d{9}` | `primary_contact.phone` |
| 1.9 | Email | email | yes | — | `primary_contact.email` |
| 1.10 | Viber number (if different) | tel | no | — | `notification_prefs.viber_number` |
| 1.11 | Secondary contact (optional) | name + phone + email | no | for vacations / event day backup | (profile) |
| 1.12 | Preferred languages | multi-select | yes | Tagalog, English, Cebuano, Hiligaynon, other | (profile) |
| 1.13 | Notification channels (rank) | reorderable list | yes | Default: Viber, Email, SMS | `notification_prefs.channels_priority` |
| 1.14 | Quiet hours | time range | yes | Default 22:00–07:00 PHT | `notification_prefs.quiet_hours` |
| 1.15 | OK to contact on event day for clarifications? | yes/no | yes | yes by default | `notification_prefs.event_day_ok` |

---

## Section 2 — Package + pricing for THIS event

| # | Field | Type | Required | Validation | Maps to JSON |
|---|---|---|---|---|---|
| 2.1 | Package summary | text (long) | yes | 10–500 chars | `service.package` |
| 2.2 | Pricing model | radio | yes | open_bar_capped / consumption / package_per_head / byob_service_only | `service.pricing_model` |
| 2.3 | Total package price (PHP) | currency | yes | > 0 | `payment.total_php` |
| 2.4 | Reservation amount (PHP) | currency | yes | ≥ 0 | `payment.reservation_amount_php` |
| 2.5 | Reservation paid? | toggle + date | yes | if yes, paid_date required | `payment.reservation_paid` + date |
| 2.6 | Down payment amount (PHP) | currency | yes | — | `payment.down_amount_php` |
| 2.7 | Down payment due date | date | yes | before event date | `payment.down_due_date` |
| 2.8 | Balance amount (PHP) | currency | yes | sum check vs total | `payment.balance_amount_php` |
| 2.9 | Balance due date | date | yes | ≤ event date | `payment.balance_due_date` |
| 2.10 | Guest count this priced for | int | yes | matches `event.estimated_guest_count` ± 20 (warn if off) | `service.guest_count_basis` |
| 2.11 | Conditional fields if `open_bar_capped`: drink cap | int | yes if 2.2 = open_bar_capped | — | `bar_details.consumption_caps.drink_cap_total` |
| 2.12 | Conditional: overage rate per drink (PHP) | currency | yes if 2.11 set | — | `bar_details.consumption_caps.overage_rate_php_per_drink` |
| 2.13 | Conditional if `consumption`: minimum spend (PHP) | currency | yes | — | `bar_details.consumption_caps.minimum_spend_php` |
| 2.14 | What's included in the package | textarea | yes | bullets supported | `service.deliverables` |
| 2.15 | What's NOT included (overage triggers) | textarea | yes | "Beer over 8 cases will be billed at PHP 110/bottle" | `service.deliverables` (appended) |

Inline preview: a small summary card on the right showing the math (total = reservation + down + balance), highlights mismatches.

---

## Section 3 — Bar details

| # | Field | Type | Required | Notes | Maps to JSON |
|---|---|---|---|---|---|
| 3.1 | Bar style | dropdown + photo | yes | rustic_wood, acrylic_modern, whiskey_barrel, tropical_tiki, custom (with description) | `bar_details.bar_style` |
| 3.2 | Bar footprint (L × D × H, m) | 3 numbers | yes | for venue floorplan | `bar_details.bar_footprint_m` |
| 3.3 | Photo of bar setup | image upload | recommended | up to 5 imgs, 5MB each | (profile gallery) |
| 3.4 | Alcohol source | radio | yes | vendor_supplied / couple_supplied_byob / mixed | `bar_details.alcohol_source` |
| 3.5 | Will alcohol be alcohol-free / dry? | toggle | yes | hides corkage section if yes | `bar_details.is_alcohol_free` |
| 3.6 | Signature cocktails (repeater, 0–4) | sub-form | no | — | `bar_details.signature_cocktails[]` |
| 3.6a | — Cocktail name | text | yes (per item) | — | `.name` |
| 3.6b | — Base spirit | dropdown | yes | gin/rum/vodka/whiskey/tequila/non_alcoholic/other | `.base_spirit` |
| 3.6c | — Description | text (≤120 chars) | yes | — | `.description` |
| 3.6d | — Garnish | text | no | — | `.garnish` |
| 3.6e | — Glassware | dropdown | yes | coupe/rocks/highball/wine/other | `.glassware` |
| 3.6f | — Estimated pours | int | yes | inventory math | `.estimated_pours` |
| 3.6g | — Inspo photo URL | url | no | — | `.photo_ref` |
| 3.7 | Beer menu (repeater) | sub-form: brand, type, qty unit, qty | conditional* | * if alcohol_source ≠ couple_supplied_byob | `bar_details.menu.beer[]` |
| 3.8 | Wine menu (repeater) | sub-form | conditional | — | `bar_details.menu.wine[]` |
| 3.9 | Spirits menu (repeater) | sub-form | conditional | — | `bar_details.menu.spirits[]` |
| 3.10 | Non-alcoholic menu (repeater) | sub-form | yes | always — required for under-18s, drivers | `bar_details.menu.non_alcoholic[]` |
| 3.11 | Mixers included? | toggle | yes | — | `bar_details.menu.mixers_included` |
| 3.12 | Ice included? | toggle | yes | block + cubed | `bar_details.menu.ice_included` |
| 3.13 | Glassware type | radio | yes | real_glass / acrylic / mixed | `bar_details.glassware.type` |
| 3.14 | Glassware counts | structured: highball, rocks, wine, coupe, beer | yes | auto-suggest based on guest count | `bar_details.glassware.counts` |
| 3.15 | Breakage buffer % | int | yes | default 10 | `bar_details.glassware.breakage_buffer_pct` |

*Couple-supplied BYOB: vendor still confirms the count for inventory, so fields render but are clearly labeled "couple-supplied — confirm volume."

---

## Section 4 — Operations (call time, staff, utilities)

| # | Field | Type | Required | Notes | Maps to JSON |
|---|---|---|---|---|---|
| 4.1 | Call time requested | time | yes | when vendor wants to start load-in | `service.call_time_requested` |
| 4.2 | Setup duration (min) | int | yes | typical 90–120 | `service.setup_duration_min` |
| 4.3 | Bar window start | time | yes | first pour | `service.bar_window.start` |
| 4.4 | Bar window end | time | yes | bar closes | `service.bar_window.end` |
| 4.5 | Last call time | time | yes | auto-suggest = bar end - 30 min | `service.last_call_time` |
| 4.6 | Strike duration (min) | int | yes | typical 45–60 | `service.strike_duration_min` |
| 4.7 | On-site total hours | int (computed) | auto | call_time → strike done | `service.on_site_duration_hr` |
| 4.8 | # of bartenders | int | yes | warn if < ceil(guests/75) | `service.bartender_count` |
| 4.9 | # of bar backs | int | no | — | `service.bar_back_count` |
| 4.10 | Uniform | dropdown | yes | all_black / barong / filipiniana / themed_custom / vendor_default | `bar_details.uniform` |
| 4.11 | Uniform photo (if themed/custom) | image | conditional | — | (profile) |
| 4.12 | Power outlets needed (220V) | int | yes | — | `bar_details.utilities_required.power_outlets` |
| 4.13 | Estimated kW load | number | yes | for generator sizing | `bar_details.utilities_required.power_kw_estimate` |
| 4.14 | Need water source nearby? | toggle | yes | — | `bar_details.utilities_required.water_source_required` |
| 4.15 | Max distance bar → water tap (m) | int | conditional | shown if 4.14 = yes | `bar_details.utilities_required.water_source_distance_m_max` |
| 4.16 | Need drainage? | toggle | yes | — | `bar_details.utilities_required.drainage_required` |
| 4.17 | OK with surface types | multi-select | yes | grass/concrete/wood/carpet | `bar_details.utilities_required.surface_type_ok` |
| 4.18 | Need shade if outdoor afternoon? | toggle | yes | — | `bar_details.utilities_required.shade_required` |
| 4.19 | Needs backup generator? | toggle | yes | — | `bar_details.utilities_required.backup_generator_needed` |
| 4.20 | Vendor meals required? | toggle | yes | usually yes | `bar_details.staff_meal_required` |
| 4.21 | # of vendor meals | int | conditional | shown if 4.20 = yes; default = bartender + bar_back count | `bar_details.staff_meal_count` |

Right sidebar: live "ops summary" card showing call time → end of strike timeline so vendor can sanity check.

---

## Section 5 — Compliance + legal

| # | Field | Type | Required | Notes | Maps to JSON |
|---|---|---|---|---|---|
| 5.1 | Does the venue charge corkage? | radio | yes | yes / no / unknown | `bar_details.corkage.venue_charges_corkage` |
| 5.2 | Corkage fee (PHP) | currency | conditional | shown if 5.1 = yes | `bar_details.corkage.corkage_fee_php` |
| 5.3 | Who pays corkage? | radio | conditional | couple / vendor / waived | `bar_details.corkage.corkage_paid_by` |
| 5.4 | Permit required (LGU / sin tax / venue)? | toggle | yes | — | `bar_details.corkage.permit_required` |
| 5.5 | Who owns the permit filing? | radio | conditional | vendor / couple / coordinator | `bar_details.corkage.permit_owner` |
| 5.6 | Permit status | radio | conditional | not_required / pending / filed / approved | `bar_details.corkage.permit_status` |
| 5.7 | DTI / business permit upload | file | yes | PDF/JPG, ≤10MB | (profile, not packet) |
| 5.8 | Liability insurance certificate | file | recommended | many high-end venues require | (profile + packet if present) |
| 5.9 | All bartenders 18+? (attestation) | checkbox | yes | required to submit | `bar_details.legal.bartenders_of_legal_age` |
| 5.10 | Acknowledge no-service-to-minors policy | checkbox | yes | — | `bar_details.legal.serves_minors_policy` |
| 5.11 | Intoxication / cut-off policy (free text) | textarea | yes | "How do you handle a guest who's had too much?" | `bar_details.legal.intoxication_policy` |
| 5.12 | Couple-provided "do not serve" list (sensitive, optional) | locked text | no | only viewable by primary contact + lead bartender; logged on view | (separate sensitive store) |
| 5.13 | Setnayan vendor code of conduct | scrollable text + accept checkbox | yes | versioned | `packet_delivery.code_of_conduct_version_accepted` |

---

## Submit + post-submit

On submit:
1. Validate all `Required: yes` fields and the validation rules from spec §2.4.
2. Generate `vendor_id` if not set.
3. Insert vendor into the event JSON's `vendors[]`.
4. Trigger an initial packet send (V1 of the packet).
5. Notify coordinator: "Mobile bar [name] completed onboarding; packet v1 sent."
6. Show vendor a confirmation screen with: packet preview link, timeline of upcoming due dates (down payment, balance, event day), and the "what we'll notify you about" digest from spec §5.

---

## Form UX notes

- **Mobile-first.** Most vendors will fill this on phone. Single-column, big tap targets, sticky save+next.
- **Tagalog/English toggle** at top. Field labels translated; placeholder examples Filipino-flavored ("e.g. The Mariel — calamansi gin spritz").
- **Smart defaults** based on `event` data already in JSON: prefill guest count (2.10), event date (for 2.7/2.9), reception start/end (for 4.3/4.4).
- **Inline math previews** for inventory: "280 guests × 4hr × 1.5 drinks/hr = ~1,680 pours expected."
- **Save indicator** ("Saved 14:23") in header so vendor isn't anxious about losing data.
- **Skip link** for couple-supplied BYOB vendors that lets them skip section 3.7–3.9 menu repeaters and go straight to confirming volumes.
- **Coordinator-assist mode**: coordinator can fill on vendor's behalf; vendor receives a magic link to "review and approve" rather than fill from scratch (common — many small mobile bar businesses don't fill forms themselves).
