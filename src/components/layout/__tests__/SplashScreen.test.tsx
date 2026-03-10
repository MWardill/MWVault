import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { SplashScreen } from '../SplashScreen';
import { useSplash } from '@/contexts/SplashContext';

vi.mock('@/contexts/SplashContext', () => ({
    useSplash: vi.fn(),
}));

describe('SplashScreen', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('renders nothing when showSplash is false', () => {
        vi.mocked(useSplash).mockReturnValue({ showSplash: false, isComplete: false, setDbLoaded: vi.fn() });

        const { container } = render(<SplashScreen />);
        expect(container.firstChild).toBeNull();
    });

    it('renders the loading bar when showSplash is true', () => {
        vi.mocked(useSplash).mockReturnValue({ showSplash: true, isComplete: false, setDbLoaded: vi.fn() });

        const { container } = render(<SplashScreen />);

        // The container creates an element rendering the splash
        expect(container.querySelector('.bg-cyan-400')).toBeInTheDocument();
    });

    it('renders the completed loading bar when isComplete is true', () => {
        vi.mocked(useSplash).mockReturnValue({ showSplash: true, isComplete: true, setDbLoaded: vi.fn() });

        const { container } = render(<SplashScreen />);

        expect(container.querySelector('.bg-pink-500')).toBeInTheDocument();
    });
});
