# Contributing to MdViewer

Thank you for considering contributing to MdViewer!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone git@github.com:YOUR_USERNAME/md-viewer.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b my-feature`

## Development

### Running the App

```bash
npm run tauri dev
```

This starts the Vite dev server and the Tauri window simultaneously.

### Building

```bash
npm run tauri build
```

### Code Style

- TypeScript with strict mode
- React functional components with hooks
- CSS modules per component (ComponentName/ComponentName.css)
- No external UI framework — vanilla CSS

## Pull Requests

1. Update or add tests if applicable
2. Ensure the build passes: `npm run build`
3. Write a clear PR description explaining **what** and **why**
4. Keep PRs focused — one feature or fix per PR

## Bug Reports

When filing a bug report, please include:

- OS version (Windows 10/11)
- App version (from the installer or `tauri.conf.json`)
- Steps to reproduce the issue
- Expected vs actual behavior
- Sample `.md` file if the bug is related to rendering

## Feature Requests

Open an issue describing the feature, its use case, and how it fits with the app's goal of being a lightweight, distraction-free Markdown viewer.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
