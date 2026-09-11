// Dump a host page's form controls and buttons (to drive it like a person would).
const L = require('./e2e-lib.cjs');
(async () => {
  const { ctx } = await L.hostContext({});
  const page = ctx.pages()[0] || (await ctx.newPage());
  await page.goto(`${L.BASE}${process.argv[2]}`, { waitUntil: 'networkidle' });
  await L.dismissCookie(page);
  console.log('at', new URL(page.url()).pathname);
  const out = await page.evaluate(() => {
    const vis = (e) => !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
    const lab = (e) => (e.labels && e.labels[0] && e.labels[0].textContent.trim().slice(0, 50)) || e.getAttribute('aria-label') || e.placeholder || '';
    const f = [...document.querySelectorAll('main input, main select, main textarea')].filter(vis).map((e) => `${e.tagName.toLowerCase()}[${e.type || ''}] name=${e.name} id=${e.id} "${lab(e)}" = ${e.type === 'radio' || e.type === 'checkbox' ? e.value + (e.checked ? ' ✓' : '') : e.value}`);
    const b = [...document.querySelectorAll('main button, main a[role=button]')].filter(vis).map((e) => `button "${(e.getAttribute('aria-label') || e.textContent).trim().replace(/\s+/g, ' ').slice(0, 60)}"`);
    return [...f, ...b];
  });
  out.forEach((l) => console.log('  ', l));
  await page.screenshot({ path: `${L.OUT}/probe-form.png`, fullPage: true });
  await ctx.close();
})();
