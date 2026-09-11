// Catch React #418 and print EVERYTHING the error carries: stack, cause, digest, and any
// component stack React/Next attach — via a reportError hook installed before any script runs.
const L = require('./e2e-lib.cjs');
const slug = process.argv[2] || 'songdesk-story-proof';
(async () => {
  const browser = await L.chromium.launch({ headless: true });
  for (let i = 0; i < 40; i += 1) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
    await ctx.addInitScript(() => {
      window.__caught = [];
      const keep = (err, where) => {
        try {
          window.__caught.push({ where, msg: String(err && err.message), stack: String(err && err.stack), cause: err && err.cause ? String(err.cause.stack || err.cause) : null, digest: err && err.digest, keys: err ? Object.getOwnPropertyNames(err) : [] });
        } catch {}
      };
      const orig = window.reportError;
      window.reportError = function (e) { keep(e, 'reportError'); return orig && orig.call(window, e); };
      const oce = console.error;
      console.error = function (...a) { if (a.some((x) => /418|hydrat/i.test(String(x && (x.message || x))))) keep(a[0] instanceof Error ? a[0] : new Error(a.map(String).join(' ')), 'console.error:' + a.slice(1).map((x) => String(x).slice(0, 2000)).join(' || ')); return oce.apply(console, a); };
    });
    const page = await ctx.newPage();
    await page.goto(`${L.BASE}/${slug}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const c = await page.evaluate(() => window.__caught);
    if (!c.length) { process.stdout.write('.'); await ctx.close(); continue; }
    console.log(`\nload ${i}: caught ${c.length}`);
    for (const e of c) console.log(JSON.stringify(e, null, 1).slice(0, 6000));
    await ctx.close();
    break;
  }
  await browser.close();
})();
