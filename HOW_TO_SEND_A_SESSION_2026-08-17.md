# How to send a session — the protocol, written from what went wrong today

> **Every rule below is a thing that actually happened on 2026-08-17**, not a precaution.
> Twenty-plus changes merged, three sessions ran in parallel, and the failures were never about
> code quality — they were about **sessions not knowing what the other sessions were doing.**

---

## 1 · The four ways parallel sessions hurt each other today

| what happened | cost | the rule it produces |
|---|---|---|
| Two sessions **revoked and re-granted the same permission** hours apart. Both were correct in isolation; together they re-opened a disclosure. **Neither pull request could show it.** | nearly shipped | **Re-read the live state immediately before merging, never only when you start.** |
| Two sessions **repaired the same broken guard** independently, each a different way. | one conflict, one wasted repair | **Check open branches before fixing shared infrastructure.** |
| A session **rebuilt sign-up** hours after another had touched it. | one conflicting PR | **Check what merged TODAY, not what the register says.** |
| A branch sat **37 commits behind main** and was broken three separate times by main moving. | three rounds of rework | **A long-lived branch is a liability. Merge main daily or finish faster.** |

🔑 **NONE of these were caught by the file-overlap matrix.** Two sessions can share zero files and
still undo each other. **Overlap analysis is necessary and not sufficient.**

---

## 2 · The three-part shape every session prompt must have

**① THE SHARED HEADER** — the rules that override a fresh session's defaults, plus today's real
production numbers so nobody argues with the product from memory.

**② THE COORDINATION BLOCK** *(new — this is what was missing)*:

```
BEFORE YOU WRITE ANY CODE, RUN THIS AND PASTE THE RESULT INTO YOUR FIRST REPLY:

  git fetch origin --quiet
  git log origin/main --oneline --since="24 hours ago" | head -30
  gh pr list --state open --json number,title,headRefName \
    -q '.[]|"#\(.number) [\(.headRefName)] \(.title)"'

Then answer, in one line each:
  - Did anything in that list touch what I am about to touch? (name it, or say none)
  - Is a branch already open for MY job? (if yes, STOP and say so — do not open a second)
  - Which of my "already ships" lines does that list contradict?

AND BEFORE YOU MERGE, run the same two commands AGAIN. On 2026-08-17 a change that was
correct when written would have undone another session's work by the time it merged,
and nothing in either pull request could have revealed it.

IF YOUR WORK TOUCHES DATABASE PERMISSIONS: re-read the LIVE grants immediately before
merging. A migration is judged against the state it will LAND in, not the state it was
written against.
```

**③ THE JOB ITSELF** — with its "already ships" list, its traps, and anything unverified marked
`UNVERIFIED — CHECK FIRST`.

---

## 3 · What "already ships" must be, or the session rebuilds it

**Four things today were reported as missing while shipped, two of them by me.** The Event Hub,
the host's own page, the photo-consent gate, and the switches alarm.

So an "already ships" line is only worth writing if it was **read out of the code or the live
database on the day the prompt is written**, and it must say which. **A line copied from an older
prompt is how a session gets paid to rebuild something.**

🪤 **AND A CHANGELOG IS NOT EVIDENCE — NEITHER IS A GREP COUNT.** Checking one session's work by
counting strings said three items were still broken; reading them showed all three were fixed and
the survivors were **comments describing the old behaviour**. **Read the line.**

---

## 4 · How to tell a session it is DONE

Never delete a finished session's prompt. Put a banner on it:

```
# SESSION N · <name> — ✅ DONE, DO NOT RE-RUN
**PR #NNNN, merged <date>. VERIFIED IN THE CODE, not from its changelog.**
```

**Why the banner and not deletion:** a deleted prompt gets rewritten from an older document, and
the older document is the one with the stale claims in it.

---

## 5 · Reporting back — what the owner actually needs

- **Plain English, what a PERSON experiences.** No file paths, table names or flag names.
- **Separate what was PROVED LIVE from what was PROVED BY TESTS.** Production has 6 events, 39
  guests and 0 orders, so most claims cannot be shown on the live site. **Say which is which
  rather than letting "verified" cover both.**
- **Say what you did NOT do,** and why. A scope quietly narrowed is worse than a scope refused.
- **If a claim in the prompt turned out to be false, lead with that.** Today a session was told to
  build something already built; it checked, found it, and shipped proof instead. **That is the
  best possible outcome and it should be reported as a win, not an apology.**

---

## 6 · The standing traps every prompt carries

- **A rejected query is not a thrown error.** A phantom column, enum value, function argument, a
  blocked iframe or a missing grant all fail the same way — the only symptom is an absence.
- **An empty column is not a missing mechanism.** Zero rows means nobody has done it yet. Grep for
  the WRITER.
- **DROP + CREATE is a reset, not an edit.** Every grant, and every later narrowing of one, is
  discarded — and this database hands back write privileges by default. ⚠ **When you fix that
  shape, sweep every instance of it in the same file:** today I fixed one of three rebuilt views
  in a single migration and left the other two publicly writable.
- **"Auto-merge armed" is not "will merge."** Four changes sat armed and red for two days.
- **A guard must be able to FAIL.** Sabotage it and print the occurrence count before and after.
- **Verify the push landed** by reading the remote. A failed push can report success.
- **Restore from an explicit backup, never from the index** — `git checkout` cannot restore an
  untracked file, and will silently leave your sabotage in place.
