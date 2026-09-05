import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { clearNuxtState } from '#app'
import type { VueWrapper } from '@vue/test-utils'
import { useSnippetSession } from '~/composables/useSnippetSession'
import EditorZone from './EditorZone.vue'

describe('EditorZone language select', () => {
  let wrapper: VueWrapper | undefined

  beforeEach(() => {
    clearNuxtState()
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    clearNuxtState()
  })

  async function mountEditorZone() {
    return mountSuspended(EditorZone, {
      global: {
        stubs: {
          // Monaco + colorMode are out of scope for toolbar language wiring.
          CodeEditor: true,
          ClientOnly: true
        }
      }
    })
  }

  it('hides the language control when no snippet is active', async () => {
    wrapper = await mountEditorZone()

    expect(wrapper.find('[data-testid="snippet-language-select"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="editor-empty-state"]').exists()).toBe(true)
  })

  it('shows an allowlisted language control for the active snippet', async () => {
    wrapper = await mountEditorZone()
    const session = useSnippetSession()
    session.createSnippet()
    await nextTick()

    const select = wrapper.get('[data-testid="snippet-language-select"]')
    expect(select.attributes('aria-label')).toBe('Snippet language')
    expect(select.text()).toContain('JavaScript')
  })

  it('keeps snippet identity when language changes and updates the control', async () => {
    wrapper = await mountEditorZone()
    const session = useSnippetSession()
    const created = session.createSnippet()
    await nextTick()

    session.updateSnippetLanguage(created.id, 'TypeScript')
    await nextTick()

    expect(wrapper.get('[data-testid="snippet-language-select"]').text()).toContain('TypeScript')
    expect(session.activeSnippet.value?.language).toBe('TypeScript')
    expect(session.activeSnippet.value?.id).toBe(created.id)
  })
})
