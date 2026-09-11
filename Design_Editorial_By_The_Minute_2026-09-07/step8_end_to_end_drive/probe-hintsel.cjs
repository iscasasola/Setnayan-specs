const L = require('./e2e-lib.cjs');
(async () => {
  const { ctx } = await L.hostContext({});
  const page = ctx.pages()[0] || (await ctx.newPage());
  await page.goto(`${L.BASE}/dashboard/0ccc7aa3-3a81-43ee-b170-afb194e0b259/story`, { waitUntil: 'networkidle' });
  console.log(await page.evaluate(() => [...document.querySelectorAll('[role="status"][aria-live="polite"]')].map((e) => `${e.tagName}.${String(e.className).slice(0, 50)} in-body-end:${e.parentElement?.parentElement === document.body}`)));
  await ctx.close();
})();
