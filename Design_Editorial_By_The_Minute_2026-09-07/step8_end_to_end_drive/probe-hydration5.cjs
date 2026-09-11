// Catch React #418 on /[slug] and snapshot the DOM AT THE MOMENT it is reported (before React
// regenerates the tree), then diff that snapshot against the server's HTML and the final DOM.
const L = require('./e2e-lib.cjs');
const slug = process.argv[2] || 'songdesk-story-proof';
(async () => {
  const browser = await L.chromium.launch({ headless: true });
  for (let i = 0; i < 30; i += 1) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
    await ctx.addInitScript(() => {
      window.__snaps = [];
      window.addEventListener('error', (e) => {
        if (/418|419|423|425/.test(String(e.message || e.error?.message))) window.__snaps.push(document.body.outerHTML);
      }, true);
    });
    const page = await ctx.newPage();
    let html = '';
    page.on('response', async (r) => { if (r.url() === `${L.BASE}/${slug}` && r.request().resourceType() === 'document') html = await r.text().catch(() => ''); });
    await page.goto(`${L.BASE}/${slug}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const n = await page.evaluate(() => window.__snaps.length);
    if (!n) { console.log(`load ${i}: clean`); await ctx.close(); continue; }
    console.log(`load ${i}: #418 — ${n} snapshot(s)`);
    const d = await page.evaluate((h) => {
      const texts = (root) => { const out = []; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT); for (let n = w.nextNode(); n; n = w.nextNode()) { if (n.nodeType === 1) { if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|LINK|META)$/.test(n.tagName)) continue; const attrs = [...n.attributes].filter((a) => !/^(style|class)$/.test(a.name)).map((a) => `${a.name}=${a.value.slice(0, 40)}`).sort().join(' '); out.push(`<${n.tagName.toLowerCase()} ${attrs}>`); } else { const t = n.textContent.replace(/\s+/g, ' ').trim(); if (t && !/^(SCRIPT|STYLE)$/.test(n.parentElement?.tagName)) out.push(`"${t.slice(0, 60)}"`); } } return out; };
      const P = (s) => new DOMParser().parseFromString(s, 'text/html').body;
      const S = texts(P(h)), M = texts(P(window.__snaps[0]));
      const cnt = (a) => a.reduce((m, t) => m.set(t, (m.get(t) || 0) + 1), new Map());
      const sm = cnt(S), mm = cnt(M);
      return {
        inMomentNotServer: [...mm].filter(([t, n]) => (sm.get(t) || 0) < n).map(([t, n]) => `${n - (sm.get(t) || 0)}× ${t}`),
        inServerNotMoment: [...sm].filter(([t, n]) => (mm.get(t) || 0) < n).map(([t, n]) => `${n - (mm.get(t) || 0)}× ${t}`),
      };
    }, html);
    console.log('  AT THE ERROR, the page had (not in the server HTML):');
    d.inMomentNotServer.slice(0, 40).forEach((t) => console.log('    +', t.slice(0, 200)));
    console.log('  the server HTML had (gone at the error):');
    d.inServerNotMoment.slice(0, 40).forEach((t) => console.log('    -', t.slice(0, 200)));
    await ctx.close();
    break;
  }
  await browser.close();
})();
