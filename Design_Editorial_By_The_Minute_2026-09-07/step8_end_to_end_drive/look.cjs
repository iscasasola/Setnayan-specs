// A first look: the live Story Maker's "The story" step as the signed-in host.
const { hostContext, BASE, OUT, dismissCookie } = require('./e2e-lib.cjs');
const EV = process.env.E2E_EVENT || '0ccc7aa3-3a81-43ee-b170-afb194e0b259';
(async () => {
  const phone = process.argv.includes('phone');
  const { ctx, log } = await hostContext({ phone });
  const page = ctx.pages()[0] || (await ctx.newPage());
  const t0 = Date.now();
  await page.goto(`${BASE}/dashboard/${EV}/story`, { waitUntil: 'networkidle', timeout: 120000 });
  console.log('loaded in', Date.now() - t0, 'ms at', new URL(page.url()).pathname);
  await dismissCookie(page);
  const steps = await page.evaluate(() => [...document.querySelectorAll('nav[aria-label="Story Maker steps"] button, [role=tab]')].map((b) => b.textContent.trim().replace(/\s+/g, ' ')));
  console.log('steps:', JSON.stringify(steps));
  const story = page.locator('nav[aria-label="Story Maker steps"] button, [role=tab]').filter({ hasText: 'The story', visible: true }).first();
  if (await story.count()) await story.click();
  await page.waitForSelector('section[aria-labelledby="make-it-yours-title"]', { timeout: 30000 }).catch(() => console.log('NO make-it-yours section'));
  await page.waitForTimeout(1500);
  const f = await page.evaluate(() => {
    const root = document.querySelector('section[aria-labelledby="make-it-yours-title"]');
    if (!root) return null;
    return {
      moments: [...root.querySelectorAll('[data-moment]')].map((b) => b.textContent.trim().replace(/\s+/g, ' ')),
      mode: [...root.querySelectorAll('[role=group][aria-label="How moments are made"] button')].map((b) => `${b.textContent.trim()}:${b.getAttribute('aria-pressed')}`),
      onPage: root.querySelectorAll('[data-obj]').length,
      tray: root.querySelectorAll('[data-film]').length,
      imgs: [...root.querySelectorAll('img')].map((i) => `${i.naturalWidth}x${i.naturalHeight}`).slice(0, 12),
      status: [...root.querySelectorAll('[role=status]')].map((s) => s.textContent.trim()),
      scrollW: document.documentElement.scrollWidth,
    };
  });
  console.log(JSON.stringify(f, null, 1));
  await page.screenshot({ path: `${OUT}/look-${phone ? 'phone' : 'desk'}.png`, fullPage: false });
  console.log('dialogs', log.dialogs.length, 'errors', JSON.stringify(log.errors.slice(0, 8)), 'csp', log.csp.length);
  await ctx.close();
})();
