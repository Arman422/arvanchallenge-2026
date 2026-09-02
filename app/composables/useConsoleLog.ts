import type { ConsoleEntry } from '~/utils/console'
import type { Snippet } from '~/types/snippet'

export function useConsoleLog() {
  const entries = useState<ConsoleEntry[]>('console-entries', () => [])

  function appendRunning(snippet: Pick<Snippet, 'id' | 'name'>): string {
    const id = crypto.randomUUID()

    entries.value = [
      ...entries.value,
      {
        id,
        timestamp: Date.now(),
        kind: 'running',
        snippetId: snippet.id,
        snippetName: snippet.name,
        message: 'Running…'
      }
    ]

    return id
  }

  function updateEntry(id: string, kind: 'success' | 'error', message: string) {
    entries.value = entries.value.map(entry =>
      entry.id === id
        ? {
            ...entry,
            kind,
            message
          }
        : entry
    )
  }

  function clear() {
    entries.value = []
  }

  return {
    entries,
    appendRunning,
    updateEntry,
    clear
  }
}
