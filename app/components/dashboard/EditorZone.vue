<script setup lang="ts">
import type { SnippetLanguage } from '~/types/snippet'
import {
  SNIPPET_LANGUAGES,
  isSnippetEmpty,
  longestSnippetLanguageLabelLength
} from '~/utils/snippet'

const { activeSnippet, updateSnippetCode, updateSnippetLanguage, deleteSnippet } = useSnippetSession()
const { isRunning, runActiveSnippet } = useRunSnippet()
const { tier } = useViewportTier()

const isDeleteModalOpen = ref(false)

/** Icon-only Run/Delete on the mobile viewport tier to avoid identity collision at 375px. */
const compactActions = computed(() => tier.value === 'mobile')

/** Width fits the longest allowlisted label (+ select chrome); max-w-full caps collision. */
const languageSelectWidth = `calc(${longestSnippetLanguageLabelLength()}ch + 2.75rem)`
const languageSelectStyle = {
  width: languageSelectWidth
}
/** Keeps identity from crushing below the language control so the toolbar can wrap instead. */
const identityRegionStyle = {
  minWidth: languageSelectWidth
}

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
        class="flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-default dark:border-[#4c4c4c] px-4 py-3"
        data-testid="editor-toolbar"
      >
        <div
          class="min-w-0 flex-1"
          :style="identityRegionStyle"
          data-testid="editor-toolbar-identity"
        >
          <h2
            class="truncate text-sm font-medium text-highlighted"
            data-testid="active-snippet-name"
          >
            {{ activeSnippet.name }}
          </h2>
          <div
            class="mt-1 max-w-full"
            :style="languageSelectStyle"
            data-testid="snippet-language-select-width"
          >
            <USelect
              v-model="languageModel"
              :items="languageItems"
              size="xs"
              class="w-full"
              :disabled="isRunning"
              aria-label="Snippet language"
              data-testid="snippet-language-select"
            />
          </div>
        </div>

        <div
          class="flex shrink-0 items-center gap-2"
          data-testid="editor-toolbar-actions"
        >
          <UButton
            color="primary"
            variant="solid"
            size="sm"
            :square="compactActions"
            icon="i-lucide-play"
            :loading="isRunning"
            :label="compactActions ? undefined : 'Run'"
            :aria-label="compactActions ? 'Run' : undefined"
            :title="compactActions ? 'Run' : undefined"
            :disabled="!canRun"
            data-testid="run-snippet-button"
            @click="runActiveSnippet"
          />
          <UButton
            color="error"
            variant="outline"
            size="sm"
            :square="compactActions"
            icon="i-lucide-trash"
            :label="compactActions ? undefined : 'Delete'"
            :aria-label="compactActions ? 'Delete' : undefined"
            :title="compactActions ? 'Delete' : undefined"
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
