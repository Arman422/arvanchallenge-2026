import type { Snippet, SnippetLanguage } from '~/types/snippet'
import {
  SNIPPET_LIST_STORAGE_KEY,
  adoptRemoteSnippetList,
  createSnippetListWriter,
  isSnippetLanguage,
  nextUntitledName,
  parseSnippetList,
  readSnippetListFromStorage,
  type SnippetListStorage
} from '~/utils/snippet'

const LAST_EDITED_DEBOUNCE_MS = 300

type SnippetSessionOptions = {
  /** Injected for tests; defaults to `localStorage` on the client. */
  storage?: SnippetListStorage | null
}

type SnippetListWriter = ReturnType<typeof createSnippetListWriter>

/** Shared across composable call sites so debounce/persistence is not split per component. */
let lastEditedDebounceTimer: ReturnType<typeof setTimeout> | undefined
let pendingLastEditedSnippetId: string | null = null
let sharedWriter: SnippetListWriter | null = null
let storageListenerAttached = false

function getClientStorage(): SnippetListStorage | null {
  if (!import.meta.client || typeof localStorage === 'undefined') {
    return null
  }

  return localStorage
}

export function useSnippetSession(options: SnippetSessionOptions = {}) {
  const snippets = useState<Snippet[]>('snippets', () => [])
  const activeSnippetId = useState<string | null>('active-snippet-id', () => null)
  const persistenceReady = useState('snippet-list-persistence-ready', () => false)

  const activeSnippet = computed(() =>
    snippets.value.find(snippet => snippet.id === activeSnippetId.value) ?? null
  )

  const storage = options.storage === undefined ? getClientStorage() : options.storage

  if (storage && sharedWriter === null) {
    sharedWriter = createSnippetListWriter(storage, () => snippets.value)
  }

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

  function discardPendingCodeEdit() {
    if (lastEditedDebounceTimer !== undefined) {
      clearTimeout(lastEditedDebounceTimer)
      lastEditedDebounceTimer = undefined
    }

    pendingLastEditedSnippetId = null
  }

  function persistImmediate() {
    flushPendingLastEditedAt()
    sharedWriter?.writeImmediate()
  }

  function persistPendingCodeEditIfAny() {
    if (pendingLastEditedSnippetId === null && lastEditedDebounceTimer === undefined) {
      return
    }

    persistImmediate()
  }

  function onStorageEvent(event: StorageEvent) {
    if (event.key !== SNIPPET_LIST_STORAGE_KEY || event.storageArea !== localStorage) {
      return
    }

    const adopted = adoptRemoteSnippetList(
      activeSnippetId.value,
      parseSnippetList(event.newValue)
    )

    // Remote whole-list wins — drop any local in-flight debounced code write.
    discardPendingCodeEdit()
    snippets.value = adopted.snippets
    activeSnippetId.value = adopted.activeSnippetId
  }

  if (import.meta.client && storage && !persistenceReady.value) {
    snippets.value = readSnippetListFromStorage(storage)
    // Hydration never restores selection — active snippet stays tab-local.
    activeSnippetId.value = null
    persistenceReady.value = true
  }

  if (
    import.meta.client
    && storage === localStorage
    && !storageListenerAttached
  ) {
    window.addEventListener('storage', onStorageEvent)
    storageListenerAttached = true
  }

  function createSnippet(): Snippet {
    const snippet: Snippet = {
      id: crypto.randomUUID(),
      name: nextUntitledName(snippets.value),
      code: '',
      language: 'JavaScript',
      lastEditedAt: Date.now()
    }

    snippets.value = [...snippets.value, snippet]
    activeSnippetId.value = snippet.id
    persistImmediate()
    return snippet
  }

  function selectSnippet(id: string) {
    if (!findSnippet(id)) {
      return
    }

    // Flush a pending code edit so it is not lost; do not rewrite storage on a bare select.
    persistPendingCodeEditIfAny()
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
    persistImmediate()
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
      sharedWriter?.writeImmediate()
    }, LAST_EDITED_DEBOUNCE_MS)
  }

  function updateSnippetLanguage(id: string, language: SnippetLanguage): boolean {
    if (!isSnippetLanguage(language)) {
      return false
    }

    const snippet = findSnippet(id)
    if (!snippet) {
      return false
    }

    snippet.language = language
    persistImmediate()
    return true
  }

  function deleteSnippet(id: string) {
    const index = snippets.value.findIndex(snippet => snippet.id === id)
    if (index === -1) {
      return
    }

    if (pendingLastEditedSnippetId === id) {
      flushPendingLastEditedAt()
    }

    const wasActive = activeSnippetId.value === id
    const nextSnippets = snippets.value.filter(snippet => snippet.id !== id)
    snippets.value = nextSnippets

    if (wasActive) {
      if (nextSnippets.length === 0) {
        activeSnippetId.value = null
      } else {
        const nextIndex = Math.min(index, nextSnippets.length - 1)
        activeSnippetId.value = nextSnippets[nextIndex]!.id
      }
    }

    persistImmediate()
  }

  return {
    snippets,
    activeSnippetId,
    activeSnippet,
    createSnippet,
    selectSnippet,
    renameSnippet,
    updateSnippetCode,
    updateSnippetLanguage,
    deleteSnippet
  }
}
