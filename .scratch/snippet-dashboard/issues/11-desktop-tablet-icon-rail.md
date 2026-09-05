# 11: Desktop and tablet snippet list icon rail

## Parent

- 05: README and responsive layout
- ADR 0005: Shell chrome and mobile exclusive workspace

## What to build

On desktop and tablet, let the user collapse the **snippet list panel** to a narrow **icon rail** and expand it again via a **shell chrome** toggle. Rail shows New Snippet and one control per snippet (with accessible names/tooltips). Product title is centered in chrome on all viewports. Tablet keeps the side-by-side workspace model (list expanded by default), same as desktop. Do not change mobile navigation in this slice — mobile exclusive stack is a separate issue. Console remains strip-toggled at the shell bottom.

## Acceptance criteria

- [x] Desktop and tablet: snippet list expands/collapses to an icon rail via a user control
- [x] Icon rail remains usable for creating and selecting snippets
- [x] Tablet defaults to side-by-side with list expanded (desktop-like)
- [x] Mobile layout is not switched to icon rail by this slice
- [x] Console strip expand/collapse behavior unchanged

## Blocked by

None - can start immediately
