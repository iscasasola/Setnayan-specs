
---

# SESSION 4-RECONCILE · Bring the older prototypes onto the new palette
**Added 2026-08-13. CORPUS-ONLY — touches no app code, so it is safe beside sessions 4 and 8.**

```
GOAL: the ~22 older screen prototypes stop carrying a dead palette, so the sessions that port
from them later are copying something correct.

WHERE: ~/Documents/Claude/Projects/Setnayan/prototypes/ — the SPECS repo, not the app repo.
You are editing drawings. Do not touch apps/web at all. That is what makes this safe to run
while other sessions build.

🔑 THE RULE, and it is the whole job: RECONCILE, NEVER REDRAW. These prototypes are STILL
CORRECT ABOUT COMPOSITION — what is on the screen, in what order, at what size. They carry the
OLD palette and nothing else is wrong with them. The owner has paid twice for one page being
redrawn; a "while I was in here" layout change is a defect, not an improvement.

MEASURED STARTING STATE — 2026-08-13, `ls prototypes/`: 29 .html files + 2 directories.

  BINDING — the TARGET, never reconcile these (they define what the others move toward):
    archetype_content_editorial_gallery_detail_2026-08-01.html
    archetype_data_roster_ledger_comparison_2026-08-01.html
    archetype_overlays_2026-08-01.html
    archetype_sheet_wizard_admin_2026-08-01.html
    archetype_shell_command_states_2026-08-01.html
  (12 screen archetypes + 7 overlay types, ALL 19 owner-approved 2026-08-04 with no changes.)

  ALSO DO NOT RECONCILE:
    front_door_and_seam_2026-08-12.html — the front door's own source of truth, already correct
    home_facebook_shaped_2026-08-07.html — SUPERSEDED the same day by the YouTube-shaped concept,
      and `/` is now being replaced outright (owner 2026-08-13). RETIRE it, do not repaint it.

  THE REST (~22) ARE THE WORK. A crude grep says 6 already mention terracotta and 16 do not —
  VERIFY THAT YOURSELF, a single mention is not a converted file.

⚠ FIRST DECIDE WHICH ARE DEAD, THEN RECONCILE WHAT SURVIVES. Several are superseded by a newer
sibling and repainting them just keeps a stale artifact arguing for the old model:
    admin_hq_v2_2026-07-15  vs  admin_designed_2026-08-03 / admin_simplified_nav_2026-08-03
    Payment_Flow_Prototype_2026-07-11 + Payment_Flow_Desktop_2026-07-11  vs  payment_flow_2026-07-24
    for_vendors_keep_100_2026-07-10  vs  for_vendors_2026-07-24
Check each against SHIPPED CODE before calling it dead — /admin/work and /admin/more already
ship, and the admin collapse is blessed (~95 of 107 routes → ONE archetype).

THE LOCKED PALETTE — do not re-derive, do not re-litigate:
    page + card   #FDFBF7  cream (page and card are the SAME value; separate with border+shadow)
    body text     #2C2A29  espresso
    CTA fill      #C24E25  terracotta   hover #B04722 · active #9D3F1E
    CTA label     #FDFBF7  ← CREAM, NOT WHITE. That exact pairing is 4.61:1.
    highlight     #A9834B  gold — UI + large text ONLY. Text escalation #8A6B39.
    links + 2nd   #3B4E67  slate indigo
    destructive   #B65A3A  ← NEVER terracotta. Terracotta means "go".
  🪤 SIZE THE CTA AGAINST CREAM, NEVER WHITE. #C75026 passes on white (4.56:1) and FAILS on the
     cream the app actually renders (4.41:1). A white-background check waves the failure through.
  🪤 THE APP IS LIGHT-ONLY since 2026-06-04. Design ONE theme. Obsidian surfaces (Alaala,
     gallery, lightbox) are dark because THOSE SURFACES are dark, not because a mode exists.

🚨 TWO GOLD LEAKS FOUND WHILE COUNTING — fix them, and understand why they are wrong:
    floor_plan_tables_vendors_2026-07-10.html  and  guests_living_roster_2026-07-10.html
  both contain #8C6932. That is the FRONT DOOR's action gold, and it is licensed for the front
  door ONLY (owner 2026-08-11). Everywhere else the rule is: the only action colour is terracotta
  and GOLD IS NEVER A BUTTON. ⚠ Worth knowing: "gold is never a button" turned out to be PROSE,
  not a mechanism — no guard has ever enforced it — which is exactly how it leaked.

ALSO RECONCILE TO THE SHIPPED SHELL, not just the colours: SidebarShell already ships and is
MOUNTED (20 consumers, in admin/layout.tsx and dashboard/[eventId]/layout.tsx), route
transitions exist via template.tsx in all four dashboard trees, and the mobile bottom navs are
mounted in the same layouts. If a prototype draws its own chrome, reconcile it to that shell —
but do NOT redraw the shell itself. design#3 is PREMISE FALSIFIED.

TYPOGRAPHY IS LOCKED: Hanken Grotesk + Space Mono, unchanged through every palette turn.

DONE = every surviving prototype renders in the locked palette against cream; the dead ones are
retired with one line each saying what supersedes them; no composition changed anywhere; and
your report lists, per file, WHAT YOU CHANGED and WHAT YOU DELIBERATELY LEFT.
```
