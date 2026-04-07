# @termuijs/widgets

The building blocks for terminal UIs. Boxes, text, tables, progress bars, spinners, gauges, and a virtualized list that handles millions of rows without breaking a sweat.

## Install

```bash
npm install @termuijs/widgets
```

Requires `@termuijs/core` as a peer dependency.

## Widgets

| Widget | What it is |
|--------|-----------|
| `Box` | Container with flexbox layout, borders, padding, margin |
| `Text` | Styled text. Color, bold, italic, underline, strikethrough, dim |
| `Table` | Data table with headers, column alignment, row selection |
| `ProgressBar` | Horizontal bar with percentage fill and optional label |
| `Spinner` | Animated loading indicator. Ships with multiple animation styles |
| `Gauge` | Arc or circular gauge for numeric values |
| `TextInput` | Single-line text input with cursor, placeholder, and change callback |
| `List` | Scrollable list with keyboard selection. Good for small datasets |
| `VirtualList` | Scroll-virtualized list. Renders only the visible rows, so 1M items costs the same as 10 |
| `LogView` | Tailing log viewer with auto-scroll and configurable buffer limit |
| `Sparkline` | Inline line chart from an array of numbers |
| `StatusIndicator` | Colored dot with a label (ok / warn / error / unknown) |
| `BarChart` | Horizontal or vertical bar chart with grouping |
| `Scrollbar` | Standalone scrollbar indicator |

## Usage

```typescript
import { Box, Text, ProgressBar, VirtualList } from '@termuijs/widgets'

const container = new Box({
    flexDirection: 'column',
    border: 'rounded',
    padding: 1,
})

container.addChild(new Text({ content: 'Downloads', bold: true }))
container.addChild(new ProgressBar({ value: 0.73, width: 30 }))

// VirtualList renders only visible rows
const list = new VirtualList({
    totalItems: 100_000,
    renderItem: (i) => `Row ${i}`,
    onSelect: (i) => console.log('picked', i),
})
container.addChild(list)
```

## VirtualList

The standout addition. It only paints the items that fit in the viewport, plus a small overscan buffer above and below. A list of 100,000 items renders the same ~26 rows as a list of 10.

```typescript
const list = new VirtualList({
    totalItems: data.length,
    itemHeight: 1,
    overscan: 2,
    renderItem: (index) => `${data[index].name} — ${data[index].status}`,
    onSelect: (index) => inspect(data[index]),
})

// Navigation
list.selectNext()
list.selectPrev()
list.pageDown()
list.selectFirst()
list.selectLast()
list.scrollTo(500)
list.confirm()        // fires onSelect with current index

// Update data on the fly
list.setTotalItems(newData.length)
list.setRenderItem((i) => newData[i].label)
```

## Every widget supports

- `visible` — show or hide
- `focusable` — whether Tab stops on this widget
- `style` — colors, borders, padding, margin
- `markDirty()` — flags the widget for re-render on the next frame
- Focus ring rendering when focused


## Documentation

Full docs at [www.termui.io/docs/widgets/overview](https://www.termui.io/docs/widgets/overview).

## License

MIT
