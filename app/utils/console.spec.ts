import { describe, expect, it } from 'vitest'
import {
  consoleEntryClass,
  formatConsoleAttribution,
  formatConsoleTimestamp
} from './console'

describe('formatConsoleTimestamp', () => {
  it('formats a timestamp as a locale time string', () => {
    const timestamp = Date.UTC(2026, 0, 15, 14, 30, 45)

    expect(formatConsoleTimestamp(timestamp)).toMatch(/\d{1,2}:\d{2}:\d{2}/)
  })
})

describe('formatConsoleAttribution', () => {
  it('joins snippet name and message with a separator', () => {
    expect(formatConsoleAttribution('untitled-1', 'Hello World')).toBe('untitled-1 › Hello World')
    expect(formatConsoleAttribution('untitled-1', 'Running…')).toBe('untitled-1 › Running…')
  })
})

describe('consoleEntryClass', () => {
  it('maps entry kinds to theme-aware semantic colors', () => {
    expect(consoleEntryClass('running')).toBe('text-muted')
    expect(consoleEntryClass('success')).toBe('text-success')
    expect(consoleEntryClass('error')).toBe('text-error')
  })
})
