// The hand-arranged moment as a signed-out visitor sees it, at 1280 and 390.
const L = require('./e2e-lib.cjs');
(async () => {
  for (const phone of [false, true]) {
    const { ctx } = await L.freshContext({ phone });
    const page = await ctx.newPage();
    await page.goto(`${L.BASE}/songdesk-story-proof`, { waitUntil: 'networkidle' });
    await L.dismissCookie(page);
    const art = page.locator('article', { has: page.locator('text=as the') }).filter({ hasText: 'First Dance' }).first();
    const n = await page.locator('article').filter({ hasText: /First Dance/i }).count();
    const target = n ? page.locator('article').filter({ hasText: /First Dance/i }).first() : art;
    await target.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await target.screenshot({ path: `${L.OUT}/public-first-dance-${phone ? 'phone' : 'desk'}.png` });
    console.log(phone ? 'phone' : 'desk', 'articles with First Dance:', n, '· sheet text:', (await target.innerText()).replace(/\s+/g, ' ').slice(0, 160));
    await ctx.close();
  }
  await L.closeAll();
})();
