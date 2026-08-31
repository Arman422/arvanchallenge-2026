<script setup lang="ts">
const { activeSnippet, updateSnippetCode } = useSnippetSession()

const codeModel = computed({
  get: () => activeSnippet.value?.code ?? '',
  set: (code: string) => {
    if (!activeSnippet.value) {
      return
    }

    updateSnippetCode(activeSnippet.value.id, code)
  }
})
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
      <header class="shrink-0 border-b border-default px-4 py-3">
        <h2
          class="text-sm font-medium text-highlighted"
          data-testid="active-snippet-name"
        >
          {{ activeSnippet.name }}
        </h2>
        <p class="text-xs text-muted">
          {{ activeSnippet.language }}
        </p>
      </header>

      <textarea
        v-model="codeModel"
        class="min-h-0 flex-1 resize-none bg-default p-4 font-mono text-sm text-highlighted outline-none"
        data-testid="editor-code-input"
        spellcheck="false"
        aria-label="Snippet code"
      />
    </div>
  </section>
</template>
