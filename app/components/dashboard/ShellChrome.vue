<script setup lang="ts">
import {
  isSystemThemePreference,
  snapshotThemePreference,
  toggleThemePreference,
  type ThemePreference
} from '~/utils/themePreference'

const { tier } = useViewportTier()
const colorMode = useColorMode()
const { snippetListExpanded, toggleSnippetList } = useDashboardPanels()
const { activeSnippetId, clearActiveSnippet } = useSnippetSession()

const showListToggle = computed(() => tier.value !== 'mobile')
const showBack = computed(
  () => tier.value === 'mobile' && activeSnippetId.value !== null
)
const showIconRail = computed(
  () => showListToggle.value && !snippetListExpanded.value
)

const listToggleLabel = computed(() =>
  showIconRail.value ? 'Expand snippet list' : 'Collapse snippet list'
)

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
    <div
      v-if="showListToggle"
      class="relative z-10 flex shrink-0 items-center"
    >
      <UButton
        color="neutral"
        variant="ghost"
        size="sm"
        square
        :icon="showIconRail ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
        :aria-label="listToggleLabel"
        :aria-expanded="!showIconRail"
        :title="listToggleLabel"
        data-testid="snippet-list-toggle"
        @click="toggleSnippetList"
      />
    </div>

    <div
      v-else-if="showBack"
      class="relative z-10 flex shrink-0 items-center"
    >
      <UButton
        color="neutral"
        variant="ghost"
        size="sm"
        square
        icon="i-lucide-arrow-left"
        aria-label="Back to snippet list"
        title="Back to snippet list"
        data-testid="shell-back-button"
        @click="clearActiveSnippet"
      />
    </div>

    <h1
      class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center truncate px-12 text-center text-sm font-medium text-highlighted"
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
