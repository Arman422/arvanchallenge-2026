# 03: Monaco editor and snippet detail view

**What to build:** Complete the **editor zone** as the detail view for the **active snippet**. When a snippet is active, show a toolbar with a **Delete** action and a Monaco wrapper component (JavaScript syntax highlighting; `readOnly` prop supported for later **run lock**). The editor binds directly to the active snippet's `code` in session state. **Delete snippet** removes it from the list; non-empty snippets prompt for confirmation, empty snippets delete silently. After delete, select another snippet or show the empty state. Monaco mounts only when a snippet is active; placeholder shown otherwise. No tab bar.

**Blocked by:** 02: Snippet list and in-memory session state

**Status:** ready-for-agent

- [ ] Active snippet code is editable in Monaco with JavaScript highlighting
- [ ] Editor binds directly to active snippet `code` in session state (no separate draft layer)
- [ ] Monaco is isolated behind a swappable wrapper; dashboard code does not import Monaco directly
- [ ] Editor zone toolbar includes Delete for the active snippet
- [ ] Deleting a non-empty snippet prompts for confirmation; deleting an empty snippet does not
- [ ] After delete, another snippet becomes active or snippet details shows the empty state
- [ ] No Monaco mounted when no snippet is active
- [ ] No tab bar in the editor zone
