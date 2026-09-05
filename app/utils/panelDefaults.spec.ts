import { describe, expect, it } from 'vitest'
import {
  getDefaultConsoleVisible,
  getDefaultSnippetListExpanded,
  getViewportTier
} from './panelDefaults'

describe('getViewportTier', () => {
  it('returns desktop at lg and above', () => {
    expect(getViewportTier(1024)).toBe('desktop')
    expect(getViewportTier(1280)).toBe('desktop')
  })

  it('returns tablet between md and lg', () => {
    expect(getViewportTier(768)).toBe('tablet')
    expect(getViewportTier(1023)).toBe('tablet')
  })

  it('returns mobile below md', () => {
    expect(getViewportTier(767)).toBe('mobile')
    expect(getViewportTier(400)).toBe('mobile')
  })
})

describe('getDefaultSnippetListExpanded', () => {
  it('expands on desktop and tablet', () => {
    expect(getDefaultSnippetListExpanded('desktop')).toBe(true)
    expect(getDefaultSnippetListExpanded('tablet')).toBe(true)
  })

  it('collapses to icon rail on mobile', () => {
    expect(getDefaultSnippetListExpanded('mobile')).toBe(false)
  })
})

describe('getDefaultConsoleVisible', () => {
  it('collapses to strip on all viewport tiers', () => {
    expect(getDefaultConsoleVisible('desktop')).toBe(false)
    expect(getDefaultConsoleVisible('tablet')).toBe(false)
    expect(getDefaultConsoleVisible('mobile')).toBe(false)
  })
})
