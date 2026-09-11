// Which text does the server send that the browser draws differently? (React #418 on /[slug], signed out)
const L = require('./e2e-lib.cjs');
const slug = process.argv[2] || 'songdesk-story-proof';
(async () => {
  const { ctx, log } = await L.freshContext({ phone: process.argv.includes('phone') });
  const page = await ctx.newPage();
  let serverHtml = '';
  page.on('response', async (r) => { if (r.url() === `${L.BASE}/${slug}` && r.request().resourceType() === 'document') serverHtml = await r.text().catch(() => ''); });
  await page.goto(`${L.BASE}/${slug}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const diff = await page.evaluate((html) => {
    const texts = (root) => {
      const out = [];
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        const p = n.parentElement;
        if (!p || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(p.tagName)) continue;
        const t = n.textContent.replace(/\s+/g, ' ').trim();
        if (t) out.push(`${p.tagName.toLowerCase()}${p.getAttribute('data-sn') ? '' : ''}: ${t}`);
      }
      return out;
    };
    const server = texts(new DOMParser().parseFromString(html, 'text/html').body);
    const client = texts(document.body);
    const count = (a) => a.reduce((m, t) => m.set(t, (m.get(t) || 0) + 1), new Map());
    const S = count(server), C = count(client);
    const onlyC = [...C].filter(([t, n]) => (S.get(t) || 0) < n).map(([t]) => t);
    const onlyS = [...S].filter(([t, n]) => (C.get(t) || 0) < n).map(([t]) => t);
    return { onlyC: onlyC.slice(0, 40), onlyS: onlyS.slice(0, 40), nS: server.length, nC: client.length };
  }, serverHtml);
  console.log('errors:', log.errors.map((e) => e.slice(0, 120)));
  console.log(`text nodes: server ${diff.nS} · client ${diff.nC}`);
  console.log('--- client only:'); diff.onlyC.forEach((t) => console.log('  C>', t.slice(0, 160)));
  console.log('--- server only:'); diff.onlyS.forEach((t) => console.log('  S>', t.slice(0, 160)));
  await ctx.close();
  await L.closeAll();
})();
