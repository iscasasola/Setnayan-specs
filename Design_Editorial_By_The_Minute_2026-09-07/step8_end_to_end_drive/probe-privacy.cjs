const L = require('./e2e-lib.cjs');
(async () => {
  const { ctx } = await L.hostContext({});
  const page = ctx.pages()[0] || (await ctx.newPage());
  await page.goto(`${L.BASE}/dashboard/0ccc7aa3-3a81-43ee-b170-afb194e0b259/website/privacy`, { waitUntil: 'networkidle' });
  await L.dismissCookie(page);
  console.log(await page.evaluate(() => [...document.querySelectorAll('input[name="visibility"]')].map((i) => `${i.value}:${i.checked}:${i.defaultChecked}`).join(' ')));
  console.log(await page.evaluate(() => [...document.querySelectorAll('label')].filter((l) => /Current/.test(l.textContent)).map((l) => l.textContent.slice(0, 60))));
  await page.screenshot({ path: `${L.OUT}/probe-privacy.png` });
  await ctx.close();
})();
