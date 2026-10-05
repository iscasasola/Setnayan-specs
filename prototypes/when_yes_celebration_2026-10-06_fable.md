# When yes — a celebration, once, in the couple's colours (2026-10-06, Fable)

Prototype: `when_yes_celebration_2026-10-06_fable.html` (self-contained; Google Fonts; **no libraries** — one canvas engine) · stills `-phone.jpg` (guest + Maker at 375) · `-desktop.jpg` (guest + Maker at 1440, scaled to 900 wide).
Builds DECISION_LOG **2026-10-06 "WHEN YES" GETS A CELEBRATION (PRO)**. Visual language: `maker_lower_third_interactive_2026-10-05_fable.html` + `guest_rsvp_flow_2026-09-30.html`.

## What it shows

- **Guest** (Phone · Desktop toggle at the top). The RSVP form: tap an answer → it fills **solid with the Look › Buttons colour** (= the palette's first colour), the other goes **plain outline**; the switched-on questions appear; **Send my reply** → the *When yes* thank-you (ticket included) appears and the chosen effect **plays once, ~2–3 s, then clears itself** — nothing stays over the ticket. *Sadly, no* → the decline screen, no effect.
- **The five.** Confetti (burst from the top, falls, fades · 2.7 s) · Fireworks (four bursts **behind** the words · 3 s) · Petals (drift and tumble · 3 s) · Sparklers (a short shimmer around the guest's **name** · 2.3 s) · None (the thank-you simply appears). All in the Mood Board colours — three sample palettes (Oxblood & olive · Sea & sand · Garden); switch one and everything recolours, buttons included.
- **Reduced motion** (the system setting, or the rig's switch to simulate it): every pick becomes **one calm wash** behind the words (1.6 s, in and out); None stays None.
- **Maker.** The RSVP stage's **When yes** tile selected. Phone: the lower third, navigator collapsed to the scene column (‹ › · ✕), the tools beside it. Desktop: the right panel. In both, **one `Celebration ▾` dropdown** (PickMenu: label left, value + chevron right; opens down, rows with a **tiny looping preview** each, **◆ Pro** on four, *Free* on None, tick on the pick). Picking one **replays it on the page**; "Play it again" replays the current. **✓ Apply** shows **◆** while a Pro effect is drafted (2026-09-28: a free couple may try every Pro effect; Apply names it).
- A clock **watchdog** ends the effect even if frames stop (tab hidden, app switched): a guest who comes back never finds it still going.

## Words

- "Celebration" is the **Maker label only** (the owner's word for the feature). Guest-facing copy never says *celebration* or *website* — checked by script (`/celebrat|website/i` over the guest page = false).
- The form's question is drawn as "Ramon, will you be with us?" — the host's own words, editable in the RSVP stage as today.

## Verified by script (Browser pane, new background tab, served over a local `python3 -m http.server`)

`window.proto.test()` plays every option on the active frame and reports frames · seconds · **stopped** · **cleared** (every canvas pixel alpha = 0 afterwards).

| Frame | Confetti | Fireworks | Petals | Sparklers | None |
|---|---|---|---|---|---|
| Guest · 375 | 325 f / 2.70 s ✓ | 361 f / 3.00 s ✓ | 361 f / 3.00 s ✓ | 277 f / 2.30 s ✓ | 0 f ✓ |
| Maker · 375 | 326 f / 2.70 s ✓ | 361 f / 3.00 s ✓ | 361 f / 3.00 s ✓ | 277 f / 2.31 s ✓ | 0 f ✓ |
| Guest · 1440 | 327 f / 2.70 s ✓ | 363 f / 3.00 s ✓ | 362 f / 3.00 s ✓ | 278 f / 2.31 s ✓ | 0 f ✓ |
| Maker · 1440 | 327 f / 2.71 s ✓ | 362 f / 3.01 s ✓ | 362 f / 3.01 s ✓ | 278 f / 2.31 s ✓ | 0 f ✓ |

✓ = stopped **and** cleared. Reduced motion: 193–194 f / 1.60 s, stopped + cleared, at both sizes. Buttons: after tapping Yes, `background = rgb(91, 26, 34)` (= `--btn`), No is transparent with the plain class. The pick marks Apply ◆; the sum reads "Celebration · Confetti ◆"; the five rows read Confetti/Fireworks/Petals/Sparklers **Pro**, None **Free**; the four Pro minis report `playing` while the list is open, None `idle`.

Two things the checks caught and the file now carries: (1) the calm wash first drew a full-size radial gradient per frame — ~500 ms a frame in a software-rasterised tab — now painted once at 96 px and stretched; (2) at 1440 the particle scale was 4× the phone (a burst ring 250 px wide), now capped at 1.8×.

## For the owner

1. **Default pick** for a new hub — None (free, quiet) or Confetti (the sell)? Drawn as Confetti in the Maker so the Pro ◆ shows; the real default is a one-line call.
2. **Sparklers** shimmer around the guest's *name* only. Around the whole "See you there, Ramon" line instead? One word.
3. The thank-you on the desktop is a single centred column; the effect fills the whole page there. Keep, or box it to the column?
