<script setup lang="ts">
import { consoleEntryClass, formatConsoleTimestamp } from '~/utils/console'

const { entries, clear } = useConsoleLog()
</script>

<template>
  <section
    class="flex min-h-0 flex-col border-t border-default bg-neutral-950 font-mono text-sm text-neutral-400"
    data-testid="console-panel"
  >
    <div class="flex shrink-0 items-center justify-between border-b border-neutral-800 px-3 py-1.5">
      <span class="text-xs text-neutral-500">Console</span>
      <UButton
        v-if="entries.length > 0"
        label="Clear"
        color="neutral"
        variant="ghost"
        size="xs"
        data-testid="console-clear-button"
        @click="clear"
      />
    </div>

    <div
      v-if="entries.length === 0"
      class="flex min-h-0 flex-1 items-center justify-center p-4"
      data-testid="console-empty-state"
    >
      <span class="text-xs text-neutral-600">
        Output will appear here
      </span>
    </div>

    <ul
      v-else
      class="min-h-0 flex-1 space-y-1 overflow-y-auto p-3"
      data-testid="console-log"
    >
      <li
        v-for="entry in entries"
        :key="entry.id"
        class="flex gap-2"
        data-testid="console-entry"
      >
        <span
          class="shrink-0 text-neutral-600"
          data-testid="console-entry-timestamp"
        >
          [{{ formatConsoleTimestamp(entry.timestamp) }}]
        </span>
        <span
          class="min-w-0 break-words"
          :class="consoleEntryClass(entry.kind)"
          data-testid="console-entry-message"
        >
          <UIcon
            v-if="entry.kind === 'running'"
            name="i-lucide-loader-circle"
            class="mr-1 inline-block size-3.5 animate-spin align-[-2px]"
          />
          {{ entry.message }}
        </span>
      </li>
    </ul>
  </section>
</template>
