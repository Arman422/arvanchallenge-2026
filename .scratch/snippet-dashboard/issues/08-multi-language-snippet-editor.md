# 08: Multi-language snippet body in the editor

**What to build:** Snippets use a curated **snippet language** allowlist (Plain Text, JavaScript, TypeScript, JSON, HTML, CSS, Less, SCSS, Markdown, YAML, XML, Python, Go, Rust, Java, C, C++, C#, SQL, Shell, Dockerfile). The editor presents the active snippet’s body according to its language: syntax highlighting for the allowlist; error marking only where Monaco already provides it (JavaScript/TypeScript, JSON, CSS/Less/SCSS, HTML family); no editor suggestions. New snippets still default to JavaScript. Persistence continues to accept only allowlisted languages. Prefer extending existing session/editor seams over new modules. Follow ADR 0004 and CONTEXT.

**Blocked by:** None - can start immediately

**Status:** ready-for-agent

## Acceptance criteria

- [x] Allowlisted snippet languages persist and round-trip; unknown languages are rejected on load as today
- [x] Active snippet’s language drives editor highlighting (including Plain Text)
- [x] Editor suggestions / autocomplete are off
- [x] Error squiggles appear for Monaco’s built-in validated languages; other allowlisted languages are highlighting-only
- [x] Creating a snippet still defaults language to JavaScript
- [x] No language servers / LSP added; no unnecessary new modules

## Blocked by

None - can start immediately
