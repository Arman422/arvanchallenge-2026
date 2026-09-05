import { beforeEach, describe, expect, it, vi } from 'vitest'
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
    }
  }
}

describe('useRunSnippet console expand', () => {
  beforeEach(() => {
    clearNuxtState()
    vi.unstubAllGlobals()
  })

  it('expands the console when a run starts', async () => {
    const storage = createMemoryStorage({
      [SNIPPET_LIST_STORAGE_KEY]: serializeSnippetList(sample)
    })

    const { useSnippetSession } = await import('./useSnippetSession')
    const { useDashboardPanels } = await import('./useDashboardPanels')
    const { useRunSnippet } = await import('./useRunSnippet')

    const session = useSnippetSession({ storage })
    session.selectSnippet('a1')

    const panels = useDashboardPanels()
    panels.consoleVisible.value = false

    vi.stubGlobal(
      '$fetch',
      vi.fn().mockResolvedValue({ status: 'success', output: 'Hello World' })
    )

    const { runActiveSnippet, isRunning } = useRunSnippet()
    const runPromise = runActiveSnippet()

    expect(isRunning.value).toBe(true)
    expect(panels.consoleVisible.value).toBe(true)

    await runPromise
  })
})
