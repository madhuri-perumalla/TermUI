# @termuijs/ui

High-level interactive components built on top of `@termuijs/widgets`. Modals, selects, tabs, toasts, forms, a command palette, and a few more.

## Install

```bash
npm install @termuijs/ui
```

Requires `@termuijs/core` and `@termuijs/widgets`.

## Components

| Component | What it does |
|-----------|-------------|
| `Select` | Dropdown with arrow key navigation and filtering |
| `MultiSelect` | Multiple selection with checkboxes |
| `Modal` | Overlay dialog. Traps focus so Tab stays inside |
| `Tabs` | Tab container with keyboard switching (left/right arrows) |
| `Toast` | Timed notification that auto-dismisses |
| `Form` | Groups inputs together with validation and a submit handler |
| `Tree` | Collapsible tree view for hierarchical data |
| `ConfirmDialog` | Simple Yes/No dialog |
| `CommandPalette` | Fuzzy-search command launcher (Ctrl+P style) |
| `Divider` | Horizontal or vertical separator line |
| `Spacer` | Flexible whitespace between elements |

## Usage

```typescript
import { Select, Modal, Toast, CommandPalette } from '@termuijs/ui'

const select = new Select({
    label: 'Choose a color',
    options: ['Red', 'Green', 'Blue'],
    onSelect: (value) => console.log(value),
})

const modal = new Modal({
    title: 'Confirm',
    content: 'Delete this file?',
    onClose: () => {},
})

// Toasts auto-dismiss
Toast.show('File saved', { duration: 2000 })

// Command palette with fuzzy search
const palette = new CommandPalette({
    commands: [
        { label: 'Open file', action: () => openFile() },
        { label: 'Save', action: () => save() },
        { label: 'Quit', action: () => app.exit() },
    ],
})
```


## Documentation

Full docs at [www.termui.io/docs/ui/overview](https://www.termui.io/docs/ui/overview).

## License

MIT
