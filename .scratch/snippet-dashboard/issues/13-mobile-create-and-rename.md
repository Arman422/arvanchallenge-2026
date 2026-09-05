# 13: Mobile create and rename without activating

## Parent

- 05: README and responsive layout
- ADR 0005: Shell chrome and mobile exclusive workspace

## What to build

On mobile, creating a snippet must **not** set an active snippet: add the row, start list-owned rename, and stay on the list after rename. Opening details requires an explicit row tap. Provide an explicit row edit control for later renames on mobile; keep double-click rename on pointer/desktop. Desktop/tablet create may still activate and focus the editor as today. Follow CONTEXT and ADR 0005.

## Acceptance criteria

- [x] Mobile New Snippet does not activate the snippet or open details
- [x] Create-time rename runs inline on the list; user remains on the list when rename ends
- [x] Tapping a row after naming opens snippet details
- [x] Mobile list rows expose an explicit edit control to rename
- [x] Desktop/tablet create and double-click rename behavior unchanged
- [x] Persistence and cross-tab rules for rename/create still hold

## Blocked by

- 12: Mobile exclusive workspace (list XOR details)
