# 16: Copy code from the editor-zone actions

**Status:** ready-for-agent

## What to build

Add **Copy code** to the **editor-zone** actions for the **active snippet**: write that snippet’s code body to the clipboard. Place the control in the actions region in order **Run · Copy · Delete**. Match existing action presentation (`sm`; icon and label on desktop/tablet; icon-only with an accessible name on the mobile viewport tier). Disable when the body is empty or under **run lock** (no spinner on Copy). On success, briefly swap the control’s icon to a checkmark (~1.5s) while keeping the “Copy” label on desktop/tablet; on clipboard failure, briefly show an error icon on the same control. No toast. Follow CONTEXT (**Copy code**). Prefer extending the existing editor-zone toolbar over new modules.

## Acceptance criteria

- [ ] Editor-zone actions include **Copy code** in order Run · Copy · Delete
- [ ] Clicking Copy writes the active snippet’s code body to the clipboard
- [ ] Copy is disabled when the body is empty or while run lock is active (no spinner)
- [ ] Desktop/tablet: `sm` control with icon and “Copy” label; mobile viewport tier: icon-only with accessible name
- [ ] Success: temporary checkmark icon on the control (~1.5s); failure: temporary error icon on the control; no toast
- [ ] Colocated tests cover enable/disable rules and success/failure feedback where practical

## Blocked by

- 15: Editor-zone toolbar — no overlap at 375px
