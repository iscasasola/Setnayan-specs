// Which ancestor turns the hint's position:fixed into a local box on the live page?
const { hostContext, BASE } = require('./e2e-lib.cjs');
const EV = '0ccc7aa3-3a81-43ee-b170-afb194e0b259';
(async () => {
  const { ctx } = await hostContext({ phone: process.argv.includes('phone') });
  const page = ctx.pages()[0] || (await ctx.newPage());
  await page.goto(`${BASE}/dashboard/${EV}/story`, { waitUntil: 'networkidle' });
  await page.locator('nav[aria-label="Story Maker steps"] button, [role=tab]').filter({ hasText: 'The story', visible: true }).first().click();
  await page.waitForSelector('section[aria-labelledby="make-it-yours-title"]');
  const out = await page.evaluate(() => {
    const h = document.querySelector('[role="status"][aria-live="polite"]');
    const res = [];
    for (let e = h.parentElement; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      const why = ['transform', 'filter', 'backdropFilter', 'perspective', 'contain', 'containerType', 'willChange', 'contentVisibility']
        .map((k) => [k, cs[k]])
        .filter(([k, v]) => v && !['none', 'normal', 'auto', 'visible'].includes(v));
      if (why.length) res.push(`${e.tagName}.${(e.className || '').toString().slice(0, 60)} ${JSON.stringify(why)}`);
    }
    return { pos: getComputedStyle(h).position, rect: h.getBoundingClientRect().toJSON(), res };
  });
  console.log(JSON.stringify(out, null, 1));
  await ctx.close();
})();
