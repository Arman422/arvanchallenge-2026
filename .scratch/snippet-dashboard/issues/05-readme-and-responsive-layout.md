# 05: README and responsive layout

**What to build:** Finish deliverables for reviewers. Update **README** with project setup instructions and a brief explanation of how the **mock API** works. Implement responsive layout for tablet and mobile per [ADR 0005](../../../docs/adr/0005-shell-chrome-and-mobile-stack.md): **shell chrome** (theme toggle; desktop product title; mobile back on details), tablet follows desktop side-by-side, mobile uses exclusive list XOR details (no icon rail). Desktop/tablet keep snippet list collapse to icon rail. Console expand/collapse via strip only; starts collapsed; running a snippet expands it. Document responsive and panel choices made. Challenge requires tablet and desktop at minimum; mobile support included per spec.

**Blocked by:** 06: Session console at shell bottom

**Status:** ready-for-agent

- [ ] README includes install, dev, build commands and mock API behavior summary
- [ ] README describes shell layout (chrome + workspace + full-width console) and panel defaults
- [ ] Shell chrome hosts theme toggle on all viewports; product title on desktop; back on mobile details
- [ ] Desktop/tablet: snippet list collapses to an icon rail via a user-toggleable control
- [ ] Console expands/collapses via the persistent strip at the shell bottom (not the editor toolbar or shell chrome)
- [ ] Tablet follows desktop side-by-side defaults (expanded list + collapsed console)
- [ ] Mobile: exclusive list or details; back deselects; create does not activate; list-owned rename with explicit edit control
- [ ] Console remains accessible on smaller screens (collapsed strip at minimum)
- [ ] Snippet list remains reachable on smaller screens
- [ ] Full run loop (create snippet → edit → run → see attributed console output) works on tablet and mobile viewports
- [ ] Dashboard shell remains usable at ~400×500 when panels are toggled (embed-quality bar)
