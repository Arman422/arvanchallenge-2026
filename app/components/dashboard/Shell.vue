<script setup lang="ts">
const INITIAL_LOAD_MIN_MS = 1000

const isLoading = ref(true)
let loadingTimer: ReturnType<typeof window.setTimeout> | undefined

onMounted(() => {
  loadingTimer = window.setTimeout(() => {
    isLoading.value = false
  }, INITIAL_LOAD_MIN_MS)
})

onUnmounted(() => {
  if (loadingTimer !== undefined) {
    window.clearTimeout(loadingTimer)
  }
})
</script>

<template>
  <div
    class="relative flex h-full min-h-0 flex-col overflow-hidden bg-default"
    data-testid="dashboard-shell"
  >
    <div
      v-if="isLoading"
      class="absolute inset-0 z-50 flex items-center justify-center bg-default"
      data-testid="dashboard-loading-overlay"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-8 animate-spin text-muted"
      />
    </div>

    <div
      class="flex min-h-0 flex-1"
      data-testid="dashboard-layout"
    >
      <DashboardSnippetListPanel class="w-64 shrink-0 border-e border-default" />
      <DashboardWorkingArea class="min-w-0 flex-1" />
    </div>
  </div>
</template>
