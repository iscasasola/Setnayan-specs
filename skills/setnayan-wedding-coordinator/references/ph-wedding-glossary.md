# Philippine Wedding Glossary

A working glossary of the terminology, roles, and ceremony elements that show up in Filipino weddings. Read this when a task uses a term you're not sure about, or when generating user-facing copy that needs to reference these correctly.

## Sponsor system

The Philippine Catholic wedding has a sponsor system that does not exist in most American weddings. Setnayan's data model treats sponsors as a first-class guest role.

**Principal Sponsors (Ninong / Ninang)** — the senior witnesses to the marriage. Plural — couples typically have several (3–10 pairs is common, sometimes more for high-profile weddings). They are usually older, accomplished, or family-elder figures, often godparents or close family friends. Addressed with "po" and titles. They get prominent processional placement, are listed on the invitation, and are typically gifted small tokens. *Ninong* is male, *Ninang* is female.

**Secondary Sponsors** — three pairs (typically), each handling one of the unity rites:
- **Candle Sponsors** — light candles during the ceremony, symbolizing Christ as the light of the union
- **Veil Sponsors** — drape the veil over the couple, symbolizing being clothed as one
- **Cord Sponsors** — drape the *yugal* (a figure-eight cord) over the couple, symbolizing eternal bond

These are usually peers or younger family members.

**Coin Bearer / Arras Bearer** — typically a young boy who carries the *arras* (13 coins) for the coin ceremony. The 13 coins symbolize the groom's commitment to provide; the bride accepts them as a sign of trust.

**Bible Bearer** — carries the bible during the processional.

**Ring Bearer** — carries the wedding rings.

**Flower Girl** — scatters petals before the bride.

**Bearer** (general) — sometimes refers collectively to the young children participating.

## Entourage roles

Beyond the sponsors, the standard Filipino entourage includes:

- **Maid of Honor** — bride's chief attendant
- **Best Man** — groom's chief attendant
- **Bridesmaids** — typically 3–6, paired visually with Groomsmen
- **Groomsmen** — paired with Bridesmaids in the processional

Filipino entourages are often larger than American ones because the family network is broader. The Setnayan data model accepts any reasonable count.

## Ceremony elements (Catholic)

A typical Filipino Catholic wedding ceremony runs 60–90 minutes and includes:

1. **Processional** — entrance order varies but typically: Coordinator → Grandparents → Parents of the groom → Parents of the bride → Principal Sponsors (paired) → Secondary Sponsors (paired) → Bridesmaids and Groomsmen (paired) → Maid of Honor and Best Man → Ring Bearer + Coin Bearer + Bible Bearer + Flower Girl → Groom (sometimes escorted by parents) → Bride (escorted by both parents, not just the father)
2. **Liturgy of the Word** — readings, gospel, homily
3. **Rite of Marriage** — declaration of consent, exchange of vows
4. **Exchange of rings**
5. **Arras (coin) ceremony** — coin bearer presents coins, groom hands them to bride
6. **Candle ceremony** — Candle Sponsors light tapers
7. **Veil ceremony** — Veil Sponsors place veil over couple
8. **Cord ceremony** — Cord Sponsors place yugal over couple
9. **Liturgy of the Eucharist** (in a full Mass wedding)
10. **Signing of the marriage contract** (often done at the altar with two principal witnesses)
11. **Recessional**

The unity rites (coin, candle, veil, cord) are PH-specific and not present in most other Catholic ceremonies. They're the ones host scripts and timelines must call out by name.

## Reception traditions

Filipino reception flow varies but commonly includes:

- **Cocktail hour / pre-reception** — appetizers and drinks while couple does post-ceremony photos
- **Couple's grand entrance** — host announces the couple
- **Welcome remarks** — typically by parents, not the couple
- **Toasts** — Best Man, Maid of Honor, Principal Sponsors (one or two)
- **First dance** — couple
- **Parents' dance** — sometimes split: bride with father, groom with mother
- **Money dance** — guests pin bills onto the couple's clothing while dancing. *Sometimes* skipped in modern urban weddings; ask the couple.
- **Garter and bouquet toss** — Western import, common in PH
- **Prosperity dance / Pangalay** — guests dance around the couple, throwing money/coins. Common in some regions, not universal.
- **Cake cutting** — couple cuts cake together
- **Singing** — couples sometimes sing, parents sometimes sing, guests sometimes sing. Very common.
- **Sendoff** — couple departs, often with bubbles/sparklers/petals

## Parish / civil requirements

Catholic weddings in the Philippines require these documents from the parish (varies slightly by diocese):

- **Baptismal Certificate** with note "for marriage purposes only" — both partners
- **Confirmation Certificate** — both partners
- **CENOMAR** (Certificate of No Marriage Record) from PSA (Philippine Statistics Authority) — both partners. Valid for 6 months from issue.
- **Pre-Cana / Discovery Weekend** completion certificate — required marriage preparation seminar
- **Banns of marriage** — published in both partners' parishes for three consecutive Sundays before the wedding
- **Confirmation of Ninongs/Ninangs** — many parishes ask for proof that Principal Sponsors are themselves Catholic
- **Marriage license** — from the Local Civil Registrar, valid for 120 days

For civil weddings, only the marriage license is required (plus 10-day publication and a marriage application form).

## Common venues

PH weddings often happen across two venues (church + reception). Common reception types:

- **Hotel ballroom** — Manila, Cebu, Davao standard
- **Resort / beach venue** — Boracay, Palawan, Batangas, La Union
- **Garden venue** — Tagaytay, Antipolo (cool weather destinations close to Manila)
- **Heritage house** — Bulacan, Iloilo, Cebu
- **Country club / private club** — Manila, Cebu

Outdoor venues require a **rain plan** as a first-class field on the event. Don't generate a Tagaytay garden timeline without it.

## Cultural notes that affect data

- **"The 200-guest wedding" is small** by Filipino standards. Mid-market is 200–400. Large weddings hit 600–800.
- **Vendor allowance** — vendors are typically fed on-site. Caterer needs a vendor count separate from guest count.
- **Po and opo** — show up in vendor and sponsor communication. Use them naturally.
- **Buffet >> plated** — buffet is more common in PH receptions than plated service, even at upscale events.
- **Photo and video are top-spend** categories, often combined into one "media" line item by couples but tracked separately by Setnayan.
- **Wedding planners called "coordinators"** — the term "wedding planner" is used, but day-of work is usually called "coordination." Setnayan follows this distinction.

## Don't use these terms

- "Bride's side" / "Groom's side" without "Bride's family" / "Groom's family" — feels too Western
- "Walking down the aisle alone" — most Filipino brides are escorted by both parents
- "Best of luck on your magical day" — not in Setnayan voice
- "Father of the bride" *only* — both parents typically perform that role; say "parents of the bride"
