# How this design gets built: INTEGRATE, never replace

> 🗣 **Owner, 2026-08-08, verbatim: *"do not just replace it. integrate it well."***
>
> This binds every frame in the Warm Editorial Archive handoff. The handoff's own
> README says the same thing in its own words — *"a restyle-and-extend of what
> ships, not a from-scratch product"* — but the owner said it out loud, so it is a
> rule here rather than a preference.

---

## Why this matters more on this codebase than most

The shipped components are not naive. Each one carries edge cases that were paid for
with real incidents:

- **"Zero is not failed-to-load."** A count of `null` means *not measured*; a bare
  `0` in its place put an unmeasured queue under "everything is clear".
- **Empty states are written invitations**, not blank space, and there are **no fake
  doors** — a control that cannot do anything is not rendered.
- **Phase-awareness.** The couple's chrome changes between planning, day-of and
  post-event. A component redrawn from a single static frame has one state.
- **Permission and entitlement gates** decide what a coordinator, a guest and the
  couple each see. They are invisible in a design frame.
- **Supabase resolves with `{ error }`; it does not throw.** Read paths check the
  error explicitly. A rewritten fetch that drops that check reports "nothing here"
  on failure.

A design frame shows **one state of one component to one role**. Replacing a
component with the frame silently deletes every other state.

---

## The rules

1. **Change components in place. Never delete-and-recreate.**
   If the diff shows a component removed and a new one added, that is a failure of
   this rule even when the result looks right.

2. **Styling changes only, unless the plan explicitly says otherwise.**
   Colour, spacing, type, radius, order. Not data flow, not conditionals, not props.

3. **Every existing conditional survives.** Before editing a component, list its
   branches — loading, empty, error, denied, partial, phase variants — and confirm
   each still renders after. The design will not mention most of them.

4. **No new data stores.** The handoff states this too: widgets read the shipped
   sources. If a frame implies data we do not have, that is a **finding**, not a
   licence to invent a reader.

5. **The existing tests stay green, untouched.** They encode past bugs. A test that
   fails after a restyle means the restyle changed behaviour — fix the code, never
   the test.

6. **Restyles land before new builds.** A restyle cannot regress behaviour that a
   new component has not got yet.

---

## The mechanical check — run this, do not eyeball it

A genuine restyle has a characteristic diff shape. After each unit:

```bash
# 1. Net lines should be roughly flat. A "restyle" that deletes 200 lines
#    removed behaviour, not styling.
git diff --stat

# 2. No component should disappear. Any removed export/function is suspect.
git diff -U0 | grep -E '^-.*(export function|export default|function [A-Z])'

# 3. No conditional should disappear. These are the edge cases.
git diff -U0 | grep -cE '^-.*(\?\?|&&|\? *\(|if \(|catch|error)'

# 4. The suite that encodes past bugs must still pass.
npx tsc --noEmit -p tsconfig.json
TZ=Asia/Manila npx tsx --test "lib/**/*.test.ts" "app/**/*.test.ts"
```

If check 2 or 3 returns anything, stop and justify each line before committing.

---

## The one-line test

> **If a reviewer reading the diff cannot tell what the screen used to do, it was a
> replacement, not an integration.**
