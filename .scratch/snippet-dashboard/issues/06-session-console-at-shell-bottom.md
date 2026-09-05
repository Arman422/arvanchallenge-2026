# 06: Session console at shell bottom

**What to build:** Align console layout and behavior with the session-console model. Move the console from snippet details to the bottom of the **dashboard shell**, spanning full width beneath the workspace (snippet list + snippet details). Snippet details contains only the placeholder or editor zone. The console is always mounted (strip visible at minimum), including during the empty state. Each log entry shows snippet attribution using the name frozen at run time. Expand/collapse is controlled only by the console strip (chevron + whole-strip click); no toggle in the editor toolbar. Clear resets the entire session log. Deleting a snippet does not remove its historical console entries.

**Blocked by:** 04: Mock API, run flow, and console

**Status:** ready-for-agent

- [ ] Shell layout: workspace row (list + snippet details) above, console below at full width
- [ ] Snippet details has no console; editor zone is toolbar + Monaco only
- [ ] Console strip is always visible; log area expands/collapses beneath it
- [ ] Console strip toggles expand/collapse; chevron reflects state; whole strip is clickable
- [ ] No console toggle in the editor zone toolbar
- [ ] Console visible during empty state (strip at minimum)
- [ ] Each console entry includes snippet name attribution (`[HH:MM:SS] snippetName › message`)
- [ ] Renaming or deleting a snippet does not rewrite existing console entries
- [ ] Clear empties the full session log

## Comments

See `docs/adr/0001-session-console-at-shell-bottom.md` and `.scratch/snippet-dashboard/spec.md`.
