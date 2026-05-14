# Transcript — Ceremony Shift Task

## Inputs received
- Sample event file: `sample_event.json` for Mariel Dela Cruz & Joaquin Santos, Nov 14 2026.
- User request: parish moved ceremony from 16:00 to 15:30. Walk through affected vendors, list specific actions, produce Viber messages. Tone: warm Filipino, not corporate.

## What I did
1. Read `sample_event.json` end-to-end (8 vendors, 17 run-of-show segments, ceremony details, venue access windows).
2. Mapped the 30-minute ceremony shift against the run-of-show to identify which segments cascade (anything tied to ceremony location or pre-ceremony photos) vs. which hold (anything tied to reception start at 18:30).
3. Classified each vendor as **affected / not affected**:
   - Affected: HMUA, photographer, videographer, florist, bridal car, coordinator, parish, officiant.
   - Not affected: caterer, band, host, reception venue (all anchored to reception start, which didn't move).
4. For each affected vendor, derived the specific concrete action they must take (new call time, new deadline, brief downstream people, etc.) — not generic "FYI" notes.
5. Drafted Viber messages in Filipino-English (Taglish) with warm tone — short, concrete, ends with a kamusta or salamat. Used "po" for parish/officiant per cultural norm; dropped it for peer-aged vendors. Included an optional sponsor-groupchat draft since punctuality of ninongs/ninangs is the biggest day-of risk for an earlier ceremony.
6. Flagged risks: sponsor punctuality, HMUA timeline compression, choir confirmation through parish.

## Outputs saved
- `analysis.md` — vendor-by-vendor breakdown with reasoning, plus risk flags.
- `vendor_messages.md` — 8 Viber-ready messages (7 vendors + parish + officiant fallback + optional sponsor groupchat).
- `transcript.md` — this file.

## Notes / assumptions
- Bridal car contact is not in the vendor array of `sample_event.json` — flagged for coordinator to fill in. Drafted a generic message they can paste.
- Father Marco is best reached by phone; Viber message is a fallback only.
- I did NOT message the caterer, band, host, or reception venue — over-messaging dilutes signal and stresses vendors who genuinely don't need to act.
- Reception start (18:30) was preserved deliberately. Could have been moved earlier too, but compressing reception further would create avoidable stress for caterer/band; the 30-min slack between portraits and cocktail is a buffer, not a problem.
