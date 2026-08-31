import { describe, expect, it } from 'vitest'
import { consoleEntryClass, formatConsoleTimestamp } from '../../app/utils/console'

describe('formatConsoleTimestamp', () => {
  it('formats a timestamp as a locale time string', () => {
    const timestamp = Date.UTC(2026, 0, 15, 14, 30, 45)

    expect(formatConsoleTimestamp(timestamp)).toMatch(/\d{1,2}:\d{2}:\d{2}/)
  })
})

describe('consoleEntryClass', () => {
  it('maps entry kinds to terminal colors', () => {
    expect(consoleEntryClass('running')).toContain('neutral')
    expect(consoleEntryClass('success')).toContain('emerald')
    expect(consoleEntryClass('error')).toContain('red')
  })
})
