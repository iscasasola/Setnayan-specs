// Patch production's react-dom chunk IN THE TEST BROWSER ONLY: at throwOnHydrationMismatch (rD),
// record the fiber React was hydrating (its component path, props) and the DOM node it found (rN).
const L = require('./e2e-lib.cjs');
const slug = process.argv[2] || 'songdesk-story-proof';
const fs = require('node:fs');
let PATCHED = fs.readFileSync(process.env.REACTDOM, 'utf8');
for (const [from, to] of [
  ['function rD(e){', 'function rD(e){try{window.__hmLog&&window.__hmLog(e,rN,rP)}catch(_){}'],
  ['case 27:return K(n),null===e&&rL&&(', 'case 27:return window.__hl&&window.__hl("enter",n.type,rN,sD,null===e,rL,n.pendingProps),K(n),null===e&&rL&&('],
  ['27===t?(t=rN,sz(e.type)?(e=sD,sD=null,rN=e):rN=t)', '27===t?(window.__hl&&window.__hl("pop",e.type,rN,sD),t=rN,sz(e.type)?(e=sD,sD=null,rN=e):rN=t)'],
  ['throw ld=n,la}}function lf(e){', 'throw window.__sus&&window.__sus("use",n),ld=n,la}}function lf(e){'],
  ['if(null!==e&&"object"==typeof e&&"function"==typeof e.then)throw ld=e,la;throw e}}var ld=null;', 'if(null!==e&&"object"==typeof e&&"function"==typeof e.then)throw window.__sus&&window.__sus("lazy",e),ld=e,la;throw e}}var ld=null;'],
  ['case 26:case 27:case 5:return Y(n),null;case 31:', 'case 26:case 27:case 5:return 27===n.tag&&window.__hl&&window.__hl("UNWIND",n.type,rN,sD),Y(n),null;case 31:'],
]) {
  if (!PATCHED.includes(from)) throw new Error('patch anchor missing: ' + from.slice(0, 40));
  PATCHED = PATCHED.replace(from, to);
}
(async () => {
  const browser = await L.chromium.launch({ headless: true });
  let found = 0;
  for (let i = 0; i < 90; i += 1) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
    await ctx.addInitScript(() => {
      window.__hm = [];
      window.__hlog = [];
      const dn = (n) => !n ? 'null' : n.nodeType === 1 ? `${n.parentNode === document.head ? 'head>' : n.parentNode === document.body ? 'body>' : ''}<${n.tagName.toLowerCase()}${n.id ? '#' + n.id : ''}>` : n.nodeType === 8 ? `<!--${n.data}-->` : n.nodeName;
      window.__sus = (kind, t) => {
        if (window.__hlog.length > 5000 && window.__suslog && window.__suslog.length > 20) return;
        (window.__suslog ||= []).push(`${Math.round(performance.now())}ms SUSPEND ${kind} status=${t && t.status} keys=${t ? Object.keys(t).join('|').slice(0, 80) : ''} value=${t && t.value !== undefined ? String(typeof t.value === 'object' ? JSON.stringify(t.value)?.slice(0, 160) : t.value).slice(0, 160) : ''} reason=${t && t.reason ? String(t.reason).slice(0, 120) : ''} stack=${new Error().stack.split('\n').slice(2, 7).map((l) => l.trim().replace(/https:\/\/[^ ]*\/chunks\//, '').replace(/\?dpl=[^:]*/, '')).join(' < ')}`);
      };
      window.__headKids = null;
      const kid = (c) => c == null || c === false ? String(c) : typeof c !== 'object' ? `${typeof c}(${String(c).length})` : Array.isArray(c) ? `[${c.map(kid).join(', ')}]` : c.$$typeof ? `${String(c.$$typeof).replace(/Symbol\(react\.|\)/g, '')}:${typeof c.type === 'string' ? c.type : c.type && (c.type.displayName || c.type.name) || (c._payload ? 'payload:' + (c._payload.status || '?') : '?')}${c.props && c.props.dangerouslySetInnerHTML ? '(html ' + String(c.props.dangerouslySetInnerHTML.__html).length + ')' : ''}${c.props && c.props.rel ? '(' + c.props.rel + ')' : ''}` : c.then ? `thenable:${c.status}` : 'obj';
      window.__hl = (what, type, rN, sD, mount, hyd, props) => { if (type === 'head' && what === 'enter' && props && !window.__headKids) window.__headKids = kid(props.children); window.__hlog.push(`${Math.round(performance.now())}ms ${what} ${type} cursor=${dn(rN)} saved=${dn(sD)}${mount === undefined ? '' : ` mount=${mount} hydrating=${hyd}`}`); };
      window.__mut = [];
      const d = (n) => n.nodeType === 1 ? `<${n.tagName.toLowerCase()}${n.id ? '#' + n.id : ''}${n.className && typeof n.className === 'string' ? '.' + n.className.slice(0, 25) : ''}>` : n.nodeType === 8 ? `<!--${n.data.slice(0, 12)}-->` : n.nodeType === 3 ? `#text(${n.textContent.length})` : n.nodeName;
      const t0 = performance.now();
      new MutationObserver((ms) => {
        for (const m of ms) {
          if (m.type !== 'childList') continue;
          const tgt = m.target;
          if (!(tgt === document.body || tgt === document.head || tgt === document.documentElement || (tgt.classList && tgt.classList.contains('sn-editorial')))) continue;
          window.__mut.push(`${Math.round(performance.now() - t0)}ms ${d(tgt)} +[${[...m.addedNodes].map(d).join(',')}] -[${[...m.removedNodes].map(d).join(',')}]`);
        }
      }).observe(document, { childList: true, subtree: true });
      window.__t0 = t0;
      window.__rc = [];
      let _rc;
      Object.defineProperty(window, '$RC', { configurable: true, get() { return _rc && function (b, c) { window.__rc.push(`${b}←${c}@${Math.round(performance.now() - t0)}`); return _rc.apply(this, arguments); }; }, set(v) { _rc = v; } });
      window.__hmLog = (fiber, next, parent) => {
        const name = (f) => (typeof f.type === 'string' ? f.type : f.type && (f.type.displayName || f.type.name)) || `tag${f.tag}`;
        const path = [];
        for (let f = fiber, k = 0; f && k < 60; f = f.return, k += 1) {
          const p = f.memoizedProps || f.pendingProps || {};
          path.push(`${name(f)}${p.className ? '.' + String(p.className).slice(0, 50) : ''}${p.id ? '#' + p.id : ''}${f.key ? ' key=' + f.key : ''}${p['data-story-entry'] !== undefined ? ' [story-entry]' : ''}`);
        }
        const pp = fiber.pendingProps || {};
        window.__hm.push({
          at: Math.round(performance.now() - window.__t0),
          hlogCount: window.__hlog.length,
          headKids: window.__headKids,
          suslog: (window.__suslog || []).slice(0, 12),
          hlogHead: window.__hlog.slice(0, 6),
          hlogTail: window.__hlog.slice(-14),
          alternate: !!fiber.alternate,
          stack: new Error().stack.split('\n').slice(2, 14).map((l) => l.trim().replace(/https:\/\/[^ ]*\/chunks\//, '').replace(/\?dpl=[^:]*/, '')).join(' < '),
          rc: (window.__rc || []).slice(),
          suspenseAncestors: (() => { const o = []; for (let f = fiber.return, k = 0; f && k < 80; f = f.return, k += 1) if (f.tag === 13) o.push(`susp(${f.memoizedState ? (f.memoizedState.dehydrated ? 'dehydrated' : 'state') : 'none'})`); return o.join(','); })(),
          fiber: name(fiber),
          props: Object.fromEntries(Object.entries(pp).filter(([k, v]) => k !== 'children' || typeof v === 'string').map(([k, v]) => [k, String(typeof v === 'function' ? 'fn' : typeof v === 'object' ? JSON.stringify(v)?.slice(0, 80) : v).slice(0, 120)])),
          childrenType: Array.isArray(pp.children) ? `array(${pp.children.length})` : typeof pp.children,
          found: next ? (next.nodeType === 3 ? `#text "${next.textContent.slice(0, 80)}"` : next.outerHTML ? next.outerHTML.slice(0, 300) : String(next.nodeName)) : 'NOTHING (end of parent)',
          foundParent: next && next.parentNode && next.parentNode.outerHTML ? next.parentNode.outerHTML.slice(0, 200) : null,
          path: path.slice(0, 40),
          hydrationParent: parent ? `${name(parent)} tag${parent.tag} ${parent.stateNode && parent.stateNode.outerHTML ? parent.stateNode.outerHTML.slice(0, 160) : parent.stateNode && parent.stateNode.nodeName}` : null,
          editorialDivs: document.querySelectorAll('.sn-editorial').length,
          readyState: document.readyState,
          bodyKids: [...document.body.childNodes].slice(0, 12).map((n) => n.nodeType === 1 ? `<${n.tagName.toLowerCase()} ${n.id ? '#' + n.id : ''}${n.className ? '.' + String(n.className).slice(0, 30) : ''}>` : n.nodeType === 8 ? `<!--${n.data}-->` : '#text'),
          tags: (() => { const t = []; for (let f = fiber, k = 0; f && k < 40; f = f.return, k += 1) t.push(f.tag); return t.join(','); })(),
        });
      };
    });
    await ctx.route(/\/_next\/static\/chunks\/a0a33787-[^/?]*\.js/, (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: PATCHED }));
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => { errs.push(e.message.slice(0, 50)); console.log('\n  pageerror stack:', (e.stack || '').split('\n').slice(0, 3).join(' | ').slice(0, 300)); });
    const scripts = [];
    page.on('request', (r) => { if (/react|a0a33787|framework|main-app/.test(r.url())) scripts.push(r.url().split('/').pop().slice(0, 60)); });
    await page.goto(`${L.BASE}/${slug}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const hm = await page.evaluate(() => window.__hm);
    if (!hm.length) { process.stdout.write(errs.length ? 'E' : '.'); if (errs.length) console.log('  chunks:', scripts.join(', ')); await ctx.close(); continue; }
    console.log(`\nload ${i}: ${hm.length} mismatch record(s), errors: ${errs.length}`);
    for (const r of hm.slice(0, 2)) { const { path, bodyKids, ...rest } = r; console.log(JSON.stringify({ ...rest, path: path.slice(0, 8) }, null, 1)); }
    await ctx.close();
    if (++found >= 2) break;
  }
  await browser.close();
})();
