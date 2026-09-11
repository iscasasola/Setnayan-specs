// A/B on production: the same page, the same browser; only the user agent tells Next.js whether
// to STREAM the metadata (normal browser) or render it BLOCKING in <head> (a listed bot UA).
const L = require('./e2e-lib.cjs');
const slug = process.argv[2] || 'songdesk-story-proof';
const N = Number(process.env.N || 40);
(async () => {
  const browser = await L.chromium.launch({ headless: true });
  const base = (await (await browser.newPage()).evaluate(() => navigator.userAgent)).replace('HeadlessChrome', 'Chrome');
  for (const [label, ua] of [['streamed (normal UA)', base], ['blocking (UA + "Chrome-Lighthouse")', `${base} Chrome-Lighthouse`]]) {
    let bad = 0, metaInBody = 0;
    for (let i = 0; i < N; i += 1) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, userAgent: ua });
      const page = await ctx.newPage();
      let err = false;
      page.on('pageerror', (e) => { if (/418/.test(e.message)) err = true; });
      let html = '';
      page.on('response', async (r) => { if (r.url() === `${L.BASE}/${slug}` && r.request().resourceType() === 'document') html = await r.text().catch(() => ''); });
      await page.goto(`${L.BASE}/${slug}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(700);
      const bodyStart = html.indexOf('<body');
      if (bodyStart > 0 && /<title>/.test(html.slice(bodyStart))) metaInBody += 1;
      if (err) bad += 1;
      await ctx.close();
    }
    console.log(`${label}: #418 on ${bad} of ${N} loads · <title> streamed into <body> on ${metaInBody} of ${N}`);
  }
  await browser.close();
})();
