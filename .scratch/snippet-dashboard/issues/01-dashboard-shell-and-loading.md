# 01: Dashboard shell and initial loading

**What to build:** Replace the Nuxt UI starter page with the snippet dashboard chrome. Implement a **dashboard shell** root component (thin page host only). On load, a loading overlay scoped to the shell root appears for at least one second, then reveals the shell layout: a **workspace** row on top (snippet list panel left, **snippet details** right) and a full-width **console** along the bottom. No tab bar anywhere. Both workspace columns show **empty state** placeholders — no snippets, no Monaco, no editor toolbar yet. Console is visible but empty (terminal-styled placeholder). No panel toggle buttons in this slice. Starter template header/footer/marketing content is removed so the app is a full-viewport dashboard.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `index.vue` (or equivalent route) is a thin host; dashboard shell is a dedicated root component that fills the viewport
- [ ] Opening the app shows a loading overlay (scoped to the shell root) for ≥1 second, then the dashboard layout
- [ ] Workspace row: snippet list panel (left) and snippet details (right), sharing the height above the console
- [ ] Console spans full shell width at the bottom, beneath both workspace columns
- [ ] Console zone visible with empty/placeholder terminal styling (no run output yet)
- [ ] Empty state visible: snippet list shows a "New Snippet" call-to-action; snippet details shows a placeholder message (no tab bar, no toolbar)
- [ ] No panel toggle UI (list/console collapse) in this slice
- [ ] No starter template marketing page or unrelated chrome remains
- [ ] Layout uses Nuxt UI + Tailwind; respects system color mode (no custom theme pass)
- [ ] Shell uses flex/grid + `min-h-0` so nested regions can shrink (embed-ready; no host prop required)

## Comments

Layout follows `docs/adr/0001-session-console-at-shell-bottom.md` and `.scratch/snippet-dashboard/spec.md`.
