// Opens a VISIBLE window on the live login page and waits for a PERSON to sign in.
// Nothing here types an email or a password. When the page leaves /login, the profile keeps the
// session and the window closes; the drive reuses the profile from then on.
//   E2E_PROFILE=<folder outside the repo> node signin.cjs
const { chromium, BASE, PROFILE } = require('./e2e-lib.cjs');

(async () => {
  const ctx = await chromium.launchPersistentContext(PROFILE, { headless: false, viewport: { width: 1100, height: 820 } });
  const page = ctx.pages()[0] || (await ctx.newPage());
  await page.goto(`${BASE}/login?next=/dashboard`, { waitUntil: 'domcontentloaded' });
  console.log('WAITING — sign in with the test account in the window that just opened.');
  // Back on OUR site and past the login + auth callback — a hop to an OAuth provider is not "signed in".
  const home = new URL(BASE).host;
  await page.waitForURL(
    (u) => u.host === home && !u.pathname.startsWith('/login') && !u.pathname.startsWith('/auth'),
    { timeout: 15 * 60_000 },
  );
  await page.waitForLoadState('domcontentloaded');
  console.log(`SIGNED IN — landed on ${new URL(page.url()).pathname}`);
  await page.waitForTimeout(1500);
  await ctx.close();
})().catch((e) => {
  console.error('signin failed:', e.message);
  process.exit(1);
});
