import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock next/navigation BEFORE dynamic imports
const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
    usePathname: () => mockUsePathname(),
}));

// We must reset modules between tests because SplashContext has a module-level
// `isFirstAppLoad` flag that is permanently mutated after the first render.
// resetModules() gives each test a fresh copy of the module with the flag = true.
describe('SplashContext', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        vi.resetModules();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('shows splash on initial load if route is /', async () => {
        mockUsePathname.mockReturnValue('/');
        const { SplashProvider, useSplash } = await import('../SplashContext');

        function TestComponent() {
            const { showSplash } = useSplash();
            return <div data-testid="showSplash">{showSplash.toString()}</div>;
        }

        render(<SplashProvider><TestComponent /></SplashProvider>);

        expect(screen.getByTestId('showSplash')).toHaveTextContent('true');
    });

    it('does not show splash on initial load if route is /collection', async () => {
        mockUsePathname.mockReturnValue('/collection');
        const { SplashProvider, useSplash } = await import('../SplashContext');

        function TestComponent() {
            const { showSplash } = useSplash();
            return <div data-testid="showSplash">{showSplash.toString()}</div>;
        }

        render(<SplashProvider><TestComponent /></SplashProvider>);

        expect(screen.getByTestId('showSplash')).toHaveTextContent('false');
    });

    it('completes the splash sequence once DB is loaded and 1 second passes', async () => {
        mockUsePathname.mockReturnValue('/');
        const { SplashProvider, useSplash } = await import('../SplashContext');

        function TestComponent() {
            const { showSplash, isComplete, setDbLoaded } = useSplash();
            return (
                <div>
                    <div data-testid="showSplash">{showSplash.toString()}</div>
                    <div data-testid="isComplete">{isComplete.toString()}</div>
                    <button data-testid="loadDb" onClick={() => setDbLoaded(true)}>Load DB</button>
                </div>
            );
        }

        render(<SplashProvider><TestComponent /></SplashProvider>);

        expect(screen.getByTestId('showSplash')).toHaveTextContent('true');
        expect(screen.getByTestId('isComplete')).toHaveTextContent('false');

        // Simulate DB load
        act(() => {
            screen.getByTestId('loadDb').click();
        });

        expect(screen.getByTestId('isComplete')).toHaveTextContent('false'); // Timer not done yet

        // Advance 1 second
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(screen.getByTestId('isComplete')).toHaveTextContent('true');

        // Allow the 300ms flash timer to complete
        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(screen.getByTestId('showSplash')).toHaveTextContent('false');
    });
});
