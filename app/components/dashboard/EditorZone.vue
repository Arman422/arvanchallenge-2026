<template>
  <section
    class="flex min-h-0 flex-1 flex-col bg-default"
    data-testid="editor-zone"
  >
    <div class="flex flex-1 items-center justify-center p-6">
      <div
        class="flex max-w-sm flex-col items-center gap-3 text-center"
        data-testid="editor-empty-state"
      >
        <UIcon
          name="i-lucide-code"
          class="size-10 text-muted"
        />
        <p class="text-sm text-muted">
          Create or select a snippet to start
        </p>
      </div>
    </div>
  </section>
</template>
