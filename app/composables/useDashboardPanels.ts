import { tryOnMounted } from '@vueuse/core'
import {
  getDefaultConsoleVisible,
  getDefaultSnippetListExpanded
} from '~/utils/panelDefaults'

export function useDashboardPanels() {
  const { tier } = useViewportTier()

  const snippetListExpanded = useState<boolean>(
    'dashboard-snippet-list-expanded',
    () => getDefaultSnippetListExpanded(tier.value)
  )

  const consoleVisible = useState<boolean>(
    'dashboard-console-visible',
    () => getDefaultConsoleVisible(tier.value)
  )

  const panelsViewportSynced = useState('dashboard-panels-viewport-synced', () => false)

  // tryOnMounted: safe when tests/composables call this outside setup.
  tryOnMounted(() => {
    if (panelsViewportSynced.value) {
      return
    }

    snippetListExpanded.value = getDefaultSnippetListExpanded(tier.value)
    consoleVisible.value = getDefaultConsoleVisible(tier.value)
    panelsViewportSynced.value = true
  })

  function toggleSnippetList() {
    snippetListExpanded.value = !snippetListExpanded.value
  }

  function toggleConsole() {
    consoleVisible.value = !consoleVisible.value
  }

  return {
    snippetListExpanded,
    consoleVisible,
    toggleSnippetList,
    toggleConsole
  }
}
