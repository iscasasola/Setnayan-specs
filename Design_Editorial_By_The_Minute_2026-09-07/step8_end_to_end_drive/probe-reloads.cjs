// Reload the live Story Maker N times (as the host) and report any page error per load.
const L = require('./e2e-lib.cjs');
(async () => {
  const phone = process.argv.includes('phone');
  const { ctx, log } = await L.hostContext({ phone });
  const page = ctx.pages()[0] || (await ctx.newPage());
  const N = Number(process.env.N || 20);
  let bad = 0;
  for (let i = 0; i < N; i += 1) {
    const before = log.errors.length;
    await page.goto(`${L.BASE}/dashboard/0ccc7aa3-3a81-43ee-b170-afb194e0b259/story`, { waitUntil: 'networkidle' });
    await L.dismissCookie(page);
    await page.locator('nav[aria-label="Story Maker steps"] button, [role=tab]').filter({ hasText: 'The story', visible: true }).first().click();
    await page.waitForTimeout(800);
    if (log.errors.length > before) { bad += 1; console.log(`load ${i}:`, log.errors.slice(before).join(' | ').slice(0, 300)); }
  }
  console.log(`${bad} of ${N} loads had a page error`);
  await ctx.close();
})();
