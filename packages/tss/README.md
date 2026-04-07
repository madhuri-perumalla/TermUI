# @termuijs/tss

Terminal Style Sheets. A CSS-like styling system for terminal apps with variables, selectors, and six built-in themes.

## Install

```bash
npm install @termuijs/tss
```

Requires `@termuijs/core` and `@termuijs/widgets`.

## Built-in themes

Six themes ship ready to use: Default, Cyberpunk, Nord, Dracula, Catppuccin, and Solarized.

## TSS syntax

TSS files look like CSS but target terminal widgets instead of HTML elements:

```
@theme cyberpunk {
    $primary: #ff00ff;
    $secondary: #00ffff;
    $bg: #0a0a0a;

    Box {
        border-color: $primary;
        background: $bg;
    }

    Text.title {
        color: $secondary;
        bold: true;
    }

    ProgressBar {
        fill-color: $primary;
        empty-color: #333333;
    }
}
```

Variables start with `$`. Selectors target widget type names and class names. Properties map to TermUI style attributes.

## Usage

```typescript
import { TSSEngine, getBuiltinTheme, getBuiltinThemeNames } from '@termuijs/tss'

// List available themes
const names = getBuiltinThemeNames()
// ['default', 'cyberpunk', 'nord', 'dracula', 'catppuccin']

// Load and parse a theme
const source = getBuiltinTheme('cyberpunk')
const engine = new TSSEngine()
engine.load(source)

// Resolve styles for a widget type
const styles = engine.resolve('Box')
// { borderColor: '#ff00ff', background: '#0a0a0a' }
```

## How it works

Three stages:

1. **Tokenizer** breaks the `.tss` source into tokens
2. **Parser** builds an AST from the token stream
3. **Engine** resolves selectors against widget types and class names, substituting variables along the way

The engine caches resolved styles, so repeated lookups for the same selector are fast.


## Documentation

Full docs at [www.termui.io/docs/tss/overview](https://www.termui.io/docs/tss/overview).

## License

MIT
