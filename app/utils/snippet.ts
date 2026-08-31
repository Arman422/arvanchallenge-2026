import type { Snippet } from '~/types/snippet'

const UNTITLED_NAME_PATTERN = /^untitled-(\d+)$/

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
