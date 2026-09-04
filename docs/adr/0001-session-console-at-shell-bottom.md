# Session console at shell bottom

The console lives at the bottom of the dashboard shell, spanning full width beneath the workspace (snippet list + snippet details). It is a session-scoped log shared across all snippets — not scoped to the active snippet.

Each console entry records a snapshot of the snippet name at run time (`[HH:MM:SS] snippetName › message`). Expand/collapse is controlled by a persistent strip on the console panel — not by the editor toolbar. Deleting or renaming a snippet does not rewrite historical entries; Clear resets the entire session log.

## Considered options

**Console at bottom of snippet details (right column only).** Keeps the workspace row self-contained. Rejected because the console is a session entity, not part of editing one snippet; nesting it in snippet details blurred that boundary and left less horizontal room for attributed log lines.

**Per-snippet console (filtered by active snippet).** Avoids attribution labels and feels natural for a detail view. Rejected because switching snippets would hide prior output, making cross-snippet comparison harder and fighting the shared-terminal mental model.

## Consequences

- Shell layout is three regions: workspace row (list + snippet details) and console.
- Snippet list panel height is the workspace row, not the full viewport.
- Console remains visible (at least as a collapsed strip) during the empty state.
- Console resize and auto-open on run remain deferred.
