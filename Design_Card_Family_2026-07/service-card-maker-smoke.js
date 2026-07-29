var fs = require('fs');
var els = {}, handlers = {}, efp = null;
function El(id){ this.id = id; this.innerHTML = ''; this.textContent = ''; }
global.document = {
  addEventListener: function(t, f){ (handlers[t] = handlers[t] || []).push(f); },
  getElementById: function(id){ return els[id] || (els[id] = new El(id)); },
  querySelector: function(){ return null; },
  querySelectorAll: function(){ return []; },
  elementFromPoint: function(){ return efp; }
};
eval(fs.readFileSync('probe.js', 'utf8'));

var n = 0, bad = 0;
function ok(cond, msg){ n++; if (!cond){ bad++; console.log('  ✗ ' + msg); } else console.log('  ✓ ' + msg); }
function fire(t, ev){ (handlers[t] || []).forEach(function(f){ f(ev); }); }
function click(btn){ fire('click', { target: { closest: function(s){ return s === 'button' ? btn : null; } } }); }
function change(ds, extra){ var t = { dataset: ds }; for (var k in (extra||{})) t[k] = extra[k]; fire('change', { target: t }); }
var EVD = new Date('2027-02-14T00:00:00');
var MA = (EVD.getTime() - Date.now()) / (1000 * 3600 * 24 * 30.44);
var PCT = MA >= 12 ? 15 : MA >= 6 ? 10 : 0;
function withDisc(n){ return '\u20b1' + (n - Math.round(n * PCT / 100)).toLocaleString('en-PH'); }
var mk = function(){ return els.mk.innerHTML; }, cq = function(){ return els.cq.innerHTML; },
    mi = function(){ return els.mkincl.innerHTML; }, est = function(){ return els.est.textContent; };

console.log('1 · the TRUE first-run: blank, placeholders, blocked');
ok(els.makercard.innerHTML.indexOf('Name this service') >= 0, 'title is a PLACEHOLDER, not a prefill');
ok(els.makercard.innerHTML.indexOf('Set your price') >= 0, 'price region admits nothing is set');
ok(els.makercard.innerHTML.indexOf('Add cover photo') >= 0, 'cover region invites the upload');
ok(els.healthtop.innerHTML.indexOf('Blocked') >= 0, 'the single top meter reads Blocked');
ok(els.health.innerHTML.indexOf('cover') >= 0 && els.health.innerHTML.indexOf('Exclusive') >= 0, 'diagnostics name BOTH blockers');
ok(els.health.innerHTML.indexOf('event type') >= 0, 'hint: no events picked yet');
ok(els.nba.innerHTML.indexOf('Next:') >= 0, 'the coach names the first move');
ok((els.healthtop.innerHTML.match(/hmeter/g) || []).length === 1
   && els.health.innerHTML.indexOf('hmeter') < 0, 'exactly ONE progress meter, on top');
ok(els.healthtop.innerHTML.indexOf('data-hd') >= 0, 'the issue count is the expand toggle');
els.health.hidden = true; // the HTML mounts it hidden; mirror that in the stub
click({ dataset: { hd: '' } });
ok(els.health.hidden === false, 'tapping it expands the diagnostics');
click({ dataset: { hd: '' } });
ok(est() === '₱0', 'no price set → the couple total is honestly zero, got ' + est());

console.log('1b · price is LIVE-EDIT — the owner-reported "cannot save" defect');
// runs in the pristine state: no lines, no discount tiers → estimate = price alone
fire('change', { target: { dataset: { basis: '1' }, value: 'event' } });
ok(els.makercard.innerHTML.indexOf('Set your price') !== -1,
   'basis switch resets the price back to blank');
fire('input', { target: { dataset: { pin: 'base' }, value: '80000' } });
ok(els.makercard.innerHTML.indexOf('₱80,000') !== -1
   && els.makercard.innerHTML.indexOf('flat') !== -1,
   'typed flat price lands on the card with no save button');
ok(est() === '₱80,000', 'couple estimate follows the typed price, got ' + est());
// per-hour: base covers N hrs, extras billed for the 6-hr demo event
fire('change', { target: { dataset: { basis: '1' }, value: 'hour' } });
fire('input', { target: { dataset: { pin: 'base' }, value: '25000' } });
fire('input', { target: { dataset: { pin: 'inc' }, value: '4' } });
fire('input', { target: { dataset: { pin: 'extra' }, value: '6000' } });
ok(els.makercard.innerHTML.indexOf('₱25,000') !== -1
   && els.makercard.innerHTML.indexOf('4 hrs') !== -1,
   'per-hour card line shows base + covered hours');
ok(est() === '₱37,000',
   'estimate bills the 2 extra demo hours: 25,000 + 2×6,000, got ' + est());
// per-pax: minimum pax floors the billed count
fire('change', { target: { dataset: { basis: '1' }, value: 'pax' } });
fire('input', { target: { dataset: { pin: 'base' }, value: '1200' } });
fire('input', { target: { dataset: { pin: 'inc' }, value: '200' } });
ok(est() === '₱240,000',
   'a 200-pax minimum bills the 140-guest demo at 200 × ₱1,200, got ' + est());
ok(els.basecopy.textContent.indexOf('200-pax minimum') !== -1,
   'the estimate explains the minimum in plain words');
// leave the canvas blank again for every section that follows
fire('change', { target: { dataset: { basis: '1' }, value: 'pax' } });
fire('change', { target: { dataset: { up: 'cover' }, files: [{}] } });
ok(els.healthtop.innerHTML.indexOf('Blocked') >= 0 && els.health.innerHTML.indexOf('Exclusive') >= 0,
   'cover alone does not unblock — the Exclusive still gates');
click({ id: 'loadex', dataset: {} });
ok(els.healthtop.innerHTML.indexOf('Blocked') < 0, 'the labeled example loads clean');
ok(est() === withDisc(168000), 'example estimate net of the lead-time tier, got ' + est());
ok(mi().indexOf('Rice + 3 mains + 2 sides') >= 0, 'example inclusions present for the interaction demos');
ok(mk().indexOf('data-grip="des"') >= 0, 'grip handles rendered');

console.log('1b · couples see the media: cover 4:3 + strip + clip');
ok(els.cmedia.innerHTML.indexOf('data-lb="cover"') >= 0, 'couple card shows the 4:3 cover');
ok((els.cmedia.innerHTML.match(/data-lb="p\d"/g) || []).length === 3, 'three photo thumbs in the strip');
ok(els.cmedia.innerHTML.indexOf('▶ 0:30') >= 0, 'the clip is a play pill on the strip');
els.lightbox = els.lightbox || { hidden: true, innerHTML: '' };
click({ dataset: { lb: 'p0' } });
ok(els.lightbox.hidden === false, 'tapping a thumb opens the lightbox');
click({ dataset: { lbclose: '' } });
ok(els.lightbox.hidden === true, 'lightbox closes');

console.log('2 · split "Rice + 3 mains + 2 sides"');
click({ dataset: { split: '0' } });
ok(mi().indexOf('Rice +') < 0, 'source inclusion row consumed');
ok(mk().indexOf('Kare-kare') >= 0, 'seeded dish appears in maker');
ok(cq().indexOf('0 of 3 chosen') >= 0, 'couple sees pick-3 counter');
ok(cq().indexOf('<span>Rice</span>') >= 0, 'Rice landed as included for couple');
ok(est() === withDisc(168000), 'estimate unchanged by split');
ok(els.health.innerHTML.indexOf('we named') >= 0, 'health: reports the auto-named side options');

console.log('3 · branch "Lechon belly" (mains option 3) into a follow-up line');
click({ dataset: { bo: 'n11:3' } });
ok(mk().indexOf('follows “Lechon belly”') >= 0, 'maker shows the follow-up lineage');
ok(cq().indexOf('— style') < 0, 'couple does NOT see the follow-up before picking');
click({ dataset: { bo: 'n13:0' } });
ok(mk().split('follows “').length - 1 === 2, 'grandchild branch exists in maker');

console.log('4 · pick Lechon → follow-up appears, price follows');
change({ cn: 'n11:3' });
ok(cq().indexOf('Lechon belly — style') >= 0, 'follow-up visible after picking its parent option');
ok(est() === withDisc(172000), 'estimate +₱4,000 for Lechon (net of tier), got ' + est());
ok(cq().split('follow-up</span>').length - 1 === 1, 'grandchild still hidden');
change({ c1: 'n13:0' });
ok(cq().split('follow-up</span>').length - 1 === 2, 'grandchild appears once ITS parent option picked');
ok(est() === withDisc(172000), 'zero-peso branches leave the price alone');

console.log('5 · drag Dessert station below Mobile bar (same group)');
var rowCl = { add: function(){}, remove: function(){} };
function grab(id){ fire('pointerdown', { preventDefault: function(){},
  target: { closest: function(s){ return s === '[data-grip]'
    ? { dataset: { grip: id }, closest: function(){ return { classList: rowCl }; } } : null; } } }); }
function over(rowId, y){ var stub = { dataset: { row: rowId }, classList: rowCl,
    getBoundingClientRect: function(){ return { top: 80, height: 20 }; } };
  stub.closest = function(s){ return s === '#mk .item[data-row]' ? stub : null; };
  efp = stub; fire('pointermove', { preventDefault: function(){}, clientX: 5, clientY: y }); }
grab('des'); over('bar', 99); fire('pointerup', {});
ok(mk().indexOf('Mobile bar') < mk().indexOf('Dessert station'), 'optional add-ons reordered by drag');

console.log('6 · drag Dessert station INTO the included group');
grab('des'); over('buf', 81); fire('pointerup', {});
ok(cq().indexOf('<span>Dessert station</span>') >= 0, 'dropping into "Included" flips the state — couple sees it with a ✓');
ok(est() === withDisc(172000), 'no phantom charge from the move');

console.log('7 · drop a fresh line onto an empty group zone');
click({ dataset: {}, id: 'addline' });
ok(mk().indexOf('data-row="n15"') >= 0, 'new line added');
grab('n15');
var zone = { dataset: { gz: 'qty' }, classList: rowCl };
zone.closest = function(s){ return s === '[data-gz]' ? zone : null; };
efp = zone; fire('pointermove', { preventDefault: function(){}, clientX: 5, clientY: 300 });
fire('pointerup', {});
ok(mk().indexOf('max_qty — no schema') >= 0 && cq().indexOf('/ max 1') >= 0,
   'zone drop made it a quantity — couple gets the stepper');

console.log('8 · the ad-style meter regulates the card');
click({ dataset: { uprm: 'cover' } });
ok(els.healthtop.innerHTML.indexOf('Blocked') >= 0 && els.pub.disabled === true,
   'removing the cover → Blocked grade + publish disabled');
fire('change', { target: { dataset: { up: 'cover' }, files: [{}] } });
ok(els.healthtop.innerHTML.indexOf('Blocked') < 0 && /\d+\/100/.test(els.healthtop.innerHTML),
   're-upload → graded score out of 100 returns');

console.log('9 · the card IS the maker');
ok(els.makercard.innerHTML.indexOf('per head') >= 0
   && els.makercard.innerHTML.indexOf('✦') >= 0, 'card canvas renders price + Exclusive regions');
ok(els.makercard.innerHTML.indexOf('cover set') >= 0, 'cover region reflects the earlier upload');
els['sh-price'] = els['sh-price'] || { hidden: true };
click({ dataset: { sheet: 'price' } });
ok(els['sh-price'].hidden === false, 'tapping the price region opens the price sheet');
click({ dataset: { shclose: '' } });
ok(els['sh-price'].hidden === true, 'closing the sheet works');

console.log('10 · blanks are AUTO-NAMED, contact info still blocks');
ok(els.health.innerHTML.indexOf('we named') >= 0 && els.pub.disabled === false,
   'blank names are auto-named and do NOT block publish');
ok(cq().indexOf('Option 1') >= 0 || cq().indexOf('Choice ') >= 0,
   'the couple sees the auto-name, never a blank');
fire('input', { target: { dataset: { lbl: 'bar' }, value: 'Mobile bar — text me 0917 555 1234' } });
ok(els.health.innerHTML.indexOf('stay in Setnayan') >= 0 && els.pub.disabled === true,
   'contact info still hard-blocks publish');
fire('input', { target: { dataset: { lbl: 'bar' }, value: 'Mobile bar · 4 hrs' } });
ok(els.health.innerHTML.indexOf('stay in Setnayan') < 0, 'clearing the contact text clears the blocker');

console.log('11 · card profile vs chat rules (the measured problem)');
function ev(t, p){ return evaluate(t, p); }
ok(ev('Instagram teaser reel','chat').length > 0 && ev('Instagram teaser reel','card').length === 0,
   'IG/TikTok deliverables: blocked by chat rules, allowed on cards');
var PRICEY = 'Php 9,000 per hour, minimum 4 hours, 150 pax, 20 staff';
ok(ev(PRICEY,'chat').length > 0 && ev(PRICEY,'card').length === 0,
   'price/quantity prose: blocked by chat rules, allowed on cards');
var DATES = 'Valid 2026-09-17 - 2026-12-31';
ok(ev(DATES,'chat').length > 0 && ev(DATES,'card').length === 0,
   'a date range in discount terms: blocked by chat rules, allowed on cards');
ok(ev('Message me on Setnayan for the full menu','chat').length > 0
   && ev('Message me on Setnayan for the full menu','card').length === 0,
   'copy pointing AT Setnayan is no longer treated as a bypass');
ok(ev('reach me at 0917 880 7163','card').length > 0, 'a real mobile still blocks on cards');
ok(ev('email us: hi@studio.com','card').length > 0, 'a real email still blocks on cards');
ok(ev('facebook.com/ourstudio','card').length > 0, 'a real social link still blocks on cards');
ok(ev('my number is 09175551234','card').length > 0, 'solicitation + number still blocks on cards');

console.log('12 · audience + the lead-time ladder');
ok(els.lifechips.innerHTML.indexOf('Debut') >= 0, 'life-event chips render');
ok(els.fachips.innerHTML.indexOf('All faiths') >= 0, 'faith chips render, All faiths default');
ok(els.disctiers.innerHTML.indexOf('data-dtm') >= 0 && els.disctiers.innerHTML.indexOf('12') >= 0,
   'editable early-booking tiers render');
if (PCT > 0) ok(els.discline.innerHTML.indexOf('months ahead') >= 0
   && els.discline.innerHTML.indexOf('−') >= 0, 'the couple sees WHICH tier landed, live');
else ok(els.discline.innerHTML === '', 'no tier applies at this distance — no line shown');

console.log('11b · the score COACHES — next best action');
ok(els.nba.innerHTML.indexOf('Next:') >= 0 || els.nba.innerHTML.indexOf('Ready') >= 0,
   'a next-best-action is always present');

console.log('11c · the three bases speak their own semantics');
ok(els.basisfields.innerHTML.indexOf('minimum') >= 0 && els.basisfields.innerHTML.indexOf('pax to serve') >= 0,
   'per-head shows the minimum-pax-to-serve rule');
fire('change', { target: { dataset: { basis: '' }, value: 'hour' } });
ok(els.basisfields.innerHTML.indexOf('covers first') >= 0 && els.basisfields.innerHTML.indexOf('per additional hour') >= 0,
   'per-hour shows base-covers-X-hours + per-extra-hour');
fire('change', { target: { dataset: { basis: '' }, value: 'event' } });
ok(els.basisfields.innerHTML.indexOf('any hours, any pax') >= 0, 'per-event is flat, said plainly');
fire('change', { target: { dataset: { basis: '' }, value: 'pax' } });

console.log('12a · the Exclusive is a REAL blocker');
fire('input', { target: { id: 'exclfld', dataset: {}, value: '' } });
ok(els.healthtop.innerHTML.indexOf('Blocked') >= 0 && els.health.innerHTML.indexOf('Exclusive') >= 0,
   'clearing the Exclusive blocks publish');
fire('input', { target: { id: 'exclfld', dataset: {}, value: 'Free engagement mini-shoot' } });
ok(els.healthtop.innerHTML.indexOf('Blocked') < 0, 'restoring it clears the block');

console.log('12b · ⓘ info boxes toggle');
els['ib-excl'] = els['ib-excl'] || { hidden: true };
els['ib-excl'].hidden = true;
click({ dataset: { info: 'excl' } });
ok(els['ib-excl'].hidden === false, 'tapping ⓘ opens the info box');
click({ dataset: { info: 'excl' } });
ok(els['ib-excl'].hidden === true, 'tapping again closes it');

console.log('12c · every sheet has an explicit Update button (owner: "pop ups must have update button")');
var html = fs.readFileSync('service-card.html', 'utf8');
var updBtns = (html.match(/class="cta shdone" data-shclose>Update card/g) || []).length;
ok(updBtns === 5, 'all 5 sheets carry an "Update card" confirm button, got ' + updBtns);
ok(/data-shclose/.test(html), 'the update button uses the existing close-and-rerender handler');

console.log('13 · mobile bar mirrors the live estimate');
ok(els.mest.textContent === els.est.textContent && els.mest.textContent.indexOf('₱') === 0,
   'floating bar total equals the estimate');

console.log(bad === 0 ? '\nALL ' + n + ' ASSERTIONS PASS' : '\n' + bad + ' of ' + n + ' FAILED');
process.exit(bad === 0 ? 0 : 1);
