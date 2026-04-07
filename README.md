<p align="center">
  <h1 align="center">TermUI</h1>
  <p align="center">Build terminal user interfaces in TypeScript.</p>
</p>

<p align="center">
  <a href="https://www.termui.io/docs/getting-started/installation"><img src="https://img.shields.io/badge/docs-termui.io-00ff88?style=flat" alt="Documentation"></a>
  <a href="https://www.npmjs.com/package/@termuijs/core"><img src="https://img.shields.io/npm/v/@termuijs/core.svg" alt="npm version"></a>
  <a href="https://github.com/Karanjot786/TermUI/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <img src="https://img.shields.io/badge/tests-356%20passing-brightgreen" alt="356 tests passing">
  <img src="https://img.shields.io/badge/TypeScript-5.7-blue" alt="TypeScript 5.7">
</p>

## What is TermUI?

TermUI is a TypeScript framework for building terminal apps. You get a layout engine, JSX support, React-style hooks, context, global state management, theming, animations, routing, and a hot-reload dev server. No curses bindings. No C extensions. Pure TypeScript.

## Quick Start

```bash
npx create-termui-app my-app
cd my-app
npm install
npm run dev
```

## Manual Setup

```bash
npm install @termuijs/core @termuijs/widgets @termuijs/jsx
```

```tsx
import { App } from '@termuijs/core'
import { Box, Text } from '@termuijs/widgets'
import { useState, useInput } from '@termuijs/jsx'

function Counter() {
    const [count, setCount] = useState(0)
    useInput((key) => {
        if (key === '+') setCount((c) => c + 1)
        if (key === 'q') app.exit()
    })
    return (
        <Box border="round" padding={1}>
            <Text bold>Count: {count}</Text>
            <Text dim>Press + to increment · q to quit</Text>
        </Box>
    )
}

const app = new App(rootWidget)
await app.mount()
```

> **Note:** The JSX-based API above shows the component-based approach with `@termuijs/jsx`. See the [Quick Start](https://www.termui.io/docs/getting-started/quick-start) for the widget-tree approach.

## Packages

| Package | What it does |
|---------|-------------|
| [`@termuijs/core`](./packages/core) | Screen buffer, input parsing, event system, flexbox layout |
| [`@termuijs/widgets`](./packages/widgets) | Box, Text, Table, ProgressBar, Spinner, Gauge, VirtualList, and more |
| [`@termuijs/ui`](./packages/ui) | Select, Tabs, Modal, Toast, Tree, MultiSelect, CommandPalette |
| [`@termuijs/jsx`](./packages/jsx) | JSX runtime — useState, useEffect, useRef, **useContext**, **useAsync**, **memo()** |
| [`@termuijs/store`](./packages/store) | Zustand-like global state with selector subscriptions |
| [`@termuijs/testing`](./packages/testing) | In-memory test renderer: render, query, fireKey, assert |
| [`@termuijs/tss`](./packages/tss) | Terminal Style Sheets — CSS-like theming with variables and pseudo-classes |
| [`@termuijs/motion`](./packages/motion) | Spring-physics and easing-based animations |
| [`@termuijs/router`](./packages/router) | File-based screen routing with typed params and guards |
| [`@termuijs/data`](./packages/data) | Real-time system data: CPU, memory, disk, processes |
| [`@termuijs/dev-server`](./packages/dev-server) | Hot-reload dev server — restart on file save in <200ms |
| [`@termuijs/quick`](./packages/quick) | Fluent builder API — build dashboards in ~20 lines |
| [`create-termui-app`](./packages/create-termui-app) | Project scaffolding CLI |

## What's New

### useContext + createContext

Share state across your component tree without prop drilling — works identically to React's context API:

```tsx
import { createContext, useContext } from '@termuijs/jsx'

const ThemeCtx = createContext({ primary: '#00ff88', bg: '#0a0a0f' })

function App() {
    return (
        <ThemeCtx.Provider value={theme}>
            <Dashboard />
        </ThemeCtx.Provider>
    )
}

function StatusBar() {
    const { primary } = useContext(ThemeCtx)
    return <Text color={primary}>Ready</Text>
}
```

### @termuijs/store — Global State

Zustand-like state management with selector-based subscriptions. Only re-renders the components that need to:

```tsx
import { createStore } from '@termuijs/store'

const useAppStore = createStore((set) => ({
    count: 0,
    increment: () => set((s) => ({ count: s.count + 1 })),
}))

function Counter() {
    const count     = useAppStore((s) => s.count)
    const increment = useAppStore((s) => s.increment)

    useInput((key) => { if (key === '+') increment() })
    return <Text>Count: {count}</Text>
}
```

### VirtualList — Scroll Any Dataset

Renders only visible rows. A list of 1,000,000 items is as fast as a list of 10:

```tsx
import { VirtualList } from '@termuijs/widgets'

const list = new VirtualList({
    totalItems: 1_000_000,
    renderItem: (index) => `Log line ${index}: some content`,
    onSelect:   (index) => openDetail(index),
})

app.events.on('key', (e) => {
    if (e.key === 'up')   list.selectPrev()
    if (e.key === 'down') list.selectNext()
})
```

### @termuijs/testing — Test Renderer

Write fast, headless component tests without a real terminal:

```tsx
import { render } from '@termuijs/testing'

const t = render(<Counter />)
expect(t.getByText('Count: 0')).toBeTruthy()

t.fireKey('+')
expect(t.getByText('Count: 1')).toBeTruthy()

t.unmount()
```

### memo() + Batched Updates

`memo()` skips re-renders when props haven't changed. Batching collapses multiple `setState` calls into one render automatically:

```tsx
import { memo } from '@termuijs/jsx'

const ProcessRow = memo(function ProcessRow({ pid, name, cpu }) {
    return <Text>{pid} {name} {cpu}%</Text>
})
// ProcessRow only re-renders when its props actually change
```

### Hot Reload Dev Server

Real process-based hot reload — your app restarts in <200ms on every save:

```bash
npm run dev          # uses create-termui-app setup
# or directly:
npx termui-dev --entry src/index.tsx
```

## Architecture

```
Application Layer:    @termuijs/ui · @termuijs/quick · create-termui-app
Component Layer:      @termuijs/widgets · @termuijs/jsx · @termuijs/store
Testing:              @termuijs/testing
Feature Layer:        @termuijs/tss · @termuijs/router · @termuijs/motion
Core Layer:           @termuijs/core · @termuijs/data
```

Every layer depends only on the layers below it. You can use any package independently.

## Examples

### System Dashboard (Quick API)

```typescript
import { app, gauge, table } from '@termuijs/quick'
import { cpu, memory, processes } from '@termuijs/data'

app('System Monitor')
    .rows(
        app.cols(
            gauge('CPU', () => cpu.percent / 100),
            gauge('MEM', () => memory.percent / 100),
        ),
        table('Processes', {
            columns: ['Name', 'PID', 'CPU%'],
            data: () => processes.top(10).map(p => ({
                Name: p.name,
                PID: p.pid,
                'CPU%': p.cpu.toFixed(1),
            })),
        }),
    )
    .run()
```

### Global State with Store

```tsx
import { createStore } from '@termuijs/store'

const useTodoStore = createStore((set, get) => ({
    todos: [] as string[],
    addTodo: (text: string) => set((s) => ({ todos: [...s.todos, text] })),
    removeTodo: (i: number) => set((s) => ({
        todos: s.todos.filter((_, idx) => idx !== i)
    })),
}))

function TodoApp() {
    const todos = useTodoStore((s) => s.todos)
    const addTodo = useTodoStore((s) => s.addTodo)

    // Only re-renders when todos changes
}
```

### Async Data Loading

```tsx
import { useAsync } from '@termuijs/jsx'

function ProcessList() {
    const { data, loading, error, refetch } = useAsync(
        () => fetchProcesses(),
        []
    )

    if (loading) return <Spinner label="Loading..." />
    if (error)   return <Text color="red">{error.message}</Text>

    return <VirtualList totalItems={data.length} renderItem={(i) => data[i].name} />
}
```

## Running the Examples

```bash
git clone https://github.com/Karanjot786/TermUI.git
cd TermUI
pnpm install
pnpm run build

# System monitor dashboard
cd examples/dashboard
npx tsx src/index.tsx

# JSX-based dashboard
cd examples/jsx-dashboard
npx tsx src/index.tsx
```

Five examples included: `dashboard`, `jsx-dashboard`, `showcase`, `system-monitor`, and `todo-app`.

## Project Structure

```
packages/
  core/              Screen buffer, input, events, layout
  widgets/           Base widget library (+ VirtualList)
  ui/                High-level components
  jsx/               JSX runtime, hooks, context, memo
  store/             Global state management
  testing/           Test renderer
  tss/               Terminal Style Sheets
  motion/            Spring animation engine
  router/            File-based routing
  data/              System data providers
  dev-server/        Hot-reload dev server
  quick/             Fluent builder API
  create-termui-app/ Project scaffolding CLI
examples/
  dashboard/         Real-time system monitor
  jsx-dashboard/     JSX-based dashboard
  showcase/          Widget gallery
  system-monitor/    Advanced monitor
  todo-app/          Interactive todo list
```

## Testing

```bash
pnpm test           # Run all 356 tests
pnpm run build      # Build all 13 packages
```

## Requirements

- Node.js 18+
- A terminal with TTY support (256-color or truecolor recommended)

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Install: `pnpm install`
4. Build: `pnpm run build`
5. Test: `pnpm test`
6. Submit a pull request

## License

MIT
