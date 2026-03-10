import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NavigationProvider, useNavigation } from '../NavigationContext';

const mockUsePathname = vi.fn();
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
    usePathname: () => mockUsePathname(),
}));

vi.mock('next-view-transitions', () => ({
    useTransitionRouter: () => ({
        push: mockPush,
    }),
}));

function TestComponent() {
    const { isNavigating, transitionType, navigate } = useNavigation();
    return (
        <div>
            <div data-testid="isNavigating">{isNavigating.toString()}</div>
            <div data-testid="transitionType">{transitionType}</div>
            <button data-testid="navBtn" onClick={() => navigate('/collection/snes')}>Nav SNES</button>
            <button data-testid="navHome" onClick={() => navigate('/home')}>Nav Home</button>
        </div>
    );
}

describe('NavigationContext', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('initializes with default values', () => {
        mockUsePathname.mockReturnValue('/home');
        render(<NavigationProvider><TestComponent /></NavigationProvider>);

        expect(screen.getByTestId('isNavigating')).toHaveTextContent('false');
        expect(screen.getByTestId('transitionType')).toHaveTextContent('slide');
    });

    it('sets transitionType to fade when navigating between collections', () => {
        mockUsePathname.mockReturnValue('/collection/megadrive');
        render(<NavigationProvider><TestComponent /></NavigationProvider>);

        act(() => {
            screen.getByTestId('navBtn').click();
        });

        expect(screen.getByTestId('transitionType')).toHaveTextContent('fade');
        expect(screen.getByTestId('isNavigating')).toHaveTextContent('true');

        act(() => {
            vi.advanceTimersByTime(50);
        });

        expect(mockPush).toHaveBeenCalledWith('/collection/snes');
    });

    it('sets transitionType to slide when navigating outside collections', () => {
        mockUsePathname.mockReturnValue('/collection/megadrive');
        render(<NavigationProvider><TestComponent /></NavigationProvider>);

        act(() => {
            screen.getByTestId('navHome').click();
        });

        expect(screen.getByTestId('transitionType')).toHaveTextContent('slide');
        expect(screen.getByTestId('isNavigating')).toHaveTextContent('true');

        act(() => {
            vi.advanceTimersByTime(50);
        });

        expect(mockPush).toHaveBeenCalledWith('/home');
    });
});
