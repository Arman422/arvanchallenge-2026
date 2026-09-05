import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { clearNuxtState } from '#app'
import type { VueWrapper } from '@vue/test-utils'
import {
  __resetCodeEditorFocusForTests,
  useCodeEditorFocus
} from '~/composables/useCodeEditorFocus'
import SnippetListPanel from './SnippetListPanel.vue'

describe('SnippetListPanel rename-on-create', () => {
  let wrapper: VueWrapper | undefined
  const focus = vi.fn()

  beforeEach(() => {
    clearNuxtState()
    __resetCodeEditorFocusForTests()
    focus.mockReset()
    useCodeEditorFocus().registerCodeEditorFocus(focus)
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    clearNuxtState()
    __resetCodeEditorFocusForTests()
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
