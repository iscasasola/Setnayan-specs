// gen-static.mjs — render every state of the JS prototype under a fake DOM, emit a ZERO-SCRIPT page
// switched by radio inputs + CSS. The owner's viewer executes no scripts (measured 2026-09-22).
import fs from 'node:fs';

const SRC = fs.readFileSync('one_door_FINAL_source.html', 'utf8');
const css = SRC.match(/<style>([\s\S]*?)<\/style>/)[1];
const script = SRC.match(/<script>([\s\S]*)<\/script>/)[1];
const shopPageTpl = SRC.match(/<div class="main" id="shopPage">([\s\S]*?)<\/div>\n\n    <!-- \/open-shop/)[1];
const summary = SRC.match(/<section class="summary"[\s\S]*?<\/section>/)[0];

// ---------- a fake DOM just big enough for render() ----------
function el(tag = 'div') {
  const e = {
    tag, innerHTML: '', textContent: '', hidden: false, attrs: {}, disabled: false, style: {}, value: '', dataset: {}, onclick: null,
    _cls: new Set(),
    setAttribute(k, v) { e.attrs[k] = String(v); }, getAttribute(k) { return e.attrs[k] ?? null; }, removeAttribute(k) { delete e.attrs[k]; },
    classList: { toggle(c, f) { if (f === undefined) f = !e._cls.has(c); f ? e._cls.add(c) : e._cls.delete(c); return f; }, add(c) { e._cls.add(c); }, remove(c) { e._cls.delete(c); }, contains(c) { return e._cls.has(c); } },
    get className() { return [...e._cls].join(' '); }, set className(v) { e._cls = new Set(String(v).split(/\s+/).filter(Boolean)); },
    querySelector() { return el(); }, querySelectorAll() { return []; }, focus() {}, addEventListener() {}, contains() { return false; },
    getBoundingClientRect() { return { top: 0, height: 0, width: 0, right: 0 }; },
  };
  return e;
}
const ids = {}; const sels = {};
const document = {
  getElementById: (id) => (ids[id] ??= el()),
  querySelector: (s) => (sels[s] ??= el()),
  querySelectorAll: () => [],
  body: el('body'), addEventListener() {}, visibilityState: 'visible',
};
const window = { scrollTo() {}, __STATE: undefined };
const location = { hash: '' };
const sessionStorage = { getItem: () => null, setItem() {}, removeItem() {} };
new Function('window', 'document', 'location', 'sessionStorage', script)(window, document, location, sessionStorage);
const P = window.__proto;

// ---------- the states, in the owner's language, grouped ----------
const GROUPS = [
  ['START', [['home', 'Shop page, signed out']]],
  ['SIGN IN', [['signin', 'Sign in'], ['signin-error', 'Wrong password'], ['signed-in-sent', 'Signed in · enquiry sent']]],
  ['CREATE ACCOUNT', [['signup', 'Create account'], ['signup-google', 'Google chosen'], ['profile', 'You'], ['profile-checking', '@name checking…'], ['profile-taken', '@name taken'], ['profile-full', 'Full name open'], ['profile-done', 'Done · back on the page']]],
  ['EVENT', [['event-debut', 'Create event · Debut · consent'], ['event-wake', 'Create event · Wake'], ['event-done', 'Event created']]],
  ['OPEN A SHOP · NEW ACCOUNT', [['shop-1', 'Step 1'], ['shop-2', 'Step 2'], ['shop-3', 'Step 3 · new account'], ['shop-3-google', 'Step 3 · Google chosen'], ['shop-email-taken', 'Email already registered'], ['shop-4', 'Step 4'], ['shop-4-google', 'Step 4 · Google'], ['terms-server', 'Terms refused by server'], ['shop-failed', 'Account made, shop failed'], ['opened', 'Opened']]],
  ['OPEN A SHOP · SIGNED IN', [['shop-1-in', 'Step 1 · signed in'], ['shop-2-in', 'Step 2 · signed in'], ['shop-3-in', 'Step 3 · signed in'], ['shop-4-in', 'Step 4 · signed in']]],
];
const STATES = GROUPS.flatMap(([, list]) => list.map(([k]) => k));

// ---------- where each control leads, per state ----------
const prevStep = { 'shop-2': 'shop-1', 'shop-3': 'shop-2', 'shop-3-google': 'shop-2', 'shop-email-taken': 'shop-2', 'shop-4': 'shop-3', 'shop-4-google': 'shop-3-google', 'terms-server': 'shop-3', 'shop-failed': 'shop-3-in', 'shop-2-in': 'shop-1-in', 'shop-3-in': 'shop-2-in', 'shop-4-in': 'shop-3-in' };
const nextStep = { 'shop-1': 'shop-2', 'shop-2': 'shop-3', 'shop-3': 'shop-4', 'shop-3-google': 'shop-4-google', 'shop-1-in': 'shop-2-in', 'shop-2-in': 'shop-3-in', 'shop-3-in': 'shop-4-in' };
const signedInStates = new Set(['signed-in-sent', 'profile-done', 'event-done', 'shop-1-in', 'shop-2-in', 'shop-3-in', 'shop-4-in', 'shop-failed', 'opened']);
function target(state, d) {
  const signedIn = signedInStates.has(state) || state.startsWith('profile') || state.startsWith('event') || state === 'signup-google';
  const t = {
    signin: 'signin', signup: 'signup', openshop: signedIn ? 'shop-1-in' : 'shop-1', createevent: 'event-debut', home: signedIn ? 'signed-in-sent' : 'home',
    send: signedIn ? null : 'signin', save: signedIn ? null : 'signin',
    wizback: prevStep[state] ?? (signedIn ? 'signed-in-sent' : 'home'), back: prevStep[state] ?? null, next: nextStep[state] ?? null,
    open: state === 'shop-4' || state === 'shop-4-google' || state === 'shop-4-in' || state === 'shop-failed' || state === 'terms-server' ? 'opened' : null,
    dosignin: state === 'shop-email-taken' ? 'shop-3-in' : 'signed-in-sent', dosignup: 'profile', doprofile: 'profile-done', later: 'profile-done', full: 'profile-full',
    close: state === 'shop-email-taken' ? 'shop-3' : state.startsWith('profile') ? 'profile-done' : 'home',
    'signin-from-wiz': 'shop-email-taken', startplanning: 'event-done', unpick: null, confirm: null, unpin: null, pin: null, mine: null, logo: null, photo: null, failshop: null, reset: null, avatar: null, unoauth: 'shop-3',
  };
  if (d.act !== undefined) return t[d.act] ?? null;
  if (d.oauth !== undefined) return state === 'signup' ? 'signup-google' : 'signed-in-sent';
  if (d.woauth !== undefined) return 'shop-3-google';
  if (d.evtype !== undefined) return d.evtype === 'wake' ? 'event-wake' : d.evtype === 'debut' ? 'event-debut' : null;
  if (d.state !== undefined) return d.state;
  return null;
}

// buttons → labels (a live move) or dead (drawn only). Buttons never nest, so a non-greedy match to </button> is safe.
function wire(html, state) {
  return html.replace(/<button\b([^>]*)>([\s\S]*?)<\/button>/g, (m, attrs, inner) => {
    const d = {};
    for (const [, k, v] of attrs.matchAll(/data-([a-z-]+)="([^"]*)"/g)) d[k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
    const to = target(state, d);
    const cleaned = attrs.replace(/\s(type|disabled)(="[^"]*")?/g, '');
    if (to && STATES.includes(to)) return `<label${cleaned} for="s-${to}" class="${(attrs.match(/class="([^"]*)"/) || [, ''])[1]} go">${inner}</label>`.replace(/class="[^"]*"(?=[^>]*class=")/, '');
    return `<button${attrs} class="${(attrs.match(/class="([^"]*)"/) || [, ''])[1]} dead" title="Drawn only — use the row at the top to move">${inner}</button>`.replace(/class="[^"]*"(?=[^>]*class=")/, '');
  });
}

const topTpl = (a) => `<div class="top"><span class="brand">SETNAYAN</span><span class="search">Search events, people, vendors</span><span class="sp"></span>${a.topEvent ? '' : '<button class="link" data-act="createevent">Create event</button>'}<button class="link" data-act="openshop">Open your shop</button>${a.signinHidden ? `<button class="avatar" data-act="avatar">${a.avatar}</button>` : '<button class="link cta" data-act="signin">Sign in</button>'}</div>`;

const panels = [];
for (const state of STATES) {
  P.applyState(state); P.render();
  const S = P.S;
  const g = (id) => document.getElementById(id);
  const bodyCls = document.body;
  const view = bodyCls.classList.contains('event') ? 'event' : bodyCls.classList.contains('wiz') ? 'wiz' : 'shop';
  let main;
  if (view === 'event') main = `<div class="event"><div class="wiz-head"><button class="icon-btn back" data-act="home" aria-label="Back"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button><h1 style="font-size:22px;font-weight:500">Create event</h1></div><div class="wiz-body">${g('eventBody').innerHTML}</div></div>`;
  else if (view === 'wiz') main = `<div class="wiz"><div class="wiz-head"><button class="icon-btn back" data-act="wizback" aria-label="Back"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button><h1 style="font-size:22px;font-weight:500">${g('wizTitle').textContent}</h1></div><div class="wiz-body">${g('wizBody').innerHTML}</div></div>`;
  else main = `<div class="main">${shopPageTpl
    .replace('♡ Save', g('saveBtn').textContent).replace('>Send<', '>' + g('sendBtn').textContent + '<')
    .replace('<textarea class="enq" id="enq" placeholder="Hi! Are you free on Oct 11? We’re 120 guests in Quezon City…"></textarea>', `<textarea class="enq" placeholder="Hi! Are you free on Oct 11? We’re 120 guests in Quezon City…">${S.enquiry}</textarea>`)
    .replace('<span class="small" id="enqNote"></span>', `<span class="small">${g('enqNote').textContent}</span>`)}</div>`;
  const ov = g('ov').classList.contains('on') ? `<div class="ov on"><div class="pc" role="dialog" aria-label="${g('pc').attrs['aria-label'] || ''}">${g('pc').innerHTML}</div></div>` : '';
  const toastOn = g('toast').classList.contains('on') && g('toastText').textContent;
  const toastHtml = toastOn ? `<div class="toast on" role="status"><span>${g('toastText').textContent}</span></div>` : '';
  const top = topTpl({ topEvent: g('topEvent').hidden, signinHidden: g('topSignin').hidden, avatar: g('topAvatar').innerHTML });
  const rail = `<nav class="shell-rail" aria-label="Site menu">${g('rail').innerHTML}</nav>`;
  // ids and non-state `for`s would repeat across the 28 hidden panels: strip them (labels for real inputs bind to nothing, which is fine here).
  const inner = `${wire(top, state)}<div class="app">${rail}<div>${wire(main, state)}</div></div>${wire(ov, state)}${toastHtml}`
    .replace(/\s+id="(?!p-|s-)[^"]*"/g, '').replace(/\s+for="(?!s-)[^"]*"/g, '');
  panels.push(`<section class="st" id="p-${state}">${inner}</section>`);
  // reset the fake toast between states
  g('toast').classList.remove('on'); g('toastText').textContent = '';
}

const radios = STATES.map((k, i) => `<input type="radio" name="st" id="s-${k}"${i === 0 ? ' checked' : ''}>`).join('');
const switcher = `<div class="states" role="group" aria-label="Jump to a state"><b>Jump to</b>${GROUPS.map(([grp, list]) => `<span class="grp">${grp}</span>` + list.map(([k, label]) => `<label class="pill" for="s-${k}">${label}</label>`).join('')).join('')}</div>`;
const rules = STATES.map((k) => `#s-${k}:checked ~ .stage #p-${k}{display:block}#s-${k}:checked ~ .states label[for="s-${k}"]{background:var(--ink);border-color:var(--ink);color:#fff}`).join('\n');

const extraCss = `
/* ---------- ZERO-SCRIPT SWITCHING: radios + sibling selectors ---------- */
input[name="st"]{position:absolute;left:-9999px;width:1px;height:1px}
.stage .st{display:none}
${rules}
.states{position:sticky;top:0}
.st .top{top:44px}
.st .wiz,.st .event{display:block}
.st .glance{display:none}
label.go{cursor:pointer}
label.btn,label.pill,label.submit{display:inline-flex;align-items:center;justify-content:center}
label.row,label.fold,label.oauth-b{display:flex}
.pc label.submit{width:100%}
.dead{cursor:default;opacity:.55}
.legend{padding:8px 16px;font-size:12px;color:var(--ink-2);background:#FBF8F3;border-bottom:1px solid var(--line)}
.legend b{color:var(--ink)}
@media (min-width:1024px){ .st .glance{display:flex} .st .top{top:44px} }
`;

const out = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>One door — FINAL interactive prototype (2026-09-22, no scripts)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<!--
  ONE DOOR — FINAL prototype, ZERO JAVASCRIPT (2026-09-22).
  The owner's viewer executes no scripts, so every one of the ${STATES.length} states below is pre-rendered markup, and the
  row at the top switches between them with radio inputs + CSS sibling selectors. Solid controls move to the next
  moment; faded ones are drawn only. Generated by gen-static.mjs from one_door_FINAL_source.html — edit the source.
  Routes: the sign-in popup (sign-in-here-panel + sign-in-card) · /signup · the Profile tab · /dashboard/create-event ·
  /open-shop. Real copy, real service tree (Photo & video, Attire), the 17 event types, the live fee schedule.
-->
<style>${css}${extraCss}</style>
</head>
<body class="hasStates">
${radios}
${switcher}
<div class="legend"><b>How to read this:</b> solid controls move you to the next moment · faded ones are drawn only · amber = not yet decided or waiting on another PR · [brackets] = placeholder.</div>
<div class="stage">
${panels.join('\n')}
</div>
${summary}
</body>
</html>
`;
fs.writeFileSync('one_door_FINAL_2026-09-22.html', out);
console.log('states', STATES.length, '| bytes', Buffer.byteLength(out), '| <script count', (out.match(/<script/g) || []).length, '| go labels', (out.match(/class="[^"]*\bgo\b/g) || []).length, '| dead buttons', (out.match(/\bdead\b/g) || []).length);
