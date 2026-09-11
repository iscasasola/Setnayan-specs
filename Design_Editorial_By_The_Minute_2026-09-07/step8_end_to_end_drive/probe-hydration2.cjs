// Force a fresh render of /[slug] (the host re-saves Public → revalidatePath), then load it signed
// out at once and diff the server's text against the drawn text when React reports #418.
const L = require('./e2e-lib.cjs');
const slug = 'songdesk-story-proof';
const EV = '0ccc7aa3-3a81-43ee-b170-afb194e0b259';
async function bust() {
  const { ctx } = await L.hostContext({});
  const page = ctx.pages()[0] || (await ctx.newPage());
  await page.goto(`${L.BASE}/dashboard/${EV}/website/privacy`, { waitUntil: 'networkidle' });
  await L.dismissCookie(page);
  await page.locator('label:has(input[name="visibility"][value="public"])').first().click();
  await page.getByRole('button', { name: 'Save changes' }).first().click();
  await page.waitForURL(/saved=1/, { timeout: 30000 }).catch(() => {});
  await ctx.close();
}
(async () => {
  for (let i = 0; i < 3; i += 1) {
    await bust();
    for (const who of ['stranger-1', 'stranger-2']) {
      const { ctx, log } = await L.freshContext({ phone: i === 2 });
      const page = await ctx.newPage();
      let serverHtml = '';
      page.on('response', async (r) => { if (r.url() === `${L.BASE}/${slug}` && r.request().resourceType() === 'document') { serverHtml = await r.text().catch(() => ''); console.log(`   ${who} x-vercel-cache=${r.headers()['x-vercel-cache']} age=${r.headers()['age']}`); } });
      await page.goto(`${L.BASE}/${slug}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      const diff = await page.evaluate((html) => {
        const texts = (root) => { const out = []; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); for (let n = w.nextNode(); n; n = w.nextNode()) { const p = n.parentElement; if (!p || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(p.tagName)) continue; const t = n.textContent.replace(/\s+/g, ' ').trim(); if (t) out.push(`${p.tagName.toLowerCase()}.${(p.className || '').toString().split(' ')[0]}: ${t}`); } return out; };
        const S = texts(new DOMParser().parseFromString(html, 'text/html').body), C = texts(document.body);
        const count = (a) => a.reduce((m, t) => m.set(t, (m.get(t) || 0) + 1), new Map());
        const sm = count(S), cm = count(C);
        return { c: [...cm].filter(([t, n]) => (sm.get(t) || 0) < n).map(([t]) => t), s: [...sm].filter(([t, n]) => (cm.get(t) || 0) < n).map(([t]) => t) };
      }, serverHtml);
      const bad = log.errors.filter((e) => /418|419|423|425|hydrat/i.test(e));
      console.log(`round ${i} ${who}: ${bad.length ? 'HYDRATION ERROR' : 'clean'}`);
      if (bad.length) {
        diff.c.filter((t) => !/ookie|Accept all|Essential only|Manage|^p\.: \.$/.test(t)).forEach((t) => console.log('   C>', t.slice(0, 170)));
        diff.s.forEach((t) => console.log('   S>', t.slice(0, 170)));
      }
      await ctx.close();
    }
  }
  await L.closeAll();
})();
