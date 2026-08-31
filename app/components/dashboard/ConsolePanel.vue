<template>
  <section
    class="flex min-h-0 flex-col border-t border-default bg-neutral-950 font-mono text-sm text-neutral-400"
    data-testid="console-panel"
  >
    <div class="flex shrink-0 items-center border-b border-neutral-800 px-3 py-1.5">
      <span class="text-xs text-neutral-500">Console</span>
    </div>

    <div
      class="flex min-h-0 flex-1 items-center justify-center p-4"
      data-testid="console-empty-state"
    >
      <span class="text-xs text-neutral-600">
        Output will appear here
      </span>
    </div>
  </section>
</template>
