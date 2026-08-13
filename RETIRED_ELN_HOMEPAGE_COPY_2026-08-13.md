# The owner-approved copy that left the site with the cinematic homepage · 13 August 2026

> **Why this file exists.** The owner ruled on 2026-08-13 that the new front door becomes `/` and
> the June ELN cinematic homepage is **retired completely**. That ruling was about the PAGE. It was
> not a ruling about the WORDS on it — and nobody, including him, said out loud that deleting the
> page also deletes the **owner-approved Filipino-USP hero and manifesto copy**, which exists
> nowhere else in the product.
>
> 🔑 **A guard is what caught it, not a reading.** `lib/home-front-copy.test.ts` pinned this copy
> line by line, and its own words for the key sentence were *"the samahan clause is the load-bearing
> idea of the approved manifesto."* When the page was deleted the guard went red with `ENOENT` —
> which is the only reason anyone noticed that retiring a layout was quietly retiring a brand
> decision. **Without that test this would have been a silent loss.**

---

## The copy, preserved verbatim

### Hero (`HOME_HERO`)

| Part | Text |
|---|---|
| Kicker | **Set na ’yan** |
| Headline | **Keep your memories.** / **Plan your moments.** *(two lines, `<br/>` between)* |
| Sub-line | **The Filipino way to keep a celebration — remembered by everyone who came, not just the couple. Plan any event, free.** |

### The samahan clause — the load-bearing sentence

> **Not one family’s album. The whole samahan’s — every photo, every clip, every story of your day,
> gathered from everyone who was there, waiting for you to step back into whenever you miss it.
> Yours for life.**

### Setnayan AI pillar copy

> **Plan like you have someone doing it for you.**
> Suri quietly watches over every vendor and every detail, and comes to you only when it’s time to
> decide. So it all feels effortless.

---

## What the new front door carries instead

Measured, not assumed. `app/_components/frontdoor/front-door-shell.tsx` carries the tagline
(*"Set na ’yan — that’s all set."*), *"plan your event, keep it for life"*, and the small print.

**It does NOT carry the manifesto, and the word `samahan` appears nowhere in the new front door.**

So the trade is real: the front door is a better *doorway* — it shows what exists and where to go —
but the ELN page was the only surface making the **argument for the product in Filipino terms**.

---

## 🔴 OWNER DECISION — one sentence, and it is not urgent

**Do you want the manifesto on the new front door?**

- **Yes** → it needs a home on the page. The prototype does not draw one, and the 2026-08-04 lock
  says *port it, never redraw it* — so adding a section is a deliberate amendment to an approved
  design, which is your call and not an engineering one.
- **No** → nothing to do. The copy stays recorded here, and the front door speaks through what it
  shows rather than what it argues.

⚠ **Deliberately NOT decided by engineering.** Losing approved brand copy silently and inventing a
new section on a locked design are both wrong; the honest move was to finish the retirement you
asked for, keep the words, and put the question in front of you.

---

## Recovery

The full retired page is one command away — same pattern the corpus uses for the gutted iteration
stubs:

```bash
git show 4c0072d1f:apps/web/app/_components/home/HomeReskin.tsx
git show 4c0072d1f:apps/web/app/_components/home/pillars.tsx
git show 4c0072d1f:apps/web/app/_components/home/setnayan-ai-story.tsx
```

Also retired with it: the 5-pillar dock, the interactive pillar widgets, the admin background-video
slots and the public Spotlight strip. `/pricing` is untouched and remains the source of truth for
prices.
