# Button rule — every interactive control is a button, one colour per meaning, icon + word by width
**2026-10-07 · Fable · design rule for the WHOLE site (owner, verbatim: *"can we create this similar rule on all buttons on the website?"* · *"so a list of all buttons on the website and what their colors are"* · *"we want all interactive button to be buttons across the website"*).**
Nothing here is built. The Suppliers prototype (`prototypes/suppliers_page_2026-10-07_fable.html`, corpus 459e015) is the reference implementation of the rule; this doc carries it to every other page.

## The rule (owner 2026-10-07, four sentences)
1. **Every interactive control is a button** — a pill with a border, 40 px tall on phone, never a bare text link with a › after it. (Links that *navigate* to another page stay links; anything that *does* something is a button.)
2. **Icon + word.** Every button carries an icon and its word. *"when icon can present text, show text. when icon can present icon with text show both."*
3. **Words drop by width.** *"so it depends on the width of the screen."* A row measures itself after render; if the words do not fit, the right-most secondary buttons drop to icon-only, one at a time; the main verb always keeps its word. Desktop shows every word.
4. **One colour per meaning**, the convention every major system shares (Bootstrap · Material · Ant · Apple HIG): the same meaning is the same colour on every screen, so the colour is learnt once.

## The colours (shipped tokens — read `apps/web/app/globals.css`, never a hex from memory)
| Tone | Meaning | Token (light · dark) | Filled (main verb) / outlined (the rest) |
|---|---|---|---|
| **Terracotta** | primary — the forward step | `--color-mulberry` (name kept; #C24E25 · #E5794E) — what `ISegmented tone=wine` and `.m-btn-primary` already use | white word on terracotta / terracotta word on 9 % tint |
| **Green** | confirm · commit · money | new `--color-ok` (#2E7D4F · #6FCF97) — today the app has `text-emerald-*`/`bg-emerald-*` scattered, no token | same |
| **Blue** | messaging · information | new `--color-info` (#1F6FB2 · #7AB8F0) — close to the shipped `--color-link` slate (#5B6E8C · #9DB2CE); owner call: reuse `--color-link` or add `--color-info` | same |
| **Amber** | attention — waiting on you | new `--color-warn` (#B26B00 · #F0B45A) — today `amber-*` classes, no token | same |
| **Red** | destructive — take it back | new `--color-danger` (#B3261E · #F2817A) — today `text-red-600` etc. in 40+ files, no token | same |
| **Grey** | manage · edit · neutral | `--color-ink` / `--color-mute` (shipped) | ink word on paper |
⚠ Book and Pay share green deliberately (both are "commit"); the icon and the word separate them. If Pay must differ, the only honest choice is terracotta — no cross-site standard exists for Pay.
⚠ **Guest Event Hub (`/[slug]`, `/e/…`) is the exception.** Those pages wear the couple's theme (their own colours), so semantic tones would fight the theme. Rule there: still buttons, still icon + word, but the colour comes from the hub's theme tokens (`--hub-btn-solid` …), and red for destructive only. **Owner call needed.**

## How a builder applies it (one component, then sweeps)
1. **One shared component** `apps/web/components/action-button.tsx`: `<ActionButton tone icon label main onClick/href>`; renders icon + `<span class="lbl">`; `aria-label` = the word, so icon-only is still readable. Plus one hook `useFitRow(ref)` = the fit pass (remove `icon-only`, then from the right add it until `scrollWidth ≤ clientWidth`; re-run on resize). Tokens `--color-ok/info/warn/danger` added to `globals.css` light + dark with the AA numbers in the comment, as every other token there has.
2. **Sweep by area, one PR per area**, in the order below. Each PR: replace every `<button>`/`<a className="…btn…">`/text-link-with-› in that area with `ActionButton`, tone from the table in this doc; the PR body carries the before/after at 375 and 1280 and a one-line check card for the owner.
3. **A guard** (`apps/web/tests/every-action-is-a-button.test.ts` or a CI script): in swept areas, no `<button` without `ActionButton`, no `›` inside an `<a>`/`<button>` text, no `text-red-*`/`bg-emerald-*` on a button. Scope grows with each sweep; never weakened.

## The list — every static button label on `origin/main`, by area, with its colour
Measured today from `origin/main` (`apps/web/app` + `apps/web/components`, 678 files with buttons). A **static** label is one written in the source; a **dynamic** one is built at runtime (`{t('…')}`, `{label}`) and must be toned by the builder in the sweep — the count per area is given so nobody mistakes this list for the whole. Tone was assigned by the meaning rule from the word itself; **"—" means the word alone does not say what it does** (owner or builder decides, reading the code). Identical labels are merged with their count.

**Totals:** 2368 buttons · 1025 with a static label · 1343 dynamic. By tone (static): — owner/builder call 463 · Grey 188 · Terracotta (brand) 150 · Red 97 · Green 89 · Blue 21 · Amber 17. **441 distinct labels need a human call.**


### Sweep 1 · Couple · Suppliers — 58 distinct labels · 74 static · 69 dynamic (hand-toned in the sweep)

| Button (as written) | × | Colour |
|---|---|---|
| Close | 8 | Grey |
| Cancel | 6 | Red |
| Record payment | 2 | Green |
| setManual()} > Add manually | 2 | Terracotta (brand) |
| unpin(buildGroupId)} > | 2 | — owner/builder call |
| } > i | 2 | — owner/builder call |
| Accept | 1 | Green |
| Add both | 1 | Terracotta (brand) |
| Close compare | 1 | Grey |
| Confirm receipt | 1 | Green |
| Dismiss | 1 | — owner/builder call |
| Dismiss notification | 1 | — owner/builder call |
| Filter | 1 | Grey |
| Keep the booking | 1 | — owner/builder call |
| Not yet | 1 | — owner/builder call |
| Remove from shortlist | 1 | Red |
| Request | 1 | — owner/builder call |
| Save price | 1 | Green |
| Save their details | 1 | Green |
| Send to | 1 | Blue |
| Share invite link | 1 | Terracotta (brand) |
| Show results | 1 | Grey |
| Undo · revert to considering | 1 | Amber |
| ` : (copy?.confirmLabel ?? `Book $`)} )} | 1 | Green |
| add(r.vendorProfileId)} disabled= > | 1 | Terracotta (brand) |
| add(s.vendorProfileId)} disabled= className=`} > | 1 | Terracotta (brand) |
| addTileToPlan(t.tile, folder.folder, folder.slug)} > | 1 | — owner/builder call |
| arrange.onMove('left')} > ← | 1 | — owner/builder call |
| arrange.onMove('right')} > | 1 | — owner/builder call |
| goToBuildTab(tab)} className= data-planning-row=> | 1 | — owner/builder call |
| in the same wrapper. */} > | 1 | — owner/builder call |
| onCompare(child)}> ⇄ Compare | 1 | — owner/builder call |
| onOpenSearch(child.groupId, child.label)} > ＋ Find Search | 1 | Grey |
| onOpenSearch(groupId, label)} > ＋ ` : `Find $`} | 1 | — owner/builder call |
| onToggle(folder.folder)} > shortlisted` : 'Not started'} ▾ | 1 | — owner/builder call |
| openPlan(p.folder, p.tile, p.slug)} > | 1 | — owner/builder call |
| openPlan(t.folder, t.tile, t.slug)} > ) : null} ) : null} | 1 | — owner/builder call |
| openSearch(t.tile, t.label)} > | 1 | — owner/builder call |
| pin(buildGroupId)} > | 1 | — owner/builder call |
| resetArrangedTile(t.tile)} > | 1 | — owner/builder call |
| setArrangeTile(null)} > Done | 1 | Green |
| setConfirmRemove(false)} > Keep | 1 | — owner/builder call |
| setConnectOpen(true)} aria-haspopup="dialog" > Connect | 1 | — owner/builder call |
| setDialog()} className= aria-label=`} > | 1 | — owner/builder call |
| setDraftKm(c.km)} > | 1 | — owner/builder call |
| setKind('add-on')} className=`} > Add-on | 1 | Terracotta (brand) |
| setKind('removal')} className=`} > Removal | 1 | — owner/builder call |
| setManualOpen(true)} > ✎ Add manually | 1 | Terracotta (brand) |
| setManualOpen(true)} > ✎ Add manually Add | 1 | Terracotta (brand) |
| setQuery('')}> × | 1 | — owner/builder call |
| startReopen(async () => ); router.refresh(); }) } > Reopen | 1 | Grey |
| toggleFacet(dim.key, opt.value)} aria-pressed= > | 1 | — owner/builder call |
| void removeTileFromPlan(t.tile, t.label)} > | 1 | — owner/builder call |
| void showFarther()} > Show suppliers farther away | 1 | Grey |
| with the same class). */} > Find | 1 | — owner/builder call |
| } > + more | 1 | Grey |
| ✓ I&apos;m done | 1 | Green |
| ＋ Add another | 1 | Terracotta (brand) |

### Sweep 2 · Couple · event dashboard (other) — 215 distinct labels · 251 static · 410 dynamic (hand-toned in the sweep)

| Button (as written) | × | Colour |
|---|---|---|
| Close | 12 | Grey |
| Cancel | 10 | Red |
| Done | 5 | Green |
| Remove | 4 | Red |
| Back | 2 | Grey |
| Dismiss | 2 | — owner/builder call |
| Hide | 2 | Grey |
| Render again | 2 | — owner/builder call |
| Try again | 2 | Terracotta (brand) |
| Undo | 2 | Amber |
| e.stopPropagation()} onClick=} > × | 2 | — owner/builder call |
| onSelect(s.key)} className=`} > ) : null} | 2 | — owner/builder call |
| setPinned(active ? null : o.key)} className=`} > | 2 | — owner/builder call |
| ) : mode.kind === 'linked' ? ( <> Add to plan ) : ( <> )} | 1 | Terracotta (brand) |
| ) : null} | 1 | — owner/builder call |
| ) : null} min | 1 | — owner/builder call |
| ) : tableLabel ? ( ) : trailing ? null : ( unseated )} | 1 | — owner/builder call |
| ); } }} > A | 1 | — owner/builder call |
| ); }} className= > | 1 | — owner/builder call |
| ); }} className=`} > | 1 | — owner/builder call |
| + Add a table | 1 | Terracotta (brand) |
| + New | 1 | Terracotta (brand) |
| : null} | 1 | — owner/builder call |
| = cap} onClick= > + Seat next unseated | 1 | Terracotta (brand) |
| Add | 1 | Terracotta (brand) |
| Add a wish | 1 | Terracotta (brand) |
| Add an e-gift method | 1 | Terracotta (brand) |
| Add another date | 1 | Terracotta (brand) |
| Add payment | 1 | Terracotta (brand) |
| Add table | 1 | Terracotta (brand) |
| Add the first moment | 1 | Terracotta (brand) |
| Add to my timeline | 1 | Terracotta (brand) |
| Add zone | 1 | Terracotta (brand) |
| All guests | 1 | — owner/builder call |
| Apply | 1 | Terracotta (brand) |
| Auto Arrange | 1 | — owner/builder call |
| Auto-seat | 1 | — owner/builder call |
| Auto-seating | 1 | — owner/builder call |
| Autofill from my event details | 1 | Grey |
| Automatic | 1 | — owner/builder call |
| Break apart | 1 | — owner/builder call |
| Cancel schedule | 1 | Red |
| Change | 1 | Grey |
| Change time | 1 | Grey |
| Close checkout | 1 | Grey |
| Close form | 1 | Grey |
| Close part chooser | 1 | Grey |
| Close the reveal preview | 1 | Grey |
| Confirm | 1 | Green |
| Continue | 1 | Terracotta (brand) |
| Continue to payment | 1 | Terracotta (brand) |
| Continue to payment · ₱ | 1 | Terracotta (brand) |
| Copy connect link | 1 | Grey |
| Copy link | 1 | Grey |
| Dance floor | 1 | — owner/builder call |
| Decline | 1 | Red |
| Decrease depth | 1 | — owner/builder call |
| Delete | 1 | Red |
| Delete challenge | 1 | Red |
| Dismiss event day banner for 1 hour | 1 | — owner/builder call |
| Dismiss notice | 1 | — owner/builder call |
| Dismiss set-your-date reminder | 1 | — owner/builder call |
| Dismiss the Papic camera reminder | 1 | — owner/builder call |
| Download | 1 | Grey |
| Download all | 1 | Grey |
| Drag to change the room width | 1 | Grey |
| Drop here | 1 | — owner/builder call |
| Email call-times to suppliers )` : ''} | 1 | Blue |
| Entrance — tap to edit, drag to move | 1 | Grey |
| Fill around locked seats | 1 | — owner/builder call |
| Fill the rest | 1 | — owner/builder call |
| Find | 1 | — owner/builder call |
| Fit all tables in view | 1 | Grey |
| Have a code? | 1 | — owner/builder call |
| Hide from wall (keeps it in your gallery) | 1 | Grey |
| Hide from wall AND gallery | 1 | Grey |
| Hide until the day | 1 | Grey |
| I choose | 1 | Terracotta (brand) |
| Increase depth | 1 | — owner/builder call |
| Keep groups together | 1 | — owner/builder call |
| Keep this clip | 1 | — owner/builder call |
| Lock in | 1 | — owner/builder call |
| Lock this preview | 1 | Grey |
| Mark highlight | 1 | Green |
| Maybe later | 1 | Amber |
| Name them | 1 | — owner/builder call |
| Name these photos | 1 | — owner/builder call |
| Not now | 1 | — owner/builder call |
| Open camera | 1 | Grey |
| P | 1 | — owner/builder call |
| Pick different | 1 | Terracotta (brand) |
| Pop out for OBS | 1 | — owner/builder call |
| Put all back | 1 | Grey |
| Regenerate | 1 | — owner/builder call |
| Relax the lowest-priority rule | 1 | — owner/builder call |
| Remove this photo | 1 | Red |
| Remove uploaded logo | 1 | Red |
| Remove voucher | 1 | Red |
| Rename this moment | 1 | Grey |
| Render now | 1 | — owner/builder call |
| Replay | 1 | — owner/builder call |
| Reset | 1 | Red |
| Reset all | 1 | Red |
| Resize cocktail area | 1 | — owner/builder call |
| Resize dance floor | 1 | — owner/builder call |
| Resize stage | 1 | — owner/builder call |
| Retake left)` : ''} | 1 | — owner/builder call |
| Retry camera | 1 | Amber |
| Review | 1 | Amber |
| Rotate 45° left | 1 | — owner/builder call |
| Rotate 45° right | 1 | — owner/builder call |
| Rotate table — drag in a circle (hold Shift for 1° steps) | 1 | — owner/builder call |
| Same as theme | 1 | — owner/builder call |
| Save Nikah details | 1 | Green |
| Save answers | 1 | Green |
| Save my music notes | 1 | Green |
| Save photo | 1 | Green |
| Scan place card or table QR | 1 | — owner/builder call |
| Schedule for later | 1 | Amber |
| Seat anywhere | 1 | — owner/builder call |
| Seat removed · Undo | 1 | Amber |
| Send my answer | 1 | Blue |
| Service | 1 | — owner/builder call |
| Share | 1 | Grey |
| Shift everything after | 1 | — owner/builder call |
| Show early | 1 | Grey |
| Show on wall again | 1 | Grey |
| Show supplier suggestions | 1 | Grey |
| Sit everyone down · dancing | 1 | — owner/builder call |
| Stage | 1 | — owner/builder call |
| Start it now | 1 | Terracotta (brand) |
| Start my seating | 1 | Terracotta (brand) |
| Start over | 1 | Terracotta (brand) |
| Stop | 1 | — owner/builder call |
| Stop scanning | 1 | — owner/builder call |
| Suggest for me | 1 | — owner/builder call |
| Take off this moment | 1 | — owner/builder call |
| This is happening now | 1 | — owner/builder call |
| Undo seat | 1 | Amber |
| Unlock | 1 | Terracotta (brand) |
| Use | 1 | Terracotta (brand) |
| Use this | 1 | Terracotta (brand) |
| Use this song on my site | 1 | Terracotta (brand) |
| Write a column | 1 | — owner/builder call |
| ` : ''} / guest | 1 | — owner/builder call |
| board.setStyle(s.key)} className=`} > | 1 | — owner/builder call |
| choose(activePart, attr, opt.id)} className=`} > | 1 | Terracotta (brand) |
| choose(t.type)} aria-pressed= className=`} > seats | 1 | Terracotta (brand) |
| choose(v)} disabled= aria-pressed= className=`} > | 1 | Terracotta (brand) |
| extra camera$ · Free` : `Add $ extra camera$ · $`} | 1 | Terracotta (brand) |
| flipDoor(!doorOpen)} className=`} > | 1 | — owner/builder call |
| handleSetProgram(cameraSourceKey(cam))} className=`} > | 1 | — owner/builder call |
| onChange()} className= aspect-square $`} title= > | 1 | — owner/builder call |
| onChange()} className= h-14 $`} style= title= > | 1 | — owner/builder call |
| onChange()} className=`} > | 1 | — owner/builder call |
| onChange()} className=`} style=} > | 1 | — owner/builder call |
| onChange(id)} aria-pressed= className=`} > | 1 | — owner/builder call |
| onChange(v)} className=`} > | 1 | — owner/builder call |
| onFire(m)} className=`} > | 1 | — owner/builder call |
| onForgetSet(g.name)} > × | 1 | — owner/builder call |
| onMoveZone(zone)} className=`} > | 1 | — owner/builder call |
| onPick(key)} className= $`} > | 1 | — owner/builder call |
| onPick(wall.key)} className= > | 1 | — owner/builder call |
| onPickColor(c)} /> ))} ) : null} + Words | 1 | — owner/builder call |
| onPickGroup(gr.id)} className=`} > | 1 | — owner/builder call |
| onPreview(t.id)} aria-pressed= className=`} > | 1 | — owner/builder call |
| onRemoveMoment(m.id, e.detail === 0)} > × | 1 | — owner/builder call |
| onRoute(screen, mode.key)} className=`} > | 1 | — owner/builder call |
| onSave(choice)} aria-pressed= className=`} > | 1 | — owner/builder call |
| onSeatGroup(grp.group_id)} className=`} > | 1 | — owner/builder call |
| onSeatTier(tier)} className=`} > unseated | 1 | — owner/builder call |
| onSelect(it.key)} onMouseEnter= className=`} > | 1 | — owner/builder call |
| onSetType(c.type)} className=`} > | 1 | — owner/builder call |
| onSetVendor(v)} className=`} > | 1 | — owner/builder call |
| onTab(t)} aria-pressed= className=`} > | 1 | — owner/builder call |
| onToggleSplit?.(key)} aria-pressed= title= className=`} > | 1 | — owner/builder call |
| onToolbar('backing')} > A | 1 | — owner/builder call |
| onToolbar('bigger')}> | 1 | — owner/builder call |
| onToolbar('left')}> | 1 | — owner/builder call |
| onToolbar('remove')}> | 1 | Red |
| onToolbar('right')}> | 1 | — owner/builder call |
| onToolbar('smaller')}> | 1 | — owner/builder call |
| onUseSet(g.name)} > | 1 | — owner/builder call |
| pickMoment(m.id)} onKeyDown= > | 1 | — owner/builder call |
| review | 1 | Amber |
| rotateTable(st, 90)} disabled= className=> Rotate | 1 | — owner/builder call |
| selectPanelTab(key)} className=`} > ) : null} | 1 | — owner/builder call |
| setActiveSlotId(s.slotId)} className=`} > `} | 1 | — owner/builder call |
| setAddOpen(true)} className=`} > | 1 | — owner/builder call |
| setAisleM(o.m)} disabled= className= m | 1 | — owner/builder call |
| setDraft((d) => ()) } className=`} > | 1 | — owner/builder call |
| setEditChairs(false)} className=`} > Done | 1 | Green |
| setEyedropping((v) => !v)} className=`} > | 1 | — owner/builder call |
| setFilter(f.key)} aria-pressed= className=`} > | 1 | — owner/builder call |
| setLegibility(id)} className=`} > | 1 | — owner/builder call |
| setMobileTab(t.key)} className=`} > | 1 | — owner/builder call |
| setMode(m)} className=`} > | 1 | — owner/builder call |
| setOpen(!open)} > | 1 | Grey |
| setPaletteKey(p.key)} className=`} > | 1 | — owner/builder call |
| setScene((s) => s + 1)}> / · tap to continue | 1 | Terracotta (brand) |
| setShowAccents(!showAccents)} className=`} > Centerpieces | 1 | — owner/builder call |
| setShowCloth(!showCloth)} className=`} > Tablecloths | 1 | — owner/builder call |
| setThemeId(t.id)} aria-pressed= className=`} > | 1 | — owner/builder call |
| setVerdicts((p) => ())} aria-pressed= className=`} > Share | 1 | Grey |
| setWaxChoice('auto')} className=`} > Mood Board | 1 | — owner/builder call |
| to seat · tables | 1 | — owner/builder call |
| void flush(); }} > Save | 1 | Green |
| window.location.reload()}> Reload | 1 | — owner/builder call |
| window.location.reload()}> reload | 1 | — owner/builder call |
| } aria-label=`} className=`} > | 1 | — owner/builder call |
| } aria-pressed= className= $`} > Seat people | 1 | — owner/builder call |
| } className= ml-auto bg-ink text-cream hover:bg-ink`}> Done | 1 | Green |
| } disabled= className=> Edit chairs… | 1 | Grey |
| } onClick= > : null} + : null} | 1 | — owner/builder call |
| ”.`); }} className= $`} > Link… | 1 | — owner/builder call |

### Sweep 3 · Couple · Guests — 30 distinct labels · 37 static · 74 dynamic (hand-toned in the sweep)

| Button (as written) | × | Colour |
|---|---|---|
| Cancel | 3 | Red |
| Close | 3 | Grey |
| Keep as is | 2 | — owner/builder call |
| Stop scanning | 2 | — owner/builder call |
| window.dispatchEvent(new CustomEvent(OPEN_EVENT))} > | 2 | Terracotta (brand) |
| Cancel new group | 1 | Red |
| Choose another file | 1 | Terracotta (brand) |
| Copy invitation link | 1 | Grey |
| Copy message | 1 | Blue |
| Copy ticket | 1 | Grey |
| Create + Add | 1 | Terracotta (brand) |
| Create group and add | 1 | Terracotta (brand) |
| Dismiss | 1 | — owner/builder call |
| Invite | 1 | Terracotta (brand) |
| Rename / Side | 1 | Grey |
| Rename this role | 1 | Grey |
| Scan a guest QR | 1 | — owner/builder call |
| Scan a guest’s QR | 1 | — owner/builder call |
| Stop | 1 | — owner/builder call |
| ` : 'Check in'} | 1 | — owner/builder call |
| ` : sentAt ? 'Send again' : 'Send invite'} | 1 | Blue |
| guests` : 'Add guest'} | 1 | Terracotta (brand) |
| mark(false)} disabled= className=> Undo | 1 | Green |
| mark(true)} disabled= className= data-guest-invite-mark=""> | 1 | Green |
| mark(true)} disabled= className=> Mark as sent | 1 | Green |
| onPick(r)} className=`} > | 1 | — owner/builder call |
| } > Delete guest | 1 | Red |
| } > New QR | 1 | Terracotta (brand) |
| } > Unlink account | 1 | — owner/builder call |
| } className=`} > | 1 | — owner/builder call |

### Sweep 4 · Couple · Budget — 5 distinct labels · 5 static · 8 dynamic (hand-toned in the sweep)

| Button (as written) | × | Colour |
|---|---|---|
| Back to your budget summary | 1 | Grey |
| Close | 1 | Grey |
| Range – % of budget | 1 | — owner/builder call |
| Share budget ranges with suppliers | 1 | Grey |
| } className="button-primary px-5" > Done | 1 | Green |

### Sweep 5 · Couple · dashboard home / account — 26 distinct labels · 28 static · 72 dynamic (hand-toned in the sweep)

| Button (as written) | × | Colour |
|---|---|---|
| Close | 2 | Grey |
| Remove | 2 | Red |
| ); }} className=`} > By time | 1 | — owner/builder call |
| Add | 1 | Terracotta (brand) |
| Don&apos;t show me invites from | 1 | Grey |
| Erase | 1 | Red |
| Haptic feedback | 1 | — owner/builder call |
| Leave | 1 | Red |
| No | 1 | — owner/builder call |
| Remove for good Photos and everything else, gone for good. | 1 | Red |
| Rename | 1 | Grey |
| Save | 1 | Green |
| Save the name | 1 | Green |
| Use “” | 1 | Terracotta (brand) |
| Yes | 1 | — owner/builder call |
| commit(r)} className=`} > | 1 | — owner/builder call |
| go(item.href)} onMouseEnter= className=`} > | 1 | Terracotta (brand) |
| goTo(at - 1)} disabled={at Back | 1 | Grey |
| setMode('specific')} className= $`} > Specific date(s) | 1 | — owner/builder call |
| setMode('window')} className= $`} > A range | 1 | — owner/builder call |
| setOrder('significance')} className=`} > By significance | 1 | — owner/builder call |
| setSubject(s)} type="button" > | 1 | — owner/builder call |
| void play()}> ↻ Replay | 1 | — owner/builder call |
| } type="button" > Change | 1 | Grey |
| ■ Stop | 1 | — owner/builder call |
| ▶ Resume | 1 | — owner/builder call |

### Sweep 6 · Couple · Event Hub Maker — 94 distinct labels · 105 static · 142 dynamic (hand-toned in the sweep)

| Button (as written) | × | Colour |
|---|---|---|
| Close | 5 | Grey |
| : null} | 2 | — owner/builder call |
| Done | 2 | Green |
| Keep it | 2 | — owner/builder call |
| Next | 2 | Terracotta (brand) |
| Save | 2 | Green |
| Your video | 2 | — owner/builder call |
| } className= $ $`} > | 2 | — owner/builder call |
| "]`)?.click(); } else onPickPage(p.option); }} className= > | 1 | — owner/builder call |
| ))} How close | 1 | Grey |
| ); } setOpen((o) => !o); }} className= $`} > | 1 | — owner/builder call |
| 8 ? 'text-[9px]' : 'text-[10.5px]' }`} > | 1 | — owner/builder call |
| : icon} )} | 1 | — owner/builder call |
| : null} ▴ | 1 | — owner/builder call |
| : tile.label} ) : null} | 1 | — owner/builder call |
| Add a moment | 1 | Terracotta (brand) |
| All items | 1 | — owner/builder call |
| Back | 1 | Grey |
| Cancel | 1 | Red |
| Change it again | 1 | Grey |
| City or area | 1 | — owner/builder call |
| Close the menu | 1 | Grey |
| Close the templates | 1 | Grey |
| Close the tools | 1 | Grey |
| Event Bar | 1 | — owner/builder call |
| Exit preview | 1 | Grey |
| Font, colour &amp; size | 1 | — owner/builder call |
| I’m ready | 1 | — owner/builder call |
| Keep editing | 1 | — owner/builder call |
| Make it move | 1 | Grey |
| None | 1 | — owner/builder call |
| Open Event Details | 1 | Grey |
| Open the Colour panel | 1 | Grey |
| Peek — hold to see the whole page | 1 | Grey |
| Play the opening | 1 | — owner/builder call |
| Preview as guest | 1 | Grey |
| Previous | 1 | — owner/builder call |
| Remove | 1 | Red |
| Remove for good | 1 | Red |
| Remove moment | 1 | Red |
| Remove this layer | 1 | Red |
| Reset how it moves | 1 | Red |
| Retry | 1 | Amber |
| Same as the Event Hub | 1 | — owner/builder call |
| Save as my hero | 1 | Green |
| Save menu | 1 | Green |
| Save message | 1 | Green |
| Save the current colour | 1 | Green |
| Save this section | 1 | Green |
| Skip for now | 1 | Grey |
| Stages | 1 | — owner/builder call |
| Start anyway | 1 | Terracotta (brand) |
| Start over | 1 | Terracotta (brand) |
| Stop | 1 | — owner/builder call |
| Style ▾ | 1 | — owner/builder call |
| Take it off | 1 | — owner/builder call |
| Try again | 1 | Terracotta (brand) |
| Turn the backdrop off | 1 | — owner/builder call |
| Undo | 1 | Amber |
| Use a photo instead | 1 | Terracotta (brand) |
| Use the invitation card instead | 1 | Terracotta (brand) |
| What’s left | 1 | — owner/builder call |
| Your Event Hub | 1 | — owner/builder call |
| act()} > Reset in my draft | 1 | Red |
| onAdd(p.key)} className=> | 1 | — owner/builder call |
| onChange(t.key)} className=`} > | 1 | — owner/builder call |
| onOpen(t.key)} className=`} > | 1 | — owner/builder call |
| pick(c)} className=`} > | 1 | Terracotta (brand) |
| pick(c)} data-city-option= className=`} > km : null} | 1 | Terracotta (brand) |
| pick(s.key)} className=`} > | 1 | Terracotta (brand) |
| pickPart(k)} className=> : null} | 1 | — owner/builder call |
| pickTool(t)} className= disabled:opacity-30`} > | 1 | — owner/builder call |
| pressDoor(door)} className= hidden lg:inline-flex $`} > | 1 | — owner/builder call |
| select(item)} className=`} > | 1 | — owner/builder call |
| setAdding('above')} className= style=} > | 1 | — owner/builder call |
| setAdding('below')} className= style=} > | 1 | — owner/builder call |
| setAsking(false)}> Cancel | 1 | Red |
| setAsking(true)}> Reset … | 1 | Red |
| setMenuOpen((o) => !o)} className=`} > | 1 | — owner/builder call |
| setOpen((o) => !o)} className= $`} > : null} | 1 | — owner/builder call |
| setOpen((o) => !o)} className= > | 1 | — owner/builder call |
| setOpen(false) : () => openSheet(); } } > | 1 | — owner/builder call |
| setPrecision(k)} className= > | 1 | — owner/builder call |
| setSheet(t.key)} className= $ $ disabled:opacity-50`} > | 1 | — owner/builder call |
| toggleStage(s)} className=`} > | 1 | — owner/builder call |
| void pick(option)} className=`} > | 1 | Terracotta (brand) |
| } className= $`} > | 1 | — owner/builder call |
| } className= bg-white/50 text-ink/60 hover:bg-white/70`} > | 1 | — owner/builder call |
| } className= touch-none`} style=} > | 1 | — owner/builder call |
| } className=`} > | 1 | — owner/builder call |
| } className=`} > : null} | 1 | — owner/builder call |
| }> Move down | 1 | Grey |
| }} className= $`} > | 1 | — owner/builder call |
| ▶ Clip | 1 | — owner/builder call |

### Sweep 7 · Supplier · dashboard — 67 distinct labels · 84 static · 168 dynamic (hand-toned in the sweep)

| Button (as written) | × | Colour |
|---|---|---|
| Save | 10 | Green |
| ) : null} | 2 | — owner/builder call |
| Add | 2 | Terracotta (brand) |
| Cancel | 2 | Red |
| Close | 2 | Grey |
| Delete | 2 | Red |
| Log | 2 | — owner/builder call |
| Remove | 2 | Red |
| Remove this option | 2 | Red |
| + Create service card | 1 | Terracotta (brand) |
| Add )` : ''} | 1 | Terracotta (brand) |
| Add add-on | 1 | Terracotta (brand) |
| Add another option | 1 | Terracotta (brand) |
| Add another video | 1 | Terracotta (brand) |
| Add domain | 1 | Terracotta (brand) |
| Add question | 1 | Terracotta (brand) |
| Add segment | 1 | Terracotta (brand) |
| Add sign | 1 | Terracotta (brand) |
| Ask again | 1 | Blue |
| Cancel rename | 1 | Red |
| Decline | 1 | Red |
| Disconnect | 1 | — owner/builder call |
| Dismiss push notification prompt | 1 | — owner/builder call |
| Flip camera | 1 | — owner/builder call |
| I delivered this service | 1 | — owner/builder call |
| Not now | 1 | — owner/builder call |
| Offer again | 1 | — owner/builder call |
| Print | 1 | Grey |
| Remove add-on | 1 | Red |
| Remove team member | 1 | Red |
| Remove this inclusion | 1 | Red |
| Remove this line | 1 | Red |
| Renew | 1 | — owner/builder call |
| Reset | 1 | Red |
| Resize cocktail area | 1 | — owner/builder call |
| Save set name | 1 | Green |
| Save tags | 1 | Green |
| Save to my booth | 1 | Green |
| Send request | 1 | Blue |
| Send to the coordinator | 1 | Blue |
| Skip — I&rsquo;ll build it myself | 1 | Terracotta (brand) |
| Step down | 1 | — owner/builder call |
| Stop | 1 | — owner/builder call |
| Stop asking | 1 | — owner/builder call |
| Stop offering | 1 | — owner/builder call |
| Try again | 1 | Terracotta (brand) |
| Update match | 1 | — owner/builder call |
| Use my past replies | 1 | Terracotta (brand) |
| ` : action.nextLabel ? `Finish $ → $` : `Finish $`} | 1 | Green |
| advance(row)} aria-label=`} className=`} > | 1 | — owner/builder call |
| item | 1 | — owner/builder call |
| onState(item.ref, s)} className=`} > | 1 | — owner/builder call |
| send(preset.key)} disabled= className=`} > | 1 | Blue |
| setChannel(r.id)} aria-pressed= className= > | 1 | — owner/builder call |
| setGiftOn(opt.on)} aria-pressed= className=`} > | 1 | — owner/builder call |
| setNotice(null)} aria-label="Dismiss"> | 1 | — owner/builder call |
| setOpen(false)} className="button-secondary"> Cancel | 1 | Red |
| setOpenId(null)} className="text-xs" style=}> Close | 1 | Grey |
| setOutcome(key)} aria-pressed= className= > | 1 | — owner/builder call |
| setSelectedId(a.asset_id)} className=`} > ` : ''} | 1 | — owner/builder call |
| setTerm(value)} className= > | 1 | — owner/builder call |
| setType(tile.key)} aria-pressed= className=`} > | 1 | — owner/builder call |
| to their editorial`} | 1 | — owner/builder call |
| toggle(area)} aria-pressed= className=`} > | 1 | — owner/builder call |
| toggle(i.id)} aria-pressed= aria-label= className=`} > | 1 | — owner/builder call |
| update(i, )} className=`} > % of total | 1 | — owner/builder call |
| update(i, )} className=`} > Fixed ₱ | 1 | — owner/builder call |

### Sweep 8 · Sign-up & onboarding — 70 distinct labels · 71 static · 21 dynamic (hand-toned in the sweep)

| Button (as written) | × | Colour |
|---|---|---|
| toggleInterested(fk)}> | 2 | — owner/builder call |
| + Add | 1 | Terracotta (brand) |
| = ESTIMATE_MAX} onClick=)}> + | 1 | — owner/builder call |
| Add it later | 1 | Amber |
| Another day | 1 | — owner/builder call |
| Cancel | 1 | Red |
| Change design | 1 | Grey |
| Close | 1 | Grey |
| Continue | 1 | Terracotta (brand) |
| Generate another design | 1 | Terracotta (brand) |
| More about this | 1 | Grey |
| Near me | 1 | — owner/builder call |
| Next month | 1 | Terracotta (brand) |
| Ours was easy — skip | 1 | Grey |
| Previous month | 1 | — owner/builder call |
| Remove | 1 | Red |
| Send invite &amp; connect | 1 | Blue |
| Tell it | 1 | — owner/builder call |
| aiAnswer(true)}>Yes — match the rest of my suppliers | 1 | — owner/builder call |
| applyBudget('no_limit', null)}> No limit | 1 | — owner/builder call |
| dropSpark(c.stem)}> | 1 | — owner/builder call |
| go(-1)} aria-label="Back" style=} > | 1 | Terracotta (brand) |
| go(1); }} disabled= style= : undefined} > | 1 | Terracotta (brand) |
| go(1)} style=} > Skip | 1 | Terracotta (brand) |
| go(1)}>This is us | 1 | Terracotta (brand) |
| goToId('love_spark')}>Change a line | 1 | Grey |
| onBudgetAmount(budgetCeilingV)}> Set a budget instead | 1 | — owner/builder call |
| onChange( as Partial)}> | 1 | — owner/builder call |
| onChange()}> | 1 | — owner/builder call |
| onChange(asStr(value) === o ? '' : o)} className= $`} > | 1 | — owner/builder call |
| onChange(v)} className= $`} > | 1 | — owner/builder call |
| onChange(values.filter((x) => x !== v))} className= $`} > ✕ | 1 | Grey |
| openMomentForm()}>＋ a moment that mattered | 1 | — owner/builder call |
| patch( })} > | 1 | — owner/builder call |
| patch()} disabled= title= > Use this monogram | 1 | Terracotta (brand) |
| patch()}> − | 1 | — owner/builder call |
| patch()}>+ | 1 | — owner/builder call |
| patch()}>− | 1 | — owner/builder call |
| pick(m.field, o.value)}> } | 1 | Terracotta (brand) |
| pickAxis(axis.id, o.key)} className= > | 1 | — owner/builder call |
| pickCelebrationDay(anchorOptions.onTheDayISO)} > On the day | 1 | — owner/builder call |
| pickCue(c.kind)}> | 1 | — owner/builder call |
| pickDetail(typeQuestion.id, o.key)} className= > | 1 | — owner/builder call |
| pickProposal(c.prop)}> | 1 | — owner/builder call |
| pickProposalVoice(c.voice)}> | 1 | — owner/builder call |
| pickTone(c.tone)}> | 1 | — owner/builder call |
| selectKind(o.value)}> | 1 | — owner/builder call |
| selectRole(o.value)}> | 1 | — owner/builder call |
| setAnchorOrigin(o)} className=`} > | 1 | — owner/builder call |
| setByoOpen(false)}>Cancel | 1 | Red |
| setByoOpen(true)}> | 1 | — owner/builder call |
| setExtrasOpen(open ? -1 : gi)}> selected : } | 1 | Grey |
| setFarther((v) => !v)}> | 1 | — owner/builder call |
| setFocusedService(k)}> | 1 | — owner/builder call |
| setHonoreeRevealed(true)} type="button" > Change | 1 | Grey |
| setMfTitle(c)}> | 1 | — owner/builder call |
| setMode('specific')}> Specific dates1–4 days | 1 | — owner/builder call |
| setMode('window')}> Flexible windowa range | 1 | — owner/builder call |
| setMode(m)} > | 1 | — owner/builder call |
| setMore((v) => !v)}> | 1 | — owner/builder call |
| setRecurs(o.v)} className=`} > | 1 | — owner/builder call |
| setShowFarther(true)}> Expand search — see farther ↓ | 1 | Grey |
| setStep((s) => Math.max(0, s - 1))}> Back | 1 | Grey |
| t === 'sel' ·· t === 'rstart' ·· t === 'rend')} onClick= > | 1 | — owner/builder call |
| toggle(c.k)} aria-pressed= > km} | 1 | — owner/builder call |
| toggle(k)} > | 1 | — owner/builder call |
| toggle(k)} aria-pressed= > | 1 | — owner/builder call |
| toggleInterested(k)}>× | 1 | — owner/builder call |
| void handleFinish(false)} disabled=> | 1 | — owner/builder call |
| void handleFinish(true)} disabled=> | 1 | — owner/builder call |

### Sweep 9 · Admin — 94 distinct labels · 112 static · 119 dynamic (hand-toned in the sweep)

| Button (as written) | × | Colour |
|---|---|---|
| Apply | 11 | Terracotta (brand) |
| Close | 4 | Grey |
| Save | 4 | Green |
| Dismiss | 2 | — owner/builder call |
| Retire | 2 | — owner/builder call |
| ) : null} ) : null} | 1 | — owner/builder call |
| + Add question | 1 | Terracotta (brand) |
| = totalPages ·· pending} onClick= > Next | 1 | Amber |
| Add award | 1 | Terracotta (brand) |
| Add row | 1 | Terracotta (brand) |
| Apply filters | 1 | Terracotta (brand) |
| Approve & publish | 1 | Green |
| Attach | 1 | — owner/builder call |
| Block | 1 | Red |
| Clear | 1 | — owner/builder call |
| Confirm & publish | 1 | Green |
| Confirm attack | 1 | Green |
| Confirm fraud | 1 | Green |
| Confirm theft | 1 | Green |
| Confirm under-declaration | 1 | Green |
| Confirm: cleanup all + show seed command | 1 | Green |
| Confirm: delete all demo suppliers | 1 | Red |
| Confirm: delete existing + create (~/category) | 1 | Red |
| Create code | 1 | Terracotta (brand) |
| Delete | 1 | Red |
| Discard | 1 | Red |
| Dismiss reminder | 1 | — owner/builder call |
| Draft credit | 1 | — owner/builder call |
| Edit | 1 | Grey |
| Escalate | 1 | — owner/builder call |
| Fit to view | 1 | Grey |
| Hide listing | 1 | Grey |
| Ignore | 1 | — owner/builder call |
| Keep it, and tell them why | 1 | — owner/builder call |
| Log expense | 1 | — owner/builder call |
| Mark N/A | 1 | Green |
| Media removed | 1 | — owner/builder call |
| Move | 1 | Grey |
| Move down | 1 | Grey |
| Move option down | 1 | Grey |
| Move option up | 1 | Grey |
| Move up | 1 | Grey |
| Open | 1 | Grey |
| Open in admin | 1 | Grey |
| Publish | 1 | Terracotta (brand) |
| Put back on sale | 1 | Grey |
| Reject | 1 | Red |
| Reject with this reason | 1 | Red |
| Remove | 1 | Red |
| Remove for good | 1 | Red |
| Remove it for good | 1 | Red |
| Reset to default content | 1 | Red |
| Resolve | 1 | — owner/builder call |
| Retire it | 1 | — owner/builder call |
| Run now | 1 | — owner/builder call |
| Save booking fee | 1 | Green |
| Save pasted result | 1 | Green |
| Save sample to slot | 1 | Green |
| Save shot prices | 1 | Green |
| Save tags | 1 | Green |
| Save this price | 1 | Green |
| Search | 1 | Grey |
| Send a test email | 1 | Blue |
| Show funnel | 1 | Grey |
| Start 2-admin approval | 1 | Terracotta (brand) |
| Try again | 1 | Terracotta (brand) |
| View receipt | 1 | Grey |
| catch }); }} className=`} > | 1 | — owner/builder call |
| clear | 1 | — owner/builder call |
| onChange(!checked)} className=`} > | 1 | — owner/builder call |
| onOpenEdge(node.id, eg.to)} title= $ $`} > rows | 1 | — owner/builder call |
| onOpenFinding(f.id)} > | 1 | — owner/builder call |
| onOpenFinding(finding.id)} > | 1 | — owner/builder call |
| onOpenTable(tableKey)}> Open table | 1 | Grey |
| option$`} | 1 | — owner/builder call |
| pickIcon(name)} className=`} > | 1 | — owner/builder call |
| setActiveScope(s)} className=`} > | 1 | — owner/builder call |
| setChannel(ch)} className=`} > | 1 | — owner/builder call |
| setControl('map')} > Map | 1 | — owner/builder call |
| setControl('tables')} > Tables | 1 | — owner/builder call |
| setDiscountType(t)} className=`} > | 1 | — owner/builder call |
| setFilter(f.key)} className=`} > | 1 | — owner/builder call |
| setPage((p) => Math.max(0, p - 1))} > ← Prev | 1 | — owner/builder call |
| setResolution(r)} > | 1 | — owner/builder call |
| setScope(s)} aria-pressed= className=`} > | 1 | — owner/builder call |
| setSelectedId(a.asset_id)} className=`} > ` : ''} | 1 | — owner/builder call |
| setStrip(null)} aria-label="Dismiss"> | 1 | — owner/builder call |
| setVariant(v.key)} aria-pressed= className=`} > | 1 | — owner/builder call |
| start(async () => ); }) } className= aria-pressed= > | 1 | Terracotta (brand) |
| zoomBy(0.83)} aria-label="Zoom out"> − | 1 | — owner/builder call |
| zoomBy(1.2)} aria-label="Zoom in"> + | 1 | — owner/builder call |
| } aria-selected= className=`} > | 1 | — owner/builder call |
| } className="group flex items-center gap-1.5 text-left" > | 1 | — owner/builder call |
| ↻ Replay | 1 | — owner/builder call |

### Sweep 10 · Marketing / other — 183 distinct labels · 212 static · 188 dynamic (hand-toned in the sweep)

| Button (as written) | × | Colour |
|---|---|---|
| Close | 12 | Grey |
| Cancel | 4 | Red |
| Try again | 3 | Terracotta (brand) |
| : null} | 2 | — owner/builder call |
| Add | 2 | Terracotta (brand) |
| Copy link to this story | 2 | Grey |
| Decline | 2 | Red |
| Done tagging | 2 | Green |
| Publish your story — free | 2 | Terracotta (brand) |
| Send request | 2 | Blue |
| Sign in | 2 | — owner/builder call |
| Sign out | 2 | Red |
| Skip | 2 | Grey |
| Talk to us | 2 | Blue |
| setKind(k)} className=`} > | 2 | — owner/builder call |
| void run('write')} className=> Try again | 2 | Terracotta (brand) |
| &rsaquo; | 1 | — owner/builder call |
| ) : isSubmitting ? ( <> Saving… ) : ( <> )} | 1 | — owner/builder call |
| + Add item | 1 | Terracotta (brand) |
| + Add payment · splits the balance | 1 | Terracotta (brand) |
| + Create event | 1 | Terracotta (brand) |
| Accept | 1 | Green |
| Accept all | 1 | Green |
| Add caption | 1 | Terracotta (brand) |
| Agree &amp; open my camera | 1 | Grey |
| Back | 1 | Grey |
| Back to the list | 1 | Grey |
| Book this deal — ₱ | 1 | Green |
| Check again | 1 | — owner/builder call |
| Choose again | 1 | Terracotta (brand) |
| Choose photos &amp; music | 1 | Terracotta (brand) |
| Close account switcher | 1 | Grey |
| Close plan picker | 1 | Grey |
| Close the reveal preview | 1 | Grey |
| Confirm it reached you | 1 | Green |
| Connect Google Drive | 1 | — owner/builder call |
| Continue | 1 | Terracotta (brand) |
| Continue to payment · ₱2,500 | 1 | Terracotta (brand) |
| Copy results | 1 | Grey |
| Couple pricing | 1 | — owner/builder call |
| Customize | 1 | — owner/builder call |
| Delete | 1 | Red |
| Dismiss app suggestion | 1 | — owner/builder call |
| Dismiss demo-mode banner for this session | 1 | — owner/builder call |
| Dismiss safety tips | 1 | — owner/builder call |
| Done | 1 | Green |
| Download | 1 | Grey |
| Download SVG | 1 | Grey |
| Download reel | 1 | Grey |
| Draw my monogram live | 1 | — owner/builder call |
| Drop | 1 | — owner/builder call |
| Fewer credits | 1 | — owner/builder call |
| Filters | 1 | — owner/builder call |
| Flip camera | 1 | — owner/builder call |
| For storytellers | 1 | — owner/builder call |
| For vendors | 1 | — owner/builder call |
| Get your invite link | 1 | Terracotta (brand) |
| Give to the celebration | 1 | — owner/builder call |
| Got it | 1 | Grey |
| Hang up | 1 | — owner/builder call |
| How the model works ↓ | 1 | — owner/builder call |
| I don&rsquo;t want these after all — remove them | 1 | Red |
| Inquire about this | 1 | Blue |
| Join | 1 | Terracotta (brand) |
| List your business for free | 1 | — owner/builder call |
| List your business — free | 1 | — owner/builder call |
| Load more | 1 | Grey |
| Log my payment | 1 | — owner/builder call |
| Make a custom track | 1 | — owner/builder call |
| Make again | 1 | — owner/builder call |
| Make my Story | 1 | — owner/builder call |
| Mark delivered | 1 | Green |
| Measure FPS (5s) | 1 | — owner/builder call |
| More credits | 1 | Grey |
| Next | 1 | Terracotta (brand) |
| Next review | 1 | Amber |
| Not me | 1 | — owner/builder call |
| Notifications | 1 | — owner/builder call |
| One hour fewer | 1 | — owner/builder call |
| One hour more | 1 | Grey |
| Open | 1 | Grey |
| Open account switcher | 1 | Grey |
| Open in Drive | 1 | Grey |
| Open program output | 1 | Grey |
| Open the sample reception in 3D | 1 | Grey |
| Pair a camera · demo DSLR (no hardware) | 1 | — owner/builder call |
| Previous review | 1 | Amber |
| Push notifications | 1 | — owner/builder call |
| Range – % of budget | 1 | — owner/builder call |
| Ready | 1 | — owner/builder call |
| Release to Drive | 1 | — owner/builder call |
| Remove | 1 | Red |
| Remove attachment | 1 | Red |
| Render reel | 1 | — owner/builder call |
| Restore camera | 1 | — owner/builder call |
| Save | 1 | Green |
| Save RSVP | 1 | Green |
| Save as my monogram | 1 | Green |
| Save entrance | 1 | Green |
| Save palette | 1 | Green |
| Save to phone | 1 | Green |
| See Stories | 1 | Grey |
| See plans | 1 | Grey |
| See supplier plans | 1 | Grey |
| See the full story | 1 | Grey |
| See what a Chapter is ↓ | 1 | Grey |
| See your matches | 1 | Grey |
| Send | 1 | Blue |
| Send new time | 1 | Blue |
| Send report | 1 | Red |
| Service details ) : null} | 1 | Grey |
| Share my Story | 1 | Grey |
| Share this invitation | 1 | Grey |
| Share this story with an app on your phone | 1 | Grey |
| Show | 1 | Grey |
| Skip tour | 1 | Grey |
| Start camera | 1 | Terracotta (brand) |
| Start the wall | 1 | Terracotta (brand) |
| Start your celebration — free | 1 | Terracotta (brand) |
| Start your wedding · free | 1 | Terracotta (brand) |
| Step of ) : null} | 1 | — owner/builder call |
| Stop | 1 | — owner/builder call |
| Tag who&rsquo;s in it | 1 | — owner/builder call |
| Tick the box above to continue | 1 | Terracotta (brand) |
| Toggle torch | 1 | — owner/builder call |
| Undo | 1 | Amber |
| Unlock Setnayan AI | 1 | Terracotta (brand) |
| Unpair | 1 | — owner/builder call |
| Use my location | 1 | Terracotta (brand) |
| What&rsquo;s free ↓ | 1 | — owner/builder call |
| ` : 'Saved'} ) : isError ? ( <> Try again ) : ( <> )} | 1 | Terracotta (brand) |
| ` : `Follow$`} | 1 | — owner/builder call |
| catch }} className= > ) : ( <> )} | 1 | — owner/builder call |
| onPick(h.leaf)}> | 1 | — owner/builder call |
| onPick(l)}> | 1 | — owner/builder call |
| onPick(null)} aria-pressed= className=`} > All | 1 | — owner/builder call |
| openConsentManager()} className=> | 1 | — owner/builder call |
| openConsentManager()}> Cookie settings | 1 | Grey |
| pick('eyebrow', 'You are invited')}> Wording pick (eyebrow) | 1 | Terracotta (brand) |
| pick(s.phase)} className= style= > | 1 | Terracotta (brand) |
| pick(seat)} className=`} > | 1 | Terracotta (brand) |
| pickPreset(p)} className= $`} aria-pressed= > | 1 | — owner/builder call |
| pickStyle(s.id)} className=`} > | 1 | — owner/builder call |
| press('download')}> | 1 | Grey |
| press('prices')}> | 1 | — owner/builder call |
| press('vendors')}> | 1 | — owner/builder call |
| reset | 1 | Red |
| reset()} style=} > Try again | 1 | Red |
| run('apple')} > Apple`} | 1 | — owner/builder call |
| run('apple')}> Apple`} | 1 | — owner/builder call |
| run('facebook')} > Facebook`} | 1 | — owner/builder call |
| run('google')} > Google`} | 1 | — owner/builder call |
| run('google')}> Google`} | 1 | — owner/builder call |
| setActiveType(null)} className=`} > All | 1 | — owner/builder call |
| setAiOn((v) => !v)} className=`} > | 1 | — owner/builder call |
| setBucketKey(b.key)} aria-pressed= className=`} > | 1 | — owner/builder call |
| setChecked((prev) => ()) } className=`} > | 1 | — owner/builder call |
| setDemoOnAir((v) => !v)} style=} > | 1 | — owner/builder call |
| setFilter(f.key)} className=`} > | 1 | — owner/builder call |
| setIndex((index + 1) % keys.length)} style=> Next | 1 | Terracotta (brand) |
| setMenuOpen((v) => !v)} > | 1 | — owner/builder call |
| setMode(k)} className= $`} aria-pressed= > | 1 | — owner/builder call |
| setMore((v) => !v)} aria-expanded= className= > | 1 | — owner/builder call |
| setOpen(true)} > Add to an event | 1 | Terracotta (brand) |
| setOpenBranch(b.tileId)}> | 1 | — owner/builder call |
| setOpenParent(p.folderId)}> | 1 | — owner/builder call |
| setPhase('walking')} className="rounded-full" style=} > | 1 | — owner/builder call |
| setReturnSignal((n) => n + 1)} style=} > Back to seat | 1 | Grey |
| setRoaming((v) => !v)} aria-pressed= className=`} > | 1 | — owner/builder call |
| setRoaming((v) => !v)} style=} > | 1 | — owner/builder call |
| setSelectedMethods((s) => ())} className=`} title=$`} > | 1 | — owner/builder call |
| setShowMatrix((v) => !v)} aria-expanded= style=} > | 1 | — owner/builder call |
| setStage(d.id)} aria-pressed= className=`} > `} | 1 | — owner/builder call |
| setThemed((v) => !v)} aria-pressed= className=`} > | 1 | — owner/builder call |
| setThemed((v) => !v)} style=} > Apply mood board | 1 | Terracotta (brand) |
| setTips((v) => !v)} aria-expanded= className= > | 1 | — owner/builder call |
| setValue(1)} aria-pressed= className=`} > No | 1 | — owner/builder call |
| setValue(5)} aria-pressed= className=`} > Yes | 1 | — owner/builder call |
| void capture()} disabled=> Take a photo | 1 | — owner/builder call |
| void run('check')} className=> Check tag | 1 | — owner/builder call |
| void run('write')} className= title= > Write to NFC | 1 | — owner/builder call |
| void run('write')} className=> Write another | 1 | — owner/builder call |
| 📄 Jump to the quote | 1 | Blue |

### Sweep 11 · Live Studio — 2 distinct labels · 2 static · 0 dynamic (hand-toned in the sweep)

| Button (as written) | × | Colour |
|---|---|---|
| Connect | 1 | — owner/builder call |
| Enter a new code | 1 | Terracotta (brand) |

### Sweep 12 · Guest · Event Hub (public) — 37 distinct labels · 44 static · 71 dynamic (hand-toned in the sweep)

| Button (as written) | × | Colour |
|---|---|---|
| Close | 4 | Grey |
| Back to the story | 2 | Grey |
| Not now | 2 | — owner/builder call |
| Open full size to save | 2 | Green |
| Save a story card for Instagram or TikTok | 2 | Green |
| Add | 1 | Terracotta (brand) |
| Ask for this one to come down | 1 | Blue |
| Dismiss | 1 | — owner/builder call |
| Drag the seal away to open the invitation | 1 | Grey |
| Follow | 1 | — owner/builder call |
| Join as a guest | 1 | Terracotta (brand) |
| Main Stage directed | 1 | — owner/builder call |
| My QR | 1 | — owner/builder call |
| Next | 1 | Terracotta (brand) |
| Not you? Clear and try another name | 1 | Terracotta (brand) |
| Open that minute — | 1 | Grey |
| Remove my avatar | 1 | Red |
| Send to the band | 1 | Blue |
| Sign out of this invitation | 1 | Red |
| Switch | 1 | Grey |
| Take my name off what I wrote | 1 | — owner/builder call |
| Tap for sound | 1 | — owner/builder call |
| This isn&rsquo;t me — I scanned the wrong code | 1 | — owner/builder call |
| Try again | 1 | Terracotta (brand) |
| Turn off | 1 | — owner/builder call |
| Withdraw | 1 | — owner/builder call |
| just show my | 1 | Grey |
| pickZone(zone.zoneIndex)} aria-pressed= className= > | 1 | — owner/builder call |
| select(m.key)} aria-current= className=`} > | 1 | — owner/builder call |
| setActive(t.key)} className=`} > ) : null} | 1 | — owner/builder call |
| setHour(h)} className=`} > | 1 | — owner/builder call |
| setOn(t.key)} className=`} > : null} | 1 | — owner/builder call |
| setOpen(i)} aria-pressed= className=`} > : null} | 1 | — owner/builder call |
| setStopped((s) => !s)} > | 1 | — owner/builder call |
| toggle(item.key)} className=`} > | 1 | — owner/builder call |
| window.print()}> Print / Save as PDF | 1 | Green |
| ‹ Back | 1 | Grey |
