# 02: Snippet list and in-memory session state

**What to build:** Wire up in-memory **snippet** management and the **snippet list panel**. The list is the sole navigator (Obsidian-like — no tab bar). From the empty state, clicking "New Snippet" creates a snippet named `untitled-1` (incrementing for subsequent creates), adds it to the flat **snippet list**, and makes it the **active snippet**. Clicking a list item changes the active snippet (visual highlight). Double-clicking a name enables inline rename. Each list row shows **snippet metadata**: a static "JavaScript" language label and a session-scoped last-edited timestamp (updated when the user edits that snippet's code). Edits bind directly to in-memory snippet state — no save action, no dirty indicators. Snippet details reflects which snippet is active (placeholder or minimal indicator — editor comes in the next ticket). No file explorer, folders, or persistence.

**Blocked by:** 01: Dashboard shell and initial loading

**Status:** ready-for-agent

- [ ] "New Snippet" creates a snippet with default name (`untitled-N`) and sets it active
- [ ] All snippets appear in a flat list with no folders or file paths
- [ ] Clicking a snippet in the list makes it the active snippet (visual highlight)
- [ ] Double-clicking a snippet name allows inline rename; empty names are rejected
- [ ] Snippet stored in memory as id, name, code, language (`JavaScript`), and `lastEditedAt`
- [ ] List rows show language label and last-edited metadata for scanning
- [ ] `lastEditedAt` updates when the user edits a snippet's code (debounced OK)
- [ ] Selecting a different snippet preserves each snippet's code in memory
- [ ] Creating/selecting snippets works without page reload; state survives navigation within the session
- [ ] No tab bar or separate "open snippets" state
