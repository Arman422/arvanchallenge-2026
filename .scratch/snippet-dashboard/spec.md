# Spec: Integrated Code Snippet Management Dashboard

**Status:** ready-for-agent

---

## Problem Statement

The developer needs to complete a front-end job challenge: build a dashboard for writing and managing JavaScript code snippets, simulating code execution via a mock API, and displaying results in a terminal-style console. The solution must demonstrate solid Vue/Nuxt skills, thoughtful state management, loading UX, error handling, and responsive design — delivered as a clean, well-committed repository suitable for review.

The developer wants to build incrementally, addressing one verifiable slice at a time rather than designing every detail upfront.

## Solution

A Nuxt application with a **dashboard shell** split into a workspace row and a session **console**:

- **Workspace row** (top): a flat **snippet list panel** on the left and **snippet details** on the right (placeholder when no snippet is active; **editor zone** with toolbar and Monaco when a snippet is active).
- **Console** (bottom): a full-width, session-scoped output region beneath the entire workspace row (under both the snippet list and snippet details).

The product follows an Obsidian-like mental model — the snippet list is the index and sole navigator; snippet details is where the user edits, runs, and deletes the active snippet. Users create and manage **snippets** in the browser (same-origin storage, shared across tabs; no backend database, no file explorer), edit JavaScript in Monaco, **run** the active snippet against a mock server endpoint, and read timestamped output in the shared session **console**. Each log entry is tagged with the snippet it came from. Edits bind directly to snippet state (no save action, no dirty indicators) with automatic write-through to browser storage. Loading states gate user actions during startup and while runs are in flight.

## User Stories

1. As a developer, I want to open the dashboard and see an empty state, so that I understand I need to create my first snippet.
2. As a developer, I want a prominent "New Snippet" action in the snippet list panel, so that I can start writing code quickly.
3. As a developer, I want a newly created snippet to become active immediately in snippet details with a default name like `untitled-1`, so that I can start typing without extra steps.
4. As a developer, I want to see all my snippets in a flat list with no folders or file explorer, so that the mental model stays simple.
5. As a developer, I want to click a snippet in the list to make it the active snippet, so that I can switch between snippets I am working on.
6. As a developer, I want to double-click a snippet name to rename it inline, so that I can organize my snippets without a separate dialog.
7. As a developer, I want each snippet to retain its code when I select a different snippet in the list, so that edits are not lost when switching snippets.
7a. As a developer, I want my snippet list to survive a full page reload in the same browser, so that I do not lose work when refreshing.
7b. As a developer, I want the snippet list to stay in sync across tabs of the same origin, so that creating or editing in one tab is reflected when I switch to another.
7c. As a developer, I want a reloaded or newly opened tab to show the hydrated snippet list with no snippet active, so that selection stays tab-local.
8. As a developer, I want to see language and last-edited metadata on each snippet list row, so that I can scan my snippets at a glance.
9. As a developer, I want to delete the active snippet from the editor zone, so that I can remove snippets I no longer need.
10. As a developer, I want a confirmation prompt when deleting a snippet with non-empty content, so that I do not accidentally lose work.
11. As a developer, I want to delete an empty snippet without a confirmation, so that trivial cleanup is frictionless.
12. As a developer, I want the active snippet's code shown in a Monaco editor with JavaScript syntax highlighting, so that editing feels like a real IDE.
13. As a developer, I want the editor isolated behind a swappable wrapper component, so that Monaco can be replaced later without rewriting the dashboard.
14. As a developer, I want a Run action for the active snippet in the editor zone, so that I can send my code to the mock API.
15. As a developer, I want the Run action disabled when the active snippet has no code, so that I cannot submit invalid requests.
16. As a developer, I want a full-screen loading overlay for at least one second on initial app load, so that the startup experience feels intentional.
17. As a developer, I want the Run button to show a spinner and be disabled while a run is in flight, so that I cannot trigger duplicate requests.
18. As a developer, I want the editor to become read-only while a run is in flight, so that I cannot mutate code mid-request.
19. As a developer, I want a "Running…" indication appended to the console when a run starts, so that I know the system is working during the 2–3 second delay.
20. As a developer, I want run results appended to the console with timestamps, so that I have a log-style history of the session.
21. As a developer, I want successful runs to display the API output text in the console, so that I can see simulated success results.
22. As a developer, I want failed runs to display error text in the console, so that I can verify error handling.
23. As a developer, I want a Clear action on the console, so that I can reset the output log when it gets noisy.
24. As a developer, I want the console styled like a terminal, so that the output area feels familiar.
25. As a developer, I want the console to sit at the bottom of the dashboard shell spanning the full width (beneath both the snippet list and snippet details), so that output feels like a shared session terminal.
26. As a developer, I want each console entry to show which snippet produced it, so that I can tell runs apart when switching between snippets.
27. As a developer, I want to expand and collapse the console via a persistent strip at the top of the console panel, so that I can reclaim vertical space without losing the affordance to open it again.
28. As a developer, I want the console strip to use a chevron to indicate collapsibility and respond to clicking the whole strip, so that the toggle is easy to discover and use.
29. As a developer, I want the console to remain visible (at least as a collapsed strip) even when no snippet is active, so that I can review prior session output from the empty state.
30. As a developer, I want the mock API to reject empty or malformed code payloads with a client-visible error, so that validation is demonstrable.
31. As a reviewer, I want the mock API to wait 2–3 seconds before responding, so that loading UX can be evaluated.
32. As a reviewer, I want the mock API to return success roughly 80% of the time, so that happy-path handling can be evaluated.
33. As a reviewer, I want the mock API to return a simulated server error roughly 20% of the time, so that error-path handling can be evaluated.
34. As a developer, I want the app built with Nuxt and Nuxt UI, so that it aligns with the company's Vue ecosystem.
35. As a developer, I want the UI to respect system light/dark preference, so that it works in either color mode without a custom theme pass yet.
36. As a developer, I want the layout to work on desktop, tablet, and mobile, so that the challenge's responsive requirement is met.
37. As a developer, I want a README with setup instructions and a brief explanation of the mock API, so that reviewers can run and understand the project.
38. As a developer, I want meaningful git commits as I build each slice, so that my workflow is visible to reviewers.
39. As a developer, I want a placeholder in snippet details when no snippet is active, so that the empty state is clear before I create or select a snippet.
40. As a developer, I want Monaco to mount only when a snippet is available to edit, so that the empty state stays lightweight.
41. As a developer, I want the snippet list panel to span the full height of the workspace row above the console, so that the left column is visually distinct from snippet details.

## Implementation Decisions

### Product mental model (decided)

- **Obsidian-like, not IDE-like**: The snippet list is the index and sole navigator. There is no tab bar, no "open snippets" working set, and no dirty/unsaved indicators.
- **List = scan, detail = act**: The snippet list shows names and metadata for navigation. Actions (Run, Delete) live in the editor zone for the active snippet.
- **Session console**: The console is a separate session entity — one shared log for all runs across all snippets in the current tab, not scoped to the active snippet. Output persists when switching snippets within the tab; it is not written to browser storage and not shared across tabs.
- **Direct-bind edits, browser-persisted list**: All edits bind directly to snippet objects (no save action, no dirty indicators). The snippet list is automatically written through to same-origin browser storage and synced across tabs (see ADR 0002). Active snippet, console, panel chrome, and run lock remain tab/session-local.

### Stack and scaffolding

- **Framework**: Nuxt (Vue) with Nuxt UI and Tailwind CSS. Scaffold is already in place; `monaco-editor` is installed but not yet wired up.
- **Component library**: Nuxt UI for buttons, modals (delete confirmation), loading spinners, and color mode. Chosen for speed; swappable later without rewriting business logic.
- **Editor**: Monaco Editor behind a thin wrapper component exposing `modelValue`, `language`, and `readOnly`. The rest of the app never imports Monaco directly.
- **Language**: JavaScript only for v1. Per-snippet language selection is deferred; list rows show a static "JavaScript" label.

### Shell architecture (decided)

- **Root component**: A single **dashboard shell** component owns the workspace layout, initial loading overlay, and panel regions. The page route is a thin host (e.g. full-viewport wrapper only).
- **Host-agnostic sizing**: The shell fills its parent via height/flex constraints (`h-full`, `min-h-0`). No `host` prop matrix in v1 — embed or modal hosts constrain size with CSS later.
- **Layout regions** orchestrated by the shell:
  - **Workspace row** (top, `flex-1`): **snippet list panel** (left) + **snippet details** (right).
  - **Console** (bottom, full width): session output panel spanning the entire shell width.
- **Snippet details** contains only the placeholder (empty state) or the **editor zone** (toolbar + Monaco). It does **not** contain the console.
- **Quality bar**: The shell must not layout-break at ~400×500 (informal checklist when wiring Monaco). Floatability is not a product requirement — constrained hosts prove embed relevance.

### Layout (desktop — decided)

- **Workspace row**:
  - **Snippet list panel**: Left column, full height of the workspace row. Contains "New Snippet", the flat snippet list with metadata per row, and active-row highlight. Togglable to an icon rail on narrower viewports.
  - **Snippet details**: Right column. Shows a placeholder when no snippet is active; shows the editor zone (toolbar + Monaco) when a snippet is active.
- **Console**: Bottom of the dashboard shell, full width beneath the workspace row. Includes:
  - A **persistent strip** (fixed height when collapsed) acting as the console header — label, chevron indicating expand/collapse state, and Clear when expanded and entries exist. The whole strip is clickable to toggle.
  - An **expandable log area** beneath the strip when expanded.
- **Console in empty shell**: Visible (at minimum the collapsed strip); shows terminal-styled placeholder or prior session output.

### Layout (tablet and mobile — direction set; implementation in responsive slice)

- Desktop-first; breakpoint behavior ships in the responsive slice (issue #05), after core workflow works.
- **Interaction model (target)**: Panel toggles — user can collapse/expand the snippet list (to icon rail) and expand/collapse the console; same mental model on narrow widths and constrained embeds (not a separate floating UX).
- **Snippet list (target)**: Expanded by default on desktop; icon rail on tablet and mobile.
- **Console defaults (target)**: Expanded on desktop and tablet; collapsed (strip only) on mobile.
- **Console auto-open on run**: Deferred; v1 run flow does not force the console open.
- **Console resize**: Deferred; expanded height uses fixed bounds in v1.
- **Not a goal**: Raycast-style floating launcher or “float mode” on mobile/tablet.

### Snippet and session state

- The **snippet list** is persisted in same-origin browser storage (e.g. `localStorage`) and shared across tabs of the same browser profile. No backend database, no file system paths, no cross-device sync. See [ADR 0002](../../docs/adr/0002-browser-persisted-snippet-list.md).
- **Automatic write-through**: create / rename / delete write storage immediately; code edits debounce (~300ms, aligned with `lastEditedAt`). No save button and no dirty indicators.
- **Cross-tab sync**: other tabs are notified (e.g. `storage` events) and quietly replace their in-memory list (whole-list last-write-wins). If the active id is missing after adopt, deselect; if still present, adopt the winning fields.
- **Not persisted / not cross-tab**: active snippet id, console entries, panel expand/collapse, run lock, startup overlay.
- A **snippet** has an id, a user-visible name, code text, a language label (`JavaScript` in v1), and a `lastEditedAt` timestamp stored with the snippet.
- The **active snippet** is tracked by id in the current tab only; selecting a list row or creating a snippet updates it. Hydration after reload or a new tab restores the list with **no** active snippet.
- Edits in Monaco bind directly to the active snippet's `code` and update `lastEditedAt` (debounced updates are acceptable).
- **Delete** removes the snippet from the list (and storage). If it was active, select another snippet or show the details placeholder. Confirm when `code` is non-empty; delete silently when empty. Deleting a snippet does **not** remove its console entries — historical log lines keep the snippet name as it was at run time. No in-app bulk “wipe all snippets” in v1.
- Default naming: `untitled-1`, `untitled-2`, etc.
- No separate "open snippets" collection. No dirty/unsaved state.

### Empty state (decided)

- On first visit (empty browser store): no snippets exist.
- Snippet list shows "New Snippet" CTA (and optionally muted empty-list text).
- Snippet details shows a placeholder ("Create or select a snippet to start"); Monaco is not mounted until a snippet is active.
- After reload or a new tab with a non-empty stored list: list is hydrated, **no** snippet is active, details still shows the placeholder until the user selects or creates one.
- Console remains mounted at the shell bottom (strip visible; log expandable); console starts empty each tab session.
- Run is disabled until an active snippet with non-empty code exists.

### Run flow and run lock

- Run sends `{ code: string }` for the active snippet to the mock API.
- During a run (**run lock**): Run button disabled with spinner; editor read-only; console receives a running entry (tagged with the active snippet) that is updated when the response arrives.

### Console behavior

- **Session-scoped**: One append-only log for the entire session, shared across all snippets.
- **Attribution**: Each entry stores a snapshot of the snippet id and name at run time. Display format: `[HH:MM:SS] snippetName › message` (e.g. `[14:32:01] untitled-1 › Hello World`). Renaming or deleting a snippet does not rewrite historical entries.
- **Strip toggle**: No console toggle in the editor zone toolbar. Expand/collapse is controlled only via the console strip. Chevron reflects state (up when collapsed, down when expanded). The whole strip is the click target; Clear uses a separate control that does not toggle collapse.
- **Clear**: Resets the entire session log.
- Terminal-like visual styling (dark background, monospace font).

### Initial loading

- Loading overlay scoped to the **dashboard shell root** (covers the shell, not necessarily the whole document) for a minimum of ~1 second on startup, then dismissed. Works in full-page and future constrained hosts. Skeleton loading is a possible future replacement.

### Mock API contract

```
POST /api/run
Request:  { "code": "<non-empty string>" }
Success:  { "status": "success", "output": "Hello World" }   (~80%)
Error:    { "status": "error", "message": "<message>" }     (~20%)
Invalid:  HTTP 400 when code is missing or empty/whitespace-only
Delay:    Random 2000–3000 ms before response
```

The API does not execute code; it simulates network latency and random outcomes.

### Theming

- Use Nuxt UI `colorMode` with system preference. No dedicated dark-theme polish pass in v1.

### Incremental delivery

- Build in tracer-bullet vertical slices (spec → tickets → implement one at a time).
- Developer controls commit timing; each slice should be independently demoable.

## Testing Decisions

### What makes a good test

- Test **external behavior**, not implementation details.
- Prefer the **highest seam** that gives deterministic, fast feedback.
- Avoid testing Monaco internals or Nuxt UI component rendering details.

### Proposed test seam (single primary seam)

**Mock API endpoint** (`POST /api/run`) tested at the HTTP/handler level:

- Rejects missing or empty `code` with 400.
- Returns `{ status: "success", output: "Hello World" }` when randomness is seeded/stubbed to success.
- Returns `{ status: "error", message: "..." }` when randomness is seeded/stubbed to failure.
- Delay is injectable or stubbed so tests do not wait 2–3 seconds.

This is the highest seam that covers challenge-mandated server behavior deterministically. Randomness and delay must be controllable in tests (dependency injection or module-level stubs) without changing the production contract.

### Modules to test

- Mock API handler and pure layout/default helpers (e.g. viewport-tier panel defaults). No composable or E2E tests until a test runner is added to CI.

### Prior art

- CI runs lint, typecheck, and Vitest. Console log formatting and panel defaults are covered at the unit level.

### UI verification

- Manual browser verification for layout, editor, console, and loading states until E2E is explicitly scoped.

## Out of Scope

- Actual JavaScript code execution or sandboxing.
- Backend database or cross-device sync. (Same-origin browser storage for the **snippet list** is in scope; see ADR 0002. Console history is not persisted.)
- IndexedDB (v1 uses a simple storage API such as `localStorage` unless size forces a change).
- File explorer, folders, or file paths.
- Tab bar, open-snippet working set, or dirty/unsaved indicators.
- Manual save/sync controls or bulk “reset all snippets” in the UI.
- Multi-language snippet support (Python, etc.) — deferred; v1 shows a static JavaScript label only.
- Authentication or multi-user sessions.
- Deploy/hosting configuration beyond standard Nuxt build.
- Dedicated dark-theme design pass.
- Skeleton loading screen (possible future replacement for full-screen loader).
- Git commits made by the agent without explicit developer request.
- Console auto-open on run.
- Console resize by drag.
- Unread/output indicators on the console strip when collapsed.
- Per-snippet console filtering.

## Further Notes

### Decisions explicitly deferred (resolve in later slices)

| Topic | Status |
|-------|--------|
| Console auto-open on run | Deferred (not in v1 run flow) |
| Console resize (drag handle) | Deferred; fixed expanded height in v1 |
| Unread indicator on collapsed console strip | Deferred |
| Per-snippet console filter | Deferred |
| Skeleton vs shell-scoped initial loader | Shell-scoped overlay chosen for v1; skeleton later |
| Per-snippet language selection | Deferred; static JavaScript label in v1 |

### Superseded decisions

| Previous decision | Superseded by |
|---|---|
| Console at bottom of working area only (not beneath snippet list) | Full-width console at bottom of dashboard shell |
| Console toggle in editor zone toolbar | Console strip as sole expand/collapse control |
| Term "working area" for the right column | **Snippet details** (see `CONTEXT.md`) |
| Snippet list session-only / no localStorage | Browser-persisted snippet list with cross-tab write-through (ADR 0002) |

### Domain glossary

See `CONTEXT.md` at repo root for canonical terminology (snippet, snippet list, snippet details, run, console, mock API, run lock, empty state, etc.).

### Challenge source

Requirements originate from `docs/challenge-question/FrontEnd_Developer_Challenge.en.md`. The challenge asks for output "at the bottom of the page"; the shell-bottom full-width console satisfies this.

### Issue tracker setup

This spec is published locally at `.scratch/snippet-dashboard/spec.md`. Run `/setup-matt-pocock-skills` to formalize issue tracker configuration before `/to-tickets`.
