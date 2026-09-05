<script setup lang="ts">
import { consoleEntryClass, formatConsoleAttribution, formatConsoleTimestamp } from '~/utils/console'

const { entries, clear } = useConsoleLog()
const { consoleVisible, toggleConsole } = useDashboardPanels()
</script>

<template>
  <section
    class="flex min-h-0 flex-col border-t border-default bg-elevated font-mono text-sm text-toned"
    :class="consoleVisible ? 'h-48' : ''"
    data-testid="console-panel"
  >
    <div
      class="flex shrink-0 items-center justify-between border-b border-default"
    >
      <button
        type="button"
        class="flex min-w-0 flex-1 items-center gap-2 px-3 py-1.5 text-left transition-colors hover:bg-accented/50"
        :aria-expanded="consoleVisible"
        :aria-label="consoleVisible ? 'Collapse output console' : 'Expand output console'"
        :data-testid="consoleVisible ? 'console-hide-button' : 'console-show-button'"
        @click="toggleConsole"
      >
        <UIcon
          :name="consoleVisible ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'"
          class="size-3.5 text-muted"
        />
        <span class="text-xs text-muted">Output Console</span>
      </button>

      <UButton
        v-if="consoleVisible && entries.length > 0"
        class="me-3"
        label="Clear"
        color="neutral"
        variant="ghost"
        size="xs"
        data-testid="console-clear-button"
        @click="clear"
      />
    </div>

    <template v-if="consoleVisible">
      <div
        v-if="entries.length === 0"
        class="flex min-h-0 flex-1 items-center justify-center p-4"
        data-testid="console-empty-state"
      >
        <span class="text-xs text-muted">
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
            class="shrink-0 text-muted"
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
            {{ formatConsoleAttribution(entry.snippetName, entry.message) }}
          </span>
        </li>
      </ul>
    </template>
  </section>
</template>
