import type { Snippet } from '~/types/snippet'
import {
  SNIPPET_LIST_STORAGE_KEY,
  parseSnippetList,
  serializeSnippetList
} from './snippetStorage'

export type SnippetListStorage = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
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
