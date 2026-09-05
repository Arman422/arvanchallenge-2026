# Code Snippet Dashboard

A Nuxt dashboard for writing and managing language-tagged code snippets in the browser. Select snippets from a flat list, edit in Monaco (syntax highlighting for an allowlisted set of languages; new snippets default to JavaScript), run against a mock execution API, and read timestamped output in a shared **Output Console** at the bottom of the page (the challenge’s “Output Console Simulation” requirement).

The **snippet list** is persisted in same-origin browser storage (`localStorage`) and stays in sync across tabs of the same browser profile. The active selection, Output Console history, panel expand/collapse, and run lock stay tab/session-local — they are not written to storage and are not shared across tabs.

Built with [Nuxt](https://nuxt.com), [Nuxt UI](https://ui.nuxt.com), and [Monaco Editor](https://microsoft.github.io/monaco-editor/).

The dashboard shell is sized to fill its host (`h-dvh` on the full page). It is intended to stay usable in a constrained box (~400×500) with panels toggled — a reviewer embed-size target for small viewports.

## Setup

Install dependencies:

```bash
pnpm install
```

## Development

Start the dev server at `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run Nuxt TypeScript checks |
| `pnpm test` | Run tests |

## Testing

We prefer colocated tests — test files live beside the module they cover.

## Mock API

The dashboard does **not** execute code. Running a snippet sends a `POST` request to `/api/run` (body is the snippet text only — language does not affect the mock):

**Request**

```json
{ "code": "<non-empty string>" }
```

**Responses**

| Outcome | HTTP | Body |
| --- | --- | --- |
| Success (~80%) | 200 | `{ "status": "success", "output": "Hello World" }` |
| Simulated error (~20%) | 200 | `{ "status": "error", "message": "Simulated execution failed" }` |
| Invalid payload | 400 | Empty or missing `code` is rejected |

Each request waits a random **2–3 seconds** before responding so loading UX can be evaluated. While a run is in flight the editor is read-only and the Run button shows a spinner.

## Layout and responsive behavior

The **dashboard shell** has three regions:

- **Shell chrome** (top) — theme toggle on all viewports; snippet-list expand/collapse on desktop/tablet; centered product title (“Snippet Manager”) on all viewports; back control on mobile when snippet details are showing. No console control in chrome.
- **Workspace** — snippet list and snippet details. Desktop/tablet: side by side (list may collapse to an icon rail). Mobile: exclusive list **or** details (no icon rail).
- **Output Console** (bottom) — full-width session log spanning beneath the workspace; expand/collapse via the persistent strip only

On desktop and tablet, snippet details shows a placeholder when nothing is selected, or the editor zone (language control + toolbar + Monaco) when a snippet is active. On mobile, the snippet list fills the workspace until a row is selected; back clears the selection and returns to the list. Creating a snippet on mobile does not open details — rename stays on the list; tap a row to edit. Mobile rename uses an explicit row edit control; desktop keeps double-click. New Snippet sits at the bottom of the mobile list.

The Output Console is session-scoped: one shared log for all runs in the current tab, with each entry tagged by snippet name (`[HH:MM:SS] snippetName › message`). Reloading or opening a new tab restores the snippet list from browser storage with **no** active snippet; the console starts empty again.

Edits bind directly to snippets — no save button and no dirty indicators. Create, rename, and delete write through to storage immediately; code edits debounce (~300ms). Other tabs of the same origin quietly adopt the latest whole-list snapshot.

The Output Console starts **collapsed** (strip only). Running a snippet expands it so the “Running…” entry and result are visible; if you collapse it mid-run, it stays collapsed.

### Breakpoints and panel defaults

| Viewport | Width | Workspace default | Output Console default |
| --- | --- | --- | --- |
| Desktop | ≥ 1024px (`lg`) | Side-by-side; list expanded | Collapsed (strip only) |
| Tablet | 768–1023px (`md`–`lg`) | Side-by-side; list expanded (same as desktop) | Collapsed (strip only) |
| Mobile | < 768px (below `md`) | Exclusive list or details (no icon rail) | Collapsed (strip only) |

Breakpoints use Tailwind defaults via VueUse `useBreakpoints`. Console expand/collapse persists for the session regardless of resize. See [ADR 0005](docs/adr/0005-shell-chrome-and-mobile-stack.md).

### Snippet list toggle (desktop / tablet)

Collapse the snippet list to a narrow **icon rail** (48px) via the toggle in **shell chrome**. The rail shows a New Snippet button and one icon per snippet (with tooltip labels). Expand restores the full list with names and metadata. Mobile uses the exclusive list/details stack instead of a rail.

### Output Console toggle

Expand/collapse via the persistent strip labeled **Output Console** at the bottom of the shell. Collapsed state shows the strip only; expanded state grows the whole console panel to a fixed height (strip + scrollable log). The whole strip is clickable; Clear does not collapse the panel. There is no separate console button in shell chrome.

## Project structure

```
app/
  components/dashboard/   # Shell, snippet list, snippet details, editor, console
  composables/            # Session state, run flow, panel layout
docs/
  adr/                    # Architecture decision records
server/
  api/run.post.ts         # Mock execution endpoint
  utils/runMock.ts        # Validation, delay, random outcomes
```

See `CONTEXT.md` for domain terminology and `docs/adr/` for layout and persistence decisions (including [ADR 0002](docs/adr/0002-browser-persisted-snippet-list.md) for the browser-persisted snippet list and [ADR 0005](docs/adr/0005-shell-chrome-and-mobile-stack.md) for shell chrome and mobile navigation).
