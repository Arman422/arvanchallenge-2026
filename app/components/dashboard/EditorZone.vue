<script setup lang="ts">
import { isSnippetEmpty } from '~/utils/snippet'

const { activeSnippet, updateSnippetCode, deleteSnippet } = useSnippetSession()

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
        <div class="min-w-0">
          <h2
            class="truncate text-sm font-medium text-highlighted"
            data-testid="active-snippet-name"
          >
            {{ activeSnippet.name }}
          </h2>
          <p class="text-xs text-muted">
            {{ activeSnippet.language }}
          </p>
        </div>

        <UButton
          color="error"
          variant="soft"
          icon="i-lucide-trash"
          label="Delete"
          data-testid="delete-snippet-button"
          @click="requestDelete"
        />
      </header>

      <ClientOnly>
        <CodeEditor
          :key="activeSnippet.id"
          v-model="codeModel"
          language="javascript"
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
