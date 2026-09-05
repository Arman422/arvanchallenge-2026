# 12: Mobile exclusive workspace (list XOR details)

## Parent

- 05: README and responsive layout
- ADR 0005: Shell chrome and mobile exclusive workspace

## What to build

On mobile, the **workspace** shows either the **snippet list** or **snippet details**, not both and not an icon rail. With no **active snippet**, show the list. Selecting a row activates the snippet and shows details. A back control in **shell chrome** clears the active snippet and returns to the list. Console stays full-width at the shell bottom (strip at minimum). Tablet/desktop side-by-side behavior stays as-is. Follow CONTEXT and ADR 0005.

## Acceptance criteria

- [x] Mobile: only list or details is visible in the workspace at a time
- [x] No active snippet ⇒ list fills the workspace; selecting a row opens details
- [x] Back in shell chrome deselects and returns to the list
- [x] No icon rail on mobile
- [x] Console remains reachable (collapsed strip at minimum) on mobile
- [x] Desktop/tablet side-by-side workspace unchanged

## Blocked by

- 10: Shell chrome and theme toggle
