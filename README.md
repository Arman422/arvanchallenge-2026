# Code Snippet Dashboard

A Nuxt dashboard for writing and managing JavaScript code snippets in the browser. Select snippets from a flat list, edit in Monaco, run against a mock execution API, and read timestamped output in a shared **Output Console** at the bottom of the page (the challenge’s “Output Console Simulation” requirement).

The **snippet list** is persisted in same-origin browser storage (`localStorage`) and stays in sync across tabs of the same browser profile. The active selection, Output Console history, panel expand/collapse, and run lock stay tab/session-local — they are not written to storage and are not shared across tabs.

Built with [Nuxt](https://nuxt.com), [Nuxt UI](https://ui.nuxt.com), and [Monaco Editor](https://microsoft.github.io/monaco-editor/).

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

The dashboard does **not** execute JavaScript. Running a snippet sends a `POST` request to `/api/run`:

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

The **dashboard shell** splits into two regions:

- **Workspace** (top) — snippet list panel (left) and snippet details (right)
- **Output Console** (bottom) — full-width session log spanning beneath both columns

Snippet details shows a placeholder when nothing is selected, or the editor zone (toolbar + Monaco) when a snippet is active. The Output Console is session-scoped: one shared log for all runs in the current tab, with each entry tagged by snippet name (`[HH:MM:SS] snippetName › message`). Reloading or opening a new tab restores the snippet list from browser storage with **no** active snippet (details stays on the placeholder until you select or create one); the console starts empty again.

Edits bind directly to snippets — no save button and no dirty indicators. Create, rename, and delete write through to storage immediately; code edits debounce (~300ms). Other tabs of the same origin quietly adopt the latest whole-list snapshot.

The Output Console starts **collapsed** (strip only). Running a snippet expands it so the “Running…” entry and result are visible; if you collapse it mid-run, it stays collapsed.

### Breakpoints and panel defaults

| Viewport | Width | Snippet list default | Output Console default |
| --- | --- | --- | --- |
| Desktop | ≥ 1024px (`lg`) | Expanded | Collapsed (strip only) |
| Tablet | 768–1023px (`md`–`lg`) | Expanded | Collapsed (strip only) |
| Mobile | < 768px (below `md`) | Icon rail (collapsed) | Collapsed (strip only) |

Breakpoints use Tailwind defaults via VueUse `useBreakpoints`. Panel defaults are applied on first load from the current viewport; expand/collapse persists for the session regardless of resize.

### Snippet list toggle

Collapse the snippet list to a narrow **icon rail** (48px) via the panel toggle in the list header. The rail shows a New Snippet button and one icon per snippet (with tooltip labels). Expand restores the full list with names and metadata. The same toggle behavior applies on desktop, tablet, and mobile.

### Output Console toggle

Expand/collapse via the persistent strip labeled **Output Console** at the bottom of the shell. Collapsed state shows the strip only; expanded state shows the log beneath it. The whole strip is clickable; Clear does not collapse the panel.

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

See `CONTEXT.md` for domain terminology and `docs/adr/` for layout and persistence decisions (including [ADR 0002](docs/adr/0002-browser-persisted-snippet-list.md) for the browser-persisted snippet list).
