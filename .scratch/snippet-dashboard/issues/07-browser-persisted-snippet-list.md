# 07: Browser-persisted snippet list with cross-tab sync

**What to build:** Persist the **snippet list** in same-origin browser storage so it survives a full reload and stays shared across tabs of the same browser profile. Edits still bind directly to snippets — no save button, no dirty indicators — with automatic write-through (debounced for code; immediate for create / rename / delete). Other tabs are notified and quietly adopt the winning whole-list snapshot: if the active snippet id is gone, deselect; otherwise replace fields. A reloaded or newly opened tab hydrates the list with **no** active snippet (details placeholder until the user selects or creates one). Console history, active selection, panel chrome, and run lock remain tab/session-local. Update the README so reviewers understand what is persisted and what is not. Follow ADR 0002 and the living spec.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] After creating/editing/renaming/deleting snippets, a full page reload restores the same snippet list (names, code, metadata)
- [ ] Opening a second same-origin tab shows the current snippet list; changes in one tab appear in the other without a manual save or sync control
- [ ] A reloaded or newly opened tab hydrates the snippet list with no active snippet (details placeholder until select/create)
- [ ] Console entries, active selection, panel expand/collapse, and run lock are not written to browser storage and are not shared across tabs
- [ ] Code edits debounce storage writes; create / rename / delete write through immediately
- [ ] No save button, dirty indicators, bulk reset, or backend/database persistence
- [ ] README describes browser-persisted snippet list vs session-scoped console and tab-local selection
