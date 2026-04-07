# @termuijs/jsx

Write terminal apps with JSX and React-style hooks. This package is the TSX runtime for TermUI. It handles the component lifecycle, reconciliation, and hooks like `useState`, `useEffect`, `useContext`, `useAsync`, and `memo()`.

## Install

```bash
npm install @termuijs/jsx
```

Requires `@termuijs/core` and `@termuijs/widgets`.

## Setup

Add this to your `tsconfig.json`:

```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "@termuijs/jsx"
    }
}
```

## Usage

```tsx
import { render, useState, useEffect } from '@termuijs/jsx'
import { Box, Text } from '@termuijs/widgets'

function App() {
    const [time, setTime] = useState(new Date().toLocaleTimeString())

    useEffect(() => {
        const id = setInterval(() => {
            setTime(new Date().toLocaleTimeString())
        }, 1000)
        return () => clearInterval(id)
    }, [])

    return (
        <Box border="rounded" padding={1}>
            <Text bold>Current time: {time}</Text>
        </Box>
    )
}

render(<App />)
```

## Hooks

| Hook | What it does |
|------|-------------|
| `useState` | Component state. Triggers a re-render when the value changes |
| `useEffect` | Side effects with cleanup. Runs after render, re-runs when deps change |
| `useRef` | Mutable ref that persists across renders without causing re-renders |
| `useInput` | Register a keyboard handler for this component |
| `useInterval` | Set an interval that auto-cleans on unmount |
| `useContext` | Read a value from the nearest `Provider` ancestor |
| `useAsync` | Load async data with built-in loading, error, and refetch tracking |

## Context

Share state across the component tree without passing props through every level.

```tsx
import { createContext, useContext } from '@termuijs/jsx'

const ThemeCtx = createContext({ primary: '#00ff88', bg: '#0a0a0f' })

function App() {
    return (
        <ThemeCtx.Provider value={{ primary: '#ff0088', bg: '#1a1a2e' }}>
            <Dashboard />
        </ThemeCtx.Provider>
    )
}

function StatusBar() {
    const theme = useContext(ThemeCtx)
    return <Text color={theme.primary}>Ready</Text>
}
```

## memo()

Skip re-renders when props haven't changed. Uses shallow comparison by default, or pass your own equality function.

```tsx
import { memo } from '@termuijs/jsx'

const Row = memo(function Row({ name, cpu }) {
    return <Text>{name}: {cpu}%</Text>
})

// With custom comparison
const Item = memo(ItemComponent, (prev, next) => prev.id === next.id)
```

## useAsync

Load async data without managing loading/error state yourself.

```tsx
import { useAsync } from '@termuijs/jsx'

function ProcessList() {
    const { data, loading, error, refetch } = useAsync(
        () => fetchProcesses(),
        []
    )

    if (loading) return <Spinner label="Loading..." />
    if (error) return <Text color="red">{error.message}</Text>
    return <Text>Found {data.length} processes</Text>
}
```

## Batched updates

Multiple `setState` calls in the same tick get batched into one render. This happens automatically via `queueMicrotask`, so three state updates in one event handler produce one re-render, not three.

## How it works

The JSX runtime converts TSX elements into TermUI widget trees. Each functional component gets a Fiber that tracks its hook state. When state changes, the reconciler diffs the old and new trees and applies the minimum set of updates to the screen. Context values propagate by walking up the Fiber parent chain.


## Documentation

Full docs at [www.termui.io/docs/jsx/context](https://www.termui.io/docs/jsx/context).

## License

MIT
