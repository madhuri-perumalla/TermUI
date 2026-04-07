# create-termui-app

Scaffold a new TermUI project. Pick a template, pick a theme, run `npm run dev`.

## Usage

```bash
npx create-termui-app my-app
cd my-app
npm install
npm run dev
```

The CLI walks you through a few choices, then generates a working project.

## Templates

| Template | What you get |
|----------|-------------|
| Empty | One file, no dependencies beyond core. Start from scratch |
| Dashboard | Real-time gauges, tables, and a status bar |
| Interactive Tool | Forms, selects, prompts. Good for CLI wizards |
| CLI Wrapper | Wraps an existing shell command in a TermUI interface |

## Themes

Choose one of five built-in themes during setup: Default, Cyberpunk, Nord, Dracula, or Catppuccin. You can change it later in `termui.config.ts`.

## Optional features

The CLI asks which extras to include:

- **Screen Router** — file-based navigation between screens
- **Data Providers** — CPU, memory, disk monitoring out of the box
- **Hot Reload** — auto-restart on save via `@termuijs/dev-server`
- **Testing** — Vitest config with `@termuijs/testing` ready to go

## Generated project

```
my-app/
  package.json
  tsconfig.json
  termui.config.ts
  vitest.config.ts        (if testing selected)
  themes/default.tss
  src/
    index.tsx
```

Everything is TypeScript, and the dev server is preconfigured in the `dev` script.


## Documentation

Full docs at [www.termui.io/docs/getting-started/installation](https://www.termui.io/docs/getting-started/installation).

## License

MIT
