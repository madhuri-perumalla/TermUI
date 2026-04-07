# @termuijs/router

Screen routing for terminal apps. Register screens by name or point it at a directory and let the file system define your routes.

## Install

```bash
npm install @termuijs/router
```

Requires `@termuijs/core` and `@termuijs/widgets`.

## Manual routing

```typescript
import { Router } from '@termuijs/router'

const router = new Router()

router.register('home', homeWidget)
router.register('settings', settingsWidget)
router.register('help', helpWidget)

// Navigate
router.push('settings')
router.back()

console.log(router.current)  // 'home'
```

## File-based routing

Point the router at a directory. Each file becomes a screen:

```
screens/
  index.ts      -> /
  settings.ts   -> /settings
  help.ts       -> /help
  users/
    [id].ts     -> /users/[id]  (dynamic param)
```

```typescript
const router = new Router({ dir: './screens' })

// Dynamic params are available in the screen
router.push('/users/42')
// screen receives { id: '42' } as params
```

## Route params

Dynamic segments use brackets in the filename. Params are typed and available inside the screen component.

```typescript
// screens/logs/[level].ts
export default function LogScreen({ params }) {
    const { level } = params  // 'error', 'warn', etc.
    return <LogView filter={level} />
}
```

## History

The router keeps a navigation stack. `push()` adds to it, `back()` pops. You can inspect the full stack with `router.history`.

## Guards

Run a check before entering a route. Return `false` or a redirect path to prevent navigation.

```typescript
router.guard('/settings', () => {
    if (!isAuthenticated) return '/login'
    return true
})
```


## Documentation

Full docs at [www.termui.io/docs/router/overview](https://www.termui.io/docs/router/overview).

## License

MIT
