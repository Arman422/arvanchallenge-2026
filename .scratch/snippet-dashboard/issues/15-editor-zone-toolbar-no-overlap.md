# 15: Editor-zone toolbar — no overlap at 375px

**Status:** ready-for-agent

## What to build

Fix the **editor-zone toolbar** in **snippet details** so identity and action controls never overlap, down to a **375px** viewport. Keep one toolbar strip with two **layout regions** only (no card chrome): **identity** (active snippet name + snippet-language control) and **actions** (Run, Delete).

Use Sorkhab button metrics already mapped onto Nuxt UI — **`sm`** for Run/Delete (no custom heights). Size the language control to fit the longest allowlisted snippet-language label (JavaScript / TypeScript / Plain Text / Dockerfile). On desktop and tablet, Run/Delete show **icon and label**. On the **mobile** viewport tier from the existing screen-size module, Run/Delete are **icon-only** with accessible names. Keep actions side by side by default; wrap or stack only when they would still collide with the identity region.

## Acceptance criteria

- [ ] Editor-zone toolbar is two layout regions (identity | actions) with no overlapping controls at 375px width
- [ ] Language control width fits the longest allowlisted snippet-language label without colliding with actions
- [ ] Run and Delete use Sorkhab `sm` sizing (Nuxt UI `sm`); no ad-hoc button heights
- [ ] Desktop and tablet: Run and Delete show icon and label
- [ ] Mobile viewport tier: Run and Delete are icon-only with `aria-label` (or equivalent accessible name)
- [ ] On mobile, actions stay side by side unless collision with identity requires wrap/stack
- [ ] Existing run, delete, and language-change behavior still works; colocated tests cover the toolbar presentation by viewport tier where practical

## Blocked by

None - can start immediately
