import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SplashProvider, useSplash } from '../SplashContext';

// Mock next/navigation
const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
    usePathname: () => mockUsePathname(),
}));

// Test component to consume context
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

describe('SplashContext', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        // Reset the isInitialLoad ref implicitly by handling modules, 
        // but since it's module-level caching in some React setups we mock carefully.
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('shows splash on initial load if route is /', () => {
        mockUsePathname.mockReturnValue('/');
        render(<SplashProvider><TestComponent /></SplashProvider>);

        expect(screen.getByTestId('showSplash')).toHaveTextContent('true');
    });

    it('does not show splash on initial load if route is /collection', () => {
        mockUsePathname.mockReturnValue('/collection');
        // We have to isolate modules to reset the internal useRef(true) 
        // if this was running in a shared environment, but testing library usually remounts it fresh.
        render(<SplashProvider><TestComponent /></SplashProvider>);

        // Wait, the hook uses useRef(true) which resets on mount. 
        // So rendering a new provider is a new mount.
        expect(screen.getByTestId('showSplash')).toHaveTextContent('false');
    });

    it('completes the splash sequence once DB is loaded and 1 second passes', async () => {
        mockUsePathname.mockReturnValue('/');
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
