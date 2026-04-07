# @termuijs/quick

Build terminal apps in ~20 lines. A fluent builder API that sits on top of the TermUI stack and handles layout, data binding, and the render loop for you.

Good for dashboards, monitors, and quick prototypes where you don't need fine-grained control over every widget.

## Install

```bash
npm install @termuijs/quick
```

Requires `@termuijs/core` and `@termuijs/widgets`.

## Usage

```typescript
import { app, gauge, table, text, sparkline } from '@termuijs/quick'

app('My Dashboard')
    .rows(
        app.cols(
            gauge('CPU', () => 0.65),
            gauge('Memory', () => 0.42),
        ),
        table('Users', {
            columns: ['Name', 'Role'],
            data: () => [
                { Name: 'Alice', Role: 'Admin' },
                { Name: 'Bob', Role: 'User' },
            ],
        }),
    )
    .run()
```

That's the whole app. Layout, render loop, and input handling are handled for you.

## Builders

| Builder | What it creates |
|---------|----------------|
| `app(title)` | Root container. Call `.run()` to start |
| `text(content)` | Static or dynamic text |
| `gauge(label, valueFn)` | Live gauge (0.0 to 1.0) |
| `table(label, config)` | Data table from an array of objects |
| `sparkline(label, dataFn)` | Inline chart from an array of numbers |
| `app.rows(...)` | Stack children vertically |
| `app.cols(...)` | Stack children horizontally |

## Reactive updates

Pass a function instead of a static value. The framework calls it on each render cycle to get fresh data.

```typescript
gauge('CPU', () => getCpuUsage())   // polled every frame
table('Procs', {
    columns: ['PID', 'Name'],
    data: () => getTopProcesses(10)  // refreshed every frame
})
```

## Pairs well with @termuijs/data

```typescript
import { cpu, memory } from '@termuijs/data'

app('System Monitor')
    .rows(
        gauge('CPU', () => cpu.percent / 100),
        gauge('MEM', () => memory.percent / 100),
    )
    .run()
```


## Documentation

Full docs at [www.termui.io/docs/guides/quick](https://www.termui.io/docs/guides/quick).

## License

MIT
