import type { Snippet, SnippetLanguage } from '~/types/snippet'

export const SNIPPET_LIST_STORAGE_KEY = 'snippet-dashboard:snippet-list'

const SNIPPET_LANGUAGES: readonly SnippetLanguage[] = ['JavaScript']

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

export type AdoptRemoteSnippetListResult = {
  snippets: Snippet[]
  activeSnippetId: string | null
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
