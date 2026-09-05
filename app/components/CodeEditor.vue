<script setup lang="ts">
import type { editor } from 'monaco-editor'
import type { SnippetLanguage } from '~/types/snippet'
import { toEditorLanguageId } from '~/utils/snippet'

const props = withDefaults(defineProps<{
  modelValue: string
  language?: SnippetLanguage
  readOnly?: boolean
}>(), {
  language: 'JavaScript',
  readOnly: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const colorMode = useColorMode()
const containerRef = ref<HTMLElement | null>(null)
const { registerCodeEditorFocus } = useCodeEditorFocus()

let editorInstance: editor.IStandaloneCodeEditor | null = null
let monacoModule: typeof import('monaco-editor') | null = null

function focusEditor() {
  editorInstance?.focus()
}

function applyTheme() {
  if (!monacoModule) {
    return
  }

  monacoModule.editor.setTheme(colorMode.value === 'dark' ? 'vs-dark' : 'vs')
}

function applyReadOnly() {
  editorInstance?.updateOptions({ readOnly: props.readOnly })
}

function applyLanguage() {
  if (!monacoModule || !editorInstance) {
    return
  }

  const model = editorInstance.getModel()
  if (!model) {
    return
  }

  monacoModule.editor.setModelLanguage(model, toEditorLanguageId(props.language))
}

/** Vite workers so Monaco’s built-in validators can surface error squiggles (ADR 0004). */
async function ensureMonacoEnvironment() {
  if (globalThis.MonacoEnvironment) {
    return
  }

  const [
    { default: EditorWorker },
    { default: JsonWorker },
    { default: CssWorker },
    { default: HtmlWorker },
    { default: TsWorker }
  ] = await Promise.all([
    import('monaco-editor/editor/editor.worker?worker'),
    import('monaco-editor/language/json/json.worker?worker'),
    import('monaco-editor/language/css/css.worker?worker'),
    import('monaco-editor/language/html/html.worker?worker'),
    import('monaco-editor/language/typescript/ts.worker?worker')
  ])

  globalThis.MonacoEnvironment = {
    getWorker(_workerId: string, label: string) {
      if (label === 'json') {
        return new JsonWorker()
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new CssWorker()
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new HtmlWorker()
      }
      if (label === 'typescript' || label === 'javascript') {
        return new TsWorker()
      }
      return new EditorWorker()
    }
  }
}

onMounted(async () => {
  await ensureMonacoEnvironment()
  monacoModule = await import('monaco-editor')

  if (!containerRef.value) {
    return
  }

  applyTheme()

  editorInstance = monacoModule.editor.create(containerRef.value, {
    value: props.modelValue,
    language: toEditorLanguageId(props.language),
    readOnly: props.readOnly,
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    tabSize: 2,
    padding: { top: 16, bottom: 16 },
    // Snippet pad: no autocomplete / suggestions (ADR 0004).
    quickSuggestions: false,
    suggestOnTriggerCharacters: false,
    wordBasedSuggestions: 'off',
    parameterHints: { enabled: false },
    snippetSuggestions: 'none'
  })

  editorInstance.onDidChangeModelContent(() => {
    if (!editorInstance) {
      return
    }

    const value = editorInstance.getValue()
    if (value !== props.modelValue) {
      emit('update:modelValue', value)
    }
  })

  registerCodeEditorFocus(focusEditor)
})

watch(() => props.modelValue, (value) => {
  if (!editorInstance || value === editorInstance.getValue()) {
    return
  }

  editorInstance.setValue(value)
})

watch(() => props.language, applyLanguage)
watch(() => props.readOnly, applyReadOnly)
watch(() => colorMode.value, applyTheme)

onBeforeUnmount(() => {
  registerCodeEditorFocus(null)
  editorInstance?.dispose()
  editorInstance = null
  monacoModule = null
})
</script>

<template>
  <div
    ref="containerRef"
    class="h-full min-h-0 w-full"
    data-testid="code-editor"
  />
</template>
