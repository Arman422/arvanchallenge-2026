<script setup lang="ts">
import type { Snippet } from '~/types/snippet'
import { formatLastEditedAt } from '~/utils/snippet'

const {
  snippets,
  activeSnippetId,
  createSnippet,
  selectSnippet,
  renameSnippet
} = useSnippetSession()

const editingSnippetId = ref<string | null>(null)
const editingName = ref('')

function startRename(snippet: Snippet) {
  editingSnippetId.value = snippet.id
  editingName.value = snippet.name
}

function commitRename() {
  if (editingSnippetId.value === null) {
    return
  }

  const renamed = renameSnippet(editingSnippetId.value, editingName.value)
  if (!renamed) {
    cancelRename()
    return
  }

  editingSnippetId.value = null
  editingName.value = ''
}

function cancelRename() {
  editingSnippetId.value = null
  editingName.value = ''
}

function handleRenameKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    commitRename()
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    cancelRename()
  }
}
</script>

<template>
  <aside
    class="flex h-full w-64 min-h-0 flex-col bg-elevated/50"
    data-testid="snippet-list-panel"
  >
    <div class="flex shrink-0 items-center gap-1 border-b border-default p-2">
      <UButton
        class="min-w-0 flex-1"
        block
        icon="i-lucide-plus"
        label="New Snippet"
        data-testid="new-snippet-button"
        @click="createSnippet"
      />
    </div>

    <div
      v-if="snippets.length === 0"
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

    <ul
      v-else
      class="min-h-0 flex-1 overflow-y-auto p-2"
      data-testid="snippet-list"
    >
      <li
        v-for="snippet in snippets"
        :key="snippet.id"
        class="rounded-md"
        data-testid="snippet-list-item"
      >
        <button
          type="button"
          class="flex w-full cursor-pointer flex-col gap-1 rounded-md px-3 py-2 text-start transition-colors"
          :class="snippet.id === activeSnippetId
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-elevated'"
          :data-testid="snippet.id === activeSnippetId ? 'snippet-list-item-active' : undefined"
          @click="selectSnippet(snippet.id)"
        >
          <div
            v-if="editingSnippetId === snippet.id"
            class="w-full"
            @click.stop
          >
            <input
              v-model="editingName"
              type="text"
              class="w-full rounded border border-default bg-default px-2 py-1 text-sm text-highlighted outline-none focus:border-primary"
              data-testid="snippet-rename-input"
              autofocus
              @keydown="handleRenameKeydown"
              @blur="commitRename"
            >
          </div>

          <span
            v-else
            class="truncate text-sm font-medium text-highlighted"
            data-testid="snippet-list-item-name"
            @dblclick.stop="startRename(snippet)"
          >
            {{ snippet.name }}
          </span>

          <div class="flex items-center gap-2 text-xs text-muted">
            <span data-testid="snippet-list-item-language">
              {{ snippet.language }}
            </span>
            <span aria-hidden="true">·</span>
            <span data-testid="snippet-list-item-last-edited">
              {{ formatLastEditedAt(snippet.lastEditedAt) }}
            </span>
          </div>
        </button>
      </li>
    </ul>
  </aside>
</template>
