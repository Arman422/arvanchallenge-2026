# 09: Change snippet language from the editor zone

**What to build:** When a snippet is active, the **editor zone** lets the user change its **snippet language** to any allowlisted value. The list metadata language label updates; the editor rebinds highlighting (and error marking where available) to the new language without recreating the snippet. “+ New Snippet” stays create-with-default only — no language picker on create. Prefer extending the existing editor-zone toolbar over new modules. Follow ADR 0004 and CONTEXT. Depends on multi-language editor behavior (08).

**Blocked by:** 08: Multi-language snippet body in the editor

**Status:** ready-for-agent

## Acceptance criteria

- [x] Active snippet has a control in the editor zone to pick any allowlisted snippet language
- [x] Changing language updates the snippet (and persistence) and the list metadata label
- [x] Editor highlighting (and errors where Monaco provides them) follows the new language without remounting a new snippet identity
- [x] “+ New Snippet” does not ask for a language; default remains JavaScript
- [x] No unnecessary new modules

## Blocked by

- 08: Multi-language snippet body in the editor
