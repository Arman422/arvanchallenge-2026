import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { VueWrapper } from '@vue/test-utils'
import { __setViewportTierForTests } from '~/composables/useViewportTier'
import { useSnippetSession } from '~/composables/useSnippetSession'
import { SNIPPET_LIST_STORAGE_KEY } from '~/utils/snippet'
import Shell from './Shell.vue'

describe('Shell mobile exclusive workspace', () => {
  let wrapper: VueWrapper | undefined

  beforeEach(() => {
    localStorage.removeItem(SNIPPET_LIST_STORAGE_KEY)
    __setViewportTierForTests('desktop')
    const colorMode = useColorMode()
    colorMode.preference = 'light'
    const session = useSnippetSession()
    session.activeSnippetId.value = null
    session.snippets.value = []
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    localStorage.removeItem(SNIPPET_LIST_STORAGE_KEY)
    __setViewportTierForTests(null)
  })

  async function mountShell() {
    wrapper = await mountSuspended(Shell, {
      global: {
        stubs: {
          CodeEditor: true,
          ClientOnly: true
        }
      }
    })
    return wrapper
  }

  it('shows list XOR details on mobile; selecting opens details and back returns to list', async () => {
    __setViewportTierForTests('mobile')
    await mountShell()

    expect(wrapper!.find('[data-testid="snippet-list-panel"]').exists()).toBe(true)
    expect(wrapper!.find('[data-testid="snippet-details"]').exists()).toBe(false)
    expect(wrapper!.find('[data-testid="console-panel"]').exists()).toBe(true)
    expect(wrapper!.find('[data-testid="snippet-list-rail"]').exists()).toBe(false)

    const session = useSnippetSession()
    session.snippets.value = [{
      id: 's1',
      name: 'snippet-1',
      code: '',
      language: 'JavaScript',
      lastEditedAt: 1_700_000_000_000
    }]
    await nextTick()

    await wrapper!.get('[data-testid="snippet-list-item"] button').trigger('click')
    await nextTick()

    expect(session.activeSnippetId.value).toBe('s1')
    expect(wrapper!.find('[data-testid="snippet-list-panel"]').exists()).toBe(false)
    expect(wrapper!.find('[data-testid="snippet-details"]').exists()).toBe(true)
    expect(wrapper!.find('[data-testid="console-panel"]').exists()).toBe(true)

    await wrapper!.get('[data-testid="shell-back-button"]').trigger('click')
    await nextTick()

    expect(session.activeSnippetId.value).toBeNull()
    expect(wrapper!.find('[data-testid="snippet-list-panel"]').exists()).toBe(true)
    expect(wrapper!.find('[data-testid="snippet-details"]').exists()).toBe(false)
  })

  it('keeps side-by-side list and details on desktop and tablet', async () => {
    await mountShell()

    expect(wrapper!.find('[data-testid="snippet-list-panel"]').exists()).toBe(true)
    expect(wrapper!.find('[data-testid="snippet-details"]').exists()).toBe(true)
    expect(wrapper!.find('[data-testid="console-panel"]').exists()).toBe(true)

    __setViewportTierForTests('tablet')
    await nextTick()

    expect(wrapper!.find('[data-testid="snippet-list-panel"]').exists()).toBe(true)
    expect(wrapper!.find('[data-testid="snippet-details"]').exists()).toBe(true)
    expect(wrapper!.find('[data-testid="shell-back-button"]').exists()).toBe(false)
  })

  it('stays on the list after mobile create and rename until a row is tapped', async () => {
    __setViewportTierForTests('mobile')
    await mountShell()

    await wrapper!.get('[data-testid="new-snippet-button"]').trigger('click')
    await nextTick()
    await nextTick()

    const session = useSnippetSession()
    expect(session.activeSnippetId.value).toBeNull()
    expect(wrapper!.find('[data-testid="snippet-list-panel"]').exists()).toBe(true)
    expect(wrapper!.find('[data-testid="snippet-details"]').exists()).toBe(false)
    expect(wrapper!.find('[data-testid="snippet-rename-input"]').exists()).toBe(true)

    await wrapper!.get('[data-testid="snippet-rename-input"]').setValue('hello')
    await wrapper!.get('[data-testid="snippet-rename-input"]').trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(session.activeSnippetId.value).toBeNull()
    expect(wrapper!.find('[data-testid="snippet-list-panel"]').exists()).toBe(true)
    expect(wrapper!.find('[data-testid="snippet-details"]').exists()).toBe(false)

    await wrapper!.get('[data-testid="snippet-list-item"] button').trigger('click')
    await nextTick()

    expect(session.activeSnippetId.value).toBeTruthy()
    expect(wrapper!.find('[data-testid="snippet-details"]').exists()).toBe(true)
    expect(wrapper!.find('[data-testid="snippet-list-panel"]').exists()).toBe(false)
  })
})
