import { describe, expect, it } from 'vitest'
import type { Snippet } from '~/types/snippet'
import { SNIPPET_LIST_STORAGE_KEY } from './snippetStorage'
import {
  createSnippetListWriter,
  readSnippetListFromStorage,
  writeSnippetListToStorage
} from './snippetListPersistence'

function createMemoryStorage(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial))

  return {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null
    },
    setItem(key: string, value: string) {
      store.set(key, value)
    },
    raw: store
  }
}

const sample: Snippet[] = [
  {
    id: 'a1',
    name: 'untitled-1',
    code: 'x',
    language: 'JavaScript',
    lastEditedAt: 100
  }
]

describe('readSnippetListFromStorage / writeSnippetListToStorage', () => {
  it('writes and reads the snippet list under the stable key', () => {
    const storage = createMemoryStorage()

    writeSnippetListToStorage(storage, sample)

    expect(storage.raw.get(SNIPPET_LIST_STORAGE_KEY)).toBeDefined()
    expect(readSnippetListFromStorage(storage)).toEqual(sample)
  })

  it('returns an empty list when storage has no entry', () => {
    expect(readSnippetListFromStorage(createMemoryStorage())).toEqual([])
  })
})

describe('createSnippetListWriter', () => {
  it('writeImmediate persists the current list right away', () => {
    const storage = createMemoryStorage()
    let snippets = [...sample]
    const writer = createSnippetListWriter(storage, () => snippets)

    snippets = [{ ...sample[0]!, name: 'renamed' }]
    writer.writeImmediate()

    expect(readSnippetListFromStorage(storage)).toEqual([
      { ...sample[0]!, name: 'renamed' }
    ])
  })
})
