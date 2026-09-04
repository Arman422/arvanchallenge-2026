import type { Snippet, SnippetLanguage } from '~/types/snippet'

const UNTITLED_NAME_PATTERN = /^untitled-(\d+)$/
const SNIPPET_LANGUAGES: readonly SnippetLanguage[] = ['JavaScript']

export const SNIPPET_LIST_STORAGE_KEY = 'snippet-dashboard:snippet-list'

export type SnippetListStorage = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export type AdoptRemoteSnippetListResult = {
  snippets: Snippet[]
  activeSnippetId: string | null
}

export function nextUntitledName(snippets: Snippet[]): string {
  let max = 0

  for (const snippet of snippets) {
    const match = UNTITLED_NAME_PATTERN.exec(snippet.name)
    if (match) {
      max = Math.max(max, Number(match[1]))
    }
  }

  return `untitled-${max + 1}`
}

export function isSnippetEmpty(code: string): boolean {
  return code.trim().length === 0
}

export function formatLastEditedAt(timestamp: number, now = Date.now()): string {
  const elapsedMs = now - timestamp
  const elapsedMinutes = Math.floor(elapsedMs / 60_000)

  if (elapsedMinutes < 1) {
    return 'Just now'
  }

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} min ago`
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60)
  if (elapsedHours < 24) {
    return `${elapsedHours} hr ago`
  }

  return new Date(timestamp).toLocaleString()
}

function isSnippetLanguage(value: unknown): value is SnippetLanguage {
  return typeof value === 'string' && (SNIPPET_LANGUAGES as readonly string[]).includes(value)
}

function isSnippet(value: unknown): value is Snippet {
  if (value === null || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === 'string'
    && typeof candidate.name === 'string'
    && typeof candidate.code === 'string'
    && isSnippetLanguage(candidate.language)
    && typeof candidate.lastEditedAt === 'number'
    && Number.isFinite(candidate.lastEditedAt)
  )
}

export function serializeSnippetList(snippets: Snippet[]): string {
  return JSON.stringify(snippets)
}

export function parseSnippetList(raw: string | null): Snippet[] {
  if (raw === null || raw === '') {
    return []
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }

  if (!Array.isArray(parsed)) {
    return []
  }

  return parsed.filter(isSnippet)
}

/** Whole-list LWW adopt: keep selection only if the active id still exists remotely. */
export function adoptRemoteSnippetList(
  activeSnippetId: string | null,
  remoteSnippets: Snippet[]
): AdoptRemoteSnippetListResult {
  if (activeSnippetId === null) {
    return { snippets: remoteSnippets, activeSnippetId: null }
  }

  const stillPresent = remoteSnippets.some(snippet => snippet.id === activeSnippetId)

  return {
    snippets: remoteSnippets,
    activeSnippetId: stillPresent ? activeSnippetId : null
  }
}

export function readSnippetListFromStorage(storage: SnippetListStorage): Snippet[] {
  return parseSnippetList(storage.getItem(SNIPPET_LIST_STORAGE_KEY))
}

export function writeSnippetListToStorage(
  storage: SnippetListStorage,
  snippets: Snippet[]
): void {
  storage.setItem(SNIPPET_LIST_STORAGE_KEY, serializeSnippetList(snippets))
}

export function createSnippetListWriter(
  storage: SnippetListStorage,
  getSnippets: () => Snippet[]
) {
  function writeImmediate() {
    writeSnippetListToStorage(storage, getSnippets())
  }

  return {
    writeImmediate
  }
}
