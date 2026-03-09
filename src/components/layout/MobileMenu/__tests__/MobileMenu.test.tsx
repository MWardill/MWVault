import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { MobileMenu } from '../MobileMenu';

// Mock spatial navigation hook since it is used in child components like JrpgMenuList/HandPointer
vi.mock('@/hooks/useSpatialNavigation', () => ({
    useSpatialNavigation: vi.fn(),
}));

import { useSpatialNavigation } from '@/hooks/useSpatialNavigation';

describe('MobileMenu (Compound)', () => {
    const mockOnClickA = vi.fn();
    const mockOnClickB = vi.fn();
    const mockOnClickC = vi.fn();

    const mockItems = [
        { id: 'home', label: 'Home', isMobileCore: true, onClick: mockOnClickA },
        { id: 'settings', label: 'Settings', isMobileCore: true, disabled: true, onClick: mockOnClickB },
        { id: 'profile', label: 'Profile Options', isMobileCore: false, onClick: mockOnClickC },
    ];

    beforeEach(() => {
        vi.mocked(useSpatialNavigation).mockReturnValue({
            focusedElementId: null,
            setFocusedElementId: vi.fn(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('renders closed by default and shows all core items', () => {
        render(<MobileMenu items={mockItems} currentRouteId="home" />);

        // Core items should be visible
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();

        // The dropdown item shouldn't be rendered since it's closed
        expect(screen.queryByText('Profile Options')).not.toBeInTheDocument();

        // Check active and disabled styling
        const homeBtn = screen.getByText('Home').closest('button');
        const settingsBtn = screen.getByText('Settings').closest('button');

        expect(homeBtn).toHaveAttribute('aria-current', 'page');
        expect(settingsBtn).toHaveAttribute('disabled');
        expect(settingsBtn).not.toHaveAttribute('aria-current');
    });

    it('toggles open when the hamburger button is clicked', async () => {
        const user = userEvent.setup();
        render(<MobileMenu items={mockItems} currentRouteId="home" />);

        const toggleButton = screen.getByLabelText('Open menu');
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

        await user.click(toggleButton);

        // Hamburger button label changes
        expect(screen.getByLabelText('Close menu')).toHaveAttribute('aria-expanded', 'true');

        // Dropdown item should now be visible
        expect(screen.getByText('Profile Options')).toBeInTheDocument();

        // Click again to close
        await user.click(screen.getByLabelText('Close menu'));

        await waitFor(() => {
            expect(screen.queryByText('Profile Options')).not.toBeInTheDocument();
        });
    });

    it('calls onClick and closes menu when a core item is clicked', async () => {
        const user = userEvent.setup();
        render(<MobileMenu items={mockItems} currentRouteId="home" />);

        // Open menu to verify it closes on click
        await user.click(screen.getByLabelText('Open menu'));
        expect(screen.getByText('Profile Options')).toBeInTheDocument();

        // Click a core item
        const homeBtn = screen.getByText('Home').closest('button');
        if (!homeBtn) throw new Error("Home button not found");
        await user.click(homeBtn);

        expect(mockOnClickA).toHaveBeenCalledTimes(1);

        // Menu should be closed
        await waitFor(() => {
            expect(screen.queryByText('Profile Options')).not.toBeInTheDocument();
        });
    });

    it('does not trigger onClick when a disabled core item is clicked', async () => {
        const user = userEvent.setup();
        render(<MobileMenu items={mockItems} currentRouteId="home" />);

        const disabledBtn = screen.getByText('Settings').closest('button');
        if (!disabledBtn) throw new Error("Settings button not found");

        await user.click(disabledBtn);
        expect(mockOnClickB).not.toHaveBeenCalled();
    });

    it('calls onClick and closes menu when an expandable dropdown item is clicked', async () => {
        const user = userEvent.setup();
        render(<MobileMenu items={mockItems} currentRouteId="home" />);

        // Open menu
        await user.click(screen.getByLabelText('Open menu'));

        // Click the dropdown item directly on the text
        const dropdownItem = screen.getByText('Profile Options');

        await user.click(dropdownItem);

        expect(mockOnClickC).toHaveBeenCalledTimes(1);

        // Menu should close
        await waitFor(() => {
            expect(screen.queryByText('Profile Options')).not.toBeInTheDocument();
        });
    });
});
