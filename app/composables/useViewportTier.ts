import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { type ViewportTier } from '~/utils/panelDefaults'

/** Matches Tailwind `lg` — desktop layout defaults during SSR/prerender. */
const SSR_DESKTOP_WIDTH = breakpointsTailwind.lg

/** Test-only override; null means use live breakpoints. */
const tierOverride = ref<ViewportTier | null>(null)

export function useViewportTier() {
  const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: SSR_DESKTOP_WIDTH })

  const tier = computed<ViewportTier>(() => {
    if (tierOverride.value !== null) {
      return tierOverride.value
    }

    if (breakpoints.isGreaterOrEqual('lg')) {
      return 'desktop'
    }

    if (breakpoints.isGreaterOrEqual('md')) {
      return 'tablet'
    }

    return 'mobile'
  })

  function isMobile(): boolean {
    return tier.value === 'mobile'
  }

  return { tier, isMobile }
}

/** Forces viewport tier in component tests; pass null to clear. */
export function __setViewportTierForTests(tier: ViewportTier | null) {
  tierOverride.value = tier
}
