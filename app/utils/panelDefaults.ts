/** Tailwind default breakpoints (px). */
export const VIEWPORT_BREAKPOINTS = {
  md: 768,
  lg: 1024
} as const

export type ViewportTier = 'mobile' | 'tablet' | 'desktop'

export function getViewportTier(width: number): ViewportTier {
  if (width >= VIEWPORT_BREAKPOINTS.lg) {
    return 'desktop'
  }

  if (width >= VIEWPORT_BREAKPOINTS.md) {
    return 'tablet'
  }

  return 'mobile'
}

export function getDefaultSnippetListExpanded(_tier: ViewportTier): boolean {
  // Desktop/tablet start expanded; mobile uses exclusive stack (not icon rail).
  return true
}

export function getDefaultConsoleVisible(_tier: ViewportTier): boolean {
  return false
}
