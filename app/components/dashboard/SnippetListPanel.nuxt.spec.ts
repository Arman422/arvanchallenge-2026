import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { clearNuxtState } from '#app'
import type { VueWrapper } from '@vue/test-utils'
import {
  __resetCodeEditorFocusForTests,
  useCodeEditorFocus
} from '~/composables/useCodeEditorFocus'
import { __setViewportTierForTests } from '~/composables/useViewportTier'
import { useDashboardPanels } from '~/composables/useDashboardPanels'
import { SNIPPET_LIST_STORAGE_KEY } from '~/utils/snippet'
import SnippetListPanel from './SnippetListPanel.vue'

function clearSnippetStorage() {
  localStorage.removeItem(SNIPPET_LIST_STORAGE_KEY)
}

describe('SnippetListPanel rename-on-create', () => {
  let wrapper: VueWrapper | undefined
  const focus = vi.fn()

  beforeEach(() => {
    clearNuxtState()
    clearSnippetStorage()
    __resetCodeEditorFocusForTests()
    __setViewportTierForTests('desktop')
    focus.mockReset()
    useCodeEditorFocus().registerCodeEditorFocus(focus)
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    clearNuxtState()
    __resetCodeEditorFocusForTests()
    __setViewportTierForTests(null)
  })

  async function createAndOpenRename() {
    wrapper = await mountSuspended(SnippetListPanel)
    await wrapper.get('[data-testid="new-snippet-button"]').trigger('click')
    await nextTick()
    await nextTick()
    return wrapper.get('[data-testid="snippet-rename-input"]')
  }

  it('opens rename with the default name selected after creating a snippet', async () => {
    const input = await createAndOpenRename()
    const el = input.element as HTMLInputElement

    expect(el.value).toBe('snippet-1')
    expect(el.selectionStart).toBe(0)
    expect(el.selectionEnd).toBe('snippet-1'.length)
  })

  it('focuses the editor on Enter and Escape, but not on blur', async () => {
    const input = await createAndOpenRename()
    await input.trigger('keydown', { key: 'Enter' })
    expect(focus).toHaveBeenCalledOnce()

    focus.mockReset()
    await wrapper!.get('[data-testid="new-snippet-button"]').trigger('click')
    await nextTick()
    await nextTick()
    await wrapper!.get('[data-testid="snippet-rename-input"]').trigger('keydown', { key: 'Escape' })
    expect(focus).toHaveBeenCalledOnce()

    focus.mockReset()
    await wrapper!.get('[data-testid="new-snippet-button"]').trigger('click')
    await nextTick()
    await nextTick()
    await wrapper!.get('[data-testid="snippet-rename-input"]').trigger('blur')
    expect(focus).not.toHaveBeenCalled()
  })
})

describe('SnippetListPanel icon rail', () => {
  let wrapper: VueWrapper | undefined

  beforeEach(() => {
    clearNuxtState()
    clearSnippetStorage()
    __setViewportTierForTests('desktop')
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    clearNuxtState()
    clearSnippetStorage()
    __setViewportTierForTests(null)
  })

  async function mountPanel() {
    wrapper = await mountSuspended(SnippetListPanel)
    return wrapper
  }

  it('starts expanded on desktop and tablet', async () => {
    await mountPanel()

    expect(wrapper!.find('[data-testid="snippet-list-panel"]').attributes('data-rail')).toBeUndefined()
    expect(wrapper!.find('[data-testid="snippet-list-toggle"]').exists()).toBe(false)

    __setViewportTierForTests('tablet')
    await nextTick()
    expect(wrapper!.find('[data-testid="snippet-list-panel"]').attributes('data-rail')).toBeUndefined()
  })

  it('collapses to an icon rail that can create and select snippets', async () => {
    await mountPanel()
    const panels = useDashboardPanels()

    await wrapper!.get('[data-testid="new-snippet-button"]').trigger('click')
    await nextTick()
    await nextTick()
    await wrapper!.get('[data-testid="snippet-rename-input"]').trigger('keydown', { key: 'Enter' })
    await nextTick()

    panels.toggleSnippetList()
    await nextTick()

    const panel = wrapper!.get('[data-testid="snippet-list-panel"]')
    expect(panel.attributes('data-rail')).toBe('true')
    expect(wrapper!.find('[data-testid="snippet-list"]').exists()).toBe(false)
    expect(wrapper!.find('[data-testid="snippet-list-rail"]').exists()).toBe(true)

    const railItem = wrapper!.get('[data-testid="snippet-list-rail-item"]')
    expect(railItem.attributes('aria-label')).toBe('snippet-1')

    await wrapper!.get('[data-testid="new-snippet-button"]').trigger('click')
    await nextTick()
    await nextTick()

    // Creating from the rail expands so rename can run.
    expect(wrapper!.find('[data-testid="snippet-list-panel"]').attributes('data-rail')).toBeUndefined()
    expect(wrapper!.find('[data-testid="snippet-rename-input"]').exists()).toBe(true)

    await wrapper!.get('[data-testid="snippet-rename-input"]').trigger('keydown', { key: 'Enter' })
    await nextTick()
    panels.toggleSnippetList()
    await nextTick()

    const railItems = wrapper!.findAll('[data-testid="snippet-list-rail-item"]')
    expect(railItems).toHaveLength(2)
    await railItems[0]!.trigger('click')
    await nextTick()

    const { activeSnippetId } = useSnippetSession()
    expect(activeSnippetId.value).toBeTruthy()
  })

  it('does not switch mobile layout to an icon rail', async () => {
    __setViewportTierForTests('mobile')
    const panels = useDashboardPanels()
    panels.snippetListExpanded.value = false

    await mountPanel()

    expect(wrapper!.find('[data-testid="snippet-list-panel"]').attributes('data-rail')).toBeUndefined()
    expect(wrapper!.find('[data-testid="snippet-list-rail"]').exists()).toBe(false)
  })
})
