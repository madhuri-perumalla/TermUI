# @termuijs/core

The rendering engine that sits at the bottom of the TermUI stack. Screen buffers, layout, input parsing, events, and styling. Everything else in the framework builds on this.

## Install

```bash
npm install @termuijs/core
```

## What's in the box

- **Screen** — Double-buffered cell grid. Diffs the previous frame against the new one so only changed cells get written to stdout.
- **LayoutEngine** — Flexbox-inspired positioning: `flexDirection`, `flexGrow`, `flexShrink`, `alignItems`, `justifyContent`, percentage sizing. All calculated in character cells.
- **InputParser** — Converts raw stdin bytes into typed `KeyEvent` objects. Handles escape sequences, Ctrl combos, and multi-byte UTF-8.
- **EventEmitter** — Type-safe `on`, `off`, `once`, `emit`. Events bubble from focused widget up through parents.
- **FocusManager** — Tab cycling between widgets, focus traps for modals, focus groups for arrow key navigation within a panel.
- **Style** — Colors (RGB, hex, named), border styles (single, double, rounded, bold), padding, margin.
- **LayerManager** — Z-indexed overlays. Modals and dropdowns render above the base layer without z-fighting.
- **App** — The entry point. Mounts your widget tree, starts the render loop, and routes input to the focused widget.

## Usage

```typescript
import { App, Screen, Style } from '@termuijs/core'

const app = new App()

// Screen is the cell buffer
const screen = app.screen
screen.setCell(0, 0, { char: 'H', fg: 'red' })

// Start the render loop
app.start()
```

## Event bubbling

Key events start at the focused widget and bubble up through its parents. Stop propagation at any level.

```typescript
import { createKeyEvent } from '@termuijs/core'

widget.on('key', (event) => {
    if (event.key === 'enter') {
        event.stopPropagation()
        // handled here, parents won't see it
    }
})
```

## Clip regions

Widgets clip their children by default. Nothing renders outside a widget's bounds.

```typescript
screen.pushClip({ x: 5, y: 5, width: 20, height: 10 })
// setCell calls outside this rect are silently discarded
screen.popClip()
```

## Batched rendering

State changes are batched via `queueMicrotask`. Multiple `setState` calls in the same tick produce a single render pass, not three.

## API reference

Full docs at [www.termui.io/docs/core/overview](https://www.termui.io/docs/core/overview).

## License

MIT
