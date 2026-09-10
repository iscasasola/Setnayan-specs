// "Make it yours" — the photo half, driven in a real browser (Chromium) at 1280 mouse and 390 touch.
// Every check prints PASS/FAIL; the run exits non-zero on any FAIL, any dialog, any console error.
const { chromium, BASE, openContext } = require('./mky-lib.cjs');
const OUT = __dirname;
const TOTAL = 10;
const ROOT = 'section[aria-labelledby="make-it-yours-title"]';

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok: !!ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
}

/** Ignore ONLY the dev server's replay of the app LAYOUT's own server log (no service role here). */
const envNoise = (e) => /\[supabase:admin\].*platform_settings/.test(e);

async function facts(page) {
  return page.evaluate((ROOT) => {
    const root = document.querySelector(ROOT);
    const pills = [...root.querySelectorAll('[data-moment]')].map((b) => +b.querySelector('span:last-child').textContent);
    const films = root.querySelectorAll('[data-film]').length;
    const cur = root.querySelector('[data-moment][aria-current="true"]');
    const onPage = root.querySelectorAll('[data-obj]').length;
    const objs = [...root.querySelectorAll('[data-obj]')].map((e) => ({ id: e.dataset.obj, l: e.style.left, t: e.style.top }));
    const hint = document.querySelector('[role="status"][aria-live="polite"]');
    return {
      pills,
      films,
      onPage,
      curPill: cur ? +cur.querySelector('span:last-child').textContent : -1,
      objs,
      total: pills.reduce((a, b) => a + b, 0) + films,
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      hint: hint && hint.textContent,
      hintOn: hint && getComputedStyle(hint).opacity !== '0',
      undo: !!(hint && hint.querySelector('button')),
      disabledButtons: root.querySelectorAll('button[disabled]').length,
      saved: [...root.querySelectorAll('[role="status"]')].map((s) => s.textContent).join('|'),
    };
  }, ROOT);
}

async function whole(page, where) {
  const f = await facts(page);
  check(`[${where}] pages + tray = ${TOTAL}`, f.total === TOTAL, `pills ${f.pills.join('+')} + tray ${f.films} = ${f.total}`);
  check(`[${where}] this page draws its pill`, f.onPage === f.curPill, `${f.onPage} drawn, pill ${f.curPill}`);
  check(`[${where}] no sideways scroll`, f.scrollW <= f.innerW, `${f.scrollW} vs ${f.innerW}`);
  return f;
}

async function waitSaved(page) {
  await page.waitForFunction(
    (ROOT) => [...document.querySelector(ROOT).querySelectorAll('[role="status"]')].some((s) => s.textContent === 'Saved'),
    ROOT,
    { timeout: 20_000 },
  );
}

async function open(page, q = '?reset') {
  await page.goto(`${BASE}/mky-harness${q}`, { waitUntil: 'networkidle', timeout: 300_000 });
  const cookie = page.getByRole('button', { name: 'Essential only' });
  if (await cookie.count()) await cookie.click().catch(() => {});
  await page.waitForSelector(ROOT);
  // A reload must re-read the kept arrangement, not start the test store over.
  await page.evaluate(() => history.replaceState(null, '', '/mky-harness'));
  await page.waitForTimeout(300);
}

function tapOrClick(phone) {
  return async (locator) => (phone ? locator.tap() : locator.click());
}

/** A real touch drag, through the DevTools protocol (Playwright's touchscreen only taps). */
async function touchDrag(page, from, to, steps = 8) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y }] });
  for (let i = 1; i <= steps; i += 1) {
    const x = from.x + ((to.x - from.x) * i) / steps;
    const y = from.y + ((to.y - from.y) * i) / steps;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
}
async function mouseDrag(page, from, to, steps = 8) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  for (let i = 1; i <= steps; i += 1) {
    await page.mouse.move(from.x + ((to.x - from.x) * i) / steps, from.y + ((to.y - from.y) * i) / steps);
  }
  await page.mouse.up();
}
/** A key HELD DOWN: the browser's own auto-repeat (keydown with repeat=true), then one keyup. */
async function holdKey(page, key, times = 8) {
  const codes = { Enter: 13, Delete: 46 };
  const cdp = await page.context().newCDPSession(page);
  const base = { key, code: key, windowsVirtualKeyCode: codes[key], nativeVirtualKeyCode: codes[key] };
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', ...base, ...(key === 'Enter' ? { text: '\r' } : {}) });
  for (let i = 0; i < times; i += 1) {
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', autoRepeat: true, ...base, ...(key === 'Enter' ? { text: '\r' } : {}) });
    await page.waitForTimeout(40);
  }
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
  await cdp.detach();
}
const center = async (loc) => {
  await loc.scrollIntoViewIfNeeded().catch(() => {});
  const b = await loc.boundingBox();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2, b };
};

async function run(phone) {
  const tag = phone ? '390 touch' : '1280 mouse';
  const browser = await chromium.launch();
  const { ctx, log } = await openContext(browser, { phone });
  const page = await ctx.newPage();
  if (process.env.TRACE) {
    page.on('response', async (r) => {
      if (r.request().method() !== 'POST' || !r.url().endsWith('/mky-harness')) return;
      const body = await r.text().catch(() => '');
      console.log('   save →', (body.match(/"ok":\w+|"version":\d+|"reason":"\w+"/g) || [body.slice(-120)]).join(' '));
    });
    page.on('console', (m) => { if (m.type() !== 'error') console.log('   console.' + m.type(), m.text().slice(0, 200)); });
  }
  const press = tapOrClick(phone);
  const drag = phone ? touchDrag : mouseDrag;
  const root = page.locator(ROOT);
  const choose = root.getByRole('button', { name: /I choose/ });
  const automatic = root.getByRole('button', { name: /Automatic/ });
  const putBack = root.getByRole('button', { name: 'Put all back' });
  const films = root.locator('[data-film]');
  const photos = root.locator('[data-obj]');
  const moment = (name) => root.locator('[data-moment]', { hasText: name });

  await open(page);
  let f = await whole(page, `${tag} · opened`);
  check(`[${tag}] opens in Automatic, tray empty`, (await automatic.getAttribute('aria-pressed')) === 'true' && f.films === 0);

  // ── AUTOMATIC IS READ-ONLY, AND EVERY REFUSAL SAYS WHY — ON A TAP ────────────────────────
  await moment('Dinner').click();
  const firstPhoto = photos.first();
  const xVisible = await firstPhoto.locator('button').isVisible();
  check(`[${tag}] Automatic shows no ×`, !xVisible);
  await press(firstPhoto);
  await page.waitForTimeout(300);
  f = await facts(page);
  check(`[${tag}] a tap on a photo in Automatic says why`, f.hintOn && /I choose/.test(f.hint), f.hint);
  const hr = await page.evaluate(() => { const r = document.querySelector('[role="status"][aria-live="polite"]').getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, vh: innerHeight, vw: innerWidth }; });
  check(`[${tag}] …where the person is looking: fully on screen`, hr.top >= 0 && hr.bottom <= hr.vh && hr.left >= 0 && hr.right <= hr.vw, JSON.stringify(hr));
  const before = (await facts(page)).objs;
  await firstPhoto.focus();
  await page.keyboard.press('Delete');
  f = await facts(page);
  check(`[${tag}] Delete on a photo in Automatic says why and removes nothing`, /I choose/.test(f.hint) && f.onPage === before.length);
  check(`[${tag}] Put all back is not offered in Automatic`, !(await putBack.isVisible()));
  if (phone) {
    // A swipe that starts on a photo scrolls the page — it is not a refusal.
    const y0 = await page.evaluate(() => window.scrollY);
    const c = await center(firstPhoto);
    await page.evaluate(() => {
      const h = document.querySelector('[role="status"][aria-live="polite"]');
      h.dataset.before = h.textContent;
    });
    await touchDrag(page, { x: c.x, y: c.y }, { x: c.x, y: c.y - 200 }, 10);
    await page.waitForTimeout(400);
    const y1 = await page.evaluate(() => window.scrollY);
    check(`[${tag}] a swipe on a photo in Automatic scrolls the page`, y1 > y0, `scrollY ${y0} → ${y1}`);
  }

  // ── I CHOOSE STARTS FROM WHAT AUTOMATIC MADE ───────────────────────────────────────────
  const autoPos = (await facts(page)).objs.map((o) => `${o.l},${o.t}`).join(' ');
  await press(choose);
  await page.waitForTimeout(200);
  f = await whole(page, `${tag} · I choose`);
  check(`[${tag}] nothing moves on I choose`, f.objs.map((o) => `${o.l},${o.t}`).join(' ') === autoPos);
  check(`[${tag}] the × shows on every photo`, (await photos.first().locator('button').isVisible()) === true);

  // ── PUT ALL BACK, WITH UNDO ────────────────────────────────────────────────────────────
  const dinnerCount = f.curPill;
  await press(putBack);
  await page.waitForTimeout(150);
  f = await whole(page, `${tag} · put all back`);
  check(`[${tag}] Put all back empties this page into the tray`, f.onPage === 0 && f.films === dinnerCount);
  check(`[${tag}] …and offers Undo`, f.undo && /back in the tray/.test(f.hint), f.hint);
  await press(page.getByRole('button', { name: 'Undo' }));
  await page.waitForTimeout(150);
  f = await whole(page, `${tag} · undo put all back`);
  check(`[${tag}] Undo puts them back`, f.onPage === dinnerCount && f.films === 0);

  // ── A TAP IS THE ADD · ONCE, HOWEVER IT IS REPEATED ────────────────────────────────────
  for (const name of ['Cocktails', 'Money Dance']) {
    await press(moment(name));
    await page.waitForTimeout(80);
    await press(putBack);
    await page.waitForTimeout(80);
  }
  await press(moment('Dinner'));
  await page.waitForTimeout(80);
  await press(putBack);
  await page.waitForTimeout(100);
  const trayBefore = (await facts(page)).films;
  // Double tap: the NEXT photo slides under the finger — it must not be added too.
  const film0 = films.first();
  if (phone) {
    await film0.scrollIntoViewIfNeeded();
    const c = await center(film0);
    await page.touchscreen.tap(c.x, c.y);
    await page.touchscreen.tap(c.x, c.y);
  } else {
    await film0.dblclick();
  }
  await page.waitForTimeout(350);
  f = await whole(page, `${tag} · double tap`);
  check(`[${tag}] a double tap adds ONE photo`, f.films === trayBefore - 1 && f.onPage === 1, `tray ${trayBefore} → ${f.films}`);

  // Keyboard: two quick Enters on a focused tray photo.
  await films.first().focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(350);
  f = await whole(page, `${tag} · double Enter`);
  check(`[${tag}] a double Enter adds ONE photo`, f.onPage === 2 && f.films === trayBefore - 2, `on page ${f.onPage}`);
  const focusedFilm = await page.evaluate(() => !!document.activeElement?.dataset?.film || document.activeElement?.tagName);
  check(`[${tag}] the keyboard keeps its place in the tray`, focusedFilm === true, String(focusedFilm));
  // Two quick Spaces on a focused tray photo.
  const beforeSpace = (await facts(page)).onPage;
  await films.first().focus();
  await page.keyboard.press(' ');
  await page.keyboard.press(' ');
  await page.waitForTimeout(350);
  f = await whole(page, `${tag} · double Space`);
  check(`[${tag}] a double Space adds ONE photo`, f.onPage === beforeSpace + 1, `${beforeSpace} → ${f.onPage}`);
  // Held Enter: the key's own auto-repeat, for about a third of a second.
  const beforeHeld = (await facts(page)).onPage;
  if ((await facts(page)).films > 1) {
    await films.first().focus();
    await holdKey(page, 'Enter', 8);
  }
  await page.waitForTimeout(400);
  f = await whole(page, `${tag} · held Enter`);
  check(`[${tag}] a held Enter adds ONE photo`, f.onPage === beforeHeld + 1, `${beforeHeld} → ${f.onPage}`);

  // ── × ON A PHOTO · UNDO · A MESSAGE KEEPS THE UNDO, A LATER CHANGE RETIRES IT ───────────
  const n0 = (await facts(page)).onPage;
  await press(photos.first().locator('button'));
  await page.waitForTimeout(150);
  f = await whole(page, `${tag} · × removal`);
  check(`[${tag}] × takes the photo back to the tray, with Undo`, f.onPage === n0 - 1 && f.undo && /Back in the tray/.test(f.hint));
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+z' : 'Control+z');
  await page.waitForTimeout(150);
  f = await whole(page, `${tag} · Cmd+Z`);
  check(`[${tag}] Cmd/Ctrl+Z undoes the removal`, f.onPage === n0);
  // A later CHANGE retires a pending Undo.
  await press(photos.first().locator('button'));
  await page.waitForTimeout(100);
  await press(films.first());
  await page.waitForTimeout(300);
  f = await facts(page);
  check(`[${tag}] a later change retires the Undo`, !f.undo);
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+z' : 'Control+z');
  await page.waitForTimeout(150);
  const g = await whole(page, `${tag} · Cmd+Z after a later change`);
  check(`[${tag}] …so Cmd+Z then does nothing`, g.onPage === f.onPage);

  // ── A DRAG: past 4px (10px for a finger), to the front, the sheet grows ─────────────────
  await press(films.first());
  await page.waitForTimeout(300);
  const pick = photos.nth(0);
  const pickId = await pick.getAttribute('data-obj');
  const c0 = await center(pick);
  const small = phone ? 7 : 3;
  await drag(page, { x: c0.x - 20, y: c0.y }, { x: c0.x - 20 + small, y: c0.y + 1 }, 3);
  await page.waitForTimeout(200);
  let po = (await facts(page)).objs.find((o) => o.id === pickId);
  check(`[${tag}] a ${small}px drift is a tap, not a move`, po.l === (await pick.evaluate((e) => e.style.left)) && `${Math.round(c0.b.x)}` === `${Math.round((await pick.boundingBox()).x)}`);
  const cvH0 = await page.evaluate((ROOT) => document.querySelector(ROOT).querySelector('[data-obj]').parentElement.offsetHeight, ROOT);
  const stage = await root.locator('[data-obj]').first().evaluate((e) => e.parentElement.parentElement.getBoundingClientRect().bottom);
  await drag(page, { x: c0.x - 20, y: c0.y }, { x: c0.x + 30, y: stage + 60 }, 12);
  await page.waitForTimeout(400);
  const cvH1 = await page.evaluate((ROOT) => document.querySelector(ROOT).querySelector('[data-obj]').parentElement.offsetHeight, ROOT);
  const lastId = await photos.last().getAttribute('data-obj');
  check(`[${tag}] a drag moves the photo and brings it to the front`, lastId === pickId);
  check(`[${tag}] the sheet grows downward to meet it`, cvH1 > cvH0, `${cvH0} → ${cvH1}`);
  const clipped = await page.evaluate((id) => {
    const el = document.querySelector(`[data-obj="${id}"]`);
    const st = el.parentElement.parentElement.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return r.bottom > st.bottom + 1 || r.right > st.right + 1 || r.left < st.left - 1;
  }, pickId);
  check(`[${tag}] a photo dragged to the bottom is not cut off`, !clipped);
  f = await whole(page, `${tag} · after drag`);

  // ── A TAP ON A PHOTO BESIDE ITS × SELECTS IT, NEVER TAKES IT OFF ───────────────────────
  {
    const q = photos.first();
    const qid = await q.getAttribute('data-obj');
    const xb = (await center(q.locator('button'))).b;
    const n1 = (await facts(page)).onPage;
    const px = xb.x - 6, py = xb.y + xb.height + 6; // just inside the photo, down-left of its ×
    if (phone) await page.touchscreen.tap(px, py); else await page.mouse.click(px, py);
    await page.waitForTimeout(200);
    const f2 = await facts(page);
    check(`[${tag}] a tap beside the × selects the photo and keeps it`, f2.onPage === n1 && f2.objs.some((o) => o.id === qid), `${n1} → ${f2.onPage}`);
  }

  // ── A × COVERED BY A NEIGHBOUR ─────────────────────────────────────────────────────────
  if ((await photos.count()) < 2) {
    await press(films.first());
    await page.waitForTimeout(300);
  }
  const A = photos.nth(0);
  const B = photos.nth(1);
  const aId = await A.getAttribute('data-obj');
  const bId = await B.getAttribute('data-obj');
  const ax = await center(A.locator('button'));
  const bc = await center(B);
  // Drag B so its body sits over A's top-right corner.
  await drag(page, { x: bc.x, y: bc.y }, { x: ax.x + (bc.b.width / 2) - 6, y: ax.y + (bc.b.height / 2) - 6 }, 10);
  await page.waitForTimeout(300);
  const ax2 = await center(A.locator('button'));
  const hit = await page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y);
    return el && el.closest('[data-obj]')?.dataset.obj + (el.closest('[data-x]') ? ':x' : '');
  }, ax2);
  check(`[${tag}] a × under a neighbour is still on top where it shows`, hit === `${aId}:x`, `hit ${hit}`);
  if (phone) await page.touchscreen.tap(ax2.x, ax2.y);
  else await page.mouse.click(ax2.x, ax2.y);
  await page.waitForTimeout(200);
  const idsNow = (await facts(page)).objs.map((o) => o.id);
  check(`[${tag}] pressing it takes off THAT photo, not the neighbour`, !idsNow.includes(aId) && idsNow.includes(bId));
  await whole(page, `${tag} · covered ×`);

  // ── THE KEYBOARD: Tab, arrows move, Delete (held = one), Cmd/Ctrl+Z ─────────────────────
  if (!phone) {
    await press(films.first());
    await page.waitForTimeout(300);
    const k = photos.first();
    const kid = await k.getAttribute('data-obj');
    await k.focus();
    const l0 = parseInt(await k.evaluate((e) => e.style.left), 10);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(150);
    const k2 = root.locator(`[data-obj="${kid}"]`);
    const l1 = parseInt(await k2.evaluate((e) => e.style.left), 10);
    check(`[${tag}] arrows move the focused photo`, l1 === Math.min(l0 + 16, 660 - 146), `${l0} → ${l1}`);
    check(`[${tag}] …and it keeps the focus`, await k2.evaluate((e) => e === document.activeElement));
    const count0 = (await facts(page)).onPage;
    await holdKey(page, 'Delete', 8);
    await page.waitForTimeout(200);
    f = await whole(page, `${tag} · held Delete`);
    check(`[${tag}] a held Delete removes ONE photo`, f.onPage === count0 - 1, `${count0} → ${f.onPage}`);
    const focusAfter = await page.evaluate(() => document.activeElement?.dataset?.obj ? 'photo' : document.activeElement?.getAttribute('aria-label'));
    check(`[${tag}] focus stays on the page after a keyboard removal`, focusAfter === 'photo' || focusAfter === 'This moment’s page', String(focusAfter));
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+z' : 'Control+z');
    await page.waitForTimeout(150);
    f = await whole(page, `${tag} · undo held Delete`);
    check(`[${tag}] Cmd/Ctrl+Z brings it back`, f.onPage === count0);
    // Tab reaches the moments and the photos.
    await moment('Cocktails').focus();
    await page.keyboard.press('ArrowDown');
    const rowFocus = await page.evaluate(() => document.activeElement?.dataset?.moment ? document.activeElement.textContent : null);
    check(`[${tag}] arrow keys walk the moments`, /Grand Entrance/.test(rowFocus || ''), rowFocus);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    check(`[${tag}] Enter opens a moment`, (await moment('Grand Entrance').getAttribute('aria-current')) === 'true');
    await moment('Dinner').click();
  }

  // ── RESIZE NEVER MOVES ANYTHING ────────────────────────────────────────────────────────
  const posA = (await facts(page)).objs.map((o) => `${o.id}@${o.l},${o.t}`).join(' ');
  const vp = page.viewportSize();
  for (const w of [700, 360, 1280, vp.width]) {
    await page.setViewportSize({ width: w, height: vp.height });
    await page.waitForTimeout(250);
  }
  const posB = (await facts(page)).objs.map((o) => `${o.id}@${o.l},${o.t}`).join(' ');
  check(`[${tag}] a resize moves nothing`, posA === posB);
  await whole(page, `${tag} · after resize`);

  // ── A PRESS STILL LANDS WHEN SOMETHING ABOVE IT CHANGES SIZE ───────────────────────────
  // Taking photos off shrinks the page above the tray; the very next tap on the tray still adds.
  await press(putBack);
  await page.waitForTimeout(60); // the toast is up and the page just shrank
  const t0 = (await facts(page)).films;
  const nextFilm = films.first();
  await press(nextFilm);
  await page.waitForTimeout(300);
  f = await whole(page, `${tag} · press after shrink`);
  check(`[${tag}] a tap on the tray lands while the Undo toast is up and the page just shrank`, f.films === t0 - 1);

  // ── THE TRAY AT ITS WIDEST: a phone never scrolls sideways ─────────────────────────────
  for (const name of ['Hair & make-up', 'Cocktails', 'Grand Entrance', 'Dinner', 'First Dance', 'Money Dance', 'Last Song & Send-off']) {
    await press(moment(name));
    await page.waitForTimeout(80);
    if (await putBack.isVisible()) await press(putBack);
    await page.waitForTimeout(80);
  }
  f = await whole(page, `${tag} · everything in the tray`);
  check(`[${tag}] all ${TOTAL} in the tray`, f.films === TOTAL);
  await page.screenshot({ path: `${OUT}/drive-${phone ? 'phone' : 'desk'}-tray.png` });
  {
    const strip = root.locator('[data-film]').first().locator('xpath=..');
    const can = await strip.evaluate((e) => e.scrollWidth > e.clientWidth);
    if (can) {
      await strip.evaluate((e) => { e.scrollLeft = e.scrollWidth; });
      await page.waitForTimeout(100);
      const sl0 = await strip.evaluate((e) => e.scrollLeft);
      await press(films.last());
      await page.waitForTimeout(300);
      const sl1 = await strip.evaluate((e) => e.scrollLeft);
      check(`[${tag}] the tray keeps its place after a tap (does not snap back to the start)`, sl1 > 0 && Math.abs(sl1 - sl0) < 90, `${sl0} → ${sl1}`);
      await press(photos.last().locator('button'));
      await page.waitForTimeout(200);
    } else check(`[${tag}] (the tray fits without scrolling here)`, true);
    await whole(page, `${tag} · tray scroll`);
  }

  // ── BACK TO AUTOMATIC: instant, with Undo, and a message never eats that Undo ──────────
  await press(automatic);
  await page.waitForTimeout(200);
  f = await whole(page, `${tag} · back to Automatic`);
  check(`[${tag}] back to Automatic re-sorts, with Undo (no pop-up)`, f.films === 0 && f.undo, f.hint);
  await press(photos.first()); // a refusal message inside the Undo window
  await page.waitForTimeout(150);
  f = await facts(page);
  check(`[${tag}] a refusal message keeps the live Undo`, f.undo && /I choose/.test(f.hint), f.hint);
  await press(page.getByRole('button', { name: 'Undo' }));
  await page.waitForTimeout(200);
  f = await whole(page, `${tag} · undo Automatic`);
  check(`[${tag}] Undo brings the hand arrangement back`, f.films === TOTAL && (await choose.getAttribute('aria-pressed')) === 'true');

  // ── BUILD A PAGE, SAVE, RELOAD ─────────────────────────────────────────────────────────
  if (process.env.TRACE) console.log('   ---- build a page ----', JSON.stringify((await facts(page)).saved));
  await press(moment('First Dance'));
  for (let i = 0; i < 3; i += 1) {
    await press(films.first());
    await page.waitForTimeout(260);
  }
  const fp = photos.first();
  const fc = await center(fp);
  await drag(page, { x: fc.x - 15, y: fc.y }, { x: fc.x + 90, y: fc.y + 70 }, 10);
  await page.waitForTimeout(200);
  const kept = await facts(page);
  if (process.env.TRACE) console.log('   after drag', JSON.stringify(kept.saved), JSON.stringify(kept.objs));
  await waitSaved(page);
  check(`[${tag}] every change is saved without pressing Save`, true);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector(ROOT);
  await press(moment('First Dance'));
  await page.waitForTimeout(200);
  const back = await whole(page, `${tag} · after reload`);
  const sig = (x) => x.objs.map((o) => `${o.l},${o.t}`).sort().join(' ');
  check(`[${tag}] reload gives back exactly what was arranged`, sig(back) === sig(kept) && back.films === kept.films, `${sig(kept)} | ${sig(back)}`);
  check(`[${tag}] reload opens in I choose`, (await choose.getAttribute('aria-pressed')) === 'true');

  // ── TWO TABS: the second one is told, and writes nothing ───────────────────────────────
  const page2 = await ctx.newPage();
  await page2.goto(`${BASE}/mky-harness`, { waitUntil: 'networkidle' });
  const root2 = page2.locator(ROOT);
  const c1 = page2.getByRole('button', { name: 'Essential only' });
  if (await c1.count()) await c1.click().catch(() => {});
  await press(films.first()); // tab 1 saves first
  await waitSaved(page);
  const winner = await facts(page);
  await (phone ? root2.locator('[data-film]').first().tap() : root2.locator('[data-film]').first().click()); // tab 2 is stale
  await page2.waitForSelector(`${ROOT} [role="alert"]`, { timeout: 15_000 });
  const alertText = await root2.locator('[role="alert"]').textContent();
  check(`[${tag}] the stale tab is told it lost, with a way to reload`, /changed somewhere else/.test(alertText) && (await page2.getByRole('button', { name: 'Reload' }).count()) === 1, alertText);
  await page2.close();
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector(ROOT);
  await press(moment('First Dance'));
  await page.waitForTimeout(200);
  const after2 = await facts(page);
  check(`[${tag}] the winning tab's work is what was kept`, sig(after2) === sig(winner) && after2.films === winner.films);

  // ── WHAT COULD NOT BE READ IS NEVER SAVED OVER ─────────────────────────────────────────
  await open(page, '?reset&unreadable');
  f = await facts(page);
  const alert = await root.locator('[role="alert"]').first().textContent().catch(() => '');
  check(`[${tag}] an unreadable pool says so`, /couldn’t load/.test(alert || ''), alert);
  await press(choose);
  await page.waitForTimeout(150);
  f = await facts(page);
  check(`[${tag}] …and refuses changes, saying why`, /reload/.test(f.hint || '') && (await automatic.getAttribute('aria-pressed')) === 'true', f.hint);
  await page.waitForTimeout(700);
  const ver = await page.getAttribute('[data-harness-version]', 'data-harness-version');
  await page.reload({ waitUntil: 'networkidle' });
  const ver2 = await page.getAttribute('[data-harness-version]', 'data-harness-version');
  check(`[${tag}] …and nothing was written`, ver === '0' && ver2 === '0', `${ver} → ${ver2}`);

  // ── NO RUN OF SHOW ─────────────────────────────────────────────────────────────────────
  await open(page, '?reset&noschedule');
  f = await whole(page, `${tag} · no run of show`);
  check(`[${tag}] with no run of show it opens in I choose, on one page, all in the tray`, (await choose.getAttribute('aria-pressed')) === 'true' && f.pills.length === 1 && f.films === TOTAL);
  check(`[${tag}] Automatic is aria-disabled, never disabled`, (await automatic.getAttribute('aria-disabled')) === 'true' && f.disabledButtons === 0);
  await (phone ? automatic.tap({ force: true }) : automatic.click({ force: true }));
  await page.waitForTimeout(150);
  f = await facts(page);
  check(`[${tag}] pressing it says why`, /run of show first/.test(f.hint || ''), f.hint);
  check(`[${tag}] the note links to the schedule`, (await root.getByRole('link', { name: 'Add your schedule' }).getAttribute('href')).endsWith('/schedule'));
  await page.screenshot({ path: `${OUT}/drive-${phone ? 'phone' : 'desk'}-noschedule.png` });

  // ── NOTHING ELSE WENT WRONG ────────────────────────────────────────────────────────────
  const errors = log.errors.filter((e) => !envNoise(e));
  check(`[${tag}] zero dialogs`, log.dialogs.length === 0, log.dialogs.join(' | '));
  check(`[${tag}] zero console errors`, errors.length === 0, errors.join(' | ').slice(0, 800));
  const noise = log.errors.length - errors.length;
  if (noise) console.log(`   (excluded ${noise} dev-server replay(s) of the app layout's platform_settings read — no service role on this machine)`);
  await browser.close();
}

(async () => {
  const which = process.argv[2];
  if (!which || which === 'desk') await run(false);
  if (!which || which === 'phone') await run(true);
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length} passed · ${failed.length} failed`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => {
  console.error('CRASHED', e);
  process.exit(2);
});
