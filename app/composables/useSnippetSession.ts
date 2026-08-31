import type { Snippet } from '~/types/snippet'
import { nextUntitledName } from '~/utils/snippet'

const LAST_EDITED_DEBOUNCE_MS = 300

export function useSnippetSession() {
  const snippets = useState<Snippet[]>('snippets', () => [])
  const activeSnippetId = useState<string | null>('active-snippet-id', () => null)

  const activeSnippet = computed(() =>
    snippets.value.find(snippet => snippet.id === activeSnippetId.value) ?? null
  )

  let lastEditedDebounceTimer: ReturnType<typeof setTimeout> | undefined
  let pendingLastEditedSnippetId: string | null = null

  function findSnippet(id: string) {
    return snippets.value.find(snippet => snippet.id === id)
  }

  function flushPendingLastEditedAt() {
    if (lastEditedDebounceTimer !== undefined) {
      clearTimeout(lastEditedDebounceTimer)
      lastEditedDebounceTimer = undefined
    }

    if (pendingLastEditedSnippetId === null) {
      return
    }

    const snippet = findSnippet(pendingLastEditedSnippetId)
    if (snippet) {
      snippet.lastEditedAt = Date.now()
    }

    pendingLastEditedSnippetId = null
  }

  function createSnippet() {
    const snippet: Snippet = {
      id: crypto.randomUUID(),
      name: nextUntitledName(snippets.value),
      code: '',
      language: 'JavaScript',
      lastEditedAt: Date.now()
    }

    snippets.value = [...snippets.value, snippet]
    activeSnippetId.value = snippet.id
  }

  function selectSnippet(id: string) {
    if (!findSnippet(id)) {
      return
    }

    flushPendingLastEditedAt()
    activeSnippetId.value = id
  }

  function renameSnippet(id: string, name: string): boolean {
    const trimmedName = name.trim()
    if (!trimmedName) {
      return false
    }

    const snippet = findSnippet(id)
    if (!snippet) {
      return false
    }

    snippet.name = trimmedName
    return true
  }

  function updateSnippetCode(id: string, code: string) {
    const snippet = findSnippet(id)
    if (!snippet) {
      return
    }

    snippet.code = code
    pendingLastEditedSnippetId = id

    if (lastEditedDebounceTimer !== undefined) {
      clearTimeout(lastEditedDebounceTimer)
    }

    lastEditedDebounceTimer = setTimeout(() => {
      flushPendingLastEditedAt()
    }, LAST_EDITED_DEBOUNCE_MS)
  }

  return {
    snippets,
    activeSnippetId,
    activeSnippet,
    createSnippet,
    selectSnippet,
    renameSnippet,
    updateSnippetCode,
  }
}
