# MdViewer — TODO

Results of a full project audit (analyst + code reviewer, 34 files reviewed).

**Overall score: 7/10** — solid v1.0 for a narrowly-scoped tool.

---

## Scorecard

| Category | Score | Notes |
|----------|-------|-------|
| Bundle / Lightweight | 8/10 | 557 kB JS justified (react-markdown + highlight.js). Tauri installer 5-15 MB vs Electron ~200 MB. |
| Code Quality | 8/10 | Strict TypeScript, zero `any`, clean separation of concerns. |
| Architecture | 9/10 | Proper component tree, useReducer + Context, unidirectional data flow. |
| Performance | 6/10 | Context re-renders, no search debounce, no MarkdownViewer memoization. |
| Security | 6/10 | CSP present but asset protocol scope `**/*` grants full filesystem access. |
| Tests | 1/10 | Zero tests. No test framework installed. |
| Documentation | 9/10 | README, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, issue/PR templates. |
| CSS / Visual | 8/10 | Clean GitHub-style. No dark mode. |
| Rust Backend | 9/10 | Minimal and correct. 54 lines. Extension validation. Single-instance. |
| Feature Completeness | 5/10 | Read-only viewer only. No dark mode, zoom, print, scroll-spy TOC. |

---

## Critical (P0) — Must fix

- [ ] **Asset protocol scope is `**/*`** — grants webview read access to the entire filesystem via `asset://` protocol. A crafted `.md` file with `![](../../../../sensitive/file)` can exfiltrate data. Restrict scope or implement dynamic scoping per opened file directory.
  - File: `src-tauri/tauri.conf.json` line 31

- [ ] **Ctrl+B shortcut is missing** — README documents `Ctrl+B` for sidebar toggle, but no code implements it. Documentation-code mismatch.
  - Fix: add keyboard listener in a `useKeyboardShortcuts` hook or existing hook

- [ ] **Search highlights inside code blocks** — TreeWalker checks only immediate parent (`CODE`, `PRE`), but highlight.js wraps tokens in `<span class="hljs-...">`. Search finds and corrupts syntax highlighting inside code blocks.
  - File: `src/hooks/useDocumentSearch.ts` lines 67-83
  - Fix: walk ancestor chain, not just immediate parent; use `FILTER_REJECT` to prune subtrees

---

## High Priority (P1) — Should fix before public release

- [ ] **No debounce on search** — every keystroke triggers a full DOM TreeWalker scan and mutation cycle. Visible jank on large documents (1000+ text nodes).
  - File: `src/hooks/useDocumentSearch.ts`
  - Fix: add 150-200ms debounce on `searchQuery` before the TreeWalker effect runs
  - Effort: ~15 min

- [ ] **MarkdownViewer re-renders on every state change** — typing in search, toggling sidebar, drag-over all trigger a full react-markdown re-render (the most expensive component).
  - File: `src/components/MarkdownViewer/MarkdownViewer.tsx`
  - Fix: wrap component in `React.memo()`
  - Effort: ~5 min

- [ ] **Tilde fences (`~~~`) not handled in heading extraction** — `extractHeadings` only toggles `inCodeBlock` for triple-backticks, not tilde fences. Headings inside tilde-fenced code blocks will appear in the TOC.
  - File: `src/lib/markdown.ts` line 13
  - Fix: also check `line.trim().startsWith('~~~')`
  - Effort: ~10 min

- [ ] **Strikethrough not stripped from heading text** — GFM `~~text~~` in headings is not removed before slug generation, causing potential ID mismatch with rehype-slug.
  - File: `src/lib/markdown.ts` lines 21-25
  - Fix: add `.replace(/~~(.+?)~~/g, '$1')`
  - Effort: ~5 min

- [ ] **Rust `read_markdown_file` has no path canonicalization** — receives arbitrary string, passes directly to `std::fs::read_to_string`. No symlink traversal protection.
  - File: `src-tauri/src/main.rs` (commands)
  - Fix: canonicalize path before reading

- [ ] **Recent files store race condition** — `addRecentFile` and mount-effect `load()` can race, causing the initial load to overwrite a just-saved list.
  - File: `src/hooks/useRecentFiles.ts`
  - Fix: create Store instance once and reuse; add guard ref

---

## Medium Priority (P2) — Should fix soon after release

- [ ] **TOC scroll-spy** — `activeId` is only set on click, not on scroll. Users expect the TOC to highlight the current section while reading.
  - File: `src/components/TOC/TOC.tsx`
  - Fix: `IntersectionObserver` on heading elements
  - Effort: ~2-3 hours

- [ ] **CSS variables not used consistently** — `index.css` defines `--color-text`, `--color-bg`, etc., but component CSS files use hardcoded hex values (`#1f2328`, `#f6f8fa`). Makes theming impossible without rewriting every CSS file.
  - Files: `MarkdownViewer.css`, `Sidebar.css`, `Toolbar.css`, `WelcomeScreen.css`, `Layout.css`
  - Effort: ~1-2 hours

- [ ] **Dark mode** — no `prefers-color-scheme` media query. Requires CSS variable consistency (above) first.
  - Effort: ~3-4 hours after CSS variable cleanup

- [ ] **Unit tests** — zero tests exist. `extractHeadings`, `appReducer`, `getFileName`, `isMarkdownFile` are all pure functions trivial to test.
  - Fix: install Vitest, write tests for pure functions
  - Effort: ~2 hours

- [ ] **Stale recent files** — deleted/moved files stay in the recent list with no way to remove them. No existence check.
  - File: `src/hooks/useRecentFiles.ts`, `src/components/WelcomeScreen/WelcomeScreen.tsx`
  - Effort: ~30 min

---

## Low Priority (P3) — Nice to have

- [ ] **Extract shared SVG icons** — same icon SVGs duplicated across `Toolbar.tsx`, `WelcomeScreen.tsx`, `DropZoneOverlay.tsx`. Extract into `components/Icons/`.

- [ ] **Duplicate search highlight CSS** — `mark.search-highlight` styles defined in both `SearchBar.css` and `MarkdownViewer.css` with different values. Keep only one.

- [ ] **`SUPPORTED_EXTENSIONS` constant not used in `isMarkdownFile`** — `constants.ts` defines it, `markdown.ts` re-implements with hardcoded strings. Three places to update if `.mdx` added.

- [ ] **`as string` cast in Toolbar.tsx and WelcomeScreen.tsx** — dialog `open()` result cast with `as string` instead of proper type narrowing.

- [ ] **Unlisten cleanup doesn't handle rejection** — `.then(fn => fn())` on unlisten promises without `.catch()`. Silent swallow if Tauri IPC torn down.
  - Files: `useFileOpen.ts`, `useTauriDragDrop.ts`

- [ ] **SVG icons lack `aria-hidden="true"`** — screen readers may try to describe SVG paths. Buttons need `aria-label`.
  - File: `src/components/Toolbar/Toolbar.tsx`

- [ ] **`App.css` is dead file** — imported nowhere, contains only a comment.

- [ ] **`Cargo.toml` `authors = ["you"]`** — placeholder, will appear in installed app metadata.

- [ ] **CSP `style-src 'unsafe-inline'`** — broader than necessary for a viewer app. Consider nonce-based approach.

- [ ] **Zoom support** — `Ctrl+`/`Ctrl-` for adjusting reading font size.

- [ ] **Print / Export to PDF** — `window.print()` with print-specific CSS.

---

## Architecture Notes

Strengths to preserve:
- 12 production dependencies, every one justified
- Strict TypeScript (`strict: true`, `noUnusedLocals`, `noUnusedParameters`)
- Co-located component CSS (ComponentName/ComponentName.css)
- Defense-in-depth file validation (Rust + JS)
- Single-instance with file forwarding via Tauri events
- Smart relative image path resolution via `convertFileSrc`
- TreeWalker-based search (no innerHTML manipulation, no XSS)
