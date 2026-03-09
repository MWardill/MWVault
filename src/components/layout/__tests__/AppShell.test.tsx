import { render, screen, cleanup } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import AppShell from '../AppShell';

// Mock next-auth
vi.mock('next-auth/react', () => ({
    useSession: () => ({
        data: { user: { name: 'TestUser' } },
        status: 'authenticated',
    }),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
    usePathname: () => '/collection/snes',
}));

// Mock next-view-transitions
vi.mock('next-view-transitions', () => ({
    useTransitionRouter: () => ({
        push: vi.fn(),
    }),
}));

// Mock spatial navigation hook
vi.mock('@/hooks/useSpatialNavigation', () => ({
    useSpatialNavigation: vi.fn(() => ({
        focusedElementId: null,
        setFocusedElementId: vi.fn(),
    })),
}));

// We only want to test integration here, not the full DOM mounting logic since that's covered in unit tests.
// Let's spy on the MobileMenu to verify it receives correct props.
vi.mock('../MobileMenu', () => ({
    MobileMenu: vi.fn(({ currentRouteId, items }) => (
        <div data-testid="mock-mobile-menu" data-route={currentRouteId} data-item-count={items.length}>
            Mock Mobile Menu
        </div>
    )),
}));

import { MobileMenu } from '../MobileMenu';

describe('AppShell Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('passes the parsed route ID to MobileMenu', () => {
        render(
            <AppShell>
                <div>Test Content</div>
            </AppShell>
        );

        const mockMenu = screen.getByTestId('mock-mobile-menu');

        // It should parse /collection/snes -> currentRouteId = "collection"
        expect(mockMenu).toHaveAttribute('data-route', 'collection');

        // It should have exactly 7 items passed to it
        expect(mockMenu).toHaveAttribute('data-item-count', '7');

        expect(MobileMenu).toHaveBeenCalled();
    });
});
