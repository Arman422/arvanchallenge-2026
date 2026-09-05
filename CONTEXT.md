# Code Snippet Dashboard

A browser-based workspace where users write language-tagged snippets, run them against a mock execution API, and read results in a session console. The snippet list is kept in the browser and shared across tabs of the same origin; the console and selection are not. On desktop and tablet, navigation is Obsidian-like: snippet list beside snippet details, shared run output along the bottom, with shell chrome above. On mobile, the list and details are exclusive — one surface at a time.

## Language

**Snippet**:
A named editable body of text with a snippet language, which the user can select and run. Snippet data outlives a single tab and reload within the same browser origin.
_Avoid_: File, document, buffer

**Snippet language**:
The language label on a snippet. It controls how the editor presents the body — syntax coloring for supported languages, and error marking only for languages that provide it. Plain text is a snippet language with no programming-language presentation. New snippets default to JavaScript; the user can change the language later from snippet details.
_Avoid_: File extension, MIME type, editor engine language id

**Snippet list**:
A flat, ordered collection of all snippets — no folders, paths, or file explorer. Served from browser-local storage shared across tabs of the same origin. Serves as the sole navigation mechanism; there is no separate tab bar.
_Avoid_: File tree, workspace, project, tab bar

**Snippet metadata**:
Scanning labels shown on each snippet list row — snippet language and a last-edited time shown as a relative age that stays current while the list is open.
_Avoid_: Dirty indicator, unsaved badge, save status, created timestamp

**Active snippet**:
The snippet shown in snippet details and targeted when the user runs code. Tab-local — not written to browser storage; a new or reloaded tab starts with none selected. On mobile, a non-null active snippet means details are showing; clearing it returns to the snippet list.
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
The root surface — shell chrome on top, workspace beneath it, console at the bottom. Intended to fill its host (full page today; embeddable in a constrained box later).
_Avoid_: App layout, page wrapper, floating panel

**Shell chrome**:
The top strip of the dashboard shell for global actions — theme toggle on all viewports, product title on desktop, and a back control on mobile when snippet details are showing. Not part of the snippet list or editor zone.
_Avoid_: App header, nav bar, marketing header, toolbar

**Workspace**:
The region of the dashboard shell between shell chrome and console. On desktop and tablet: snippet list panel and snippet details side by side. On mobile: either the snippet list or snippet details, not both.
_Avoid_: Main area, content pane, working area

**Snippet list panel**:
The list surface of the workspace — creating, selecting, and renaming snippets, and displaying snippet metadata. On desktop and tablet it is the left-hand column (optionally collapsible to an icon rail). On mobile it is the full workspace when no snippet is active.
_Avoid_: Sidebar, file tree, navigator

**Snippet details**:
The editing surface of the workspace — a placeholder when no snippet is active (desktop/tablet), or the editor zone when a snippet is active. On mobile it replaces the snippet list panel while a snippet is active.
_Avoid_: Working area, main panel, detail pane

**Editor zone**:
The toolbar and code editor within snippet details for the active snippet.
_Avoid_: Editor pane, code panel, tab bar

**Rename snippet**:
Changing a snippet's display name via inline edit in the snippet list. Starts automatically after creating a snippet (default name selected), by double-clicking an existing name on pointer devices, or via an explicit row edit control on mobile. Escape or confirming an empty name keeps the previous name. On desktop and tablet, Enter or Escape moves focus to the editor; on mobile after create-time rename the user stays on the list. Blur does not move focus to the editor.
_Avoid_: File rename, title edit, retitle

**Delete snippet**:
Removing a snippet from the snippet list via an action in the editor zone when that snippet is active. Non-empty snippets require confirmation; empty snippets delete silently. Does not remove that snippet's console entries.
_Avoid_: Close tab, dismiss, remove file

**Run lock**:
While a run request is in flight, action buttons are disabled with spinners and the editor is read-only until the response arrives. Tab-local — not shared across tabs.
_Avoid_: Loading state, busy flag

**Empty state**:
No snippets in the browser store (first visit or after every snippet was deleted): the list shows a "+ New Snippet" call-to-action; on desktop and tablet snippet details shows a placeholder; on mobile the list fills the workspace. The console remains available at the shell bottom. A non-empty hydrated list with no active snippet still shows the details placeholder on desktop/tablet until the user selects a snippet; on mobile the list remains showing until the user selects one.
_Avoid_: Welcome screen, onboarding

**Theme preference**:
The user's chosen light or dark appearance for the dashboard shell. On first visit it is taken from the system appearance and then kept for later visits until the user changes it. Changed in-app via the theme toggle in shell chrome.
_Avoid_: Color mode, system theme (after first visit it no longer tracks the OS)
