# Registers — moved under version control 2026-09-16

`ONE_REGISTER.md` and `02_OWNER_DESK.md` are the two documents sessions edit most
and the two the owner is asked to act from. **Until today neither was under
version control.**

They lived only in `~/Documents/Claude/Projects/Setnayan_Finale_2026-09-13/`,
which sits inside the **stale `/Users/icecasasola` checkout** — the one
`CLAUDE.md` warns is 749 commits behind and must never be trusted as current.
That repo's root `.gitignore` opens with `/*`, an allowlist, so both files were
silently swallowed: `git check-ignore -v ONE_REGISTER.md` →
`.gitignore:18:/*`.

🔑 **So a full day of edits — a 🛑 stop banner, fifteen rows closed with
evidence, a re-measure appendix, and twenty-four new launch-readiness rows — had
no history and no backup, while being reported as "recorded".** Nothing was lost,
but nothing could have been recovered either.

**These copies are the tracked ones.** Edit here, and mirror out to the Finale
folder if a session still reads from there.

⚠ Same failure mode as the one already in memory — *the root gitignore is an
allowlist that silently swallows a new top-level folder*. It had been recorded
once and still cost a day, because nobody checked whether the FILES they were
told to maintain were inside it. **`git ls-files --error-unmatch <file>` before
believing an edit is saved.**
