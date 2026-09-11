// Load /[slug] signed out until React reports #418, then diff server vs client DOM by ELEMENT
// (tag + attributes + own text), not just text.
const L = require('./e2e-lib.cjs');
const slug = process.argv[2] || 'songdesk-story-proof';
(async () => {
  const browser = await L.chromium.launch({ headless: true });
  for (let i = 0; i < 16; i += 1) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, colorScheme: i % 2 ? 'dark' : 'light' });
    const page = await ctx.newPage();
    const errs = [];
    let html = '';
    page.on('pageerror', (e) => errs.push(e.message.slice(0, 60)));
    page.on('response', async (r) => { if (r.url() === `${L.BASE}/${slug}` && r.request().resourceType() === 'document') html = await r.text().catch(() => ''); });
    await page.goto(`${L.BASE}/${slug}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    if (!errs.length) { console.log(`load ${i}: clean`); await ctx.close(); continue; }
    console.log(`load ${i}: ${errs.join(' | ')}`);
    const d = await page.evaluate((h) => {
      const sig = (root) => {
        const out = [];
        for (const e of root.querySelectorAll('body *')) {
          if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|LINK|META)$/.test(e.tagName)) continue;
          const attrs = [...e.attributes].filter((a) => !/^(style)$/.test(a.name)).map((a) => `${a.name}=${a.value.slice(0, 50)}`).sort().join(' ');
          const own = [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('').slice(0, 50);
          out.push(`<${e.tagName.toLowerCase()} ${attrs}>${own}`);
        }
        return out;
      };
      const doc = new DOMParser().parseFromString(h, 'text/html');
      // Streamed boundaries arrive as hidden <div id="S:n"> and are moved into place by $RC; drop the
      // fallback templates and count the streamed content where it will land.
      const S = sig(doc), C = sig(document);
      const cnt = (a) => a.reduce((m, t) => m.set(t, (m.get(t) || 0) + 1), new Map());
      const sm = cnt(S), cm = cnt(C);
      return {
        c: [...cm].filter(([t, n]) => (sm.get(t) || 0) < n).map(([t, n]) => `${n - (sm.get(t) || 0)}× ${t}`),
        s: [...sm].filter(([t, n]) => (cm.get(t) || 0) < n).map(([t, n]) => `${n - (cm.get(t) || 0)}× ${t}`),
      };
    }, html);
    const noise = /ookie|Accept all|Essential only|Manage|guided-tour|sn-skel|aria-busy|Loading your invitation|animate-pulse|bg-ink\/\[0.06\]|<title |max-w-3xl px-4 py-10|flex-col items-center text-center|<h1 class=mt-3 font-display/;
    console.log('  CLIENT has, server did not:'); d.c.filter((t) => !noise.test(t)).slice(0, 25).forEach((t) => console.log('   C', t.slice(0, 220)));
    console.log('  SERVER had, client does not:'); d.s.filter((t) => !noise.test(t)).slice(0, 25).forEach((t) => console.log('   S', t.slice(0, 220)));
    await ctx.close();
    break;
  }
  await browser.close();
})();
