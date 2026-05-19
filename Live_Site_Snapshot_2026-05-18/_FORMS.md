# Forms & data input/output — site-wide

Every form input across all 13 public routes. Source: SSR HTML, captured 2026-05-18.

Use this to validate against the spec: which fields are collected, which are required, what they're named in the DOM.

---

## `/vendors` — Vendors — Setnayan · Setnayan

| Tag | Type | Label | Placeholder | Name (DOM) | Required |
|-----|------|-------|-------------|------------|----------|
| INPUT | search | Search | Photographer, florist, name… | `q` |  |
| INPUT | text | City | Manila, Cebu… | `city` |  |
| SELECT | text | Sort byMost reviewsHighest ratedNewestName (A → Z) |  | `sort` |  |
| INPUT | checkbox | Verified only(hide vendors who haven’t completed verification) |  | `verified` |  |

## `/help` — Help & support · Setnayan · Setnayan

| Tag | Type | Label | Placeholder | Name (DOM) | Required |
|-----|------|-------|-------------|------------|----------|
| INPUT | email | Your email | you@example.com | `sender_email` | yes |
| INPUT | text | Your name (optional) |  | `sender_name` |  |
| SELECT | text | TopicChoose one (optional)I’m a couple planning an eventI’m a vendorBilling or paymentsBug reportFeature requestOther |  | `topic` |  |
| INPUT | text | Subject | One sentence about what's up | `subject` | yes |
| TEXTAREA | text | Message | Anything that helps us help you — event ID, exact URL you were on, what you expected vs. what happen | `body` | yes |

## `/login` — Setnayan

| Tag | Type | Label | Placeholder | Name (DOM) | Required |
|-----|------|-------|-------------|------------|----------|
| INPUT | email | Email | you@setnayan.com | `email` | yes |
| INPUT | password | Password | •••••••• | `password` | yes |
| INPUT | email | Magic link | you@setnayan.com | `email` | yes |

## `/signup` — Setnayan

| Tag | Type | Label | Placeholder | Name (DOM) | Required |
|-----|------|-------|-------------|------------|----------|
| INPUT | radio | CouplePlanning our wedding |  | `account_type` |  |
| INPUT | radio | VendorPhotographer, caterer, etc. |  | `account_type` |  |
| INPUT | email | Email | you@setnayan.com | `email` | yes |
| INPUT | password | Password | •••••••• | `password` | yes |

## `/signup?as=vendor` — Setnayan

| Tag | Type | Label | Placeholder | Name (DOM) | Required |
|-----|------|-------|-------------|------------|----------|
| INPUT | radio | CouplePlanning our wedding |  | `account_type` |  |
| INPUT | radio | VendorPhotographer, caterer, etc. |  | `account_type` |  |
| INPUT | email | Email | you@setnayan.com | `email` | yes |
| INPUT | password | Password | •••••••• | `password` | yes |

## `/waitlist` — Setnayan

| Tag | Type | Label | Placeholder | Name (DOM) | Required |
|-----|------|-------|-------------|------------|----------|
| INPUT | email | Your email * | you@example.com | `email` | yes |
| INPUT | text | Your name (optional) | Maria | `full_name` |  |
| INPUT | text | Partner’s name (optional) | Juan | `partner_name` |  |
| INPUT | date | Wedding date (optional) |  | `wedding_date` |  |
| INPUT | text | City (optional) | Manila / Cebu / Davao … | `location_city` |  |

---

## Pages with no public forms

- `/` — Wedding Suppliers & Supplies Philippines
- `/features` — Every Feature in Setnayan — Wedding & Life-Events Platform Philippines · Setnayan
- `/for-vendors` — Run your wedding business in one app — Setnayan for vendors · Setnayan
- `/privacy` — Privacy policy · Setnayan · Setnayan
- `/terms` — Terms of service · Setnayan · Setnayan
- `/pricing` — Pricing — Setnayan · Setnayan
- `/download` — Download Setnayan for Mac · Setnayan