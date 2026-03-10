import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FloatingPanel } from '../FloatingPanel';
import { useSplash } from '@/contexts/SplashContext';

// Mock SplashContext
vi.mock('@/contexts/SplashContext', () => ({
    useSplash: vi.fn(),
}));

describe('FloatingPanel', () => {
    it('renders its children correctly', () => {
        vi.mocked(useSplash).mockReturnValue({ showSplash: false, isComplete: false, setDbLoaded: vi.fn() });

        render(
            <FloatingPanel>
                <div data-testid="child">Panel Content</div>
            </FloatingPanel>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Panel Content')).toBeInTheDocument();
    });

    it('renders a title if provided', () => {
        vi.mocked(useSplash).mockReturnValue({ showSplash: false, isComplete: false, setDbLoaded: vi.fn() });

        render(
            <FloatingPanel title="MY PANEL TITLE">
                <div>Content</div>
            </FloatingPanel>
        );

        expect(screen.getByText('MY PANEL TITLE')).toBeInTheDocument();
    });
});
