import { render, screen, cleanup, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { GameClock } from '../GameClock';

describe('GameClock', () => {
    beforeEach(() => {
        // Setup fake timers to control setInterval
        vi.useFakeTimers();

        // Mock the Date object to provide a consistent initial time
        const mockDate = new Date('2024-01-01T14:30:15');
        vi.setSystemTime(mockDate);
    });

    afterEach(() => {
        vi.useRealTimers();
        cleanup();
    });

    it('renders the initial time correctly', () => {
        render(<GameClock />);

        // Should show 14:30:15 based on our mocked system time
        expect(screen.getByText('14:30:15')).toBeInTheDocument();
    });

    it('updates the time every second', () => {
        render(<GameClock />);

        expect(screen.getByText('14:30:15')).toBeInTheDocument();

        // Advance timer by 1 second (1000ms)
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        // Time should update
        expect(screen.getByText('14:30:16')).toBeInTheDocument();

        // Advance timer by 59 seconds
        act(() => {
            vi.advanceTimersByTime(59000);
        });

        // Time should be 14:31:15
        expect(screen.getByText('14:31:15')).toBeInTheDocument();
    });

    it('clears intervals on unmount to prevent memory leaks', () => {
        const spy = vi.spyOn(window, 'clearInterval');
        const { unmount } = render(<GameClock />);

        unmount();

        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});
