import { describe, it, expect, vi } from 'vitest';
import { Router } from './router.js';

const DummyComponent = () => ({ type: 'box', props: {}, children: [] } as any);

describe('Router Redirects', () => {
    it('handles static redirect', () => {
        const router = new Router();
        router.addRoute('/old', DummyComponent, undefined, {
            beforeEnter: () => '/new',
        });
        router.addRoute('/new', DummyComponent);

        router.push('/old');
        expect(router.currentPath).toBe('/new');
    });

    it('handles function redirect', () => {
        const router = new Router();
        router.addRoute('/user/[id]', DummyComponent, undefined, {
            beforeEnter: (to) => {
                const match = to.match(/\/user\/(.+)/);
                return match ? `/profile/${match[1]}` : to;
            },
        });
        router.addRoute('/profile/[id]', DummyComponent);

        router.push('/user/123');
        expect(router.currentPath).toBe('/profile/123');
        expect(router.params).toEqual({ id: '123' });
    });

    it('handles replace redirect', () => {
        const router = new Router();
        router.addRoute('/start', DummyComponent);
        router.addRoute('/old', DummyComponent, undefined, {
            beforeEnter: () => '/new',
        });
        router.addRoute('/new', DummyComponent);

        router.push('/start');
        router.replace('/old');
        expect(router.currentPath).toBe('/new');
        expect(router.historyLength).toBe(1);
    });

    it('handles redirect chain', () => {
        const router = new Router();
        router.addRoute('/a', DummyComponent, undefined, {
            beforeEnter: () => '/b',
        });
        router.addRoute('/b', DummyComponent, undefined, {
            beforeEnter: () => '/c',
        });
        router.addRoute('/c', DummyComponent);

        router.push('/a');
        expect(router.currentPath).toBe('/c');
    });

    it('detects cyclic redirect and emits error', () => {
        const router = new Router();
        const errorHandler = vi.fn();
        router.events.on('error', errorHandler);

        router.addRoute('/a', DummyComponent, undefined, {
            beforeEnter: () => '/b',
        });
        router.addRoute('/b', DummyComponent, undefined, {
            beforeEnter: () => '/a',
        });

        router.push('/a');

        expect(errorHandler).toHaveBeenCalled();
        expect(errorHandler.mock.calls[0][0].message).toMatch(/Too many redirects/);
    });

    it('detects cyclic redirect in replace and emits error', () => {
        const router = new Router();
        const errorHandler = vi.fn();
        router.events.on('error', errorHandler);

        router.addRoute('/start', DummyComponent);
        router.addRoute('/a', DummyComponent, undefined, {
            beforeEnter: () => '/b',
        });
        router.addRoute('/b', DummyComponent, undefined, {
            beforeEnter: () => '/a',
        });

        router.push('/start');
        router.replace('/a');

        expect(errorHandler).toHaveBeenCalled();
        expect(errorHandler.mock.calls[0][0].message).toMatch(/Too many redirects/);
    });

    it('resets redirect depth on successful navigation', () => {
        const router = new Router();
        const errorHandler = vi.fn();
        router.events.on('error', errorHandler);

        router.addRoute('/a', DummyComponent, undefined, {
            beforeEnter: () => '/b',
        });
        router.addRoute('/b', DummyComponent, undefined, {
            beforeEnter: () => '/c',
        });
        router.addRoute('/c', DummyComponent);

        router.push('/a');
        expect(router.currentPath).toBe('/c');
        expect(errorHandler).not.toHaveBeenCalled();

        // Navigate again should reset depth
        router.push('/a');
        expect(router.currentPath).toBe('/c');
        expect(errorHandler).not.toHaveBeenCalled();
    });
});