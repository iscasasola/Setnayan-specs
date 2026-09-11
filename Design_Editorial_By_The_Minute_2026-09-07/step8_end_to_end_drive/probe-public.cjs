// Signed out: every og:image meta, and any page error, on several public celebration pages.
const L = require('./e2e-lib.cjs');
(async () => {
  for (const slug of (process.argv[2] || 'songdesk-story-proof,movie-night,cale-ice,ana-miguel').split(',')) {
    const { ctx, log } = await L.freshContext({});
    const page = await ctx.newPage();
    const r = await page.goto(`${L.BASE}/${slug}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    const metas = await page.evaluate(() => [...document.querySelectorAll('meta[property^="og:image"], meta[name^="twitter:image"]')].map((m) => `${m.getAttribute('property') || m.getAttribute('name')}=${m.content}`));
    console.log(`${slug} · HTTP ${r.status()} · errors ${log.errors.length ? log.errors.map((e) => e.slice(0, 90)).join(' | ') : 'none'}`);
    for (const m of metas) console.log('   ', m);
    await ctx.close();
  }
  await L.closeAll();
})();
