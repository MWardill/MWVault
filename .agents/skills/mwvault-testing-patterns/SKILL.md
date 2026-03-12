---
name: mwvault-testing-patterns
description: Testing guidelines and common mocking patterns for the MWVault application. Use this whenever writing unit or integration tests for React components or hooks in this codebase.
license: MIT
metadata:
  author: AI
  version: '2.0.0'
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
- **At the end of ANY task that touches source code** (even if no tests were written).

---

## ⚠️ MANDATORY: End-of-Task Quality Gate

**After every task that modifies any source file you MUST run both checks and fix all failures before declaring the task complete:**

```powershell
# PowerShell uses semicolons, not && to chain commands
# 1. Lint — must exit 0
npm run lint

# 2. Tests — must show 0 failing tests
npm run test -- --run
```

> [!WARNING]
> In PowerShell, use `;` to chain commands — `&&` is **not** a valid statement separator. Run commands on separate lines or separated by `;`.

- If linting fails → fix the lint errors and re-run.
- If any tests fail → fix the tests (or the source code) and re-run.
- Do NOT declare the task done until both commands show zero errors.
- These checks must be run even when the task *appears* unrelated to tests (e.g. changing a DB query changes the type surface, which can break tests).

---

## 🎮 MANDATORY: Keyboard / Spatial Navigation for All New UI

**Every new interactive UI element MUST support the MWVault spatial navigation system (`useSpatialNavigation`).**

### Rules
1. **Every clickable item in a list or grid** must have:
   - The `jrpg-selectable` CSS class (makes it discoverable by the hook's `querySelectorAll`)
   - A **unique, stable `id` prop** (e.g. `id={`grid-game-${game.id}`}`)
2. **Every modal / overlay panel** must:
   - On open: call `setFocusedElementId(someButtonId)` to move the cursor into the panel
   - On close: call `setFocusedElementId(triggerElementId)` to return cursor to where the user was
   - Register an `Escape` key handler via `document.addEventListener('keydown', ...)` that calls `onClose`
3. **Primary action buttons inside a panel** (e.g. Close, Confirm) must also be `jrpg-selectable` with unique IDs so the user can navigate to them with arrow keys and press Enter.
4. **Focused state styling** must be visually distinct — use the sky-blue glow pattern:
   ```tsx
   const isFocused = focusedElementId === myId;
   // Border: isFocused ? "border-2 border-sky-400 shadow-[0_0_16px_rgba(125,211,252,0.5)]" : "border border-white/15"
   // Pip:    {isFocused && <motion.span animate={{ opacity: [1,0.2,1] }} ...>▶</motion.span>}
   // Text:   isFocused ? "text-white" : "text-slate-300 group-hover:text-white"
   ```

### Standard import pattern
```tsx
import { useSpatialNavigation, setFocusedElementId } from "@/hooks/useSpatialNavigation";

// Inside the component:
const { focusedElementId } = useSpatialNavigation();
const isFocused = focusedElementId === myId;
```

### Modal open/close pattern
```tsx
// On open — move cursor into the panel
useEffect(() => {
    if (isOpen) {
        setFocusedElementId("my-panel-close-btn");
    }
}, [isOpen]);

// On close — return cursor to the triggering element
const handleClose = useCallback(() => {
    setFocusedElementId(triggerElementId); // e.g. `grid-game-${game.id}`
    onClose();
}, [triggerElementId, onClose]);
```

---

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

### 6. Module-Level State Reset (`vi.resetModules`)
Some modules (e.g. `SplashContext`) use **module-level mutable variables** (e.g. `let isFirstAppLoad = true`) that persist across tests within a test file. These cause "state leak" where the first test's side-effects corrupt subsequent tests.

**Always** use `vi.resetModules()` + dynamic `import()` per-test when the module under test has module-level mutable state:

```tsx
describe('Component with module-level state', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        vi.resetModules(); // ← fresh module for every test
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('behaves correctly on first load', async () => {
        // Dynamic import INSIDE the test — gets the fresh module copy
        const { SplashProvider, useSplash } = await import('../SplashContext');
        // ... render and assert
    });
});
```

### 7. Mocking `ConsolePortal` in Layout Tests
`ConsolePortal` is a client component that uses `useEffect` + `createPortal`. In server-component layout tests there is no real DOM portal target, so mock it to render its children inline:

```tsx
vi.mock('@/components/ui/ConsolePortal', () => ({
    ConsolePortal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
```

### 8. Async `useEffect` and Portals (`act(async)`)
Components that set state inside a `useEffect` (e.g. `ConsolePortal` looking up a DOM element) require the render to be wrapped in `act(async () => { ... })` so that React flushes all effects before assertions run:

```tsx
it('renders into a portal', async () => {
    await act(async () => {
        render(<ConsolePortal><div data-testid="content">Hello</div></ConsolePortal>);
    });

    expect(screen.getByTestId('content')).toBeInTheDocument();
});
```
