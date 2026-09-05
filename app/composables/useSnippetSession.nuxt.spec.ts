import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearNuxtState } from '#app'
import type { Snippet } from '~/types/snippet'
import {
  SNIPPET_LIST_STORAGE_KEY,
  serializeSnippetList
} from '~/utils/snippet'

const sample: Snippet[] = [
  {
    id: 'a1',
    name: 'snippet-1',
    code: 'console.log(1)',
    language: 'JavaScript',
    lastEditedAt: 1_700_000_000_000
  }
]

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

describe('useSnippetSession persistence', () => {
  beforeEach(() => {
    clearNuxtState()
    vi.useFakeTimers()
    vi.resetModules()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('hydrates the snippet list from storage with no active snippet', async () => {
    const storage = createMemoryStorage({
      [SNIPPET_LIST_STORAGE_KEY]: serializeSnippetList(sample)
    })

    const { useSnippetSession } = await import('./useSnippetSession')
    const session = useSnippetSession({ storage })

    expect(session.snippets.value).toEqual(sample)
    expect(session.activeSnippetId.value).toBeNull()
  })

  it('hydrates allowlisted non-JavaScript languages from storage', async () => {
    const pythonSnippet: Snippet = {
      id: 'py1',
      name: 'hello',
      code: 'print(1)',
      language: 'Python',
      lastEditedAt: 1_700_000_000_000
    }
    const storage = createMemoryStorage({
      [SNIPPET_LIST_STORAGE_KEY]: serializeSnippetList([pythonSnippet])
    })

    const { useSnippetSession } = await import('./useSnippetSession')
    const session = useSnippetSession({ storage })

    expect(session.snippets.value).toEqual([pythonSnippet])
  })

  it('write-through create immediately and code edits after debounce', async () => {
    const storage = createMemoryStorage()
    const { useSnippetSession } = await import('./useSnippetSession')
    const session = useSnippetSession({ storage })

    const created = session.createSnippet()
    expect(created).toMatchObject({
      name: 'snippet-1',
      code: '',
      language: 'JavaScript'
    })
    expect(created.id).toBeTruthy()
    expect(session.activeSnippetId.value).toBe(created.id)
    expect(storage.raw.get(SNIPPET_LIST_STORAGE_KEY)).toBeDefined()
    const afterCreate = JSON.parse(storage.raw.get(SNIPPET_LIST_STORAGE_KEY)!) as Snippet[]
    expect(afterCreate).toHaveLength(1)

    const id = session.activeSnippetId.value!
    session.updateSnippetCode(id, 'hello')
    expect(JSON.parse(storage.raw.get(SNIPPET_LIST_STORAGE_KEY)!)).toEqual(afterCreate)

    vi.advanceTimersByTime(300)
    const afterEdit = JSON.parse(storage.raw.get(SNIPPET_LIST_STORAGE_KEY)!) as Snippet[]
    expect(afterEdit[0]!.code).toBe('hello')
  })

  it('updates snippet language immediately and persists it', async () => {
    const storage = createMemoryStorage({
      [SNIPPET_LIST_STORAGE_KEY]: serializeSnippetList(sample)
    })
    const { useSnippetSession } = await import('./useSnippetSession')
    const session = useSnippetSession({ storage })

    session.selectSnippet('a1')
    session.updateSnippetLanguage('a1', 'Python')

    expect(session.snippets.value[0]!.language).toBe('Python')
    const persisted = JSON.parse(storage.raw.get(SNIPPET_LIST_STORAGE_KEY)!) as Snippet[]
    expect(persisted[0]!.language).toBe('Python')
    expect(persisted[0]!.id).toBe('a1')
  })

  it('ignores unknown languages and leaves the snippet unchanged', async () => {
    const storage = createMemoryStorage({
      [SNIPPET_LIST_STORAGE_KEY]: serializeSnippetList(sample)
    })
    const { useSnippetSession } = await import('./useSnippetSession')
    const session = useSnippetSession({ storage })

    session.selectSnippet('a1')
    // @ts-expect-error intentional invalid language
    session.updateSnippetLanguage('a1', 'Brainfuck')

    expect(session.snippets.value[0]!.language).toBe('JavaScript')
    expect(JSON.parse(storage.raw.get(SNIPPET_LIST_STORAGE_KEY)!)).toEqual(sample)
  })

  it('does not rewrite storage when selecting with no pending code edit', async () => {
    const storage = createMemoryStorage({
      [SNIPPET_LIST_STORAGE_KEY]: serializeSnippetList(sample)
    })
    const { useSnippetSession } = await import('./useSnippetSession')
    const session = useSnippetSession({ storage })

    const before = storage.raw.get(SNIPPET_LIST_STORAGE_KEY)
    session.selectSnippet('a1')
    expect(storage.raw.get(SNIPPET_LIST_STORAGE_KEY)).toBe(before)
    expect(session.activeSnippetId.value).toBe('a1')
  })
})
