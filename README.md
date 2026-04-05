# soylentgreenstudio/md-viewer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)
[![Tauri](https://img.shields.io/badge/Tauri-2.x-orange.svg)](https://v2.tauri.app)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org)

**A lightweight desktop Markdown viewer for Windows with table of contents navigation and full-text search.**

Open any `.md` file and get a clean, distraction-free reading experience with automatic heading navigation, syntax highlighting, and instant search. Built with Tauri for a native feel at a fraction of Electron's footprint.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Architecture](#architecture)
- [Release](#release)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## Features

| Feature | Description |
| ------- | ----------- |
| **Markdown rendering** | GitHub-flavored Markdown via react-markdown with remark-gfm |
| **Syntax highlighting** | Code blocks highlighted with highlight.js (GitHub theme) |
| **Table of Contents** | Auto-generated sidebar from document headings, click to navigate |
| **Full-text search** | Ctrl+F search with match highlighting, match counter, and keyboard navigation |
| **Image support** | Renders local relative images and remote URLs |
| **Drag and Drop** | Drop `.md` files onto the window to open them |
| **Recent files** | Persistent list of recently opened documents |
| **File associations** | Registers as a handler for `.md` and `.markdown` files on Windows |
| **Collapsible sidebar** | Toggle the TOC sidebar for more reading space |

## Installation

Download the latest `.exe` installer from [Releases](../../releases/latest) and run it. The installer is per-user — no admin rights required.

### System Requirements

| Requirement | Version |
| ----------- | ------- |
| OS | Windows 10/11 (64-bit) |
| Runtime | WebView2 (included in Windows 10 1803+) |

## Usage

Open Markdown files in any of these ways:

1. **File dialog** — click the open button in the toolbar
2. **Drag and drop** — drag a `.md` file onto the application window
3. **File association** — double-click any `.md` file in Explorer (after installation)
4. **Recent files** — select from the welcome screen

### Keyboard Shortcuts

| Shortcut | Action |
| -------- | ------ |
| `Ctrl+O` | Open file |
| `Ctrl+F` | Search in document |
| `Enter` | Next search match |
| `Shift+Enter` | Previous search match |
| `Escape` | Close search |
| `Ctrl+B` | Toggle sidebar |

## Development

### Prerequisites

| Tool | Version |
| ---- | ------- |
| [Node.js](https://nodejs.org/) | 18+ |
| [Rust](https://www.rust-lang.org/tools/install) | stable |
| [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) | see docs |

### Setup

```bash
git clone https://github.com/soylentgreenstudio/md-viewer.git
cd md-viewer
npm install
npm run tauri dev
```

That's it.

### Build

```bash
npm run tauri build
```

The NSIS installer will be in `src-tauri/target/release/bundle/nsis/`.

## Architecture

```
MdViewer
├── src/                    # React frontend (TypeScript)
│   ├── components/         # UI components
│   │   ├── Layout/         # Main layout shell
│   │   ├── MarkdownViewer/ # Markdown renderer
│   │   ├── TOC/            # Table of contents
│   │   ├── Sidebar/        # Sidebar container
│   │   ├── Toolbar/        # Top toolbar
│   │   ├── SearchBar/      # Search UI
│   │   ├── WelcomeScreen/  # Landing screen
│   │   └── DropZoneOverlay/# Drag-drop overlay
│   ├── contexts/           # React context (app state)
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript type definitions
├── src-tauri/              # Rust backend (Tauri)
│   └── src/main.rs         # File system access, window management
├── public/                 # Static assets
└── index.html              # Entry point
```

### Rendering Pipeline

```
.md file → Tauri (Rust) reads file → React state → react-markdown
    → remark-gfm (tables, strikethrough, task lists)
    → rehype-slug (heading IDs)
    → rehype-highlight (code syntax)
    → DOM
```

### TOC Navigation Flow

```
Markdown text → extractHeadings() → github-slugger IDs
                                           ↓
DOM headings  → rehype-slug       → github-slugger IDs (same)
                                           ↓
TOC click → document.getElementById(id) → scrollIntoView
```

## Release

Releases are automated via GitHub Actions. To publish a new version:

```bash
git tag v1.0.1
git push origin v1.0.1
```

The CI pipeline will:

1. Build the Tauri application on a Windows runner
2. Create a GitHub Release with the version tag
3. Attach the `.exe` installer to the release

### Versioning

This project follows [Semantic Versioning](https://semver.org/). Update the version in `src-tauri/tauri.conf.json` and `package.json` before tagging.

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| **Frontend** | React 19, TypeScript 5.8, Vite 7 |
| **Backend** | Tauri 2 (Rust) |
| **Markdown** | react-markdown 10, remark-gfm, rehype-highlight, rehype-slug |
| **Heading IDs** | github-slugger |
| **Syntax theme** | highlight.js (GitHub light) |
| **Installer** | NSIS (Windows) |
| **CI/CD** | GitHub Actions |

## License

[MIT](LICENSE.md)
