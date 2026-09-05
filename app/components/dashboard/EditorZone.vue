<script setup lang="ts">
import type { SnippetLanguage } from '~/types/snippet'
import { SNIPPET_LANGUAGES, isSnippetEmpty } from '~/utils/snippet'

const { activeSnippet, updateSnippetCode, updateSnippetLanguage, deleteSnippet } = useSnippetSession()
const { isRunning, runActiveSnippet } = useRunSnippet()

const isDeleteModalOpen = ref(false)

const codeModel = computed({
  get: () => activeSnippet.value?.code ?? '',
  set: (code: string) => {
    if (!activeSnippet.value) {
      return
    }

    updateSnippetCode(activeSnippet.value.id, code)
  }
})

const languageModel = computed({
  get: () => activeSnippet.value?.language ?? 'JavaScript',
  set: (language: SnippetLanguage) => {
    if (!activeSnippet.value) {
      return
    }

    updateSnippetLanguage(activeSnippet.value.id, language)
  }
})

const languageItems = [...SNIPPET_LANGUAGES]

const canRun = computed(() =>
  Boolean(activeSnippet.value && !isSnippetEmpty(activeSnippet.value.code) && !isRunning.value)
)

function requestDelete() {
  if (!activeSnippet.value) {
    return
  }

  if (isSnippetEmpty(activeSnippet.value.code)) {
    deleteSnippet(activeSnippet.value.id)
    return
  }

  isDeleteModalOpen.value = true
}

function confirmDelete() {
  if (!activeSnippet.value) {
    return
  }

  deleteSnippet(activeSnippet.value.id)
  isDeleteModalOpen.value = false
}
</script>

<template>
  <section
    class="flex min-h-0 flex-1 flex-col bg-default"
    data-testid="editor-zone"
  >
    <div
      v-if="!activeSnippet"
      class="flex flex-1 items-center justify-center p-6"
    >
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

    <div
      v-else
      class="flex min-h-0 flex-1 flex-col"
      data-testid="editor-active-snippet"
    >
      <header
        class="flex shrink-0 items-center justify-between gap-3 border-b border-default px-4 py-3"
        data-testid="editor-toolbar"
      >
        <div class="min-w-0 flex-1">
          <h2
            class="truncate text-sm font-medium text-highlighted"
            data-testid="active-snippet-name"
          >
            {{ activeSnippet.name }}
          </h2>
          <USelect
            v-model="languageModel"
            :items="languageItems"
            size="xs"
            class="mt-1 w-44"
            :disabled="isRunning"
            aria-label="Snippet language"
            data-testid="snippet-language-select"
          />
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <UButton
            color="primary"
            variant="solid"
            icon="i-lucide-play"
            :loading="isRunning"
            label="Run"
            :disabled="!canRun"
            data-testid="run-snippet-button"
            @click="runActiveSnippet"
          />
          <UButton
            color="error"
            variant="outline"
            icon="i-lucide-trash"
            label="Delete"
            :disabled="isRunning"
            data-testid="delete-snippet-button"
            @click="requestDelete"
          />
        </div>
      </header>

      <ClientOnly>
        <CodeEditor
          :key="activeSnippet.id"
          v-model="codeModel"
          :language="activeSnippet.language"
          :read-only="isRunning"
          class="min-h-0 flex-1"
          data-testid="editor-code-input"
        />
      </ClientOnly>
    </div>

    <UModal
      v-model:open="isDeleteModalOpen"
      title="Delete snippet?"
      :description="`Delete “${activeSnippet?.name ?? 'this snippet'}”? This cannot be undone.`"
      data-testid="delete-snippet-modal"
    >
      <template #footer="{ close }">
        <UButton
          label="Cancel"
          color="neutral"
          variant="ghost"
          data-testid="delete-snippet-cancel"
          @click="close"
        />
        <UButton
          label="Delete"
          color="error"
          data-testid="delete-snippet-confirm"
          @click="confirmDelete"
        />
      </template>
    </UModal>
  </section>
</template>
