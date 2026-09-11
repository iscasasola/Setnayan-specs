// STEP 8 · the Story, end to end, on the LIVE site — the stages after the editor.
//
//   node live-e2e.cjs <stage> [phone] [dark]
//
//   setup     host: an address, Unlisted, the guests' photo pool opened          (desk)
//   tag       guest: opens their invitation, finds themselves in the pool: "I'm in this"
//   arrange   host: The story → Automatic → I choose → a moment by hand (photos + words with a look)
//             → Undo → reload → it is all still there
//   publish   host: Publish → the consent tick → Published
//   view      /[slug] signed out · as the guest · as the host; the share card; A3 + A4 prints
//   ask       guest: "Hide it, or ask to be unnamed" → "Ask for this one to come down"
//   after     the same reads as `view`, asserting the taken-down photograph is gone everywhere
//
// The host is the signed-in profile (a PERSON signed in; see signin.cjs). The guest is a fresh
// browser that opens the guest's own invitation link — exactly what a guest does. Strangers are a
// fresh browser with nothing.
const fs = require('node:fs');
const path = require('node:path');
const L = require('./e2e-lib.cjs');
const { BASE, OUT, check, results } = L;

const EV = process.env.E2E_EVENT || '0ccc7aa3-3a81-43ee-b170-afb194e0b259';
const SLUG = process.env.E2E_SLUG || 'songdesk-story-proof';
const GUEST_QR = process.env.E2E_GUEST_QR; // the guest's own invitation token (from the guest list)
const MOMENT = process.env.E2E_MOMENT || 'First Dance';
const ROOT = 'section[aria-labelledby="make-it-yours-title"]';
const STATE = path.join(OUT, 'e2e-state.json');
const stage = process.argv[2];
const phone = process.argv.includes('phone');
const dark = process.argv.includes('dark');
const tag = `${phone ? '390 touch' : '1280 mouse'}${dark ? ' · dark' : ''}`;

const readState = () => (fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : {});
const writeState = (s) => fs.writeFileSync(STATE, JSON.stringify({ ...readState(), ...s }, null, 2));
const shot = (page, name) => page.screenshot({ path: path.join(OUT, `e2e-${name}-${phone ? 'phone' : 'desk'}${dark ? '-dark' : ''}.png`), fullPage: false });
const press = (loc) => (phone ? loc.tap() : loc.click());

async function storyStep(page, name) {
  await page.locator('nav[aria-label="Story Maker steps"] button, [role=tab]').filter({ hasText: name, visible: true }).first().click();
  await page.waitForTimeout(400);
}
async function openMaker(page) {
  await page.goto(`${BASE}/dashboard/${EV}/story`, { waitUntil: 'networkidle', timeout: 120_000 });
  await L.dismissCookie(page);
}

/* ── setup ─────────────────────────────────────────────────────────────────────────────────── */
async function setup() {
  const { ctx, log } = await L.hostContext({ phone, dark });
  const page = ctx.pages()[0] || (await ctx.newPage());
  // 1 · an address
  await page.goto(`${BASE}/dashboard/${EV}/invitation`, { waitUntil: 'networkidle' });
  await L.dismissCookie(page);
  const slug = page.locator('#slug');
  const current = await slug.inputValue().catch(() => '');
  if (current !== SLUG) {
    await slug.fill(SLUG);
    const save = page.getByRole('button', { name: 'Save slug' });
    await page.waitForFunction((b) => b && !b.disabled, await save.elementHandle(), { timeout: 20_000 });
    await save.click();
    await page.waitForURL(/slug_saved|slug_error/, { timeout: 30_000 }).catch(() => {});
  }
  await page.goto(`${BASE}/dashboard/${EV}/invitation`, { waitUntil: 'networkidle' });
  check(`[${tag}] setup · the celebration has its address`, (await page.locator('#slug').inputValue()) === SLUG, await page.locator('#slug').inputValue());
  // 2 · who may open the page — Unlisted by default (anyone with the link, never listed); the share
  //     card is only the story's own on a PUBLIC page (unlisted pages keep the brand card by design,
  //     app/[slug]/page.tsx generateMetadata), so the share-card half of the drive runs on Public.
  const VIS = process.env.E2E_VIS || 'unlisted';
  await page.goto(`${BASE}/dashboard/${EV}/website/privacy`, { waitUntil: 'networkidle' });
  await L.dismissCookie(page);
  await page.locator(`label:has(input[name="visibility"][value="${VIS}"])`).first().click();
  await page.getByRole('button', { name: 'Save changes' }).first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForURL(/saved=1/, { timeout: 30_000 }).catch(() => {});
  await page.goto(`${BASE}/dashboard/${EV}/website/privacy`, { waitUntil: 'networkidle' });
  check(`[${tag}] setup · ${VIS} is saved`, await page.locator(`input[name="visibility"][value="${VIS}"]`).isChecked());
  // 3 · the guests' photo pool
  await page.goto(`${BASE}/dashboard/${EV}/studio/papic`, { waitUntil: 'networkidle' });
  await L.dismissCookie(page);
  const sw = page.getByRole('switch').filter({ hasText: /to guests/ }).first();
  if ((await sw.getAttribute('aria-checked')) !== 'true') {
    await sw.click();
    await page.waitForFunction((e) => e.getAttribute('aria-checked') === 'true', await sw.elementHandle(), { timeout: 20_000 });
  }
  check(`[${tag}] setup · the guests' photo pool is open`, (await sw.getAttribute('aria-checked')) === 'true');
  await shot(page, 'setup-pool');
  finish(log, tag);
  await ctx.close();
}

/* ── tag: the guest finds themselves ───────────────────────────────────────────────────────── */
async function tagMe() {
  if (!GUEST_QR) throw new Error('E2E_GUEST_QR — the guest’s own invitation token');
  const { ctx, log } = await L.freshContext({ phone, dark });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/papic/me/${GUEST_QR}/session?next=pool`, { waitUntil: 'networkidle' });
  await L.dismissCookie(page);
  check(`[${tag}] tag · the invitation opens the guest's pool`, /\/papic\/pool/.test(page.url()), page.url());
  const tiles = page.locator('button[aria-pressed]');
  const n = await tiles.count();
  check(`[${tag}] tag · the pool shows the day's photographs`, n > 0, `${n} tiles`);
  const want = Number(process.env.E2E_TAG_INDEX || 0);
  const tile = tiles.nth(want);
  // Which capture is it? The tile's picture names its stored key.
  const src = await tile.locator('xpath=ancestor::*[.//img][1]//img').first().getAttribute('src').catch(() => null);
  const key = (src || '').match(/story-step4-fixture\/(\d+)/)?.[1] ?? null;
  if ((await tile.getAttribute('aria-pressed')) !== 'true') await press(tile);
  await page.waitForFunction((e) => e.getAttribute('aria-pressed') === 'true', await tile.elementHandle(), { timeout: 20_000 });
  check(`[${tag}] tag · "I'm in this" links the guest to photograph ${key}`, (await tile.getAttribute('aria-pressed')) === 'true', `fixture #${key}`);
  writeState({ taggedFixture: key });
  await shot(page, 'tag-pool');
  finish(log, tag);
  await ctx.close();
}

/* ── arrange: a moment by hand ─────────────────────────────────────────────────────────────── */
async function arrange() {
  const { ctx, log } = await L.hostContext({ phone, dark });
  const page = ctx.pages()[0] || (await ctx.newPage());
  await openMaker(page);
  await storyStep(page, 'The story');
  const root = page.locator(ROOT);
  await root.waitFor();
  const automatic = root.getByRole('button', { name: /Automatic/ });
  const choose = root.getByRole('button', { name: /I choose/ });
  const moment = root.locator('[data-moment]', { hasText: MOMENT });
  const photos = root.locator('[data-obj][data-kind="photo"]');
  const films = root.locator('[data-film]');
  check(`[${tag}] arrange · opens in Automatic`, (await automatic.getAttribute('aria-pressed')) === 'true');
  await press(moment);
  const autoCount = await photos.count();
  check(`[${tag}] arrange · Automatic put ${MOMENT}'s photographs on its page`, autoCount > 0, `${autoCount}`);
  await shot(page, 'arrange-automatic');
  await press(choose);
  await page.waitForTimeout(300);
  check(`[${tag}] arrange · I choose`, (await choose.getAttribute('aria-pressed')) === 'true');
  // Bring the tagged photograph onto this page if it lives elsewhere, so the take-down is visible here.
  const st = readState();
  if (st.taggedFixture) {
    const here = await root.locator(`[data-obj] img[src*="story-step4-fixture/${st.taggedFixture}"]`).count();
    if (!here) {
      // find its moment, take it off there, put it here
      for (const m of await root.locator('[data-moment]').all()) {
        await press(m);
        await page.waitForTimeout(150);
        const x = root.locator(`[data-obj]:has(img[src*="story-step4-fixture/${st.taggedFixture}-"]) [data-x]`);
        if (await x.count()) { await press(x.first()); await page.waitForTimeout(250); break; }
      }
      await press(moment);
      await page.waitForTimeout(150);
      const f = root.locator(`[data-film]:has(img[src*="story-step4-fixture/${st.taggedFixture}-"])`);
      if (await f.count()) await press(f.first());
      await page.waitForTimeout(300);
    }
  }
  // Words, with a look: + Words → type → Terracotta → a background.
  await press(root.getByRole('button', { name: '+ Words' }));
  await page.waitForTimeout(300);
  const ed = root.locator('[data-obj][data-kind="words"] [data-ed]').last();
  await press(ed);
  await page.keyboard.type('Their first dance, under the capiz lights');
  const bar = root.locator('[role="toolbar"][aria-label="Words"]');
  await press(bar.getByRole('button', { name: 'Text colour' }));
  await press(bar.getByRole('radio', { name: /Terracotta/ }).first());
  await press(bar.getByRole('button', { name: /Background behind the words/ }));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const wordsOn = await root.locator('[data-obj][data-kind="words"]').count();
  check(`[${tag}] arrange · words with a look are on the page`, wordsOn >= 1, `${wordsOn} words box(es)`);
  // A removal, then Undo.
  const before = await photos.count();
  await press(photos.first().locator('[data-x]'));
  await page.waitForTimeout(250);
  const afterX = await photos.count();
  await press(page.getByRole('button', { name: 'Undo' }));
  await page.waitForTimeout(300);
  check(`[${tag}] arrange · × then Undo puts the photograph back`, afterX === before - 1 && (await photos.count()) === before, `${before} → ${afterX} → ${await photos.count()}`);
  // Saved without pressing Save, then a reload reads it all back.
  await page.waitForFunction((R) => [...document.querySelector(R).querySelectorAll('[role="status"]')].some((s) => s.textContent === 'Saved'), ROOT, { timeout: 20_000 });
  const sig = async () => page.evaluate((R) => {
    const r = document.querySelector(R);
    return [...r.querySelectorAll('[data-obj]')].map((e) => `${e.dataset.kind}@${e.style.left},${e.style.top}${e.dataset.kind === 'words' ? `:${e.querySelector('[data-ed]').innerText.trim()}|${getComputedStyle(e.querySelector('[data-ed]')).color}` : ''}`).sort().join(' ');
  }, ROOT);
  const kept = await sig();
  await shot(page, 'arrange-by-hand');
  await openMaker(page);
  await storyStep(page, 'The story');
  await root.waitFor();
  await press(moment);
  await page.waitForTimeout(300);
  const back = await sig();
  check(`[${tag}] arrange · a reload gives back exactly what was arranged`, back === kept, `${kept} ‖ ${back}`);
  check(`[${tag}] arrange · and it reopens in I choose`, (await choose.getAttribute('aria-pressed')) === 'true');
  const onPage = await root.locator('[data-obj][data-kind="photo"] img').evaluateAll((is) => is.map((i) => (i.src.match(/story-step4-fixture\/(\d+)/) || [])[1]).filter(Boolean));
  writeState({ arranged: onPage, moment: MOMENT });
  void films;
  finish(log, tag);
  await ctx.close();
}

/* ── publish ───────────────────────────────────────────────────────────────────────────────── */
async function publish() {
  const { ctx, log } = await L.hostContext({ phone, dark });
  const page = ctx.pages()[0] || (await ctx.newPage());
  await openMaker(page);
  await storyStep(page, 'Publish');
  const sec = page.locator('section[aria-labelledby="publish-heading"]');
  const tick = sec.locator('input[type="checkbox"]').first();
  if (!(await tick.isChecked())) await tick.check();
  const rung = sec.locator('button[aria-pressed]').filter({ hasText: 'Published' }).first();
  await rung.click();
  await sec.getByText('everyone can read it', { exact: false }).waitFor({ timeout: 30_000 });
  check(`[${tag}] publish · "Published" — everyone can read it`, (await rung.getAttribute('aria-pressed')) === 'true');
  await shot(page, 'publish');
  finish(log, tag);
  await ctx.close();
}

/* ── the reads: page, share card, prints — for three viewers ───────────────────────────────── */
async function readAs(who, ctx) {
  const page = await ctx.newPage();
  if (who === 'guest') {
    await page.goto(`${BASE}/${SLUG}?invite=${GUEST_QR}`, { waitUntil: 'networkidle' });
  }
  const resp = await page.goto(`${BASE}/${SLUG}`, { waitUntil: 'networkidle', timeout: 120_000 });
  await L.dismissCookie(page);
  const html = await page.content();
  const og = await page.locator('meta[property="og:image"]').first().getAttribute('content').catch(() => null);
  const sheets = await page.locator('[data-arranged-sheet], [data-sheet]').count().catch(() => 0);
  const shown = [...new Set([...html.matchAll(/story-step4-fixture\/(\d+)/g)].map((m) => m[1]))].sort();
  return { page, status: resp?.status(), html, og, sheets, shown };
}

async function prints(ctx, format) {
  const page = await ctx.newPage();
  const url = `${BASE}/${SLUG}/print${format === 'a4' ? '?format=a4' : ''}`;
  const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 120_000 });
  await page.waitForTimeout(800);
  const html = await page.content();
  const shown = [...new Set([...html.matchAll(/story-step4-fixture\/(\d+)/g)].map((m) => m[1]))].sort();
  const pdfPath = path.join(OUT, `e2e-print-${format}-${stage}.pdf`);
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: pdfPath, format: format === 'a4' ? 'A4' : 'A3', printBackground: true, preferCSSPageSize: true });
  const pdf = fs.readFileSync(pdfPath, 'latin1');
  const pages = (pdf.match(/\/Type\s*\/Page[^s]/g) || []).length;
  await page.emulateMedia({ media: 'screen' });
  return { page, status: resp?.status(), finalUrl: page.url(), shown, pages, pdfPath };
}

async function view(after) {
  const st = readState();
  const gone = after ? st.taggedFixture : null;
  const label = after ? 'after' : 'view';
  // signed out
  {
    const { ctx, log } = await L.freshContext({ phone, dark });
    const r = await readAs('stranger', ctx);
    check(`[${tag}] ${label} · signed out · the story answers`, r.status === 200, `HTTP ${r.status}`);
    check(`[${tag}] ${label} · signed out · the arranged moment is drawn`, r.shown.length > 0 && (st.arranged || []).every((k) => after && k === gone ? true : r.shown.includes(k)), `shown ${r.shown.join(',')} · arranged ${(st.arranged || []).join(',')}`);
    if (gone) check(`[${tag}] after · signed out · the taken-down photograph is gone from the page`, !r.shown.includes(gone), `shown ${r.shown.join(',')}`);
    check(`[${tag}] ${label} · the share card's address is versioned`, /\/api\/og\/realstory-slug\/[^?]+\?v=\d+/.test(r.og || ''), r.og);
    if (after) check(`[${tag}] after · the share card's address MOVED`, r.og && r.og !== st.ogBefore, `${st.ogBefore} → ${r.og}`);
    else writeState({ ogBefore: r.og });
    const card = await r.page.request.get(r.og.replace(/^https?:\/\/[^/]+/, BASE));
    check(`[${tag}] ${label} · the share card renders`, card.status() === 200 && /image\//.test(card.headers()['content-type'] || ''), `${card.status()} ${card.headers()['content-type']}`);
    fs.writeFileSync(path.join(OUT, `e2e-og-${label}.png`), await card.body());
    await r.page.screenshot({ path: path.join(OUT, `e2e-${label}-stranger-${phone ? 'phone' : 'desk'}${dark ? '-dark' : ''}.png`), fullPage: true });
    for (const format of ['a3', 'a4']) {
      const p = await prints(ctx, format);
      check(`[${tag}] ${label} · ${format.toUpperCase()} print opens for a stranger`, p.status === 200 && /\/print/.test(p.finalUrl), `${p.status} ${p.finalUrl}`);
      check(`[${tag}] ${label} · ${format.toUpperCase()} print carries the arranged moment`, (st.arranged || []).filter((k) => k !== gone).every((k) => p.shown.includes(k)), `print shows ${p.shown.join(',')}`);
      if (gone) check(`[${tag}] after · ${format.toUpperCase()} print no longer carries the taken-down photograph`, !p.shown.includes(gone), `print shows ${p.shown.join(',')}`);
      check(`[${tag}] ${label} · ${format.toUpperCase()} prints to PDF`, p.pages > 0, `${p.pages} page(s) → ${path.basename(p.pdfPath)}`);
    }
    finish(log, `${tag} · stranger`);
    await ctx.close();
  }
  // the guest
  if (GUEST_QR) {
    const { ctx, log } = await L.freshContext({ phone, dark });
    const r = await readAs('guest', ctx);
    check(`[${tag}] ${label} · as the guest · the story answers`, r.status === 200);
    const were = await r.page.getByText('Hide it, or ask to be unnamed').count();
    // Before the ask the guest's own door is on the story; once they have asked, their tag is off
    // and nothing of theirs is left to hide, so the door is gone (your-own-consent.tsx returns null).
    const asked = !!readState().asked;
    check(`[${tag}] ${label} · as the guest · their own consent door ${asked ? 'is gone once they have asked' : 'is on the story'}`, asked ? were === 0 : were > 0, `${were}`);
    if (gone) check(`[${tag}] after · as the guest · the photograph is gone for them too`, !r.shown.includes(gone), `shown ${r.shown.join(',')}`);
    await r.page.screenshot({ path: path.join(OUT, `e2e-${label}-guest-${phone ? 'phone' : 'desk'}${dark ? '-dark' : ''}.png`), fullPage: true });
    finish(log, `${tag} · guest`);
    await ctx.close();
  }
  // the host
  {
    const { ctx, log } = await L.hostContext({ phone, dark });
    const r = await readAs('host', ctx);
    check(`[${tag}] ${label} · as the host · the story answers`, r.status === 200);
    if (gone) check(`[${tag}] after · as the host · the photograph is gone for the host too`, !r.shown.includes(gone), `shown ${r.shown.join(',')}`);
    await r.page.screenshot({ path: path.join(OUT, `e2e-${label}-host-${phone ? 'phone' : 'desk'}${dark ? '-dark' : ''}.png`), fullPage: true });
    finish(log, `${tag} · host`);
    await ctx.close();
  }
}

/* ── ask: the guest asks for their photograph to come down ─────────────────────────────────── */
async function ask() {
  const { ctx, log } = await L.freshContext({ phone, dark });
  const r = await readAs('guest', ctx);
  const page = r.page;
  await press(page.getByRole('button', { name: 'Hide it, or ask to be unnamed' }));
  const pick = page.locator('#own-consent-pick');
  await pick.waitFor();
  const options = await pick.locator('option').allTextContents();
  check(`[${tag}] ask · the guest is offered their photograph(s)`, options.length > 0, options.join(', '));
  await page.locator('textarea[name="note"]').fill('Step-8 test: please take this one down.');
  await press(page.getByRole('button', { name: 'Ask for this one to come down' }));
  const said = page.locator('p[aria-live="polite"]').filter({ hasText: /Asked|already asked/ });
  await said.waitFor({ timeout: 30_000 });
  check(`[${tag}] ask · the guest is told what happens next`, true, (await said.textContent()).trim());
  writeState({ asked: true });
  await shot(page, 'ask');
  finish(log, tag);
  await ctx.close();
}

function finish(log, where) {
  check(`[${where}] zero dialogs`, log.dialogs.length === 0, log.dialogs.join(' | '));
  check(`[${where}] zero console errors`, log.errors.length === 0, log.errors.join(' | ').slice(0, 600));
  check(`[${where}] zero CSP reports`, log.csp.length === 0, log.csp.join(' | ').slice(0, 300));
}

(async () => {
  const run = { setup, tag: tagMe, arrange, publish, view: () => view(false), ask, after: () => view(true) }[stage];
  if (!run) throw new Error(`stage? ${stage}`);
  await run();
  await L.closeAll();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length} passed · ${failed.length} failed`);
  process.exit(failed.length ? 1 : 0);
})().catch(async (e) => {
  console.error('CRASHED', e);
  await L.closeAll();
  process.exit(2);
});
