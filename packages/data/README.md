# @termuijs/data

System data providers for TermUI. CPU, memory, disk, processes, and network info, ready to drop into gauges and tables.

## Install

```bash
npm install @termuijs/data
```

## Usage

```typescript
import { cpu, memory, disk, processes, network } from '@termuijs/data'

// CPU
console.log(cpu.percent)       // 45.2
console.log(cpu.cores)         // 8

// Memory
console.log(memory.percent)    // 67.1
console.log(memory.used)       // bytes
console.log(memory.total)      // bytes

// Disk
console.log(disk.percent)      // 52.3

// Top processes by CPU usage
const top = processes.top(5)
// [{ name: 'node', pid: 1234, cpu: 12.3, mem: 5.6 }, ...]

// Network throughput
console.log(network.rx)        // bytes/sec received
console.log(network.tx)        // bytes/sec transmitted
```

## Providers

| Provider | Properties |
|----------|-----------|
| `cpu` | `percent`, `cores`, `model`, `speed` |
| `memory` | `percent`, `used`, `total`, `free` |
| `disk` | `percent`, `used`, `total`, `free` |
| `processes` | `top(n)`, `list()`, `byName(name)` |
| `network` | `rx`, `tx`, `interfaces` |
| `system` | `hostname`, `platform`, `uptime`, `arch` |

Each provider polls the OS at a configurable interval and caches the result. Multiple widgets reading the same provider share the cache, so you're not hitting `/proc` or `sysctl` once per widget.

## Pairs well with @termuijs/quick

```typescript
import { app, gauge } from '@termuijs/quick'
import { cpu, memory } from '@termuijs/data'

app('Monitor')
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
