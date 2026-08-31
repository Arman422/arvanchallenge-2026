<template>
  <aside
    class="flex h-full min-h-0 flex-col bg-elevated/50"
    data-testid="snippet-list-panel"
  >
    <div class="shrink-0 border-b border-default p-3">
      <UButton
        block
        icon="i-lucide-plus"
        label="New Snippet"
        data-testid="new-snippet-button"
      />
    </div>

    <div
      class="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 p-4 text-center"
      data-testid="snippet-list-empty"
    >
      <UIcon
        name="i-lucide-file-code"
        class="size-8 text-muted"
      />
      <p class="text-sm text-muted">
        No snippets yet
      </p>
    </div>
  </aside>
</template>
