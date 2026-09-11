// Prints which account the saved profile is signed in as (reads the page, never a cookie).
const { hostContext, BASE } = require('./e2e-lib.cjs');
(async () => {
  const { ctx } = await hostContext();
  const page = ctx.pages()[0] || (await ctx.newPage());
  await page.goto(`${BASE}/dashboard/profile`, { waitUntil: 'domcontentloaded' });
  const html = (await page.content()).replace(/\\+"/g, '"');
  const m = html.match(/"userId":"([^"]+)","displayName":"[^"]*","email":"([^"]+)"/);
  console.log('path', new URL(page.url()).pathname, '· signed in as', m ? `${m[2]} (${m[1]})` : '(none found)');
  await ctx.close();
})();
