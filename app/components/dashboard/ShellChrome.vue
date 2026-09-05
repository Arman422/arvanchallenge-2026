<script setup lang="ts">
import {
  isSystemThemePreference,
  snapshotThemePreference,
  toggleThemePreference,
  type ThemePreference
} from '~/utils/themePreference'

const { tier } = useViewportTier()
const colorMode = useColorMode()

const showProductTitle = computed(() => tier.value !== 'tablet')
const isMobileTitle = computed(() => tier.value === 'mobile')

function currentThemePreference(): ThemePreference {
  if (!isSystemThemePreference(colorMode.preference)) {
    return snapshotThemePreference(colorMode.preference)
  }

  return snapshotThemePreference(colorMode.value)
}

const themePreference = computed(() => currentThemePreference())

const themeIcon = computed(() =>
  themePreference.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'
)

const themeAriaLabel = computed(() =>
  themePreference.value === 'dark'
    ? 'Switch to light theme'
    : 'Switch to dark theme'
)

function toggleTheme() {
  colorMode.preference = toggleThemePreference(currentThemePreference())
}
</script>

<template>
  <header
    class="relative flex shrink-0 items-center gap-3 border-b border-default dark:border-[#4c4c4c] px-3 py-2"
    data-testid="shell-chrome"
  >
    <h1
      v-if="showProductTitle"
      class="truncate text-sm font-medium text-highlighted"
      :class="isMobileTitle
        ? 'pointer-events-none absolute inset-x-0 text-center px-12'
        : ''"
      data-testid="shell-product-title"
    >
      Snippet Manager
    </h1>

    <div class="relative z-10 ms-auto flex shrink-0 items-center">
      <UButton
        color="neutral"
        variant="ghost"
        size="sm"
        square
        :icon="themeIcon"
        :aria-label="themeAriaLabel"
        data-testid="theme-toggle-button"
        @click="toggleTheme"
      />
    </div>
  </header>
</template>
