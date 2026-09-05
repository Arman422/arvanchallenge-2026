let focusCodeEditorImpl: (() => void) | null = null
let pendingFocus = false

export function useCodeEditorFocus() {
  function registerCodeEditorFocus(fn: (() => void) | null) {
    focusCodeEditorImpl = fn

    if (fn && pendingFocus) {
      pendingFocus = false
      fn()
    }
  }

  function focusCodeEditor() {
    if (focusCodeEditorImpl) {
      focusCodeEditorImpl()
      pendingFocus = false
      return
    }

    pendingFocus = true
  }

  return {
    registerCodeEditorFocus,
    focusCodeEditor
  }
}

/** Clears module state between unit tests. */
export function __resetCodeEditorFocusForTests() {
  focusCodeEditorImpl = null
  pendingFocus = false
}
