# Arvan panel token sample

Source: `https://panel.arvancloud.ir/storage/buckets` (logged-in Object Storage UI), sampled 2026-09-05.
Purpose: visual affinity mapping for this challenge app — not a full design-system dump.

## Typography

- Stack in panel: `YekanBakh, Inter, Arial, Helvetica, sans-serif`
- `YekanBakh` appears proprietary (Persian UI). For our LTR/English challenge UI, use public **Inter** as the stand-in; do not embed YekanBakh unless licensing is confirmed.

## Radii

| Token | Value |
| --- | --- |
| `--border-radius-xs` | `0.25rem` (4px) |
| `--border-radius-sm` | `0.5rem` (8px) — icon / ghost buttons |
| `--border-radius-md` | `0.75rem` (12px) — primary buttons |
| `--border-radius-lg` | `1rem` (16px) |

## Primary scale (stable across themes)

| Step | Hex |
| --- | --- |
| 50 | `#f3fcfc` |
| 100 | `#e6f8f8` |
| 200 | `#bfeeee` |
| 300 | `#99e3e3` |
| 400 | `#4dcfcf` |
| 500 | `#00baba` |
| 600 | `#00a7a7` |
| 700 | `#008c8c` |
| 800 | `#007070` |
| 900 | `#005b5b` |
| (solid CTA light) | `#009595` (`--bg-primary-t3-1-default` light) |
| (solid CTA dark) | `#007070` (`--bg-primary-t3-1-default` dark) |
| (CTA hover light) | `#007070` |
| (CTA hover dark) | `#005d5d` |
| (CTA active) | `#004a4a` |

## Primary button chrome (md)

- Height: `40px`
- Padding: `0 16px`
- Border radius: `12px`
- Font weight: `400`
- Light: bg `#009595`, fg `#ffffff`
- Dark: bg `#007070`, fg `#e6e6e6`
- Disabled light uses washed primary (`#99e3e3`); dark disabled `#003838`

## Neutrals / surfaces

### Light (`data-theme="light"`)

- Page/body bg: `#f5f5f5` (`rgb(245,245,245)`)
- Surface default: `#ffffff`
- Subtle surfaces: `#fafafa`, `#f5f5f5`, `#f0f0f0`
- Text primary: `#333333` / `#4c4c4c`
- Muted text: `#7f7f7f`
- Borders / strokes: `#e6e6e6`, `#cccccc`
- Selected nav tint: `#e0f7f7`

### Dark (`data-theme="dark"`)

- Page/body bg: `#262626`
- Surface default: `#141414`
- Raised / nested: `#191919`, `#262626`, `#404040`
- Text primary: `#e6e6e6`
- Muted text: `#b3b3b3` / `#cccccc`
- Selected / primary soft: `#002525`, selected strong `#004a4a`

## Status (for badges / alerts if needed)

- Success solid (light): `#45c16e` → focus `#17b24a`
- Success solid (dark): `#128e3b`
- Danger / error solid: `#d61e20` (light) / `#ab181a` (dark active)
- Warning: `#fdc935` / `#e3a902`
- Info blue: `#34a5e7`

## Suggested Nuxt UI mapping (when implementing)

- `ui.colors.primary` → custom teal scale above (replace current Nuxt green)
- `ui.colors.neutral` → remapped grays closer to panel neutrals than default `slate` (panel neutrals are true gray, not blue-gray)
- Default button radius → `12px` for primary; `8px` for icon/ghost
- Default md button height → `40px`
- Font sans → `Inter` (public stand-in for panel stack)

## Sorkhab Button (canonical)

Source: https://sorkhab.arvancloud.ir/components/button/

| Size | Height | Radius | Pad X | Type | Icon | Gap |
| --- | --- | --- | --- | --- | --- | --- |
| medium | 40px | 12px (`rounded-[12px]`) | 16px | 16px | 20px | 8px |
| small | 32px | 8px (`rounded-[8px]`) | 16px | — | 20px | 8px |

Do **not** raise Nuxt `--ui-radius` to 12px — Nuxt multiplies it (`rounded-xl = radius × 3`), which turns 40px buttons into pills and square icon buttons into circles. Keep `--ui-radius` at the Nuxt default (`0.25rem`) and use fixed pixel radii on buttons.

Variant → Nuxt UI mapping used in-app:

| Sorkhab | Nuxt UI | Notes |
| --- | --- | --- |
| primary | `primary` / `solid` | `#009595` → hover `#007070` → active `#004a4a` (no `/75` wash) |
| secondary | `neutral` / `solid` | `#4c4c4c` charcoal |
| ghost | `neutral` / `ghost` | muted text, light gray hover |
| primary-danger | `error` / `solid` | `#d61e20` |
| tertiary-danger | `error` / `outline` | destructive secondary actions |

## Out of scope from this sample

- RTL layout, Persian copy, sidebar chrome, marketing banners
- Exact ArButton component API / CSS class names
- Full Sorkhab component set (tabs, tables, etc.)
