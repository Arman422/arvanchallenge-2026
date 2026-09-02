export type ConsoleEntryKind = 'running' | 'success' | 'error'

export type ConsoleEntry = {
  id: string
  timestamp: number
  kind: ConsoleEntryKind
  snippetId: string
  snippetName: string
  message: string
}

export function formatConsoleAttribution(snippetName: string, message: string): string {
  return `${snippetName} › ${message}`
}

export function formatConsoleTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export function consoleEntryClass(kind: ConsoleEntryKind): string {
  switch (kind) {
    case 'running':
      return 'text-neutral-400'
    case 'success':
      return 'text-emerald-400'
    case 'error':
      return 'text-red-400'
  }
}
