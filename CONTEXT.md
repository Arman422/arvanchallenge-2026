# Code Snippet Dashboard

A browser-based workspace where users write JavaScript snippets, run them against a mock execution API, and read results in a session console. The snippet list is kept in the browser and shared across tabs of the same origin; the console and selection are not. Navigation follows an Obsidian-like model: a scannable snippet list on the left, snippet details on the right, and shared run output along the bottom.

## Language

**Snippet**:
A single editable unit of JavaScript source code the user can name, select, and run. Snippet data outlives a single tab and reload within the same browser origin.
_Avoid_: File, document, buffer

**Snippet list**:
A flat, ordered collection of all snippets — no folders, paths, or file explorer. Served from browser-local storage shared across tabs of the same origin. Serves as the sole navigation mechanism; there is no separate tab bar.
_Avoid_: File tree, workspace, project, tab bar

**Snippet metadata**:
Scanning labels shown on each snippet list row — language (JavaScript in v1) and a last-edited time shown as a relative age that stays current while the list is open.
_Avoid_: Dirty indicator, unsaved badge, save status, created timestamp

**Active snippet**:
The snippet currently selected in the snippet list, shown in the editor, and targeted when the user runs code. Tab-local — not written to browser storage; a new or reloaded tab starts with none selected.
_Avoid_: Open file, current tab, open snippet

**Run**:
Sending the active snippet's code to the mock API and awaiting a simulated success or error response.
_Avoid_: Execute, compile, evaluate

**Console**:
A session-scoped output region at the bottom of the dashboard shell, spanning full width beneath the workspace. One shared append-only log for all runs across all snippets within the current tab session — not written to browser storage and not shared across tabs. A persistent strip header expands and collapses the log; each entry is tagged with the snippet it came from.
_Avoid_: Terminal, output panel, REPL, per-snippet output

**Console entry**:
A single line in the session console log — timestamp, snippet name (frozen at run time), and message.
_Avoid_: Log line, output row

**Mock API**:
A server-side endpoint that validates the payload, waits 2–3 seconds, then returns a random success or error — it does not actually execute code.
_Avoid_: Runner, sandbox, executor

**Dashboard shell**:
The root workspace surface — workspace row on top, console on bottom. Intended to fill its host (full page today; embeddable in a constrained box later).
_Avoid_: App layout, page wrapper, floating panel

**Workspace**:
The top region of the dashboard shell — snippet list panel and snippet details side by side, above the console.
_Avoid_: Main area, content pane, working area

**Snippet list panel**:
The left-hand column of the workspace — a full-height flat list for creating, selecting, renaming snippets, and displaying snippet metadata. No file explorer.
_Avoid_: Sidebar, file tree, navigator

**Snippet details**:
The right-hand column of the workspace — a placeholder when no snippet is active, or the editor zone when a snippet is active.
_Avoid_: Working area, main panel, detail pane

**Editor zone**:
The toolbar and code editor within snippet details for the active snippet.
_Avoid_: Editor pane, code panel, tab bar

**Rename snippet**:
Changing a snippet's display name via inline edit in the snippet list. Starts automatically after creating a snippet (default name selected), or by double-clicking an existing name. Escape or confirming an empty name keeps the previous name. Enter or Escape moves focus to the editor; blur does not.
_Avoid_: File rename, title edit, retitle

**Delete snippet**:
Removing a snippet from the snippet list via an action in the editor zone when that snippet is active. Non-empty snippets require confirmation; empty snippets delete silently. Does not remove that snippet's console entries.
_Avoid_: Close tab, dismiss, remove file

**Run lock**:
While a run request is in flight, action buttons are disabled with spinners and the editor is read-only until the response arrives. Tab-local — not shared across tabs.
_Avoid_: Loading state, busy flag

**Empty state**:
No snippets in the browser store (first visit or after every snippet was deleted): the list shows a "+ New Snippet" call-to-action, snippet details shows a placeholder, and the console remains available at the shell bottom. A non-empty hydrated list with no active snippet still shows the details placeholder until the user selects or creates one.
_Avoid_: Welcome screen, onboarding

**Theme preference**:
The user's chosen light or dark appearance for the dashboard shell. On first visit it is taken from the system appearance and then kept for later visits until the user changes it. No in-app theme control is exposed yet.
_Avoid_: Color mode, system theme (after first visit it no longer tracks the OS), app header theme switch
