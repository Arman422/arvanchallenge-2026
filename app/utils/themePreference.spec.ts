import { describe, expect, it } from 'vitest'
import {
  isSystemThemePreference,
  snapshotThemePreference,
  toggleThemePreference
} from './themePreference'

describe('isSystemThemePreference', () => {
  it('is true only for the system preference', () => {
    expect(isSystemThemePreference('system')).toBe(true)
    expect(isSystemThemePreference('light')).toBe(false)
    expect(isSystemThemePreference('dark')).toBe(false)
  })
})

describe('snapshotThemePreference', () => {
  it('locks the resolved appearance into an explicit preference', () => {
    expect(snapshotThemePreference('dark')).toBe('dark')
    expect(snapshotThemePreference('light')).toBe('light')
  })

  it('defaults unknown resolved values to light', () => {
    expect(snapshotThemePreference('')).toBe('light')
    expect(snapshotThemePreference('system')).toBe('light')
  })
})

describe('toggleThemePreference', () => {
  it('flips between light and dark', () => {
    expect(toggleThemePreference('light')).toBe('dark')
    expect(toggleThemePreference('dark')).toBe('light')
  })
})
