import type { RunApiResponse } from '~/types/run'
import { isSnippetEmpty } from '~/utils/snippet'

function isRunApiResponse(value: unknown): value is RunApiResponse {
  if (typeof value !== 'object' || value === null || !('status' in value)) {
    return false
  }

  const status = (value as { status: unknown }).status

  if (status === 'success') {
    return typeof (value as { output?: unknown }).output === 'string'
  }

  if (status === 'error') {
    return typeof (value as { message?: unknown }).message === 'string'
  }

  return false
}

export function useRunSnippet() {
  const isRunning = useState('snippet-run-lock', () => false)
  const { activeSnippet } = useSnippetSession()
  const { appendRunning, updateEntry } = useConsoleLog()

  async function runActiveSnippet() {
    const snippet = activeSnippet.value

    if (!snippet || isSnippetEmpty(snippet.code) || isRunning.value) {
      return
    }

    isRunning.value = true
    const entryId = appendRunning()

    try {
      const result = await $fetch<RunApiResponse>('/api/run', {
        method: 'POST',
        body: { code: snippet.code }
      })

      if (!isRunApiResponse(result)) {
        updateEntry(entryId, 'error', 'Unexpected response from run API')
        return
      }

      if (result.status === 'success') {
        updateEntry(entryId, 'success', result.output)
        return
      }

      updateEntry(entryId, 'error', result.message)
    } catch {
      updateEntry(entryId, 'error', 'Run request failed')
    } finally {
      isRunning.value = false
    }
  }

  return {
    isRunning,
    runActiveSnippet
  }
}
