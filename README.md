# Figma Workflows

Build reusable workflows that automate repetitive design tasks in Figma.

<p align="center">
  <a href="https://www.figma.com/community/plugin/1021090917104575891/Figma-Workflows">
    <img src="assets/badge.png" height="60" alt="Install Figma Workflows" />
  </a>
</p>

## Stack

- TypeScript for the plugin controller and React UI
- React 19
- Tailwind CSS 4
- shadcn-style local UI components with Radix primitives and Lucide icons
- Vite 8 with a single-file, Figma-compatible UI bundle

## Local development

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Import `manifest.json` from **Figma → Plugins → Development → Import plugin
from manifest**. The development build watches TypeScript and CSS files and writes
the plugin bundles to `dist/`. Vite performs one clean build before starting the
UI and controller watchers.

## Commands

```bash
npm run build         # production bundle
npm test              # workflow regression tests
npm run typecheck     # TypeScript validation
npm run lint          # ESLint validation
npm run format        # format the entire project with Prettier
npm run format:check  # Prettier validation
npm run check         # tests, typecheck, lint, and production build
```

Workflow execution uses the plugin's internal typed graph engine. Existing
saved workflows remain compatible and no external workflow-engine dependency
is required.
