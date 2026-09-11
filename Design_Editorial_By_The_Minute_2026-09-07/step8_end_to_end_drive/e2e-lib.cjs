// Step 8 · the end-to-end drive against the LIVE site — shared pieces.
//
// 🔒 SIGN-IN IS A PERSON'S. No script here types a password. `signin.cjs` opens a visible window on
// the live login page and a PERSON signs in; the browser keeps its own session in a profile folder
// (E2E_PROFILE, never inside the repo or this corpus). Every later run reuses that profile, so the
// drive acts as the signed-in host without a credential ever passing through code.
const path = require('node:path');
const fs = require('node:fs');

const ROOT_WT = process.env.E2E_WT || '/Users/icecasasola/Documents/Claude/Projects/wt-story8';
const { chromium, devices } = require(path.join(ROOT_WT, 'node_modules/.pnpm/playwright@1.60.0/node_modules/playwright'));

const BASE = process.env.E2E_BASE || 'https://www.setnayan.com';
const PROFILE = process.env.E2E_PROFILE;
if (!PROFILE) throw new Error('E2E_PROFILE must name a profile folder outside the repo');
const OUT = process.env.E2E_OUT || path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

function contextOptions({ phone = false, dark = false } = {}) {
  const base = phone
    ? { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } }
    : { viewport: { width: 1280, height: 860 } };
  delete base.defaultBrowserType;
  return { ...base, colorScheme: dark ? 'dark' : 'light' };
}

/** A context on the signed-in profile (host), or a fresh one (signed out / guest). */
async function hostContext(opts = {}) {
  const ctx = await chromium.launchPersistentContext(PROFILE, {
    headless: process.env.HEADED ? false : true,
    ...contextOptions(opts),
  });
  return wire(ctx);
}

let freshBrowser = null;
async function freshContext(opts = {}) {
  if (!freshBrowser) freshBrowser = await chromium.launch({ headless: true });
  const ctx = await freshBrowser.newContext(contextOptions(opts));
  return wire(ctx);
}

async function closeAll() {
  if (freshBrowser) await freshBrowser.close().catch(() => {});
  freshBrowser = null;
}

const COLORS = ['#8FB3D9', '#E7BE7A', '#D69B72', '#7E9BA9', '#A9C0D2', '#DEC08A', '#93A9BE', '#D9BB98', '#6E8B63', '#B08A5A'];
function stillSvg(n) {
  const c = COLORS[(n - 1) % COLORS.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="440" viewBox="0 0 640 440"><rect width="640" height="230" fill="${c}"/><rect y="230" width="640" height="210" fill="#4C6647"/><circle cx="200" cy="120" r="70" fill="rgba(255,255,255,.4)"/><text x="320" y="360" font-size="120" text-anchor="middle" fill="#fff" font-family="sans-serif">${n}</text></svg>`;
}

/**
 * Records dialogs, console errors, page errors and CSP reports. When STUB_FIXTURE is on, the
 * step-4 fixture captures (whose R2 objects were never uploaded) are answered with a drawn still —
 * ONLY the image bytes; the page, the reads and the saves are the live site's.
 */
function wire(ctx) {
  const log = { dialogs: [], errors: [], csp: [] };
  if (process.env.STUB_FIXTURE !== '0') {
    ctx.route('**/story-step4-fixture/**', (route) => {
      const m = route.request().url().match(/story-step4-fixture\/(\d+)/);
      return route.fulfill({ status: 200, contentType: 'image/svg+xml', body: stillSvg(m ? +m[1] : 1) });
    });
  }
  const watch = (page) => {
    page.on('dialog', (d) => {
      log.dialogs.push(`${d.type()}: ${d.message()}`);
      d.dismiss().catch(() => {});
    });
    page.on('console', (m) => {
      if (m.type() === 'error') log.errors.push(`console: ${m.text()}`);
    });
    page.on('pageerror', (err) => { log.errors.push(`pageerror: ${err.message}`); if (process.env.STACKS) console.log('   PAGEERROR', page.url(), '\n', (err.stack || '').split('\n').slice(0, 8).join('\n')); });
    page.on('request', (r) => {
      if (r.url().includes('/api/csp-report')) log.csp.push((r.postData() || '').slice(0, 300));
    });
  };
  ctx.pages().forEach(watch);
  ctx.on('page', watch);
  return { ctx, log };
}

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok: !!ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
  return !!ok;
}

async function dismissCookie(page) {
  const b = page.getByRole('button', { name: 'Essential only' });
  if (await b.count()) await b.first().click().catch(() => {});
  // A first visit to some host pages opens a guided tour; a person skips it.
  await page.waitForTimeout(400);
  const skip = page.locator('[role="dialog"][aria-labelledby="guided-tour-title"]').getByRole('button', { name: 'Skip tour' });
  if (await skip.count()) await skip.first().click().catch(() => {});
}

module.exports = { chromium, devices, BASE, PROFILE, OUT, hostContext, freshContext, closeAll, check, results, dismissCookie, stillSvg };
