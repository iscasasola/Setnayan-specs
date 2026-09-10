// Shared harness for driving "Make it yours" in a real browser.
// stubs the fixture captures' image bytes, and records every dialog and console error.
const { createRequire } = require('node:module');
const fs = require('node:fs');
const path = require('node:path');

const WT = '/Users/icecasasola/Documents/Claude/Projects/wt-make-it-yours/apps/web';
const req = createRequire(path.join(WT, 'package.json'));
const { chromium, devices } = require('/Users/icecasasola/Documents/Claude/Projects/wt-make-it-yours/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright');

function env() {
  const out = {};
  for (const line of fs.readFileSync(path.join(WT, '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^"|"$/g, '');
  }
  return out;
}

const BASE = 'http://localhost:3000';

const COLORS = ['#8FB3D9', '#E7BE7A', '#D69B72', '#7E9BA9', '#A9C0D2', '#DEC08A', '#93A9BE', '#D9BB98', '#6E8B63', '#B08A5A'];
function stillSvg(n) {
  const c = COLORS[(n - 1) % COLORS.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="440" viewBox="0 0 640 440"><rect width="640" height="230" fill="${c}"/><rect y="230" width="640" height="210" fill="#4C6647"/><circle cx="200" cy="120" r="70" fill="rgba(255,255,255,.4)"/><text x="320" y="360" font-size="120" text-anchor="middle" fill="#fff" font-family="sans-serif">${n}</text></svg>`;
}

/**
 * A browser context that is signed in, answers the fixture stills with a drawn picture, and
 * records dialogs + console errors + page errors.
 */
async function openContext(browser, { phone = false } = {}) {
  const opts = phone
    ? { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } }
    : { viewport: { width: 1280, height: 860 } };
  const ctx = await browser.newContext(opts);
  await ctx.route('**/story-step4-fixture/**', (route) => {
    const m = route.request().url().match(/story-step4-fixture\/(\d+)/);
    return route.fulfill({ status: 200, contentType: 'image/svg+xml', body: stillSvg(m ? +m[1] : 1) });
  });
  const log = { dialogs: [], errors: [] };
  ctx.on('page', (p) => watch(p, log));
  return { ctx, log };
}

function watch(page, log) {
  page.on('dialog', (d) => {
    log.dialogs.push(`${d.type()}: ${d.message()}`);
    d.dismiss().catch(() => {});
  });
  page.on('console', (m) => {
    if (m.type() === 'error') log.errors.push(`console: ${m.text()}`);
  });
  page.on('pageerror', (err) => log.errors.push(`pageerror: ${err.message}`));
  page.on('request', (r) => {
    if (r.url().includes('/api/csp-report')) log.errors.push(`csp-report: ${(r.postData() || '').slice(0, 300)}`);
  });
}

module.exports = { chromium, devices, BASE, openContext, watch, WT };
