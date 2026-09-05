import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  __resetCodeEditorFocusForTests,
  useCodeEditorFocus
} from './useCodeEditorFocus'

describe('useCodeEditorFocus', () => {
  afterEach(() => {
    __resetCodeEditorFocusForTests()
  })

  it('invokes the registered focus handler', () => {
    const { registerCodeEditorFocus, focusCodeEditor } = useCodeEditorFocus()
    const focus = vi.fn()

    registerCodeEditorFocus(focus)
    focusCodeEditor()

    expect(focus).toHaveBeenCalledOnce()
  })

  it('runs a pending focus once the editor registers', () => {
    const { registerCodeEditorFocus, focusCodeEditor } = useCodeEditorFocus()
    const focus = vi.fn()

    focusCodeEditor()
    expect(focus).not.toHaveBeenCalled()

    registerCodeEditorFocus(focus)
    expect(focus).toHaveBeenCalledOnce()
  })

  it('does not focus after the editor unregisters', () => {
    const { registerCodeEditorFocus, focusCodeEditor } = useCodeEditorFocus()
    const focus = vi.fn()

    registerCodeEditorFocus(focus)
    registerCodeEditorFocus(null)
    focusCodeEditor()

    expect(focus).not.toHaveBeenCalled()
  })
})
