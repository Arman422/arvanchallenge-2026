export type SnippetLanguage
  = | 'Plain Text'
    | 'JavaScript'
    | 'TypeScript'
    | 'JSON'
    | 'HTML'
    | 'CSS'
    | 'Less'
    | 'SCSS'
    | 'Markdown'
    | 'YAML'
    | 'XML'
    | 'Python'
    | 'Go'
    | 'Rust'
    | 'Java'
    | 'C'
    | 'C++'
    | 'C#'
    | 'SQL'
    | 'Shell'
    | 'Dockerfile'

export type Snippet = {
  id: string
  name: string
  code: string
  language: SnippetLanguage
  lastEditedAt: number
}
