// STEP 8 · the 10a items the live drive had not yet re-driven (mapped in 10a-evidence.md) — driven
// against the LIVE Story Maker, run by live-mky-drive.cjs with PART=gaps on a freshly reset
// arrangement. Each check names its 10a id(s).
const MOD = process.platform === 'darwin' ? 'Meta' : 'Control';

function lcg(seed) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 2 ** 32);
}

/** WCAG contrast of an element's text against the first opaque background behind it. */
const CONTRAST = `(el) => {
  const rgb = (c) => (c.match(/[\\d.]+/g) || []).map(Number);
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const cs = getComputedStyle(el);
  let fg = rgb(cs.color);
  let bgEl = el, bg = null;
  while (bgEl) { const c = rgb(getComputedStyle(bgEl).backgroundColor); if (c.length >= 3 && (c[3] === undefined || c[3] > 0.5)) { bg = c; break; } bgEl = bgEl.parentElement; }
  if (!bg) bg = [255, 255, 255];
  if (fg[3] !== undefined && fg[3] < 1) { const a = fg[3]; fg = [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a)); }
  const L1 = lum(fg), L2 = lum(bg);
  const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  return { ratio: Math.round(ratio * 100) / 100, size: parseFloat(cs.fontSize), weight: cs.fontWeight, text: (el.textContent || el.placeholder || '').trim().slice(0, 40) };
}`;

async function gaps(h) {
  const { page, ctx, phone, tag, check, facts, whole, waitSaved, open, touchDrag, mouseDrag, center, ROOT, TOTAL } = h;
  const root = page.locator(ROOT);
  const press = async (loc) => (phone ? loc.tap() : loc.click());
  const pressAnyway = async (loc) => (phone ? loc.tap({ force: true }) : loc.click({ force: true }));
  const drag = phone ? touchDrag : mouseDrag;
  const wait = (ms) => page.waitForTimeout(ms);
  const choose = root.getByRole('button', { name: /I choose/ });
  const automatic = root.getByRole('button', { name: /Automatic/ });
  const films = root.locator('[data-film]');
  const photos = root.locator('[data-obj][data-kind="photo"]');
  const boxes = root.locator('[data-obj][data-kind="words"]');
  const moment = (name) => root.locator('[data-moment]', { hasText: name });
  const plusWords = root.getByRole('button', { name: '+ Words' });
  const plusNew = root.getByRole('button', { name: '+ New' });
  const nameSetBtn = root.getByRole('button', { name: 'Name these photos' });
  const setInput = root.getByRole('textbox', { name: 'A name for these photos' });
  const putBack = root.getByRole('button', { name: 'Put all back' });
  const bar = root.locator('[role="toolbar"][aria-label="Words"]');
  const tb = (name) => bar.getByRole('button', { name });
  const hint = async () => (await facts(page)).hint || '';
  const sheet = () =>
    page.evaluate((ROOT) => {
      const c = document.querySelector(ROOT).querySelector('[aria-label="This moment’s page"]');
      const r = c.getBoundingClientRect();
      const st = c.parentElement.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, h: r.height, stageBottom: st.bottom, stageScroll: c.parentElement.scrollWidth - c.parentElement.clientWidth };
    }, ROOT);
  const boxRect = (loc) => loc.evaluate((e) => e.getBoundingClientRect().toJSON());
  const typeWords = async (text) => {
    await press(plusWords);
    await wait(300);
    await page.keyboard.type(text);
    await wait(200);
  };

  await open(page);
  await press(moment('Dinner'));
  await wait(200);
  if (process.env.GAPS_ONLY !== 'monkey') {

  // ── CRITIC TEST 6: a moment the host added, in Automatic, says what is true ─────────────────
  await press(choose);
  await wait(250);
  await press(plusNew);
  await wait(300);
  await page.keyboard.type('Our own moment');
  await page.keyboard.press('Enter');
  await wait(400);
  await press(automatic);
  await wait(400);
  await press(moment('Our own moment'));
  await wait(300);
  {
    const txt = await root.innerText();
    const said = (txt.match(/Automatic leaves moments you added alone[^\n]*|No photo from the day falls[^\n]*/) || [''])[0];
    check(`[${tag}] gaps a host-added moment in Automatic says Automatic leaves it alone — never "no photo falls in it" (r3 CRITIC TEST 6)`, /leaves moments you added alone/.test(said) && !/No photo from the day falls/.test(txt), said || txt.replace(/\s+/g, ' ').slice(0, 160));
  }
  // Undo the Automatic, back to I choose with the host moment kept.
  const undo = page.getByRole('button', { name: 'Undo' });
  if (await undo.count()) await press(undo);
  await wait(300);
  if ((await choose.getAttribute('aria-pressed')) !== 'true') await press(choose);
  await wait(250);

  // ── R5-reload-forgets-hand-changes · F2 · chaos-r3-02: after a reload, Automatic still offers Undo ──
  {
    await press(moment('Dinner'));
    await wait(250);
    const p = photos.first();
    const c = await center(p);
    await drag(page, { x: c.x - 10, y: c.y }, { x: c.x + 60, y: c.y + 40 }, 8);
    await wait(300);
    await waitSaved(page);
    await open(page);
    await press(moment('Dinner'));
    await wait(250);
    await press(automatic);
    await wait(400);
    const f = await facts(page);
    check(`[${tag}] gaps after a reload, Back to Automatic still offers Undo for the hand-made pages (r3 R5-reload · F2 · chaos-r3-02)`, f.undo && /Sorted by your run of show/.test(f.hint), f.hint);
    await press(page.getByRole('button', { name: 'Undo' }));
    await wait(400);
    check(`[${tag}] gaps …and that Undo brings the hand arrangement back`, (await choose.getAttribute('aria-pressed')) === 'true');
    await whole(page, `${tag} · gaps after reload + Automatic + Undo`);
  }

  // ── RL-14 · chaos-13: four-line words dragged to the bottom are not cut off ────────────────
  {
    await press(moment('Dinner'));
    await wait(250);
    await press(plusWords);
    await wait(300);
    for (const l of ['one', 'two', 'three']) {
      await page.keyboard.type(l);
      await page.keyboard.press('Enter');
    }
    await page.keyboard.type('four');
    await page.keyboard.press('Escape');
    await wait(300);
    const w = boxes.last();
    const g = await center(w.locator('[data-grip]'));
    const s0 = await sheet();
    await drag(page, { x: g.x, y: g.y }, { x: g.x, y: s0.bottom + 90 }, 12);
    await wait(500);
    const s1 = await sheet();
    const r = await boxRect(w);
    check(`[${tag}] gaps four-line words dragged to the bottom are not cut off — the page grows to hold them (RL-14 · chaos-13)`, r.bottom <= s1.bottom + 1 && s1.h > s0.h - 1, `words ${Math.round(r.top)}–${Math.round(r.bottom)} · page ${Math.round(s1.top)}–${Math.round(s1.bottom)} (was ${Math.round(s0.h)}px tall, now ${Math.round(s1.h)})`);
    await whole(page, `${tag} · gaps four lines at the bottom`);
  }

  // ── RL-15 · chaos-09: one long word (a wedding hashtag) never runs off the page ─────────────
  {
    await typeWords('#TalaAndMigoForeverAndEverUnderTheCapizLightsInTagaytay2026');
    await page.keyboard.press('Escape');
    await wait(400);
    const w = boxes.last();
    const r = await boxRect(w);
    const s = await sheet();
    const sideways = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    check(`[${tag}] gaps a 60-character hashtag stays inside the page (RL-15 · chaos-09)`, r.right <= s.right + 1 && r.left >= s.left - 1, `words ${Math.round(r.left)}–${Math.round(r.right)} · page ${Math.round(s.left)}–${Math.round(s.right)}`);
    check(`[${tag}] gaps …and nothing scrolls sideways, the page or the desk (RL-15 · chaos-09)`, sideways <= 0 && s.stageScroll <= 1, `page ${sideways}px · desk ${s.stageScroll}px`);
    if (!phone) {
      await press(w.locator('[data-ed]'));
      await wait(250);
      const x = await w.locator('[data-x]').evaluate((e) => { const b = e.getBoundingClientRect(); return b.right <= innerWidth && b.width > 0 && getComputedStyle(e).display !== 'none'; });
      check(`[${tag}] gaps …and its × is on screen (RL-16)`, x);
      await page.keyboard.press('Escape');
    }
  }

  // ── DW-22 · chaos-17: caret in words, then a photo — Backspace takes the PHOTO, not letters ──
  {
    const w = boxes.first();
    const before = await w.locator('[data-ed]').innerText();
    await press(w.locator('[data-ed]'));
    await wait(200);
    const n0 = (await facts(page)).onPage;
    const p = photos.first();
    const pb = await p.boundingBox();
    if (phone) await page.touchscreen.tap(pb.x + pb.width / 2, pb.y + pb.height / 2);
    else await page.mouse.click(pb.x + pb.width / 2, pb.y + pb.height / 2);
    await wait(250);
    const caretInWords = await page.evaluate(() => document.activeElement?.dataset?.ed !== undefined);
    check(`[${tag}] gaps a press on a photo takes the caret out of the words (DW-22 · chaos-17)`, !caretInWords);
    if (!phone) {
      await page.keyboard.press('Backspace');
      await wait(300);
      const after = await w.locator('[data-ed]').innerText();
      const f = await facts(page);
      check(`[${tag}] gaps …so Backspace takes the photo off and leaves the words as they were (DW-22 · chaos-17)`, f.onPage === n0 - 1 && after === before, `photos ${n0} → ${f.onPage} · words ${JSON.stringify(before)} → ${JSON.stringify(after)}`);
      await page.keyboard.press(`${MOD}+z`);
      await wait(300);
    }
    await whole(page, `${tag} · gaps caret then photo`);
  }

  // ── R16-stale-look-row: when an empty box leaves, its toolbar goes with it ───────────────────
  {
    await press(plusWords);
    await wait(300);
    check(`[${tag}] gaps (a new empty box brings its toolbar)`, await bar.isVisible());
    await press(moment('Cocktails'));
    await wait(400);
    check(`[${tag}] gaps the empty box leaves and its toolbar goes with it (r3 R16-stale-look-row)`, !(await bar.isVisible()) && (await boxes.count()) === 0, `bar ${await bar.isVisible()} · boxes ${await boxes.count()}`);
    await press(moment('Dinner'));
    await wait(300);
  }

  // ── F14: a drop does not replay the landing animation ───────────────────────────────────────
  {
    const p = photos.last();
    const c = await center(p);
    await drag(page, { x: c.x - 10, y: c.y }, { x: c.x - 40, y: c.y + 25 }, 8);
    await wait(60);
    const running = await p.evaluate((e) => e.getAnimations({ subtree: true }).filter((a) => a.playState === 'running' && /land|pop|in/i.test(a.animationName || '')).map((a) => a.animationName));
    const op = await p.evaluate((e) => getComputedStyle(e).opacity);
    check(`[${tag}] gaps a dropped photo does not replay its landing animation — no blink (r3 F14)`, running.length === 0 && op === '1', `running ${JSON.stringify(running)} · opacity ${op}`);
  }

  // ── R9-name-field-outlives-its-context: the set-name field closes on a mode switch, + New, <2 photos ──
  {
    await press(moment('Dinner'));
    await wait(250);
    while ((await photos.count()) < 2 && (await films.count()) > 0) {
      await press(films.first());
      await wait(300);
    }
    const open1 = async () => { await press(nameSetBtn); await wait(300); return setInput.isVisible(); };
    if (await open1()) {
      await press(automatic);
      await wait(400);
      check(`[${tag}] gaps the set-name field closes when the mode switches (r3 R9-name-field-outlives-its-context)`, !(await setInput.isVisible()));
      await press(page.getByRole('button', { name: 'Undo' }));
      await wait(400);
    } else check(`[${tag}] gaps (Name these photos opened)`, false, 'field did not open');
    if (await open1()) {
      await press(plusNew);
      await wait(350);
      check(`[${tag}] gaps the set-name field closes on + New (r3 R9-name-field-outlives-its-context)`, !(await setInput.isVisible()));
      await page.keyboard.press('Escape');
      await wait(300);
    }
    await press(moment('Dinner'));
    await wait(250);
    if (await open1()) {
      while ((await photos.count()) >= 2) {
        await press(photos.first().locator('[data-x]'));
        await wait(300);
      }
      check(`[${tag}] gaps the set-name field closes when fewer than 2 photos are left (r3 R9-name-field-outlives-its-context)`, !(await setInput.isVisible()));
      await press(page.getByRole('button', { name: 'Undo' })).catch(() => {});
      await wait(300);
    }
    await whole(page, `${tag} · gaps set-name field`);
  }

  // ── chaos-r3-09 (desk): a TURNED caption's × stays above a photo laid over its corner ────────
  if (!phone) {
    await press(moment('Dinner'));
    await wait(250);
    await typeWords('Turned');
    await press(tb('Turn right'));
    await press(tb('Turn right'));
    await wait(250);
    const w = boxes.last();
    const xc = await center(w.locator('[data-x]'));
    const p = photos.first();
    const pc = await center(p);
    await drag(page, { x: pc.x - 20, y: pc.y }, { x: xc.x - 20, y: xc.y + 10 }, 12);
    await wait(300);
    // The photo now lies over part of the words; select them where they still SHOW (a real click
    // on an uncovered point — a forced click would land on the photo on top).
    await w.evaluate((e) => e.scrollIntoView({ block: 'center' })); // clear of the site's fixed header
    await wait(250);
    const spot = await w.evaluate((e) => {
      const r = e.getBoundingClientRect();
      for (let y = r.top + 4; y < r.bottom - 2; y += 4) for (let x = r.left + 4; x < r.right - 2; x += 6) {
        const hit = document.elementFromPoint(x, y);
        if (hit && e.contains(hit) && !hit.closest('[data-x]') && !hit.closest('[data-hdl]')) return { x, y };
      }
      return null;
    });
    if (spot) await page.mouse.click(spot.x, spot.y);
    await wait(250);
    const shown = await w.locator('[data-x]').evaluate((e) => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0);
    check(`[${tag}] gaps (the turned caption is selected and its × shows)`, !!spot && shown, JSON.stringify(spot));
    const xc2 = await w.locator('[data-x]').evaluate((e) => { const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
    const hit = await page.evaluate(({ x, y }) => { const el = document.elementFromPoint(x, y); return el?.closest('[data-x]') ? el.closest('[data-obj]')?.dataset.kind : el?.closest('[data-obj]')?.dataset.kind || el?.tagName; }, xc2);
    check(`[${tag}] gaps a turned caption's × stays on top of a photo laid over it (chaos-r3-09)`, hit === 'words', `hit ${hit}`);
    await page.keyboard.press('Escape');
  }

  // ── critic-6 (desk): dragging a moment row over the words types nothing into them ───────────
  if (!phone) {
    await press(moment('Dinner'));
    await wait(250);
    const w = boxes.first();
    const before = await w.locator('[data-ed]').innerText();
    const grip = root.locator('[data-row]').nth(1).locator('span').first();
    const g = await center(grip);
    const wc = await center(w.locator('[data-ed]'));
    await mouseDrag(page, g, wc, 14);
    await wait(400);
    const after = await w.locator('[data-ed]').innerText();
    check(`[${tag}] gaps a moment row dropped on the words types nothing into them (critic-6)`, after === before, `${JSON.stringify(before)} → ${JSON.stringify(after)}`);
    await whole(page, `${tag} · gaps row over words`);
  }

  // ── CRITIC TEST 4 (phone): the Undo toast never takes a press meant for what is under it ────
  if (phone) {
    await press(moment('Dinner'));
    await wait(250);
    await press(photos.first().locator('[data-x]'));
    await wait(250);
    const toast = await page.evaluate(() => { const h = document.querySelector('[class*="make-it-yours_hint"]'); const r = h.getBoundingClientRect(); return { pe: getComputedStyle(h).pointerEvents, top: r.top, bottom: r.bottom }; });
    const t0 = (await facts(page)).films;
    await press(films.first());
    await wait(400);
    const t1 = (await facts(page)).films;
    check(`[${tag}] gaps with the Undo toast up, a tap on the tray still lands (r3 CRITIC TEST 4)`, toast.pe === 'none' && t1 === t0 - 1, `toast ${JSON.stringify(toast)} · tray ${t0} → ${t1}`);
  }

  // ── critic-20: the same refusal twice is announced twice; reduced motion keeps a still cue ──
  {
    await press(automatic);
    await wait(400);
    await press(moment('Cocktails'));
    await wait(250);
    const n1 = await page.evaluate(() => { const s = document.querySelector('[class*="make-it-yours_hint"] span'); if (s) s.dataset.seen = '1'; return !!s; });
    await press(photos.first());
    await wait(200);
    const same1 = await page.evaluate(() => document.querySelector('[class*="make-it-yours_hint"] span')?.dataset.seen === '1');
    await page.evaluate(() => { const s = document.querySelector('[class*="make-it-yours_hint"] span'); if (s) s.dataset.seen = '1'; });
    await press(photos.first());
    await wait(200);
    const same2 = await page.evaluate(() => document.querySelector('[class*="make-it-yours_hint"] span')?.dataset.seen === '1');
    check(`[${tag}] gaps a repeated refusal is a NEW message node, so a screen reader says it again (critic-20)`, !same2 && /I choose/.test(await hint()), `first ${n1}/${same1} · second reused ${same2}`);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await press(photos.first());
    await wait(120);
    const cue = await choose.evaluate((e) => ({ anim: getComputedStyle(e).animationName, ring: getComputedStyle(e).boxShadow }));
    check(`[${tag}] gaps with reduced motion the nudge on "I choose" is still, and still visible (critic-20)`, (cue.anim === 'none' || cue.anim === '') && cue.ring !== 'none', JSON.stringify(cue));
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const u = page.getByRole('button', { name: 'Undo' });
    if (await u.count()) await press(u);
    await wait(300);
  }

  // ── critic-11: the moment-row × target, measured ────────────────────────────────────────────
  {
    if ((await choose.getAttribute('aria-pressed')) !== 'true') await press(choose);
    await wait(250);
    const cx = await root.locator('[data-row] [data-cx]').first().evaluate((e) => { const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; });
    check(`[${tag}] gaps the moment-row × is ${phone ? '≥ 36' : '≥ 28'}px, with no invisible halo (critic-11 — measured; round 3 removed halos because they stole presses)`, phone ? cx.w >= 36 && cx.h >= 36 : cx.w >= 28 && cx.h >= 28, `${cx.w}×${cx.h}`);
  }

  // ── critic-12 · r3 R13: contrast of the small print (light is the only theme — owner 2026-06-04) ──
  {
    await press(moment('Dinner'));
    await wait(250);
    const probes = await page.evaluate(({ ROOT, CONTRAST }) => {
      const fn = eval(CONTRAST);
      const r = document.querySelector(ROOT);
      const pick = (sel) => [...r.querySelectorAll(sel)].filter((e) => e.offsetParent && (e.textContent || '').trim()).slice(0, 3);
      const out = [];
      for (const [name, sel] of [
        ['lede', 'p'],
        ['moment time', '[data-row] small'],
        ['photo-count pill', '[data-moment] span:last-child'],
        ['tray label', '[data-film] ~ *, [data-film]'],
        ['mode note', '[role="group"] ~ p'],
      ]) for (const e of pick(sel)) out.push({ name, ...fn(e) });
      // The tray's own labels ("NOT PLACED YET", "n left · tap to add") and the page's instruction.
      for (const e of [...r.querySelectorAll('*')].filter((e) => e.children.length === 0 && /NOT PLACED YET|left · tap to add|Nothing here yet|sorted by your run of show|all placed/i.test(e.textContent || ''))) out.push({ name: 'tray/page text', ...fn(e) });
      return out;
    }, { ROOT, CONTRAST });
    const low = probes.filter((p) => p.ratio < 4.5);
    check(`[${tag}] gaps the small print is ≥ 4.5:1 (critic-12 · r3 R13)`, low.length === 0, `${probes.length} measured; below 4.5: ${JSON.stringify(low.slice(0, 6))}`);
    // + New, ✎, Put all back while hovered (r3 R13-start-over-and-mini-hover; "Start over" does not exist in the port).
    if (!phone) {
      const minis = [];
      for (const loc of [plusNew, root.getByRole('button', { name: 'Rename this moment' }), putBack]) {
        if (!(await loc.isVisible())) continue;
        await loc.hover();
        await wait(200);
        minis.push(await loc.evaluate(eval(CONTRAST)));
      }
      check(`[${tag}] gaps the terracotta mini buttons are ≥ 4.5:1 while hovered (r3 R13-start-over-and-mini-hover)`, minis.length > 0 && minis.every((m) => m.ratio >= 4.5), JSON.stringify(minis));
    }
    // Placeholders in the name fields (r3 R13-dark-placeholders — measured in the only theme there is).
    await press(plusNew);
    await wait(300);
    const ph = await root.locator('[data-name-input]').evaluate((e) => {
      const rgb = (c) => (c.match(/[\d.]+/g) || []).map(Number);
      const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      const c = rgb(getComputedStyle(e, '::placeholder').color);
      let b = null; for (let x = e; x && !b; x = x.parentElement) { const v = rgb(getComputedStyle(x).backgroundColor); if (v.length >= 3 && (v[3] === undefined || v[3] > 0.5)) b = v; }
      b = b || [255, 255, 255];
      const fg = c[3] !== undefined && c[3] < 1 ? [0, 1, 2].map((i) => c[i] * c[3] + b[i] * (1 - c[3])) : c;
      const L1 = lum(fg), L2 = lum(b);
      return Math.round(((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)) * 100) / 100;
    });
    check(`[${tag}] gaps the name field's placeholder is ≥ 4.5:1 (r3 R13-dark-placeholders, in the only theme)`, ph >= 4.5, `${ph}:1`);
    await page.keyboard.press('Escape');
    await wait(300);
  }

  // ── RL-17 · chaos-12 (desk): the window narrows WHILE typing — nothing moves, nothing leaves ──
  if (!phone) {
    await press(moment('Dinner'));
    await wait(250);
    const before = (await facts(page)).objs.map((o) => `${o.id}@${o.l},${o.t}`).sort().join(' ');
    await press(boxes.first().locator('[data-ed]'));
    await page.keyboard.type(' more');
    const vp = page.viewportSize();
    await page.setViewportSize({ width: 390, height: vp.height });
    await wait(300);
    await page.keyboard.type(' words');
    const outside = await page.evaluate((ROOT) => {
      const c = document.querySelector(ROOT).querySelector('[aria-label="This moment’s page"]').getBoundingClientRect();
      return [...document.querySelector(ROOT).querySelectorAll('[data-obj]')].filter((e) => { const r = e.getBoundingClientRect(); return r.right > c.right + 1 || r.left < c.left - 1; }).length;
    }, ROOT);
    await page.keyboard.press('Escape');
    await page.setViewportSize(vp);
    await wait(400);
    const after = (await facts(page)).objs.map((o) => `${o.id}@${o.l},${o.t}`).sort().join(' ');
    check(`[${tag}] gaps narrowing the window while typing leaves nothing outside the page (RL-17 · chaos-12)`, outside === 0, `${outside} outside`);
    check(`[${tag}] gaps …and moves nothing, once it is wide again (RL-17 · chaos-12 · chaos-15)`, before === after, `${before} ‖ ${after}`);
    await whole(page, `${tag} · gaps resize while typing`);
  }

  } // end of the non-monkey gaps

  // ── chaos-01 · chaos-02 · chaos-r3-01: a strict monkey on the live page ─────────────────────
  {
    const rnd = lcg(Number(process.env.SEED || (phone ? 777 : 20260910)));
    const N = Number(process.env.MONKEY || 150);
    let violations = 0;
    const errs0 = h.log.errors.length;
    let errsSeen = errs0;
    const names = ['Hair & make-up', 'Cocktails', 'Grand Entrance', 'Dinner', 'First Dance', 'Money Dance', 'Last Song & Send-off'];
    if ((await choose.getAttribute('aria-pressed')) !== 'true') await press(choose);
    for (let i = 0; i < N; i += 1) {
      const a = Math.floor(rnd() * 10);
      try {
        if (a === 0) await press(moment(names[Math.floor(rnd() * names.length)]));
        else if (a === 1 && (await films.count())) await press(films.nth(Math.floor(rnd() * (await films.count()))));
        else if (a === 2 && (await photos.count())) await press(photos.nth(Math.floor(rnd() * (await photos.count()))).locator('[data-x]'));
        else if (a === 3 && (await photos.count())) {
          const p = photos.nth(Math.floor(rnd() * (await photos.count())));
          const c = await center(p);
          await drag(page, { x: c.x - 10, y: c.y }, { x: c.x + (rnd() - 0.5) * 200, y: c.y + (rnd() - 0.3) * 160 }, 6);
        } else if (a === 4 && (await putBack.isVisible())) await press(putBack);
        else if (a === 5) { const u = page.getByRole('button', { name: 'Undo' }); if (await u.count()) await press(u); else await page.keyboard.press(`${MOD}+z`); }
        else if (a === 6 && (await choose.getAttribute('aria-pressed')) === 'true') { await press(plusWords); await wait(150); await page.keyboard.type(`w${i}`); await page.keyboard.press('Escape'); }
        else if (a === 7 && (await boxes.count())) { await press(boxes.first().locator('[data-ed]')); await wait(100); if (await bar.isVisible()) await press(tb(rnd() < 0.5 ? 'Bigger text' : 'Turn right')); await page.keyboard.press('Escape'); }
        else if (a === 8) await press(rnd() < 0.2 ? automatic : choose);
        else if (a === 9 && (await films.count())) { await press(films.first()); }
      } catch (e) {
        /* a press on something that moved is a person's miss, not a violation */
      }
      await wait(120);
      if (h.log.errors.length > errsSeen) { console.log(`   monkey step ${i} action ${a}: NEW ERROR ${h.log.errors.slice(errsSeen).join(' | ').slice(0, 300)}`); errsSeen = h.log.errors.length; }
      const f = await facts(page);
      const bad = f.total !== TOTAL || f.scrollW > f.innerW || f.onPage !== f.curPill;
      if (bad) {
        violations += 1;
        console.log(`   monkey step ${i} action ${a}: total ${f.total} · scroll ${f.scrollW}/${f.innerW} · drawn ${f.onPage} pill ${f.curPill}`);
        if (violations > 3) break;
      }
      if (i > 0 && i % 50 === 0) {
        await waitSaved(page).catch(() => {});
        await open(page);
        if (h.log.errors.length > errsSeen) { console.log(`   monkey reload at ${i}: NEW ERROR ${h.log.errors.slice(errsSeen).join(' | ').slice(0, 300)}`); errsSeen = h.log.errors.length; }
        const g = await facts(page);
        if (g.total !== TOTAL) { violations += 1; console.log(`   monkey reload at ${i}: total ${g.total}`); }
      }
    }
    check(`[${tag}] gaps a strict ${N}-action monkey on the LIVE page: every photo accounted for, drawn = its pill, no sideways scroll, after every action and every reload (chaos-01 · chaos-02 · chaos-r3-01)`, violations === 0 && h.log.errors.length === errs0 && h.log.dialogs.length === 0, `${violations} violation(s) · ${h.log.errors.length - errs0} new errors · ${h.log.dialogs.length} dialogs`);
    await waitSaved(page).catch(() => {});
  }
  void ctx;
}

module.exports = { gaps };
