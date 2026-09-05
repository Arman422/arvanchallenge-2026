export type ThemePreference = 'light' | 'dark'

export function isSystemThemePreference(preference: string): boolean {
  return preference === 'system'
}

export function snapshotThemePreference(resolved: string): ThemePreference {
  return resolved === 'dark' ? 'dark' : 'light'
}

export function toggleThemePreference(current: ThemePreference): ThemePreference {
  return current === 'dark' ? 'light' : 'dark'
}
