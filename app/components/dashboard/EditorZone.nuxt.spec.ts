import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { clearNuxtState } from '#app'
import type { VueWrapper } from '@vue/test-utils'
import { useSnippetSession } from '~/composables/useSnippetSession'
import { __setViewportTierForTests } from '~/composables/useViewportTier'
import { SNIPPET_LANGUAGES } from '~/utils/snippet'
import EditorZone from './EditorZone.vue'

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

describe('EditorZone language select', () => {
  let wrapper: VueWrapper | undefined

  beforeEach(() => {
    clearNuxtState()
    __setViewportTierForTests('desktop')
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    clearNuxtState()
    __setViewportTierForTests(null)
  })

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

describe('EditorZone toolbar', () => {
  let wrapper: VueWrapper | undefined

  beforeEach(() => {
    clearNuxtState()
    __setViewportTierForTests('desktop')
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    clearNuxtState()
    __setViewportTierForTests(null)
  })

  async function mountWithActiveSnippet() {
    wrapper = await mountEditorZone()
    useSnippetSession().createSnippet()
    await nextTick()
    return wrapper
  }

  it('keeps identity and actions as two non-overlapping layout regions', async () => {
    await mountWithActiveSnippet()

    const toolbar = wrapper!.get('[data-testid="editor-toolbar"]')
    const identity = wrapper!.get('[data-testid="editor-toolbar-identity"]')
    const actions = wrapper!.get('[data-testid="editor-toolbar-actions"]')

    expect(toolbar.element.contains(identity.element)).toBe(true)
    expect(toolbar.element.contains(actions.element)).toBe(true)
    expect(toolbar.classes()).toContain('flex-wrap')
    expect(identity.find('[data-testid="active-snippet-name"]').exists()).toBe(true)
    expect(identity.find('[data-testid="snippet-language-select"]').exists()).toBe(true)
    expect(actions.find('[data-testid="run-snippet-button"]').exists()).toBe(true)
    expect(actions.find('[data-testid="delete-snippet-button"]').exists()).toBe(true)
    // Identity min-width matches language sizing so the strip wraps instead of overlapping.
    expect((identity.element as HTMLElement).style.minWidth).toContain('ch')
  })

  it('sizes the language control for the longest allowlisted label', async () => {
    await mountWithActiveSnippet()

    const longest = Math.max(...SNIPPET_LANGUAGES.map(label => label.length))
    const widthShell = wrapper!.get('[data-testid="snippet-language-select-width"]')
    const width = (widthShell.element as HTMLElement).style.width
    // ch width covers the longest label; max-w-full prevents collision with actions.
    expect(width).toContain(`${longest}ch`)
    expect(widthShell.classes()).toContain('max-w-full')
    expect(widthShell.find('[data-testid="snippet-language-select"]').exists()).toBe(true)
  })

  it('uses sm Run/Delete with icon and label on desktop and tablet', async () => {
    await mountWithActiveSnippet()

    for (const tier of ['desktop', 'tablet'] as const) {
      __setViewportTierForTests(tier)
      await nextTick()

      const run = wrapper!.get('[data-testid="run-snippet-button"]')
      const del = wrapper!.get('[data-testid="delete-snippet-button"]')

      expect(run.classes()).toContain('h-8')
      expect(del.classes()).toContain('h-8')
      expect(run.text()).toContain('Run')
      expect(del.text()).toContain('Delete')
      expect(run.find('[data-slot="label"]').exists()).toBe(true)
      expect(del.find('[data-slot="label"]').exists()).toBe(true)
    }
  })

  it('uses icon-only sm Run/Delete with accessible names on mobile', async () => {
    __setViewportTierForTests('mobile')
    await mountWithActiveSnippet()

    const run = wrapper!.get('[data-testid="run-snippet-button"]')
    const del = wrapper!.get('[data-testid="delete-snippet-button"]')

    // Sorkhab sm + square → size-8 (same 32px metrics as h-8 labeled sm).
    expect(run.classes()).toContain('size-8')
    expect(del.classes()).toContain('size-8')
    expect(run.attributes('aria-label')).toBe('Run')
    expect(del.attributes('aria-label')).toBe('Delete')
    expect(run.find('[data-slot="label"]').exists()).toBe(false)
    expect(del.find('[data-slot="label"]').exists()).toBe(false)
  })

  it('keeps mobile actions side by side by default', async () => {
    __setViewportTierForTests('mobile')
    await mountWithActiveSnippet()

    const actions = wrapper!.get('[data-testid="editor-toolbar-actions"]')
    expect(actions.classes()).toContain('flex')
    expect(actions.classes()).not.toContain('flex-col')
  })
})
