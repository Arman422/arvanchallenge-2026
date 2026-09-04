import { describe, expect, it } from 'vitest'
import type { Snippet } from '~/types/snippet'
import {
  SNIPPET_LIST_STORAGE_KEY,
  adoptRemoteSnippetList,
  createSnippetListWriter,
  nextUntitledName,
  parseSnippetList,
  readSnippetListFromStorage,
  serializeSnippetList,
  writeSnippetListToStorage
} from './snippet'

const sampleSnippets: Snippet[] = [
  {
    id: 'a1',
    name: 'snippet-1',
    code: 'console.log(1)',
    language: 'JavaScript',
    lastEditedAt: 1_700_000_000_000
  },
  {
    id: 'b2',
    name: 'helper',
    code: '',
    language: 'JavaScript',
    lastEditedAt: 1_700_000_000_100
  }
]

describe('nextUntitledName', () => {
  it('returns snippet-1 when the list is empty', () => {
    expect(nextUntitledName([])).toBe('snippet-1')
  })

  it('increments past the highest existing snippet-N name', () => {
    expect(nextUntitledName(sampleSnippets)).toBe('snippet-2')
    expect(nextUntitledName([
      { ...sampleSnippets[0]!, name: 'snippet-3' },
      { ...sampleSnippets[1]!, name: 'snippet-7' }
    ])).toBe('snippet-8')
  })

  it('ignores names that are not snippet-N', () => {
    expect(nextUntitledName([
      { ...sampleSnippets[0]!, name: 'untitled-9' },
      { ...sampleSnippets[1]!, name: 'helper' }
    ])).toBe('snippet-1')
  })
})

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

describe('SNIPPET_LIST_STORAGE_KEY', () => {
  it('is a stable same-origin storage key for the snippet list', () => {
    expect(SNIPPET_LIST_STORAGE_KEY).toBe('snippet-dashboard:snippet-list')
  })
})

describe('serializeSnippetList / parseSnippetList', () => {
  it('round-trips a snippet list preserving order and fields', () => {
    const raw = serializeSnippetList(sampleSnippets)

    expect(parseSnippetList(raw)).toEqual(sampleSnippets)
  })

  it('returns an empty list for null, empty, or corrupt payloads', () => {
    expect(parseSnippetList(null)).toEqual([])
    expect(parseSnippetList('')).toEqual([])
    expect(parseSnippetList('{')).toEqual([])
    expect(parseSnippetList('"not-an-array"')).toEqual([])
    expect(parseSnippetList('[{"id":"x"}]')).toEqual([])
  })

  it('drops invalid entries and keeps valid ones', () => {
    const mixed = JSON.stringify([
      sampleSnippets[0],
      { id: 'bad', name: 1 },
      sampleSnippets[1]
    ])

    expect(parseSnippetList(mixed)).toEqual([sampleSnippets[0], sampleSnippets[1]])
  })
})

describe('adoptRemoteSnippetList', () => {
  it('replaces the list and keeps the active id when it is still present', () => {
    const remote = [
      { ...sampleSnippets[0]!, name: 'renamed', code: 'updated' },
      sampleSnippets[1]!
    ]

    expect(adoptRemoteSnippetList('a1', remote)).toEqual({
      snippets: remote,
      activeSnippetId: 'a1'
    })
  })

  it('deselects when the active id is missing from the remote list', () => {
    expect(adoptRemoteSnippetList('a1', [sampleSnippets[1]!])).toEqual({
      snippets: [sampleSnippets[1]!],
      activeSnippetId: null
    })
  })

  it('keeps no selection when none was active', () => {
    expect(adoptRemoteSnippetList(null, sampleSnippets)).toEqual({
      snippets: sampleSnippets,
      activeSnippetId: null
    })
  })
})

describe('readSnippetListFromStorage / writeSnippetListToStorage', () => {
  it('writes and reads the snippet list under the stable key', () => {
    const storage = createMemoryStorage()

    writeSnippetListToStorage(storage, sampleSnippets)

    expect(storage.raw.get(SNIPPET_LIST_STORAGE_KEY)).toBeDefined()
    expect(readSnippetListFromStorage(storage)).toEqual(sampleSnippets)
  })

  it('returns an empty list when storage has no entry', () => {
    expect(readSnippetListFromStorage(createMemoryStorage())).toEqual([])
  })
})

describe('createSnippetListWriter', () => {
  it('writeImmediate persists the current list right away', () => {
    const storage = createMemoryStorage()
    let snippets = [sampleSnippets[0]!]
    const writer = createSnippetListWriter(storage, () => snippets)

    snippets = [{ ...sampleSnippets[0]!, name: 'renamed' }]
    writer.writeImmediate()

    expect(readSnippetListFromStorage(storage)).toEqual([
      { ...sampleSnippets[0]!, name: 'renamed' }
    ])
  })
})
