// Does the visitor's time zone decide React #418 on /[slug]? Same page, same visitor, two zones.
const L = require('./e2e-lib.cjs');
const slug = process.argv[2] || 'songdesk-story-proof';
(async () => {
  const browser = await L.chromium.launch({ headless: true });
  for (const tz of (process.env.TZS || 'UTC,Asia/Manila,UTC,Asia/Manila,UTC,Asia/Manila').split(',')) {
    for (const dark of [false, true]) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, timezoneId: tz, colorScheme: dark ? 'dark' : 'light' });
      const page = await ctx.newPage();
      const errs = [];
      page.on('pageerror', (e) => errs.push(e.message.slice(0, 40)));
      await page.goto(`${L.BASE}/${slug}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      console.log(`${tz.padEnd(12)} ${dark ? 'dark ' : 'light'} → ${errs.length ? errs.join(' | ') : 'clean'}`);
      await ctx.close();
    }
  }
  await browser.close();
})();
