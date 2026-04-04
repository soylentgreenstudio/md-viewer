# MdViewer

Lightweight desktop Markdown viewer for Windows built with Tauri + React.

## Features

- 📄 **Markdown rendering** — GitHub-flavored Markdown with syntax highlighting
- 📑 **Table of Contents** — auto-generated sidebar navigation by headings
- 🔍 **Full-text search** — Ctrl+F search with match highlighting and navigation
- 🖼️ **Image support** — renders local and remote images
- 📂 **Drag & Drop** — drop `.md` files to open them
- 🕐 **Recent files** — quick access to recently opened documents
- 🎨 **Clean UI** — minimal, distraction-free reading experience

## Installation

Download the latest `.exe` installer from [Releases](../../releases/latest) and run it.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI prerequisites](https://v2.tauri.app/start/prerequisites/)

### Setup

```bash
npm install
npm run tauri dev
```

### Build

```bash
npm run tauri build
```

The installer will be in `src-tauri/target/release/bundle/nsis/`.

## Release

Releases are automated via GitHub Actions. To create a new release:

```bash
git tag v1.0.0
git push origin v1.0.0
```

This triggers a CI build that compiles the app and publishes a GitHub Release with the Windows installer attached.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Backend:** Tauri 2 (Rust)
- **Markdown:** react-markdown, remark-gfm, rehype-highlight, rehype-slug

## License

MIT
