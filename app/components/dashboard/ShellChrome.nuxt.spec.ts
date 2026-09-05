import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { VueWrapper } from '@vue/test-utils'
import { __setViewportTierForTests } from '~/composables/useViewportTier'
import ShellChrome from './ShellChrome.vue'

describe('ShellChrome', () => {
  let wrapper: VueWrapper | undefined

  beforeEach(() => {
    __setViewportTierForTests('desktop')
    const colorMode = useColorMode()
    colorMode.preference = 'light'
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    __setViewportTierForTests(null)
  })

  async function mountChrome() {
    wrapper = await mountSuspended(ShellChrome)
    return wrapper
  }

  it('renders shell chrome with a theme icon toggle and no console control', async () => {
    await mountChrome()

    expect(wrapper!.find('[data-testid="shell-chrome"]').exists()).toBe(true)
    expect(wrapper!.find('[data-testid="theme-toggle-button"]').exists()).toBe(true)
    expect(wrapper!.find('[data-testid="console-show-button"]').exists()).toBe(false)
    expect(wrapper!.find('[data-testid="console-hide-button"]').exists()).toBe(false)
  })

  it('toggles theme preference between light and dark', async () => {
    await mountChrome()
    const colorMode = useColorMode()

    await wrapper!.get('[data-testid="theme-toggle-button"]').trigger('click')
    expect(colorMode.preference).toBe('dark')

    await wrapper!.get('[data-testid="theme-toggle-button"]').trigger('click')
    expect(colorMode.preference).toBe('light')
  })

  it('shows the product title on desktop and centered on mobile', async () => {
    await mountChrome()
    const desktopTitle = wrapper!.get('[data-testid="shell-product-title"]')
    expect(desktopTitle.text()).toBe('Snippet Manager')
    expect(desktopTitle.classes()).not.toContain('text-center')

    __setViewportTierForTests('tablet')
    await nextTick()
    expect(wrapper!.find('[data-testid="shell-product-title"]').exists()).toBe(false)

    __setViewportTierForTests('mobile')
    await nextTick()
    const mobileTitle = wrapper!.get('[data-testid="shell-product-title"]')
    expect(mobileTitle.text()).toBe('Snippet Manager')
    expect(mobileTitle.classes()).toContain('text-center')
  })
})
