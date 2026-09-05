# 05: README and responsive layout

**What to build:** Finish deliverables for reviewers. Update **README** with project setup instructions and a brief explanation of how the **mock API** works. Implement responsive layout for tablet and mobile — resolve deferred breakpoint decisions during this ticket (desktop-first; workspace must remain usable on smaller screens). Add **panel toggles** for snippet list (collapse to icon rail) and console (expand/collapse via strip). Console does **not** auto-open on run in v1. Document responsive and panel choices made. Challenge requires tablet and desktop at minimum; mobile support included per spec.

**Blocked by:** 06: Session console at shell bottom

**Status:** ready-for-agent

- [ ] README includes install, dev, build commands and mock API behavior summary
- [ ] README describes shell layout (workspace + full-width console) and panel defaults
- [ ] Snippet list collapses to an icon rail via a user-toggleable control
- [ ] Console expands/collapses via the persistent strip at the shell bottom (not the editor toolbar)
- [ ] Narrow-width defaults for panel visibility implemented (desktop: expanded list + expanded console; mobile: icon rail + collapsed console strip)
- [ ] Layout adapts on tablet breakpoints without breaking the workspace + console mental model
- [ ] Layout adapts on mobile breakpoints; panel toggles carry the same behavior as tablet
- [ ] Console remains accessible on smaller screens (collapsed strip at minimum)
- [ ] Snippet list remains reachable on smaller screens
- [ ] Full run loop (create snippet → edit → run → see attributed console output) works on tablet and mobile viewports
- [ ] Dashboard shell remains usable at ~400×500 when panels are toggled (embed-quality bar)
