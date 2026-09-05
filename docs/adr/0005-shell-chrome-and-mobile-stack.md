# Shell chrome and mobile exclusive workspace

The dashboard shell gains a top **shell chrome** on all viewports for global actions (theme toggle; centered product title; snippet-list expand/collapse on desktop/tablet). On mobile, the workspace is exclusive — snippet list **or** snippet details, not side by side and not an icon rail. Selecting a snippet shows details; back clears the active snippet and returns to the list. Creating a snippet on mobile does not activate it: the list owns rename, the user stays on the list, and opening details requires an explicit row tap. Later renames on mobile use an explicit row edit control; desktop keeps double-click. Tablet follows the desktop side-by-side model for now. Console expand/collapse stays on the persistent strip only — no chrome console button.

## Considered options

**Icon rail on mobile (prior target).** Same panel mental model as desktop. Rejected for mobile: a rail plus editor is too cramped, and it fought a clear place for theme chrome.

**Drawer / overlay list over details.** Keeps one shell without a back stack. Rejected in favor of exclusive list XOR details so “active snippet” stays meaningful: selected means details are showing.

**Keep selection when returning to the list.** Would require a second mobile surface flag and leave a highlighted row with nowhere to show details. Rejected; back deselects.

**Chrome console toggle beside theme.** Rejected for now; the strip already toggles the console and a second control adds ambiguity.

**List expand/collapse in the snippet list header.** Worked for the expanded panel but cramped the 48px icon rail. Moved to shell chrome so the rail keeps only New Snippet + snippet icons, with the title centered between list toggle and theme.

## Consequences

- Shell regions are chrome, workspace, and console (extends ADR 0001’s workspace + console).
- Theme toggle and (on desktop/tablet) snippet-list toggle live in shell chrome (see ADR 0003 for theme).
- Mobile replaces the icon-rail story; desktop/tablet may still collapse the list to an icon rail.
- Mobile create must not set the active snippet until the user chooses a row.
- Spec, README, and issue #05 must not promise rail-on-mobile.
