# 04: Mock API, run flow, and console

**What to build:** End-to-end **run** loop. A **mock API** at `POST /api/run` accepts `{ code }`, rejects missing or whitespace-only code with HTTP 400, waits 2–3 seconds, then returns success (~80%, `{ status: "success", output: "Hello World" }`) or error (~20%, `{ status: "error", message: "..." }`). The Run action in the editor zone toolbar sends the **active snippet**'s code; it is disabled when code is empty. During a run (**run lock**): Run shows a spinner and is disabled; the editor becomes read-only; the session **console** appends a "Running…" entry (tagged with the active snippet) that updates on response. Console is append-only with timestamps and snippet attribution, terminal-like styling, and a Clear action that resets the entire session log. Automated tests cover the mock API at the HTTP/handler level with stubbed delay and randomness.

**Blocked by:** 03: Monaco editor and snippet detail view

**Status:** ready-for-agent

- [ ] `POST /api/run` validates payload; returns 400 for missing/empty code
- [ ] Successful responses match `{ status: "success", output: "Hello World" }` after 2–3s delay
- [ ] Error responses match `{ status: "error", message: "..." }` after 2–3s delay (~20% in production)
- [ ] Run button in editor zone toolbar; disabled when active snippet has no code
- [ ] During run: button spinner + disabled; editor read-only until response
- [ ] Console shows timestamped entries with snippet name attribution (`snippetName › message`)
- [ ] "Running…" updates to success output or error message; attribution uses snippet name at run time
- [ ] Clear button empties the entire session console log
- [ ] Automated tests verify validation, success, and error paths with deterministic stubs
- [ ] Test runner added to project and wired into CI

## Comments

Console shell placement and strip toggle are tracked in **06: Session console at shell bottom**. See `docs/adr/0001-session-console-at-shell-bottom.md`.
