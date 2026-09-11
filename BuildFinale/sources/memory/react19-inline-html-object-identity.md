---
name: react19-inline-html-object-identity
description: "React 19 re-applies dangerouslySetInnerHTML whenever the {__html} OBJECT is new — on a contenteditable that wipes every typed letter; keep one object in useState"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 305d8925-2b7c-44aa-8e2d-a5d286f6f205
  modified: 2026-09-11T05:07:07.303Z
---

Measured 2026-09-11 (Setnayan step 6, a contenteditable caption): `dangerouslySetInnerHTML={{ __html: html }}`
with `html` held stable in state STILL reset the element's innerHTML on every re-render, because
React 19 compares the prop object, not the string. Each keystroke → commit → re-render → the letter
just typed vanished (MutationObserver: text added, then childList cleared). The box stayed empty
under the caret; nothing threw.

Fix: `const [inner] = useState(() => ({ __html: toHtml(text) }))` and pass `inner` itself. Write
later changes to the DOM yourself (only when the element is not focused).

**Why:** invisible to reading and to unit tests — only a real browser typing into it showed it.
**How to apply:** any uncontrolled contenteditable in this repo (React 19.2). Related:
[[setnayan-make-it-yours-step6-landed]].
