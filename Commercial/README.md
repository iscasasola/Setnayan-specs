# Commercial — Setnayan paid video ads

Home for Setnayan's **paid video commercials** (Facebook / Instagram first). Marketing assets only — **no app code**. This is a Cowork planning + production workspace.

## Current project

**Non-person FB/IG ad · ≤29s** → [`Plan_NonPerson_FBIG_Ads_2026-06-14.md`](Plan_NonPerson_FBIG_Ads_2026-06-14.md)
The canonical plan. Person-free execution of the owner-authored render script; built for FB/IG paid (9:16 hero + 4:5 feed, sound-off-safe, +15s/6s cuts). Open decisions live in §9 of that doc.

## Folder structure

| Path | Holds |
|---|---|
| `Plan_*.md` | The plan / brief for each commercial (one per project, dated) |
| `script/` | Timed shooting scripts + burned-caption sheets (per cut: 24s / 15s / 6s) |
| `prompts/` | Higgsfield / Recraft generation prompts (object-convergence b-roll, textures) |
| `assets/` | Logo (`setnayan-mark.svg`), fonts, palette refs, harvested frames |
| `renders/` | Final MP4s + the cut-down matrix (9:16 / 4:5 / 1:1) ready for Meta Ads Manager |

## Prior art (don't duplicate — reference)

The owner-authored creative lives in the sibling project **`~/Documents/Claude/Projects/setnayan-motion/`**:
- `copy/script.md` — the 3-act spine (same-questions → convergence → relief). **Inherited.**
- `copy/concept.md` — lead message + the 4 breadth bands. **Inherited.**
- `copy/brand-kit.md` — Clean Editorial palette / type / voice. **Inherited verbatim.**
- `copy/video-prompt-15s.md` — the incoming 15s Higgsfield object-convergence render (no people, no text) — a candidate hero source.
- `scripts/build-hero.sh` + `template.html` — frame-extraction + scrub toolchain (reuse for any web-scrub variant).

That folder is the **scroll/web** ad. This folder is the **paid autoplay** ad. Same brand, same spine, different delivery.

## Tooling notes

- **ffmpeg** is available via `imageio-ffmpeg` (off-PATH binary under `~/Library/Python/3.9/...`).
- Two build paths (see plan §10): the incoming Higgsfield convergence video + caption layer, or a fresh **Remotion** build (deterministic, 9:16→4:5 by one number).
- **Credit lesson:** lock the script before generating expensive footage (~250 credits were burned on cut renders for the scroll ad).

## Status

**PLANNING** — awaiting owner's §9 decisions in Cowork (hero source · lead message · gold accent · music/CTA · AI-spend). Then a build session renders a 3s proof-of-look before the full 24s.

Logged in `DECISION_LOG.md` (2026-06-14). Related memory: `project_setnayan_motion_ad`.
