<script setup lang="ts">
import { useTimestamp } from '@vueuse/core'
import type { Snippet } from '~/types/snippet'
import { formatLastEditedAt } from '~/utils/snippet'

const {
  snippets,
  activeSnippetId,
  createSnippet,
  selectSnippet,
  renameSnippet
} = useSnippetSession()
const { focusCodeEditor } = useCodeEditorFocus()
const { tier } = useViewportTier()
const { snippetListExpanded } = useDashboardPanels()

/** Advances so relative last-edited labels stay current while the panel is open. */
const now = useTimestamp({ interval: 60_000 })

const editingSnippetId = ref<string | null>(null)
const editingName = ref('')
const renameInputRef = ref<HTMLInputElement | null>(null)

const showIconRail = computed(
  () => tier.value !== 'mobile' && !snippetListExpanded.value
)
/** Mobile exclusive list: create sits in the thumb zone under the rows. */
const isMobile = computed(() => tier.value === 'mobile')
const createAtBottom = isMobile

function setRenameInputRef(el: Element | null) {
  renameInputRef.value = el instanceof HTMLInputElement ? el : null
}

async function startRename(snippet: Snippet) {
  editingSnippetId.value = snippet.id
  editingName.value = snippet.name
  await nextTick()
  const input = renameInputRef.value
  if (!input) {
    return
  }
  input.focus()
  input.select()
}

function handleCreateSnippet() {
  if (showIconRail.value) {
    snippetListExpanded.value = true
  }

  const snippet = createSnippet({ activate: !isMobile.value })
  void startRename(snippet)
}

function commitRename(options: { focusEditor?: boolean } = {}) {
  if (editingSnippetId.value === null) {
    return
  }

  const renamed = renameSnippet(editingSnippetId.value, editingName.value)
  if (!renamed) {
    cancelRename(options)
    return
  }

  editingSnippetId.value = null
  editingName.value = ''

  if (options.focusEditor) {
    focusCodeEditor()
  }
}

function cancelRename(options: { focusEditor?: boolean } = {}) {
  editingSnippetId.value = null
  editingName.value = ''

  if (options.focusEditor) {
    focusCodeEditor()
  }
}

function handleRenameKeydown(event: KeyboardEvent) {
  const focusEditor = !isMobile.value

  if (event.key === 'Enter') {
    event.preventDefault()
    commitRename({ focusEditor })
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    cancelRename({ focusEditor })
  }
}
</script>

<template>
  <aside
    class="flex h-full min-h-0 flex-col bg-elevated/50"
    :class="showIconRail ? 'w-12' : tier === 'mobile' ? 'w-full' : 'w-64'"
    data-testid="snippet-list-panel"
    :data-rail="showIconRail ? 'true' : undefined"
  >
    <div
      v-if="!createAtBottom"
      class="flex shrink-0 items-center justify-center gap-1 border-b border-default p-2"
      data-testid="new-snippet-bar"
      data-placement="top"
    >
      <UButton
        v-if="showIconRail"
        color="primary"
        variant="solid"
        size="sm"
        square
        icon="i-lucide-plus"
        aria-label="New Snippet"
        title="New Snippet"
        data-testid="new-snippet-button"
        @click="handleCreateSnippet"
      />
      <UButton
        v-else
        class="min-w-0 flex-1"
        block
        icon="i-lucide-plus"
        label="New Snippet"
        data-testid="new-snippet-button"
        @click="handleCreateSnippet"
      />
    </div>

    <template v-if="showIconRail">
      <ul
        class="flex min-h-0 flex-1 flex-col items-center gap-1 overflow-y-auto p-1"
        data-testid="snippet-list-rail"
      >
        <li
          v-for="snippet in snippets"
          :key="snippet.id"
        >
          <button
            type="button"
            class="flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors"
            :class="snippet.id === activeSnippetId
              ? 'bg-primary/10 text-primary'
              : 'text-muted hover:bg-elevated hover:text-highlighted'"
            :aria-label="snippet.name"
            :aria-current="snippet.id === activeSnippetId ? 'true' : undefined"
            :title="snippet.name"
            data-testid="snippet-list-rail-item"
            @click="selectSnippet(snippet.id)"
          >
            <UIcon
              name="i-lucide-file-code"
              class="size-4"
            />
          </button>
        </li>
      </ul>
    </template>

    <template v-else>
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
          class="flex items-center gap-1 rounded-md"
          data-testid="snippet-list-item"
        >
          <button
            type="button"
            class="flex min-w-0 flex-1 cursor-pointer flex-col gap-1 rounded-md px-3 py-2 text-start transition-colors"
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
                :ref="setRenameInputRef"
                v-model="editingName"
                type="text"
                class="w-full rounded border border-default bg-default px-2 py-1 text-sm text-highlighted outline-none focus:border-primary"
                data-testid="snippet-rename-input"
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

            <div class="flex justify-between gap-2 text-xs text-muted">
              <span data-testid="snippet-list-item-language">
                {{ snippet.language }}
              </span>
              <span data-testid="snippet-list-item-last-edited">
                {{ formatLastEditedAt(snippet.lastEditedAt, now) }}
              </span>
            </div>
          </button>

          <UButton
            v-if="isMobile && editingSnippetId !== snippet.id"
            color="neutral"
            variant="ghost"
            size="sm"
            square
            icon="i-lucide-pencil"
            :aria-label="`Rename ${snippet.name}`"
            data-testid="snippet-rename-button"
            @click="startRename(snippet)"
          />
        </li>
      </ul>
    </template>

    <div
      v-if="createAtBottom"
      class="flex shrink-0 items-center justify-center gap-1 border-t border-default p-2"
      data-testid="new-snippet-bar"
      data-placement="bottom"
    >
      <UButton
        class="min-w-0 flex-1"
        block
        icon="i-lucide-plus"
        label="New Snippet"
        data-testid="new-snippet-button"
        @click="handleCreateSnippet"
      />
    </div>
  </aside>
</template>
