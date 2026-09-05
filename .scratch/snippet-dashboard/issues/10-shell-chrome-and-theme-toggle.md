# 10: Shell chrome and theme toggle

## Parent

- 05: README and responsive layout
- ADR 0005: Shell chrome and mobile exclusive workspace

## What to build

Add **shell chrome** to the dashboard shell on all viewports. Host the in-app **theme preference** toggle there (not in the snippet list). On desktop, show a product title (e.g. “Snippet Manager”). On mobile, omit the title for height. Do not add a console control in chrome — the console strip remains the only expand/collapse affordance. Follow CONTEXT and ADR 0003 / 0005.

## Acceptance criteria

- [x] Shell chrome appears above the workspace on desktop, tablet, and mobile
- [x] Theme toggle in shell chrome switches light/dark and persists as theme preference
- [x] Desktop chrome shows a product title; mobile chrome does not
- [x] No console toggle in shell chrome
- [x] Theme control is not placed in the snippet list panel

## Blocked by

None - can start immediately
