# @termuijs/testing

Test renderer for TermUI components. Renders your JSX tree into an in-memory screen buffer, then gives you methods to query the output, simulate key presses, and check what's on screen. No real terminal needed.

The API follows the same pattern as React Testing Library: render, query, interact, assert.

## Install

```bash
npm install --save-dev @termuijs/testing
```

Works with Vitest (recommended) or any test runner.

## Quick start

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@termuijs/testing'
import { useState, useInput } from '@termuijs/jsx'
import { Text } from '@termuijs/widgets'

function Counter() {
    const [count, setCount] = useState(0)
    useInput((key) => {
        if (key === '+') setCount((c) => c + 1)
    })
    return <Text>Count: {count}</Text>
}

describe('Counter', () => {
    it('starts at zero', () => {
        const t = render(<Counter />)
        expect(t.getByText('Count: 0')).toBeTruthy()
        t.unmount()
    })

    it('increments on +', () => {
        const t = render(<Counter />)
        t.fireKey('+')
        expect(t.getByText('Count: 1')).toBeTruthy()
        t.unmount()
    })
})
```

## API

| Method | Description |
|--------|-------------|
| `render(element, opts?)` | Render into a virtual screen (default 80x24). Returns a TestInstance |
| `t.getByText(text)` | Find first widget containing that text, or null |
| `t.getAllByText(text)` | Find all widgets containing that text |
| `t.getAllByType(Type)` | Find all widgets of a given constructor |
| `t.lastFrame()` | Current screen as an array of strings (one per row) |
| `t.toString()` | Joined non-empty screen rows |
| `t.fireKey(key, mods?)` | Simulate a key press. Dispatches to useInput handlers |
| `t.typeText(text)` | Type characters one by one |
| `t.rerender(element?)` | Re-render, optionally with a new root element |
| `t.unmount()` | Clean up all component state. Always call this |

## Testing with stores

Call `destroy()` on your stores in `afterEach` to reset state between tests.

```typescript
afterEach(() => {
    useCounterStore.destroy()
})
```

## Testing with context

Wrap the component in a Provider to supply test values.

```tsx
const t = render(
    <ThemeCtx.Provider value={testTheme}>
        <MyComponent />
    </ThemeCtx.Provider>
)
```

## Snapshot testing

`lastFrame()` returns the rendered screen as a string array, which works with Vitest's `toMatchSnapshot`:

```typescript
expect(t.lastFrame()).toMatchSnapshot()
```


## Documentation

Full docs at [www.termui.io/docs/testing/overview](https://www.termui.io/docs/testing/overview).

## License

MIT
