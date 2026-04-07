# @termuijs/motion

Animations for terminal UIs. Spring physics for things that should feel physical, easing curves for things that should feel timed.

## Install

```bash
npm install @termuijs/motion
```

Requires `@termuijs/core`.

## Springs

Springs simulate real physics. You set stiffness, damping, and mass, then let the spring figure out the motion. The result feels natural because it is — Hooke's law, not a hand-tuned bezier.

```typescript
import { Spring } from '@termuijs/motion'

const spring = new Spring({
    stiffness: 180,
    damping: 12,
    mass: 1,
})

// Animate from 0 to 100
spring.start(0, 100, (value) => {
    progressBar.setValue(value / 100)
})
```

### Spring parameters

| Parameter | What it controls | Default |
|-----------|-----------------|---------|
| `stiffness` | How tight the spring pulls. Higher = snappier | 170 |
| `damping` | How fast oscillation settles. Higher = less bounce | 26 |
| `mass` | Inertia. Higher = slower to get moving | 1 |

A stiffness of 300 with damping of 10 gives you a snappy bounce. Stiffness 100 with damping 30 gives you a slow, smooth glide. Experiment.

## Transitions

For animations where you want a fixed duration rather than physics behavior:

```typescript
import { transition } from '@termuijs/motion'

transition(widget, {
    from: { x: 0, opacity: 0 },
    to: { x: 20, opacity: 1 },
    duration: 300,
    easing: 'ease-out',
})
```

## How it works

The spring simulation runs per-frame. Each tick updates position and velocity using the spring equation. Once velocity drops below a threshold and position is close enough to the target, the spring settles and stops ticking. No wasted CPU on finished animations.


## Documentation

Full docs at [www.termui.io/docs/motion/springs](https://www.termui.io/docs/motion/springs).

## License

MIT
