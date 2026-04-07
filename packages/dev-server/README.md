# @termuijs/dev-server

File-watching dev server for TermUI apps. Saves a file, restarts the app. The turnaround is under 200ms in most cases.

## Install

```bash
npm install --save-dev @termuijs/dev-server
```

## Usage

```bash
# If you used create-termui-app, it's already wired up:
npm run dev

# Or run it directly:
npx termui-dev --entry src/index.tsx
```

## How it works

The dev server uses Node's `child_process.fork()` to run your entry file in a separate process. When a source file changes:

1. Debounce 200ms (in case you're saving multiple files)
2. Send SIGTERM to the running process
3. If it's still alive after 2 seconds, send SIGKILL
4. Fork a fresh process with the same entry

The child process runs with `TERMUI_DEV=1` and `NODE_ENV=development` in its environment.

## CLI flags

| Flag | Default | What it does |
|------|---------|-------------|
| `--entry <path>` | Auto-detected | Entry file to run |
| `--watch <glob>` | `src/**` | Files to watch |
| `--debounce <ms>` | `200` | Wait time after last change |

## Auto entry detection

Without `--entry`, the server checks these paths in order:

```
src/index.tsx → src/index.ts → src/main.tsx → src/main.ts → index.tsx → index.ts
```

## Environment variables

The child process receives these:

| Variable | Value | Purpose |
|----------|-------|---------|
| `TERMUI_DEV` | `"1"` | Check this to enable dev-only logging or debug overlays |
| `NODE_ENV` | `"development"` | Standard Node convention |

```typescript
if (process.env.TERMUI_DEV === '1') {
    // enable verbose logging, performance counters, etc.
}
```

## Graceful shutdown

Ctrl+C sends SIGTERM to the dev server, which forwards it to the child process and waits for it to exit cleanly before shutting down itself.


## Documentation

Full docs at [www.termui.io/docs/guides/dev-server](https://www.termui.io/docs/guides/dev-server).

## License

MIT
