import {
  isSystemThemePreference,
  snapshotThemePreference
} from '~/utils/themePreference'

export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  if (!isSystemThemePreference(colorMode.preference)) {
    return
  }

  const resolved = colorMode.value === 'dark' || colorMode.value === 'light'
    ? colorMode.value
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

  colorMode.preference = snapshotThemePreference(resolved)
})
