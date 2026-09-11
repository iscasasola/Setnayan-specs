// Step 6 of "Make it yours" — words, the words toolbar, the round handle / phone toolbar, moments
// (+ New, ✎, row ×, grip, Alt+Arrow), named sets — driven in the SAME run as step 4 (mky-drive.cjs),
// so one log holds every dialog, console error and CSP report. Each check names the 10a item it re-drives.
const MOD = process.platform === 'darwin' ? 'Meta' : 'Control';

/** The arrangement the page last SENT to the live save (a server action's JSON argument list). */
function lastSavedDoc(page) {
  try {
    const args = JSON.parse(page.__lastSave || 'null');
    return (Array.isArray(args) ? args : []).find((a) => a && typeof a === 'object' && Array.isArray(a.moments)) || null;
  } catch {
    return null;
  }
}

async function step6(h) {
  const { page, phone, tag, check, facts, whole, waitSaved, open, touchDrag, mouseDrag, center, ROOT, TOTAL, OUT } = h;
  const root = page.locator(ROOT);
  const press = async (loc) => (phone ? loc.tap() : loc.click());
  // A button that is aria-disabled still answers a press (it says why) — Playwright will not press
  // one without being told to, exactly as step 4's drive presses Automatic.
  const pressAnyway = async (loc) => (phone ? loc.tap({ force: true }) : loc.click({ force: true }));
  const drag = phone ? touchDrag : mouseDrag;
  const choose = root.getByRole('button', { name: /I choose/ });
  const automatic = root.getByRole('button', { name: /Automatic/ });
  const films = root.locator('[data-film]');
  const photos = root.locator('[data-obj][data-kind="photo"]');
  const boxes = root.locator('[data-obj][data-kind="words"]');
  const moment = (name) => root.locator('[data-moment]', { hasText: name });
  const plusWords = root.getByRole('button', { name: '+ Words' });
  const plusNew = root.getByRole('button', { name: '+ New' });
  const rename = root.getByRole('button', { name: 'Rename this moment' });
  const nameSetBtn = root.getByRole('button', { name: 'Name these photos' });
  const putBack = root.getByRole('button', { name: 'Put all back' });
  const bar = root.locator('[role="toolbar"][aria-label="Words"]');
  const tb = (name) => bar.getByRole('button', { name });
  const wait = (ms) => page.waitForTimeout(ms);
  const hint = async () => (await facts(page)).hint || '';
  const active = () =>
    page.evaluate(() => {
      const a = document.activeElement;
      if (!a || a === document.body) return 'body';
      if (a.dataset.ed !== undefined) return `ed:${a.closest('[data-obj]')?.dataset.obj}`;
      if (a.dataset.obj) return `obj:${a.dataset.obj}`;
      if (a.dataset.moment) return `moment:${a.dataset.moment}`;
      return a.getAttribute('aria-label') || a.textContent?.trim().slice(0, 30) || a.tagName;
    });
  const wordsInfo = () =>
    page.evaluate((ROOT) => {
      return [...document.querySelector(ROOT).querySelectorAll('[data-obj][data-kind="words"]')].map((e) => {
        const ed = e.querySelector('[data-ed]');
        const cs = getComputedStyle(ed);
        return {
          id: e.dataset.obj,
          text: ed.innerText.replace(/\n$/, ''),
          sel: e.className.includes('sel'),
          left: e.style.left,
          top: e.style.top,
          size: parseFloat(cs.fontSize),
          turn: e.dataset.turn || '0',
          backing: e.className.includes('pillw'),
          color: cs.color,
          bg: getComputedStyle(ed).backgroundColor,
          ph: getComputedStyle(ed, '::before').content,
        };
      });
    }, ROOT);
  const rowsInfo = () =>
    page.evaluate((ROOT) => [...document.querySelector(ROOT).querySelectorAll('[data-row]')].map((r) => r.querySelector('b').textContent), ROOT);
  const pageRect = () =>
    page.evaluate((ROOT) => {
      const c = document.querySelector(ROOT).querySelector('[aria-label="This moment’s page"]').getBoundingClientRect();
      return { left: c.left, right: c.right, top: c.top, bottom: c.bottom };
    }, ROOT);

  // ── A FRESH STORY, IN AUTOMATIC ────────────────────────────────────────────────────────
  await open(page, '?reset');
  await moment('Dinner').click();
  await wait(150);

  // critic-9: in Automatic, + Words and Name these photos say why — never a dead button.
  check(`[${tag}] s6 + Words is aria-disabled in Automatic, never disabled`, (await plusWords.getAttribute('aria-disabled')) === 'true' && (await plusWords.getAttribute('disabled')) === null);
  await pressAnyway(plusWords);
  await wait(150);
  check(`[${tag}] s6 + Words in Automatic says why (critic-9)`, /add words/.test(await hint()), await hint());
  await pressAnyway(nameSetBtn);
  await wait(150);
  check(`[${tag}] s6 Name these photos in Automatic says why (critic-9)`, /name photos/.test(await hint()), await hint());
  check(`[${tag}] s6 no + New and no ✎ in Automatic`, !(await plusNew.isVisible()) && !(await rename.isVisible()));

  await press(choose);
  await wait(200);
  await whole(page, `${tag} · s6 I choose`);
  // Free a few photos into the tray to work with.
  for (const name of ['Hair & make-up', 'Money Dance', 'First Dance']) {
    await press(moment(name));
    await wait(150);
    if (await putBack.isVisible()) {
      await press(putBack);
      await wait(250);
    }
  }
  await press(moment('Dinner'));
  await wait(250);

  // ── + WORDS: an EMPTY box, BELOW everything, focused, a placeholder (RL-12 · critic-7) ─────
  await press(plusWords);
  await wait(300);
  let W = await wordsInfo();
  const fresh = W[W.length - 1];
  check(`[${tag}] s6 + Words adds ONE empty box`, W.length === 1 && fresh.text === '', JSON.stringify(W));
  check(`[${tag}] s6 …with a drawn placeholder, not typed text (critic-7)`, /Type here/.test(fresh.ph), fresh.ph);
  check(`[${tag}] s6 …and the caret in it`, (await active()) === `ed:${fresh.id}`, await active());
  const below = await page.evaluate(({ ROOT, id }) => {
    const r = document.querySelector(ROOT);
    const w = r.querySelector(`[data-obj="${id}"]`).getBoundingClientRect();
    const ps = [...r.querySelectorAll('[data-obj][data-kind="photo"]')].map((e) => e.getBoundingClientRect());
    const lowest = Math.max(...ps.map((p) => p.bottom));
    const hits = ps.filter((p) => w.left < p.right && p.left < w.right && w.top < p.bottom && p.top < w.bottom).length;
    return { top: w.top, lowest, hits };
  }, { ROOT, id: fresh.id });
  check(`[${tag}] s6 …placed BELOW every photo, on none of them (RL-12)`, below.top >= below.lowest - 1 && below.hits === 0, JSON.stringify(below));
  check(`[${tag}] s6 the words toolbar shows for the new box`, await bar.isVisible());

  // DW-18 · R7-lowest-empty-box: leaving the EMPTY box by tapping a tray photo — the box goes,
  // quietly, AND the tap still places the photo.
  {
    const before = await facts(page);
    await press(films.first());
    await wait(500);
    const after = await facts(page);
    W = await wordsInfo();
    check(`[${tag}] s6 an empty box left by a tray tap goes quietly (no Undo)`, W.length === 0 && !after.undo, `${W.length} boxes, undo ${after.undo}`);
    check(`[${tag}] s6 …and that same tap still places the photo (DW-18 · R7)`, after.onPage === before.onPage + 1, `${before.onPage} → ${after.onPage}`);
    await whole(page, `${tag} · s6 empty box + tray tap`);
  }
  // R7 · DW-18 where it BITES: the empty box is what made the page tall, so leaving it shrinks the
  // page — and everything under it slides up — in the middle of the press that left it. Pressed
  // near the BOTTOM edge of a tray photo, a slide of even a few pixels takes the press elsewhere.
  {
    await press(plusWords);
    await wait(300);
    for (let i = 0; i < 11; i += 1) {
      await page.keyboard.type(`line ${i + 1}`);
      await page.keyboard.press('Enter');
    }
    await page.keyboard.type('the last line');
    await wait(250);
    await press(plusWords); // a SECOND box, empty, below the tall one — it grows the page
    await wait(400);
    const before = await facts(page);
    const fb = await films.first().boundingBox();
    const pt = { x: fb.x + fb.width / 2, y: fb.y + fb.height - 5 };
    if (phone) await page.touchscreen.tap(pt.x, pt.y);
    else await page.mouse.click(pt.x, pt.y);
    await wait(600);
    const after = await facts(page);
    check(`[${tag}] s6 an empty box that made the page tall leaves, and the press near a tray photo's edge still lands (R7)`, after.onPage === before.onPage + 1 && (await boxes.count()) === 1, `photos ${before.onPage} → ${after.onPage}, boxes ${await boxes.count()}`);
    // Put the page back as it was for what follows: the tall caption goes, with its Undo unused.
    await press(photos.last().locator('[data-x]'));
    await wait(300);
    await boxes.first().locator('[data-ed]').click({ force: true }).catch(() => {});
    await page.evaluate(() => {
      const ed = document.activeElement;
      if (!ed || ed.dataset.ed === undefined) return;
      const r = document.createRange();
      r.selectNodeContents(ed);
      getSelection().removeAllRanges();
      getSelection().addRange(r);
    });
    await page.keyboard.press('Backspace');
    await press(moment('Cocktails'));
    await wait(350);
    await press(moment('Dinner'));
    await wait(350);
    check(`[${tag}] s6 (the tall caption is gone again)`, (await boxes.count()) === 0, String(await boxes.count()));
    await whole(page, `${tag} · s6 tall page`);
  }
  // DW-21: empty box, then × on a photo — the photo goes.
  {
    await press(plusWords);
    await wait(300);
    const n0 = (await facts(page)).onPage;
    await press(photos.first().locator('[data-x]'));
    await wait(400);
    const f = await facts(page);
    check(`[${tag}] s6 empty box then a photo's × — the photo goes (DW-21)`, f.onPage === n0 - 1 && (await boxes.count()) === 0, `${n0} → ${f.onPage}, boxes ${await boxes.count()}`);
    await press(page.getByRole('button', { name: 'Undo' }));
    await wait(300);
  }
  // DW-17: empty box, then another moment — the moment opens.
  {
    await press(plusWords);
    await wait(300);
    await press(moment('Cocktails'));
    await wait(400);
    check(`[${tag}] s6 empty box then another moment — it opens (DW-17)`, (await moment('Cocktails').getAttribute('aria-current')) === 'true');
    await press(moment('Dinner'));
    await wait(250);
    check(`[${tag}] s6 …and the empty box did not follow or stay`, (await boxes.count()) === 0);
  }
  // R7-tab-from-empty-box (OPEN in the prototype): Tab out of a still-empty new box.
  if (!phone) {
    await press(plusWords);
    await wait(300);
    await page.keyboard.press('Tab');
    await wait(300);
    const a = await active();
    check(`[${tag}] s6 Tab from an empty new box moves to the next control, not the page top (R7)`, a !== 'body' && !String(a).startsWith('ed:') && (await boxes.count()) === 0, a);
  }
  // R14: pressing the empty box's own grip before typing throws nothing and keeps the box.
  {
    await press(plusWords);
    await wait(300);
    const g = boxes.first().locator('[data-grip]');
    const c = await center(g);
    if (phone) await page.touchscreen.tap(c.x, c.y);
    else await page.mouse.click(c.x, c.y);
    await wait(250);
    check(`[${tag}] s6 pressing a new empty box's own grip keeps it (R14)`, (await boxes.count()) === 1);
  }

  // ── TYPING · PLAIN PASTE · ESCAPE ─────────────────────────────────────────────────────
  const box = boxes.first();
  const ed = box.locator('[data-ed]');
  await press(ed);
  await wait(150);
  await page.keyboard.type('She came down the path');
  await page.keyboard.press('Enter');
  await page.keyboard.type('and the rain stopped.');
  await wait(200);
  W = await wordsInfo();
  check(`[${tag}] s6 typing keeps the line break`, W[0]?.text === 'She came down the path\nand the rain stopped.', JSON.stringify(W[0]?.text));
  // critic-13: plain text only.
  await page.evaluate(() => {
    const a = document.activeElement;
    const dt = new DataTransfer();
    dt.setData('text/html', '<b>BOLD</b><a href="https://x.test">link</a><img src="x">');
    dt.setData('text/plain', ' — pasted');
    a.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
  });
  await wait(200);
  const pasted = await ed.evaluate((e) => ({ html: e.innerHTML, text: e.innerText }));
  check(`[${tag}] s6 a paste is plain text only (critic-13)`, !/<b|<a|<img/i.test(pasted.html) && /— pasted/.test(pasted.text), pasted.html.slice(0, 120));
  // R12: Escape stops typing AND lets go — the next Backspace deletes nothing.
  await page.keyboard.press('Escape');
  await wait(200);
  const afterEsc = await active();
  W = await wordsInfo();
  check(`[${tag}] s6 Escape stops typing and lets go of the words (R12)`, !String(afterEsc).startsWith('ed:') && !W[0].sel, `${afterEsc} sel=${W[0].sel}`);
  await page.keyboard.press('Backspace');
  await wait(200);
  W = await wordsInfo();
  check(`[${tag}] s6 …so a Backspace after it deletes nothing (R12)`, W.length === 1 && /pasted/.test(W[0].text), JSON.stringify(W.map((w) => w.text)));
  await waitSaved(page);

  // ── THE WORDS TOOLBAR, EXACTLY AS THE PROTOTYPE DRAWS IT ─────────────────────────────────
  await press(ed);
  await wait(250);
  check(`[${tag}] s6 tapping into a caption places the caret, never removes it (R7-phone-tap)`, (await boxes.count()) === 1 && String(await active()).startsWith('ed:'), await active());
  const shape = await page.evaluate((ROOT) => {
    const b = document.querySelector(ROOT).querySelector('[role="toolbar"][aria-label="Words"]');
    const btns = [...b.querySelectorAll(':scope > button, :scope > div > button')].filter((x) => x.getAttribute('role') !== 'radio');
    const r = b.getBoundingClientRect();
    const sizes = btns.map((x) => `${Math.round(x.getBoundingClientRect().width)}x${Math.round(x.getBoundingClientRect().height)}`);
    return {
      labels: btns.map((x) => x.getAttribute('aria-label')),
      sizes: [...new Set(sizes)],
      dividers: b.querySelectorAll(':scope > span[aria-hidden="true"]').length,
      onScreen: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight,
      rect: { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom), vw: innerWidth },
    };
  }, ROOT);
  check(
    `[${tag}] s6 the toolbar is [ − size + ] | [ A colour ] [ A background ] | [ ↺ ↻ ] | [ remove ]`,
    shape.labels.join(',') === 'Smaller text,Bigger text,Text colour,Background behind the words,Turn left,Turn right,Remove these words' && shape.dividers === 3,
    JSON.stringify(shape.labels) + ` dividers ${shape.dividers}`,
  );
  check(`[${tag}] s6 …every control the same square button`, shape.sizes.length === 1 && shape.sizes[0].split('x')[0] === shape.sizes[0].split('x')[1], shape.sizes.join(' '));
  check(`[${tag}] s6 …on screen`, shape.onScreen, JSON.stringify(shape.rect));
  const placement = async () =>
    page.evaluate((ROOT) => {
      const r = document.querySelector(ROOT);
      const b = r.querySelector('[role="toolbar"][aria-label="Words"]').getBoundingClientRect();
      const w = r.querySelector('[data-obj][data-kind="words"]').getBoundingClientRect();
      const gap = b.bottom <= w.top + 1 ? w.top - b.bottom : b.top - w.bottom;
      const across = b.left < w.right && w.left < b.right;
      return { above: b.bottom <= w.top + 1, below: b.top >= w.bottom - 1, gap: Math.round(gap), across, bx: b.left, by: b.top, wx: w.left, wy: w.top };
    }, ROOT);
  let pl = await placement();
  check(`[${tag}] s6 …floating just above the words (or below when there is no room)`, pl.above || pl.below, JSON.stringify(pl));
  // Nothing on the bar takes the caret out of the words.
  const size0 = (await wordsInfo())[0].size;
  await press(tb('Bigger text'));
  await wait(200);
  await press(tb('Bigger text'));
  await wait(250);
  let wi = (await wordsInfo())[0];
  check(`[${tag}] s6 + steps the size by 2`, Math.round(wi.size) === Math.round(size0) + 4, `${size0} → ${wi.size}`);
  check(`[${tag}] s6 …and the caret stays in the words`, String(await active()).startsWith('ed:'), await active());
  check(`[${tag}] s6 …and the size shows on the bar`, (await bar.textContent()).includes(String(Math.round(size0) + 4)));
  await press(tb('Smaller text'));
  await wait(250);
  check(`[${tag}] s6 − steps it back`, Math.round((await wordsInfo())[0].size) === Math.round(size0) + 2);
  // The colour menu: Ink · Terracotta · Blue · Gold, opening AWAY from the words.
  await press(tb('Text colour'));
  await wait(250);
  const menu = bar.locator('[role="radiogroup"]');
  const radios = await menu.getByRole('radio').evaluateAll((rs) => rs.map((r) => r.getAttribute('aria-label')));
  check(`[${tag}] s6 the colour menu offers Ink · Terracotta · Blue · Gold`, radios.join(',') === 'Ink,Terracotta,Blue,Gold', radios.join(','));
  const away = await page.evaluate((ROOT) => {
    const r = document.querySelector(ROOT);
    const b = r.querySelector('[role="toolbar"][aria-label="Words"]');
    const m = b.querySelector('[role="radiogroup"]').getBoundingClientRect();
    const w = r.querySelector('[data-obj][data-kind="words"]').getBoundingClientRect();
    const overlap = m.left < w.right && w.left < m.right && m.top < w.bottom && w.top < m.bottom;
    return { overlap, above: b.hasAttribute('data-above'), mTop: m.top, mBottom: m.bottom, bTop: b.getBoundingClientRect().top, bBottom: b.getBoundingClientRect().bottom };
  }, ROOT);
  check(`[${tag}] s6 …opening AWAY from the words, never on them`, !away.overlap && (away.above ? away.mBottom <= away.bTop + 1 : away.mTop >= away.bBottom - 1), JSON.stringify(away));
  await press(menu.getByRole('radio', { name: 'Blue' }));
  await wait(250);
  wi = (await wordsInfo())[0];
  check(`[${tag}] s6 choosing Blue colours the words and closes the menu`, !(await menu.isVisible()) && wi.color !== 'rgb(44, 42, 41)', wi.color);
  check(`[${tag}] s6 …with the caret still in the words`, String(await active()).startsWith('ed:'), await active());
  await press(tb('Background behind the words'));
  await wait(250);
  wi = (await wordsInfo())[0];
  check(`[${tag}] s6 the background puts the colour behind the words`, wi.backing && wi.bg !== 'rgba(0, 0, 0, 0)' && (await tb('Background behind the words').getAttribute('aria-pressed')) === 'true', wi.bg);
  await press(tb('Turn right'));
  await wait(200);
  await press(tb('Turn right'));
  await wait(250);
  wi = (await wordsInfo())[0];
  check(`[${tag}] s6 turn right turns by 15°`, wi.turn === '30', wi.turn);
  await press(tb('Turn left'));
  await wait(250);
  check(`[${tag}] s6 turn left turns back`, (await wordsInfo())[0].turn === '15');
  // R11-turned-words: turned words stay inside the sheet.
  {
    const pr = await pageRect();
    const wr = await boxes.first().boundingBox();
    check(`[${tag}] s6 turned words stay on the sheet (R11 · chaos-r3-08)`, wr.x >= pr.left - 1 && wr.x + wr.width <= pr.right + 1 && wr.y >= pr.top - 1, JSON.stringify({ wr, pr }));
  }

  // ── PHONE: the handle and the words' × give way to the toolbar ─────────────────────────
  const xh = await page.evaluate((ROOT) => {
    const w = document.querySelector(ROOT).querySelector('[data-obj][data-kind="words"]');
    return { x: getComputedStyle(w.querySelector('[data-x]')).display, h: getComputedStyle(w.querySelector('[data-hdl]')).display };
  }, ROOT);
  if (phone) check(`[${tag}] s6 on a phone the handle and the words' × give way to the toolbar`, xh.x === 'none' && xh.h === 'none', JSON.stringify(xh));
  else check(`[${tag}] s6 on a computer the selected words show their round handle and ×`, xh.h === 'block' && xh.x === 'grid', JSON.stringify(xh));
  if (!phone) {
    // r3 R2-turned-x-reads-plus: a turned caption's × is turned back upright.
    const xt = await boxes.first().locator('[data-x]').evaluate((e) => getComputedStyle(e).transform);
    check(`[${tag}] s6 a turned caption's × is turned back upright`, xt !== 'none' && !/^matrix\(1(\.0+)?, 0, 0, 1/.test(xt), xt);
  }

  // ── MOVING WORDS: the grip (mouse AND touch), the keyboard; the bar follows ─────────────
  {
    const before = (await wordsInfo())[0];
    const g = await center(boxes.first().locator('[data-grip]'));
    pl = await placement();
    await drag(page, { x: g.x, y: g.y }, { x: g.x + 60, y: g.y - 40 }, 10);
    await wait(400);
    const after = (await wordsInfo())[0];
    const pl2 = await placement();
    check(`[${tag}] s6 the ⋮⋮ grip drags the words (R6 grip press)`, after.left !== before.left || after.top !== before.top, `${before.left},${before.top} → ${after.left},${after.top}`);
    check(`[${tag}] s6 …the text is untouched by the drag`, after.text === before.text);
    check(`[${tag}] s6 …and the toolbar follows the words — still just above or below them, across them`, (pl2.above || pl2.below) && Math.abs(pl2.gap - 18) <= 2 && pl2.across && (pl2.by !== pl.by || pl2.bx !== pl.bx), JSON.stringify({ pl, pl2 }));
    check(`[${tag}] s6 …and the caret is not left in the text`, !String(await active()).startsWith('ed:'), await active());
  }
  if (!phone) {
    // critic-14 (OPEN in the prototype): the keyboard can MOVE words.
    await boxes.first().focus();
    await wait(150);
    const l0 = parseInt((await wordsInfo())[0].left, 10);
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await wait(250);
    const l1 = parseInt((await wordsInfo())[0].left, 10);
    check(`[${tag}] s6 arrow keys move focused words (critic-14)`, l1 === l0 - 16 || (l0 < 16 && l1 < l0), `${l0} → ${l1}`);
    // critic test 5: the toolbar is the keyboard's route to resize and turn.
    let reached = false;
    for (let i = 0; i < 14; i += 1) {
      await page.keyboard.press('Tab');
      if ((await active()) === 'Bigger text') {
        reached = true;
        break;
      }
    }
    const z0 = (await wordsInfo())[0].size;
    if (reached) await page.keyboard.press('Enter');
    await wait(250);
    check(`[${tag}] s6 the keyboard reaches the toolbar and Enter resizes (critic test 5)`, reached && Math.round((await wordsInfo())[0].size) === Math.round(z0) + 2, `reached ${reached}`);
    // The round handle: resize + turn, snapping straight.
    await boxes.first().locator('[data-ed]').click();
    await wait(200);
    const hd = await center(boxes.first().locator('[data-hdl]'));
    const bb = await boxes.first().boundingBox();
    const cxp = bb.x + bb.width / 2;
    const cyp = bb.y + bb.height / 2;
    const s0 = (await wordsInfo())[0].size;
    await mouseDrag(page, { x: hd.x, y: hd.y }, { x: cxp + (hd.x - cxp) * 1.4, y: cyp + (hd.y - cyp) * 1.4 }, 8);
    await wait(300);
    const big = (await wordsInfo())[0];
    check(`[${tag}] s6 the round handle resizes the words`, big.size > s0, `${s0} → ${big.size}`);
    // Bring the turn back near straight: the handle within 5° snaps it to 0.
    const hd2 = await center(boxes.first().locator('[data-hdl]'));
    const bb2 = await boxes.first().boundingBox();
    const c2 = { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height / 2 };
    const r2 = Math.hypot(hd2.x - c2.x, hd2.y - c2.y);
    const turnNow = Number((await wordsInfo())[0].turn);
    const a2 = Math.atan2(hd2.y - c2.y, hd2.x - c2.x) - ((turnNow - 3) * Math.PI) / 180;
    await mouseDrag(page, hd2, { x: c2.x + r2 * Math.cos(a2), y: c2.y + r2 * Math.sin(a2) }, 10);
    await wait(300);
    check(`[${tag}] s6 the handle snaps straight within 5°`, (await wordsInfo())[0].turn === '0', (await wordsInfo())[0].turn);
    const pr = await pageRect();
    const wr = await boxes.first().boundingBox();
    check(`[${tag}] s6 …and keeps the words on the sheet`, wr.x >= pr.left - 1 && wr.x + wr.width <= pr.right + 1 && wr.y >= pr.top - 1);
  }

  // ── CLEARING WORDS THAT HAD TEXT IS A REMOVAL WITH UNDO (r3 critic test 3) ──────────────
  {
    const kept = (await wordsInfo())[0].text;
    await press(boxes.first().locator('[data-ed]'));
    await wait(150);
    const a1 = await active();
    if (phone) {
      // A phone selects all from its long-press menu, which selects the caption's own contents.
      // (Chromium's emulated Cmd+A after a drag selected a stray line break OUTSIDE the caption —
      // measured, and not something a phone can do; the tap itself leaves the caret inside.)
      await page.evaluate(() => {
        const ed = document.activeElement;
        const r = document.createRange();
        r.selectNodeContents(ed);
        getSelection().removeAllRanges();
        getSelection().addRange(r);
      });
    } else {
      await page.keyboard.press(`${MOD}+a`);
    }
    const s1 = await page.evaluate(() => JSON.stringify(String(getSelection())));
    await page.keyboard.press('Backspace');
    await wait(200);
    const t1 = (await wordsInfo()).map((w) => JSON.stringify(w.text)).join(',');
    await press(moment('Cocktails'));
    await wait(400);
    let f = await facts(page);
    check(`[${tag}] s6 clearing a caption and leaving it removes it WITH Undo`, /Words removed/.test(f.hint) && f.undo, `${f.hint} · focus ${a1} · selection ${s1} · text ${t1}`);
    await press(page.getByRole('button', { name: 'Undo' }));
    await wait(350);
    await press(moment('Dinner'));
    await wait(300);
    const back = await wordsInfo();
    check(`[${tag}] s6 …and Undo brings the words back as they were`, back.length === 1 && back[0].text === kept, JSON.stringify(back.map((w) => w.text)));
    // The toolbar's remove, then Undo.
    await press(boxes.first().locator('[data-ed]'));
    await wait(200);
    await press(tb('Remove these words'));
    await wait(300);
    f = await facts(page);
    check(`[${tag}] s6 the toolbar's remove takes the words off, with Undo`, (await boxes.count()) === 0 && f.undo && /Words removed/.test(f.hint), f.hint);
    await press(page.getByRole('button', { name: 'Undo' }));
    await wait(350);
    check(`[${tag}] s6 …and Undo puts them back`, (await boxes.count()) === 1);
  }
  await whole(page, `${tag} · s6 after words`);

  // ── MOMENTS: + New and ✎ as an inline field ────────────────────────────────────────────
  const rows0 = await rowsInfo();
  await press(plusNew);
  await wait(350);
  const nameInput = root.locator('[data-name-input]');
  check(`[${tag}] s6 + New opens the name field in the page's header, focused and empty`, (await nameInput.isVisible()) && (await nameInput.inputValue()) === '' && (await nameInput.evaluate((e) => e === document.activeElement)));
  check(`[${tag}] s6 …and adds its row at the end`, (await rowsInfo()).length === rows0.length + 1);
  await page.keyboard.type('Our first look');
  await page.keyboard.press('Enter');
  await wait(350);
  let rows = await rowsInfo();
  check(`[${tag}] s6 Enter names the new moment`, rows[rows.length - 1] === 'Our first look' && (await root.locator('h3', { hasText: 'Our first look' }).count()) === 1, rows.join(' | '));
  // + New, then Escape — the new moment is gone.
  await press(plusNew);
  await wait(300);
  await page.keyboard.press('Escape');
  await wait(350);
  check(`[${tag}] s6 Escape on a new moment cancels it`, (await rowsInfo()).length === rows.length, (await rowsInfo()).join(' | '));
  // R1-empty-new-moment-field-swallows-tray-tap · R8-new-empty-swallows-tap.
  {
    await press(moment('Our first look'));
    await wait(200);
    const n0 = (await facts(page)).films;
    const filmsBefore = n0;
    await press(plusNew);
    await wait(300);
    await press(films.first());
    await wait(600);
    const f = await facts(page);
    check(`[${tag}] s6 + New left empty, then ONE tap on the tray: the moment is cancelled…`, (await rowsInfo()).length === rows.length, (await rowsInfo()).join(' | '));
    check(`[${tag}] s6 …and the tap still places the photo (R8)`, f.films === filmsBefore - 1, `${filmsBefore} → ${f.films}`);
    await whole(page, `${tag} · s6 empty new + tray tap`);
  }
  // ✎ rename, Escape keeps the old name; a long one-word name never widens the page (B6 · P11 · chaos-14).
  {
    await press(rename);
    await wait(250);
    check(`[${tag}] s6 ✎ opens the field with the current name`, (await nameInput.inputValue()) === 'Our first look');
    await page.keyboard.type('XYZ');
    await page.keyboard.press('Escape');
    await wait(250);
    check(`[${tag}] s6 Escape keeps the old name`, (await rowsInfo()).includes('Our first look'));
    await press(rename);
    await wait(250);
    const tag60 = '#SheCameDownThePathAndTheRainStoppedForeverAndEverAndEver2026';
    await nameInput.fill(tag60);
    await page.keyboard.press('Enter');
    await wait(350);
    const f = await whole(page, `${tag} · s6 a 60-character one-word name`);
    const xOk = await page.evaluate((ROOT) => {
      const row = [...document.querySelector(ROOT).querySelectorAll('[data-row]')].find((r) => r.textContent.includes('#SheCame'));
      const x = row.querySelector('[data-cx]').getBoundingClientRect();
      return x.right <= innerWidth && x.left >= 0 && x.width > 0;
    }, ROOT);
    check(`[${tag}] s6 …its row × stays on screen (B6 · P11)`, xOk);
    check(`[${tag}] s6 …and + New too (P12)`, await plusNew.evaluate((e) => { const r = e.getBoundingClientRect(); return r.right <= innerWidth && r.left >= 0; }));
    void f;
  }

  // ── ROW × WITH UNDO — its photos back in the tray, its words back with Undo (critic-1) ──
  {
    await press(moment('Dinner'));
    await wait(250);
    const n = (await facts(page)).curPill;
    const rowsBefore = await rowsInfo();
    await press(root.locator('[data-row]', { hasText: 'Dinner' }).locator('[data-cx]'));
    await wait(400);
    let f = await whole(page, `${tag} · s6 row ×`);
    check(`[${tag}] s6 row × removes the moment and says its photos are back`, !(await rowsInfo()).includes('Dinner') && /removed/.test(f.hint) && (n ? /back in the tray/.test(f.hint) : true) && f.undo, f.hint);
    await press(page.getByRole('button', { name: 'Undo' }));
    await wait(400);
    f = await whole(page, `${tag} · s6 undo row ×`);
    await press(moment('Dinner'));
    await wait(250);
    check(`[${tag}] s6 …Undo brings the moment, its photos AND its words back (critic-1)`, (await rowsInfo()).join('|') === rowsBefore.join('|') && (await boxes.count()) === 1 && (await facts(page)).curPill === n);
  }
  // Accessibility structure (r3/critic OPEN): no row is a button, and no button holds a button.
  {
    const a11y = await page.evaluate((ROOT) => ({
      nested: document.querySelector(ROOT).querySelectorAll('button button, [role="button"] button').length,
      roleButtonRows: document.querySelector(ROOT).querySelectorAll('[data-row][role="button"]').length,
      list: document.querySelector(ROOT).querySelectorAll('[role="list"] > [role="listitem"]').length,
    }), ROOT);
    check(`[${tag}] s6 no row is a button, and no button sits inside another`, a11y.nested === 0 && a11y.roleButtonRows === 0 && a11y.list > 0, JSON.stringify(a11y));
  }

  // ── REORDER: the grip with a mouse AND a finger (P9); Alt+Arrow (H2) ────────────────────
  {
    const before = await rowsInfo();
    const grip = root.locator('[data-row]').nth(0).locator('span').first();
    const g = await center(grip);
    const third = await root.locator('[data-row]').nth(2).boundingBox();
    await drag(page, g, { x: g.x, y: third.y + third.height * 0.75 }, 12);
    await wait(400);
    const after = await rowsInfo();
    check(`[${tag}] s6 the grip reorders moments (${phone ? 'finger' : 'mouse'}) (P9)`, after[0] !== before[0] && after.includes(before[0]) && new Set(after).size === after.length && after.length === before.length, `${before.slice(0, 3).join(',')} → ${after.slice(0, 3).join(',')}`);
    await whole(page, `${tag} · s6 grip reorder`);
  }
  if (!phone) {
    const before = await rowsInfo();
    const first = root.locator('[data-moment]').nth(0);
    const name0 = before[0];
    await first.focus();
    await page.keyboard.press('Alt+ArrowDown');
    await wait(350);
    const after = await rowsInfo();
    const focusName = await page.evaluate(() => document.activeElement?.querySelector?.('b')?.textContent);
    check(`[${tag}] s6 Alt+ArrowDown moves the moment down one (H2)`, after[1] === name0 && after[0] === before[1], after.slice(0, 3).join(','));
    check(`[${tag}] s6 …and the keyboard stays on it`, focusName === name0, String(focusName));
    // chaos-r3-10: Cmd/Ctrl+Z while a grip is still held never lists a moment twice.
    await press(moment('Grand Entrance'));
    await wait(150);
    await press(putBack);
    await wait(250);
    const gg = await center(root.locator('[data-row]').nth(1).locator('span').first());
    await page.mouse.move(gg.x, gg.y);
    await page.mouse.down();
    await page.mouse.move(gg.x, gg.y + 30, { steps: 4 });
    await page.keyboard.press(`${MOD}+z`);
    await page.mouse.move(gg.x, gg.y + 70, { steps: 4 });
    await page.mouse.up();
    await wait(400);
    const r = await rowsInfo();
    check(`[${tag}] s6 Cmd/Ctrl+Z during a grip drag never lists a moment twice (chaos-r3-10)`, new Set(r).size === r.length, r.join(' | '));
    await whole(page, `${tag} · s6 undo during grip`);
  }

  // ── NAMED SETS ───────────────────────────────────────────────────────────────────────────
  {
    await press(moment('Hair & make-up'));
    await wait(250);
    if ((await facts(page)).curPill < 2) {
      for (let i = 0; i < 3 && (await facts(page)).curPill < 2; i += 1) {
        await press(films.first());
        await wait(300);
      }
    }
    // a page with ONE photo says why it cannot be named
    const pillNow = (await facts(page)).curPill;
    check(`[${tag}] s6 Name these photos is offered with 2+ photos on the page`, (await nameSetBtn.getAttribute('aria-disabled')) === (pillNow < 2 ? 'true' : 'false'));
    await pressAnyway(nameSetBtn);
    await wait(300);
    const setInput = root.getByRole('textbox', { name: 'A name for these photos' });
    check(`[${tag}] s6 …it opens an inline field, focused`, (await setInput.isVisible()) && (await setInput.evaluate((e) => e === document.activeElement)));
    await page.keyboard.type('The entourage');
    await page.keyboard.press('Enter');
    await wait(400);
    let f = await facts(page);
    const chip = root.locator('[data-chip="The entourage"]');
    check(`[${tag}] s6 Enter names them: one chip, and it says so`, (await chip.count()) === 1 && /Named “The entourage”/.test(f.hint), f.hint);
    check(`[${tag}] s6 …the chip says none are free to place`, /all placed/.test(await chip.textContent()), await chip.textContent());
    // R9: after naming, a Backspace must not take a photo off.
    const n0 = (await facts(page)).onPage;
    await page.keyboard.press('Backspace');
    await wait(250);
    check(`[${tag}] s6 …and a Backspace right after naming takes nothing off (R9)`, (await facts(page)).onPage === n0);
    // One chip per name.
    await press(nameSetBtn);
    await wait(250);
    await page.keyboard.type('The entourage');
    await page.keyboard.press('Enter');
    await wait(350);
    check(`[${tag}] s6 naming again with the same name keeps ONE chip`, (await root.locator('[data-chip="The entourage"]').count()) === 1);
    // Put them back: the chip now says how many are free, and places them on another page.
    await press(putBack);
    await wait(300);
    const txt = await chip.textContent();
    check(`[${tag}] s6 the chip shows what is still free to place (critic-15)`, new RegExp(`· ${n0}$`).test(txt.trim().replace(/\s*×$/, '')), txt);
    const gname = await page.evaluate((ROOT) => [...document.querySelector(ROOT).querySelectorAll('[data-film]')].filter((f) => /The entourage/.test(f.textContent)).length, ROOT);
    check(`[${tag}] s6 …and their tray photos carry the name`, gname === n0, String(gname));
    await press(moment('Cocktails'));
    await wait(250);
    const c0 = (await facts(page)).curPill;
    await press(chip.locator('button').first());
    await wait(450);
    f = await whole(page, `${tag} · s6 chip places`);
    check(`[${tag}] s6 pressing the chip places its free photos on this page`, f.curPill === c0 + n0, `${c0} → ${f.curPill}`);
    // The name field goes away with its context (r3 R9-name-field-outlives-its-context).
    await press(nameSetBtn);
    await wait(250);
    await press(moment('Money Dance'));
    await wait(300);
    check(`[${tag}] s6 the set-name field closes when the moment changes`, !(await setInput.isVisible()));
    // Chip × forgets the name, with Undo; the photos stay put.
    const onPages = (await facts(page)).total;
    await press(chip.getByRole('button', { name: 'Forget the name The entourage' }));
    await wait(350);
    f = await facts(page);
    check(`[${tag}] s6 chip × forgets the name, with Undo, and every photo stays put`, (await chip.count()) === 0 && f.undo && /the photos stay put/.test(f.hint) && f.total === onPages, f.hint);
    await press(page.getByRole('button', { name: 'Undo' }));
    await wait(350);
    check(`[${tag}] s6 …Undo brings the name back`, (await root.locator('[data-chip="The entourage"]').count()) === 1);
  }

  // ── EVERYTHING READS BACK EXACTLY AFTER A RELOAD ─────────────────────────────────────────
  await press(moment('Dinner'));
  await wait(250);
  await waitSaved(page);
  const keptWords = await wordsInfo();
  const keptRows = await rowsInfo();
  const keptChips = await root.locator('[data-chip]').evaluateAll((cs) => cs.map((c) => c.textContent));
  await open(page);
  await press(moment('Dinner'));
  await wait(300);
  const wordsBack = await wordsInfo();
  const sig = (ws) => ws.map((w) => [w.text, w.left, w.top, Math.round(w.size), w.turn, w.backing, w.color].join('~')).join('|');
  check(`[${tag}] s6 reload gives back the words exactly — text, place, size, turn, colour, background`, sig(wordsBack) === sig(keptWords), `${sig(keptWords)} ‖ ${sig(wordsBack)}`);
  check(`[${tag}] s6 …the moments, named and in order`, (await rowsInfo()).join('|') === keptRows.join('|'), (await rowsInfo()).join('|'));
  check(`[${tag}] s6 …and the named sets`, (await root.locator('[data-chip]').evaluateAll((cs) => cs.map((c) => c.textContent))).join('|') === keptChips.join('|'));
  await whole(page, `${tag} · s6 after reload`);
  // What is KEPT about each caption's size is what is DRAWN — a stale size lets Automatic deal a
  // photo under the words (10a M-R3-17 · M-R5-08).
  {
    const doc = lastSavedDoc(page);
    const kept = new Map((doc?.moments ?? []).flatMap((m) => m.objects).filter((o) => o.kind === 'words').map((o) => [o.id, o]));
    const drawnSizes = await page.evaluate((ROOT) => [...document.querySelector(ROOT).querySelectorAll('[data-obj][data-kind="words"]')].map((e) => ({ id: e.dataset.obj, w: e.offsetWidth, h: e.offsetHeight })), ROOT);
    const off = drawnSizes.filter((d) => { const k = kept.get(d.id); return !k || Math.abs((k.w ?? -99) - d.w) > 2 || Math.abs((k.h ?? -99) - d.h) > 2; });
    check(`[${tag}] s6 each caption's kept size is the size it is drawn`, drawnSizes.length > 0 && off.length === 0, JSON.stringify({ off, kept: [...kept.values()].map((k) => [k.id, k.w, k.h]) }));
  }

  // ── AUTOMATIC: words are read-only and say why; the ✎ and + New go ────────────────────────
  await press(automatic);
  await wait(350);
  await press(moment('Dinner'));
  await wait(250);
  {
    const buried = await page.evaluate((ROOT) => {
      const r = document.querySelector(ROOT);
      const ws = [...r.querySelectorAll('[data-obj][data-kind="words"]')].map((e) => e.getBoundingClientRect());
      const ps = [...r.querySelectorAll('[data-obj][data-kind="photo"]')].map((e) => e.getBoundingClientRect());
      return ps.filter((p) => ws.some((w) => p.left < w.right - 4 && w.left < p.right - 4 && p.top < w.bottom - 4 && w.top < p.bottom - 4)).length;
    }, ROOT);
    check(`[${tag}] s6 Automatic deals no photo under the host's words (M-R3-17 · M-R5-08)`, buried === 0, `${buried} under words`);
  }
  if ((await boxes.count()) > 0) {
    await press(boxes.first());
    await wait(200);
    check(`[${tag}] s6 a tap on words in Automatic says why`, /change words/.test(await hint()), await hint());
    if (!phone) {
      await boxes.first().focus();
      await page.keyboard.press('Delete');
      await wait(200);
      check(`[${tag}] s6 Delete on words in Automatic says why and removes nothing (r3 R3-delete-hint)`, /change words/.test(await hint()) && (await boxes.count()) === 1, await hint());
    }
    const editable = await boxes.first().locator('[data-ed]').getAttribute('contenteditable');
    check(`[${tag}] s6 words in Automatic cannot be typed into`, editable === 'false', String(editable));
  }
  await page.screenshot({ path: `${OUT}/drive-${phone ? 'phone' : 'desk'}${process.env.DARK ? '-dark' : ''}-step6.png`, fullPage: false });
  await whole(page, `${tag} · s6 end`);
  void TOTAL;
}

module.exports = { step6 };
