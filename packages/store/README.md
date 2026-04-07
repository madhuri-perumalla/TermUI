# @termuijs/store

Global state management for TermUI apps. The API is modeled after Zustand: create a store with a creator function, use it inside components with an optional selector, read and write state from anywhere.

Components only re-render when the specific slice they selected changes. If ten components share a store and one field updates, only the components watching that field re-render.

## Install

```bash
npm install @termuijs/store
```

Requires `@termuijs/jsx`.

## Usage

```typescript
import { createStore } from '@termuijs/store'

const useCounter = createStore((set) => ({
    count: 0,
    increment: () => set((s) => ({ count: s.count + 1 })),
    decrement: () => set((s) => ({ count: s.count - 1 })),
    reset: () => set({ count: 0 }),
}))

// In a component — only re-renders when count changes
function Counter() {
    const count = useCounter((s) => s.count)
    const increment = useCounter((s) => s.increment)

    useInput((key) => { if (key === '+') increment() })

    return <Text>Count: {count}</Text>
}
```

## Selectors

Pass a function to read a specific slice. The component won't re-render when other slices change.

```typescript
const count  = useCounter((s) => s.count)       // only count
const filter = useAppStore((s) => s.filter)      // only filter
const all    = useCounter()                       // everything (re-renders on any change)
```

## Access outside components

The hook has `getState`, `setState`, `subscribe`, and `destroy` attached directly, so you can use them without hooks rules.

```typescript
// Read
const current = useCounter.getState()

// Write from a timer
setInterval(() => {
    useCounter.setState((s) => ({ count: s.count + 1 }))
}, 5000)

// Subscribe to changes
const unsub = useCounter.subscribe((state, prev) => {
    console.log('count went from', prev.count, 'to', state.count)
})
unsub()  // unsubscribe
```

## Async actions

Actions are plain functions. Use async/await normally.

```typescript
const useDataStore = createStore((set) => ({
    items: [],
    loading: false,
    fetch: async () => {
        set({ loading: true })
        const items = await fetchItems()
        set({ items, loading: false })
    },
}))
```

## API

| Method | Description |
|--------|-------------|
| `createStore(creator)` | Create a store, returns a hook |
| `useStore()` | Subscribe to full state |
| `useStore(selector)` | Subscribe to a derived slice |
| `useStore.getState()` | Read state without subscribing |
| `useStore.setState(partial)` | Write state from outside components |
| `useStore.subscribe(listener)` | Listen to changes, returns unsubscribe |
| `useStore.destroy()` | Remove all subscribers (useful in tests) |


## Documentation

Full docs at [www.termui.io/docs/store/overview](https://www.termui.io/docs/store/overview).

## License

MIT
