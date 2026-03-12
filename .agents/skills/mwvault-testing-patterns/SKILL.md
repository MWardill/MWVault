---
name: mwvault-testing-patterns
description: Testing guidelines and common mocking patterns for the MWVault application. Use this whenever writing unit or integration tests for React components or hooks in this codebase.
license: MIT
metadata:
  author: AI
  version: '1.0.0'
---

# MWVault Testing Patterns

This skill provides standardised testing patterns and boilerplates for the MWVault application using Vitest and React Testing Library.

## When to Apply
Reference these guidelines whenever you are:
- Writing new unit tests for components or hooks.
- Refactoring existing tests.
- Mocking Next.js App Router features (`next/navigation`).
- Mocking `next-view-transitions`.
- Testing components with `framer-motion` animations, `setTimeout`, or asynchronous loading.

## Core Guidelines

### 1. Mocking Next.js App Router (`next/navigation`)
Always mock `usePathname` and `useParams` when components depend on routing state directly.

```tsx
import { vi } from 'vitest';

const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
    usePathname: () => mockUsePathname(),
    useParams: () => ({ consoleId: 'snes' }),
}));
```

### 2. Mocking `next-view-transitions`
The `next-view-transitions` library is a core part of the MWVault routing architecture. You must explicitly mock `useTransitionRouter`.

```tsx
const mockPush = vi.fn();
vi.mock('next-view-transitions', () => ({
    useTransitionRouter: () => ({
        push: mockPush,
    }),
}));
```

### 3. Handling Timers and Animations
For components managing timeouts, debounce functions, or `framer-motion` animations (e.g. `SplashContext`, `FloatingPanel`), always use `vi.useFakeTimers()` to ensure fast, deterministic, and reliable tests.

```tsx
import { act } from '@testing-library/react';

describe('Animated Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('waits for animation or timeout to complete', () => {
        // ... render component causing state change
        
        act(() => {
            vi.advanceTimersByTime(1000); // Fast-forward 1 second
        });
        
        // ... assert subsequent state
    });
});
```

### 4. Mocking Custom Context Hooks
If testing a UI component that reads from a global context (like `SplashContext`, `NavigationContext`, or `AuthContext`), mock the context hook directly instead of wrapping the component in the root providers, unless you are writing a full integration test.

```tsx
vi.mock('@/contexts/SplashContext', () => ({
    useSplash: vi.fn(() => ({
        showSplash: false,
        isComplete: false,
        setDbLoaded: vi.fn(),
    })),
}));

vi.mock('@/contexts/NavigationContext', () => ({
    useNavigation: vi.fn(() => ({
        isNavigating: false,
        transitionType: 'slide',
        navigate: vi.fn(),
    })),
}));
```

### 5. Mocking Spatial Navigation
The `useSpatialNavigation` hook is prevalent in lists and interactive grids to handle Gamepad/D-Pad focus.

```tsx
vi.mock('@/hooks/useSpatialNavigation', () => ({
    useSpatialNavigation: vi.fn(() => ({
        focusedElementId: null, // Set to a specific ID string to mock focus
        setFocusedElementId: vi.fn(),
    })),
}));
```
