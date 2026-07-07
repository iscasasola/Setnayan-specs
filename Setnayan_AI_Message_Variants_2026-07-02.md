# Setnayan AI — message variant library (5 per message)

**Date:** 2026-07-02 · **Status:** DRAFT for owner review · **Companion to:** `Setnayan_AI_Market_Intelligence_2026-07-02.md` §11

Code-stored, deterministic. Each message now has **5 phrasings**, rotated by a hash of the alert's key so a couple never hears the same line twice — no LLM at render time, free for life.

**Validation (automated):** 36 messages · 180 variants · **0 slot-leaks** · 0 duplicates · every **variant 1 = the current shipped line, verbatim** (nothing approved was lost).

**Read like this:** variant 1 is what ships today; variants 2–5 are the new phrasings up for your approval. `{tokens}` are filled live with the couple's real vendor/date/₱.

---

## 1 · Secretary — does the legwork

### SEC-01 · busy — Weekly digest — busy week

1. _(current — shipped)_ This week I checked {checked_count} things on your {event} — {on_track_count} on track. ⏎ {flags} ⏎ Next up: {next_task}.
2. Ran through {checked_count} things on your {event} this week — {on_track_count} are on track. ⏎ {flags} ⏎ Next up: {next_task}.
3. Quick week in review: I went over {checked_count} things on your {event}, and {on_track_count} are on track. ⏎ {flags} ⏎ Next up: {next_task}.
4. I looked at {checked_count} things on your {event} this week — {on_track_count} of them are on track. ⏎ {flags} ⏎ After that: {next_task}.
5. Here's your week — {checked_count} things checked on your {event}, {on_track_count} on track. ⏎ {flags} ⏎ Up next: {next_task}.

### SEC-01 · quiet — Weekly digest — quiet week

1. _(current — shipped)_ Calm week — everything’s on track. One thing on the horizon: {horizon_item}.
2. Nothing needs you this week, everything’s moving along. The one thing coming up: {horizon_item}.
3. Quiet stretch, and that’s a good thing — you’re on track. Just one item on the horizon: {horizon_item}.
4. You’re all set for now, no fires to put out. The only thing ahead: {horizon_item}.
5. Easy week — everything’s where it should be. One thing to keep half an eye on: {horizon_item}.

### SEC-02 — Decision-stuck → narrow to two

1. _(current — shipped)_ You’ve been weighing {category} for {weeks} weeks. Based on your budget, {date_label}, and the style you keep picking, I’d look hardest at these two: {top2}. The main difference: {differentiator}.
2. {category} has been on your mind for {weeks} weeks now. Looking at your budget, {date_label}, and the style you keep gravitating toward, the two I’d focus on are {top2}. What sets them apart: {differentiator}.
3. After {weeks} weeks of you circling {category}, I think it’s down to two: {top2}. They both fit your budget, {date_label}, and the look you keep choosing. The thing that separates them: {differentiator}.
4. You’ve spent {weeks} weeks on {category}, so here’s where I’d land. Given your budget, {date_label}, and the style running through your picks, {top2} are the two worth a real look. The key difference: {differentiator}.
5. I’ve watched you sit with {category} for {weeks} weeks, and two keep rising to the top for your budget, {date_label}, and the aesthetic you lean into: {top2}. Where they part ways: {differentiator}.

### SEC-03 — Discovery-stuck → offer more

1. _(current — shipped)_ Still nothing right for {category}? I found {new_count} more if we relax {relaxed_filter} a little. Want to see them?
2. Nothing in {category} feeling right yet? If we ease up on {relaxed_filter} a bit, {new_count} more open up. Want a look?
3. Haven't found your {category} match? Loosening {relaxed_filter} just slightly brings in {new_count} more. Should I pull them up?
4. {category} is still coming up empty for you. There are {new_count} more waiting if we soften {relaxed_filter} a touch — want them?
5. No luck on {category} so far? I've got {new_count} others we could reach by relaxing {relaxed_filter} a little. Interested?

### SEC-04 — Vendor gone quiet → nudge?

1. _(current — shipped)_ {vendor} hasn’t replied in {days} days. Want me to send a nudge?
2. It’s been {days} days with no word from {vendor}. Should I give them a nudge?
3. Still nothing from {vendor} after {days} days. Want me to follow up for you?
4. {vendor} has gone quiet — {days} days now. Happy to send a friendly nudge if you’d like.
5. No reply from {vendor} in {days} days. Want me to check in with them?

### SEC-04 · draft — Outgoing follow-up draft (sent TO the vendor)

1. _(current — shipped)_ Hi {vendor}, following up on our inquiry about {service} for {date_label_value}. Are you available, and could you share a quote? Thank you!
2. Hi {vendor}, just circling back on our note about {service} for {date_label_value}. Are you free that day, and what would a quote look like? Thanks so much!
3. Hi {vendor}, we're still hoping to hear from you on {service} for {date_label_value}. Could you let us know if you're available and roughly what it'd cost? Thank you!
4. Hi {vendor}, checking in on the {service} we asked about for {date_label_value}. Is that date open on your end, and could you send over a quote? Thanks!
5. Hi {vendor}, we'd love to move forward with {service} for {date_label_value}. Are you available then, and would you mind sharing pricing? Thank you!

### SEC-05 — Quote received → compare

1. _(current — shipped)_ {vendor} quoted ₱{amount} ({inclusions}). That’s {vs_benchmark} for {category} in your area. Want to compare it against your shortlist?
2. Just got {vendor}’s quote: ₱{amount} for {inclusions}. For {category} in your area, that’s {vs_benchmark}. Want me to line it up next to your shortlist?
3. {vendor} came back at ₱{amount} ({inclusions}) — {vs_benchmark} for {category} where you are. Happy to put it side by side with your shortlist if that helps.
4. Heard from {vendor}: ₱{amount}, and that covers {inclusions}. Compared to other {category} in your area, it’s {vs_benchmark}. Want to see how it stacks against your shortlist?
5. {vendor}’s number is ₱{amount} for {inclusions}. That lands {vs_benchmark} for {category} around you. Want me to weigh it against your shortlist?

### SEC-06 — Just locked → next task

1. _(current — shipped)_ Nice — that’s locked. Next, while there’s time: {next_task} ({why_now}).
2. Done and locked. Since we’ve still got room, let’s do {next_task} next — {why_now}.
3. That one’s settled. While there’s still time on the clock, next up is {next_task} ({why_now}).
4. Locked in, nicely done. The good next move is {next_task}, and here’s why now — {why_now}.
5. Great, that’s handled. Next on the list while you’ve got the runway: {next_task} ({why_now}).

### SEC-07 — Picks converging on a date

1. _(current — shipped)_ Most of your picks ({count} so far) point to {date}. Want me to do a focused search around that date, or stay open to others?
2. So far {count} of your picks land on {date}. I can zero in on vendors open that day, or keep things wide — which feels right?
3. Your shortlist is leaning one way: {count} picks point to {date}. Should I narrow the search to that date, or leave it open?
4. Noticed a pattern — {count} of your choices so far center on {date}. Want me to search tightly around it, or keep other dates in play?
5. {count} of your picks are pointing at {date} now. I can focus everything on that date, or we can stay flexible — your call.

### SEC-08 — Options running thin  ← Wave-1 (MI-6)

1. _(current — shipped)_ Your {category} options are running thin ({found_count}). I can widen the search by {suggestion} — want me to?
2. You're down to {found_count} {category} options. I could open things up by {suggestion} if you'd like — want me to?
3. Only {found_count} {category} options left on the list. I can pull in more by {suggestion} — should I?
4. Your {category} shortlist is getting short ({found_count}). I'd widen it by {suggestion} — want me to give that a go?
5. {found_count} {category} options and shrinking. I can find more by {suggestion} — want me to?

### SEC-09 — Progress → categories locked

1. _(current — shipped)_ You’ve locked {locked} of {total} key categories — solid progress. The big one left: {remaining_highlight}.
2. Nice — {locked} of {total} key categories are locked in. The big one still open is {remaining_highlight}.
3. You’re {locked} of {total} key categories down, and that’s real progress. The one that still matters most: {remaining_highlight}.
4. That’s {locked} of {total} key categories sorted — you’re in good shape. Left to go: {remaining_highlight}.
5. {locked} of {total} key categories locked already. The one I’d turn to next is {remaining_highlight}.

## 2 · Guard — the safety net

### GRD-01 — Payment due

1. _(current — shipped)_ Heads up — your {vendor} payment (₱{amount}) is due {due_date}, {days_left} days away.
2. Quick note: {vendor} needs ₱{amount} by {due_date} — that's {days_left} days out.
3. Your {vendor} payment of ₱{amount} lands on {due_date}, so about {days_left} days from now.
4. Just flagging that ₱{amount} is due to {vendor} on {due_date} — {days_left} days to go.
5. Marking your calendar with you — {vendor}'s ₱{amount} is due {due_date}, {days_left} days away.

### GRD-02 — Legal document deadline (wedding)

1. _(current — shipped)_ Your {document} needs attention — {deadline} ({days_left} days). I’ll remind you again at 30 days.
2. Heads up on your {document} — it’s due {deadline}, so {days_left} days out. I’ll nudge you again at the 30-day mark.
3. Your {document} is coming up on {deadline}, which is {days_left} days away. No rush yet — I’ll check back in with you at 30 days.
4. Just flagging your {document}: {deadline} means {days_left} days left. I’ve got a reminder set for you again at 30 days.
5. That {document} of yours needs a look before {deadline} — {days_left} days from now. I’ll circle back at the 30-day point.

### GRD-03 — Shortlisted vendor price rose

1. _(current — shipped)_ {vendor} (on your {category} shortlist) went from ₱{old_price} to ₱{new_price}. Lock it in, or want alternatives?
2. Heads up: {vendor}, on your {category} shortlist, moved from ₱{old_price} to ₱{new_price}. Want to lock it in, or see other options?
3. {vendor} just repriced their {category} work — ₱{old_price} is now ₱{new_price}. Want me to lock it in, or pull a few alternatives?
4. Price shift on your {category} shortlist: {vendor} went ₱{old_price} to ₱{new_price}. I can lock them in, or find you some other choices — your call.
5. Noticed {vendor} bumped their {category} price from ₱{old_price} to ₱{new_price}. Still want them locked in, or would you rather I show alternatives?

### GRD-04 — Vendor caution signal

1. _(current — shipped)_ A note on {vendor}: {signal}. Worth a quick check-in before you commit further — want me to draft a message?
2. Quick heads-up on {vendor} — {signal}. I'd sort that out before you commit any further. Want me to draft a message?
3. Before you go deeper with {vendor}, one thing worth knowing: {signal}. A quick check-in would clear it up — want me to draft a message?
4. On {vendor}: {signal}. Nothing alarming, but I'd check in before you commit further. Want me to draft something to send?
5. Just flagging {vendor} — {signal}. Worth a quick conversation before the next step. Want me to draft a message to them?

### GRD-05 — Over budget

1. _(current — shipped)_ You’re ₱{over_amount} over budget right now — mostly {top_driver_category}. Want me to find a few places to trim, or raise the total?
2. Quick heads-up — you’re running ₱{over_amount} over, and {top_driver_category} is doing most of it. I can look for spots to trim, or we bump the total up. Your call.
3. Right now the numbers are ₱{over_amount} over budget, with {top_driver_category} the biggest reason. Want me to trim a bit here and there, or just raise the total?
4. {top_driver_category} has pushed you ₱{over_amount} past your budget. I’d be happy to hunt down a few things to cut back, or we can lift the total instead — whichever feels right.
5. So you’re ₱{over_amount} over at the moment, mostly from {top_driver_category}. Should I find a couple of places to shave off, or would you rather raise the total?

### GRD-06 — Schedule clash

1. _(current — shipped)_ Two things land on {slot}: {item_a} and {item_b}. That’s a clash — want to resolve it now?
2. Heads up — {item_a} and {item_b} are both booked for {slot}. They can’t both happen then. Want to sort it out now?
3. {item_a} and {item_b} are stacked on the same {slot}. That’s a conflict — should we untangle it now, or leave it for later?
4. You’ve got {item_a} and {item_b} both sitting on {slot}. One of them needs to move — want to handle that together now?
5. Noticed {item_a} overlaps {item_b} on {slot}. That won’t work as-is — want to fix it now?

### GRD-07 — Contract window closing

1. _(current — shipped)_ Your {window_type} window with {vendor} closes {deadline}. If anything’s uncertain, decide before then — after that, changes may cost.
2. Heads up: your {window_type} window with {vendor} closes {deadline}. If you’re still unsure about anything, it’s worth settling before then — changes after that may cost.
3. {vendor} keeps your {window_type} window open until {deadline}. Anything you’re still weighing, it’s best to lock in before then — past that, changes may cost.
4. The {window_type} window with {vendor} runs out {deadline}. If there’s still a detail you’re not sure on, decide before then — changes made later may cost.
5. You’ve got until {deadline} on your {window_type} window with {vendor}. If something’s still up in the air, sort it before then — after that, changes may cost.

### GRD-08 — Unverified vendor → pay safely

1. _(current — shipped)_ Quick check — {vendor} isn’t verified on Setnayan yet. Confirm their details before sending money. Want tips on paying safely?
2. One heads-up before you pay: {vendor} hasn’t been verified on Setnayan yet. It’s worth double-checking their details first. Want a few tips on paying safely?
3. Just so you know, {vendor} isn’t verified on Setnayan yet — nothing wrong, just not confirmed. I’d check their details before any money moves. Should I share some safe-payment tips?
4. Before you send anything to {vendor}, worth knowing they’re not verified on Setnayan yet. A quick look at their details first keeps you safe. Want me to walk you through paying safely?
5. Small note — {vendor}’s verification isn’t through on Setnayan yet, so I’d confirm who they are before paying. Want some pointers on how to pay safely?

### GRD-09 — Availability changed on your date  ← Wave-1 (MI-2)

1. _(current — shipped)_ {vendor}’s availability for {date} just changed ({status}). If they’re a top pick, lock them soon — want me to reach out?
2. Heads up — {vendor} is now {status} for {date}. If they’re high on your list, it’s worth locking them in before that shifts again. Want me to message them?
3. {vendor} just updated their {date} availability to {status}. If you had them as a favorite, I’d reach out sooner rather than later — should I send them a note?
4. Quick update: {vendor}’s {date} status moved to {status}. If they’re one you really wanted, now’s a good time to secure the date. Want me to get in touch?
5. Something changed with {vendor} — they’re {status} for {date} now. If they’re a top choice for you, let’s not let them slip. Should I reach out on your behalf?

### GRD-10 — Vendor fell through → backups found  ← Wave-1 (MI-2)

1. _(current — shipped)_ {vendor} fell through for {category}. I already found {backup_count} open on {date} — want to see them now?
2. Heads up — {vendor} fell through for {category}. Good news is I've already lined up {backup_count} that are open on {date}. Want a look?
3. So {vendor} didn't work out for {category}, but don't worry — I found {backup_count} others open on {date}. Want me to show you?
4. Small snag: {vendor} fell through for {category}. I dug up {backup_count} more open on {date} already — want to see them?
5. {vendor} is out for {category}. I've already got {backup_count} lined up that are free on {date} — should I pull them up?

## 3 · Commend — earned reassurance

### CMD-01 — Great choice (reviews)

1. _(current — shipped)_ Great choice. {vendor} has {review_count} reviews at {avg_stars}★ and finished {events_this_month} events this month — you’re in good hands.
2. Lovely pick. {review_count} couples have reviewed {vendor} at {avg_stars}★, and they wrapped {events_this_month} events just this month — you’re in good hands.
3. You chose well. {vendor} is sitting at {avg_stars}★ across {review_count} reviews and closed out {events_this_month} events this month. Solid, steady hands.
4. I love this one. {vendor} carries {review_count} reviews at {avg_stars}★ and has already done {events_this_month} events this month — you’re working with proven people.
5. Nice call. Behind {vendor} are {review_count} reviews at {avg_stars}★ and {events_this_month} events finished this month — they clearly know what they’re doing.

### CMD-02 — Context — vendor is filling up

1. _(current — shipped)_ For context: {vendor} has done {events_this_month} events this month at {avg_stars}★, and their calendar is filling for your date.
2. Worth knowing: {vendor} has covered {events_this_month} events just this month, holding a {avg_stars}★ average — and their dates near yours are starting to book up.
3. A little background on {vendor}: {events_this_month} events this month, {avg_stars}★ across them, and their calendar’s already filling around your date.
4. {vendor} is having a strong month — {events_this_month} events done at {avg_stars}★ — and I’m seeing their availability tighten close to your date.
5. Just so you have the full picture on {vendor}: they’ve handled {events_this_month} events this month at {avg_stars}★, and openings around your date are getting scarce.

### CMD-03 — Ahead of your timeline

1. _(current — shipped)_ You’re {ahead_descriptor} for your timeline — genuinely ahead of the curve. Nicely done.
2. Just checked your timeline and you’re {ahead_descriptor}. That’s real progress — nicely done.
3. You’re moving {ahead_descriptor} on your timeline. Most {organizers} aren’t this far along. Well done.
4. Wanted you to know you’re {ahead_descriptor} for where your {event} should be by now. That’s a great spot to be in.
5. You’re {ahead_descriptor} for your timeline — that’s the kind of head start that makes everything easier later. Nicely done.

### CMD-04 — Booked under typical price

1. _(current — shipped)_ Good eye — you booked {vendor} about ₱{below_amount} under what {organizers} like you typically pay for {category}.
2. Nice work on {vendor} — you came in about ₱{below_amount} below what most {organizers} spend on {category}.
3. You did well here: {vendor} landed about ₱{below_amount} under the usual {category} price for {organizers} like you.
4. That's a smart book. {vendor} came in about ₱{below_amount} cheaper than {category} typically runs for {organizers}.
5. Worth flagging — {vendor} put you about ₱{below_amount} below what {organizers} like you usually pay for {category}.

## 4 · Inference — personalization (DORMANT until DPO sign-off)

### INF-01 — Noticed your taste

1. _(current — shipped)_ I noticed you keep looking at {value} {attribute}. Want me to lean that way across your shortlist — or are you still exploring?
2. You've come back to {value} {attribute} a few times now. Want me to nudge your shortlist that way, or are you keeping your options open?
3. {value} {attribute} keeps catching your eye — I've noticed. Should I favor that across your shortlist, or are you still feeling things out?
4. Seems like {value} {attribute} is drawing you in. I can shape your shortlist around it if you'd like — or leave it wide open, your call.
5. I've spotted a pattern: {value} {attribute} keeps pulling your attention. Want me to weight your shortlist toward it, or are you still browsing?

### INF-02 — Existing vendor also offers it

1. _(current — shipped)_ You’re looking at {service} — {existing_vendor}, who you’ve already booked, also offers it. Add it with them instead of hiring separately?
2. Noticed you’re browsing {service}. {existing_vendor} is already on your team and offers it too — want me to add it with them rather than bring in someone new?
3. Quick heads-up on {service}: {existing_vendor}, who you’ve already booked, does this as well. Fold it in with them, or would you rather hire separately?
4. Since you’re considering {service} — {existing_vendor} already handles some of your {event}, and this is one of their offerings too. Add it to their scope, or keep it its own booking?
5. One less vendor to juggle: {existing_vendor}, already booked with you, offers {service} too. Want me to add it with them instead of finding someone else?

### INF-03 — Picks vs your budget

1. _(current — shipped)_ Your {category} picks keep landing {direction} your stated budget. Want me to update the budget, or re-filter to it?
2. I've noticed your {category} picks keep coming in {direction} the budget you set. I can bump the budget to match, or re-filter down to it — which feels right?
3. Every {category} option you're drawn to is landing {direction} your stated budget. Do you want me to update the number, or keep filtering to it?
4. The {category} choices you like keep sitting {direction} your budget. Happy to adjust the budget, or keep the filter tight — your call.
5. Looks like your {category} taste runs {direction} the budget you gave me. Should I raise it to fit, or re-filter so it stays put?

### INF-04 — Vendors cluster in an area

1. _(current — shipped)_ Your vendors cluster around {area}. Want me to anchor proximity there for the rest of your search?
2. I noticed most of your vendors are around {area}. Want me to keep the rest of your search close to there, or cast wider?
3. Looks like {area} is where your vendors are landing. Should I favor that spot as I look for the rest, or leave it open?
4. A pattern I'm seeing: your vendors keep clustering near {area}. Happy to weight the rest of your search toward there if you'd like.
5. Most of what you've picked sits around {area}. Want me to lean into that area for what's left, or keep things flexible?

### INF-05 — Browsing without reaching out

1. _(current — shipped)_ You’ve been browsing {category} for {days} days without reaching out. Stuck on something? I can narrow it down or send inquiries for you.
2. I’ve noticed you looking at {category} for {days} days now without messaging anyone. Anything holding you up? I’m happy to shortlist a few or reach out on your behalf.
3. You’ve spent {days} days on {category} but haven’t reached out to anyone yet. If it’s feeling like a lot, I can trim the options down or send the inquiries for you.
4. {category} has had your attention for {days} days with no messages sent — totally fine to take your time. Want me to narrow the field, or send a few inquiries so you’re not doing it all yourself?
5. Been {days} days of browsing {category} and no one’s heard from you yet. Whenever you’re ready, I can help you narrow it down or fire off the inquiries myself.

## 5 · Trend — cohort intelligence (DORMANT until DPO sign-off + min-N)

### TRD-01 — Cohort added a service

1. _(current — shipped)_ {percent}% of {organizers} like you ({cohort_descriptor}) added {service}. Worth a look for yours?
2. For reference: {percent}% of {cohort_descriptor} {organizers} ended up adding {service}. No rush — just thought you'd want to know.
3. A quick data point — {percent}% of {organizers} in your spot ({cohort_descriptor}) went with {service}. Curious if it's a fit for your {event}?
4. Among {cohort_descriptor} {organizers}, {percent}% added {service}. Sharing it in case it's useful for your {event}, no pressure either way.
5. Something I noticed: {percent}% of {organizers} like you ({cohort_descriptor}) chose {service}. Happy to walk you through it, or we can leave it.

### TRD-02 — Cohort typical spend

1. _(current — shipped)_ For reference, {organizers} like you ({cohort_descriptor}) spent around ₱{median_spend} on {category}.
2. Just so you have a number to compare against: {organizers} in your spot ({cohort_descriptor}) typically put about ₱{median_spend} toward {category}.
3. For context, the middle of the pack for {organizers} like you ({cohort_descriptor}) lands near ₱{median_spend} on {category}.
4. Here's a benchmark — most {organizers} who are {cohort_descriptor} spend somewhere around ₱{median_spend} on {category}.
5. To give you a sense of it, {cohort_descriptor} {organizers} usually land at roughly ₱{median_spend} for {category}.

### TRD-03 — Cohort typical booking timing

1. _(current — shipped)_ Most {organizers} like you book {category} by {typical_timing}. You’ve got room, but it’s worth starting soon.
2. Just a heads-up: {cohort_descriptor} tend to have {category} locked in by {typical_timing}. You’re not behind at all — might just be a good time to start looking.
3. For your {event}, {category} usually gets booked by {typical_timing} for couples like you. Plenty of time still, so no rush — whenever you’re ready to peek.
4. Something I’ve noticed: {organizers} like you tend to sort {category} by {typical_timing}. You’re comfortably ahead of that, but easing into it now keeps things relaxed.
5. {cohort_descriptor} typically settle {category} around {typical_timing}. You’ve still got runway before {date_label} — want to start browsing, or hold off for now?

### TRD-04 — Cohort cross-booking

1. _(current — shipped)_ {percent}% of {organizers} who booked {a} also arranged {b} — want me to check your options?
2. Noticed something: {percent}% of {organizers} who go with {a} also line up {b}. Want me to look into it for you?
3. Here's a pattern worth knowing — {percent}% of {organizers} who booked {a} ended up arranging {b} too. Should I pull up your options?
4. Most couples who book {a} don't stop there — {percent}% of {organizers} also arrange {b}. Want me to see what's out there for you?
5. Since you've got {a} sorted, one thing: {percent}% of {organizers} who booked it also set up {b}. Want me to check what's available?

### TRD-05 — Availability signal for your date

1. _(current — shipped)_ A heads-up grounded in real bookings: {category} availability for {date} is {availability_signal}. No rush, but earlier is easier.
2. Looking at actual bookings across your area: {category} for {date} is {availability_signal} right now. Nothing to act on today, but the good ones book earlier.
3. Quick read from real booking data — {category} availability on {date} is sitting at {availability_signal}. No pressure, just easier to lock in sooner than later.
4. From what couples are actually booking: {date} is {availability_signal} for {category}. You've got time, though it does get simpler the earlier you start.
5. Real numbers, not a nudge: {category} for {date} is {availability_signal}. Whenever you're ready — just a touch easier while there's still room.

## 1 · Secretary — does the legwork

### SEC-10 — Availability countdown — NET-NEW (MI-1)  ← Wave-1

1. _(current — shipped)_ Good news — {available} of your {shortlisted} {category} picks are still open for your {date_label}.
2. Quick update: {available} of the {shortlisted} {category} picks you shortlisted are still free on your {date_label}.
3. Still looking good — {available} out of {shortlisted} of your {category} picks have your {date_label} open.
4. Happy to say {available} of your {shortlisted} {category} picks are still available for your {date_label}.
5. Checked in on your {category} shortlist — {available} of the {shortlisted} are still open for your {date_label}.

