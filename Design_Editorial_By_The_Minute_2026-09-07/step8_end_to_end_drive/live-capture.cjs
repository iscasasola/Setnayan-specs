// STEP 8 · the day itself: the host opens Papic and shoots, through the REAL web camera, on the live
// site. Chromium's fake camera plays E2E_CAMERA (an MJPEG of numbered scenes, 4 s each) so every
// photograph is a different, recognisable picture — real uploads to R2 through the app's own path.
//   E2E_EVENT=<event id> E2E_CAMERA=<file.mjpeg> node live-capture.cjs seats
//   E2E_EVENT=<event id> E2E_CAMERA=<file.mjpeg> E2E_SEAT=<claim token> SHOTS=4 CLIP=1 node live-capture.cjs shoot
const L = require('./e2e-lib.cjs');
const { BASE, OUT, check, results } = L;
const EV = process.env.E2E_EVENT;
const stage = process.argv[2];

async function cameraContext() {
  const ctx = await L.chromium.launchPersistentContext(L.PROFILE, {
    headless: !process.env.HEADED,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    permissions: ['camera', 'microphone'],
    args: [
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      `--use-file-for-fake-video-capture=${process.env.E2E_CAMERA}`,
    ],
  });
  const log = { errors: [], dialogs: [] };
  const watch = (p) => {
    p.on('pageerror', (e) => log.errors.push(e.message));
    p.on('console', (m) => { if (m.type() === 'error') log.errors.push(m.text()); });
    p.on('dialog', (d) => { log.dialogs.push(d.message()); d.dismiss().catch(() => {}); });
  };
  ctx.pages().forEach(watch);
  ctx.on('page', watch);
  return { ctx, log };
}

(async () => {
  const { ctx, log } = await cameraContext();
  const page = ctx.pages()[0] || (await ctx.newPage());
  if (stage === 'seats') {
    // The host opening Papic is what sets out the free cameras.
    await page.goto(`${BASE}/dashboard/${EV}/studio/papic`, { waitUntil: 'networkidle' });
    await L.dismissCookie(page);
    await page.goto(`${BASE}/dashboard/${EV}/studio/papic/crew`, { waitUntil: 'networkidle' });
    const links = await page.evaluate(() => [...document.querySelectorAll('a[href*="/papic/join/"], input[value*="/papic/join/"]')].map((e) => e.href || e.value));
    console.log('claim links on the crew page:', [...new Set(links)].length);
    await page.screenshot({ path: `${OUT}/capture-crew.png`, fullPage: true });
  }
  if (stage === 'shoot') {
    page.on('response', async (r) => {
      const req = r.request();
      if (req.method() !== 'POST' && req.method() !== 'PUT') return;
      const u = new URL(r.url());
      let body = '';
      if (req.headers()['next-action'] || u.pathname.startsWith('/api/')) body = (await r.text().catch(() => '')).slice(-260).replace(/\s+/g, ' ');
      console.log(`   ${req.method()} ${u.host === new URL(BASE).host ? u.pathname : u.host} → ${r.status()} ${body}`);
    });
    await page.goto(`${BASE}/papic/join/${process.env.E2E_SEAT}?kind=seat`, { waitUntil: 'networkidle' });
    await L.dismissCookie(page);
    await page.screenshot({ path: `${OUT}/capture-claim.png` });
    // The join door says "Opening your camera…" with a Continue — a person taps it.
    if (/\/papic\/join\//.test(page.url())) {
      const cont = page.getByRole('link', { name: /Continue/ }).or(page.getByRole('button', { name: /Continue/ })).first();
      if (await cont.count()) await cont.tap({ timeout: 5000 }).catch(() => {}); // it may already be on its way
      await page.waitForURL((u) => !/\/papic\/join\//.test(u.pathname), { timeout: 30_000 }).catch(() => {});
      await page.waitForLoadState('networkidle');
    }
    const claim = page.getByRole('button', { name: /Claim my seat|Start shooting/ }).first();
    if (/\/papic\/claim\//.test(page.url())) {
      await claim.waitFor({ timeout: 30_000 });
      await claim.tap();
      await page.waitForURL(/\/papic\/seat\//, { timeout: 60_000 }).catch(async () => {
        await page.screenshot({ path: `${OUT}/capture-claim-after.png` });
        console.log('after claim at', page.url(), (await page.locator('main').innerText().catch(() => '')).slice(0, 400));
      });
    }
    check('shoot · the seat camera opens', /\/papic\/seat\//.test(page.url()), new URL(page.url()).pathname);
    const shutter = page.getByRole('button', { name: 'Take a photo', exact: true });
    await shutter.waitFor({ state: 'attached', timeout: 60_000 });
    // The round shutter is disabled until the camera is live.
    await page.waitForFunction(() => { const b = document.querySelector('button[aria-label^="Tap to take a photo"]'); return b && !b.disabled; }, null, { timeout: 30_000 }).catch(async (e) => {
      await page.screenshot({ path: `${OUT}/capture-not-ready.png` });
      console.log('camera not ready:', (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 600));
      console.log('errors:', log.errors.slice(0, 5));
      throw e;
    });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/capture-seat-${Date.now()}.png` });
    const shots = Number(process.env.SHOTS || 4);
    const gap = Number(process.env.GAP_MS || 4200);
    let taken = 0;
    for (let i = 0; i < shots; i += 1) {
      await shutter.dispatchEvent('click');
      taken += 1;
      console.log(`  shutter ${taken} at ${new Date().toISOString()}`);
      await page.waitForTimeout(gap);
    }
    if (process.env.CLIP) {
      const rec = page.getByRole('button', { name: 'Record a 10-second clip', exact: true });
      if (await rec.count()) {
        await rec.dispatchEvent('click');
        await page.waitForTimeout(5000);
        const stop = page.getByRole('button', { name: 'Stop recording', exact: true });
        if (await stop.count()) await stop.dispatchEvent('click');
        console.log('  clip recorded (5 s)');
      } else console.log('  (clips are off on this seat)');
    }
    await page.waitForTimeout(8000); // uploads finish
    await page.screenshot({ path: `${OUT}/capture-seat-after.png` });
    check('shoot · no page errors on the camera', log.errors.length === 0, log.errors.join(' | ').slice(0, 500));
    check('shoot · no dialogs', log.dialogs.length === 0, log.dialogs.join(' | '));
  }
  await ctx.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length} passed · ${failed.length} failed`);
})().catch((e) => { console.error('CRASHED', e); process.exit(2); });
