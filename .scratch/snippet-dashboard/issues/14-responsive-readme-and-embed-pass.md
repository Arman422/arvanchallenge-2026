# 14: Responsive README and embed-quality pass

## Parent

- 05: README and responsive layout

## What to build

Finish reviewer-facing docs and verify the responsive shell end-to-end. README must cover setup, mock API behavior, shell regions (chrome + workspace + console), and breakpoint defaults after chrome, icon rail, and mobile stack have shipped. Confirm the full create → edit → run → attributed console loop on tablet and mobile, and that the dashboard shell stays usable at roughly 400×500 with panels toggled.

## Acceptance criteria

- [x] README includes install, dev, and build commands and a mock API behavior summary
- [x] README describes shell chrome, workspace (including mobile exclusive stack), console strip, and panel defaults accurately
- [x] Full run loop works on tablet and mobile viewports
- [x] Snippet list and console remain reachable on smaller screens
- [x] Dashboard shell remains usable at ~400×500 when panels are toggled

## Blocked by

- 10: Shell chrome and theme toggle
- 11: Desktop and tablet snippet list icon rail
- 12: Mobile exclusive workspace (list XOR details)
- 13: Mobile create and rename without activating
