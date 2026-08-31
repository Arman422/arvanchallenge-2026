<script setup lang="ts">
import type { editor } from 'monaco-editor'

const props = withDefaults(defineProps<{
  modelValue: string
  language?: string
  readOnly?: boolean
}>(), {
  language: 'javascript',
  readOnly: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const colorMode = useColorMode()
const containerRef = ref<HTMLElement | null>(null)

let editorInstance: editor.IStandaloneCodeEditor | null = null
let monacoModule: typeof import('monaco-editor') | null = null

function applyTheme() {
  if (!monacoModule) {
    return
  }

  monacoModule.editor.setTheme(colorMode.value === 'dark' ? 'vs-dark' : 'vs')
}

function applyReadOnly() {
  editorInstance?.updateOptions({ readOnly: props.readOnly })
}

onMounted(async () => {
  monacoModule = await import('monaco-editor')

  if (!containerRef.value) {
    return
  }

  applyTheme()

  editorInstance = monacoModule.editor.create(containerRef.value, {
    value: props.modelValue,
    language: props.language,
    readOnly: props.readOnly,
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    tabSize: 2,
    padding: { top: 16, bottom: 16 }
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
})

watch(() => props.modelValue, (value) => {
  if (!editorInstance || value === editorInstance.getValue()) {
    return
  }

  editorInstance.setValue(value)
})

watch(() => props.readOnly, applyReadOnly)
watch(() => colorMode.value, applyTheme)

onBeforeUnmount(() => {
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
