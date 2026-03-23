import { render, screen, cleanup, waitFor } from '@testing-library/react';
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
        { id: 'home', label: 'Home', onClick: mockOnClickA },
        { id: 'settings', label: 'Settings', disabled: true, onClick: mockOnClickB },
        { id: 'profile', label: 'Profile Options', onClick: mockOnClickC },
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

    it('renders closed by default with Home icon button', () => {
        render(<MobileMenu items={mockItems} currentRouteId="home" />);

        // Home icon button should be visible
        const homeBtn = screen.getByLabelText('Home');
        expect(homeBtn).toBeInTheDocument();

        // Dropdown items shouldn't be rendered since it's closed
        expect(screen.queryByText('Settings')).not.toBeInTheDocument();
        expect(screen.queryByText('Profile Options')).not.toBeInTheDocument();
    });

    it('toggles open when the hamburger button is clicked', async () => {
        const user = userEvent.setup();
        render(<MobileMenu items={mockItems} currentRouteId="home" />);

        const toggleButton = screen.getByLabelText('Open menu');
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

        await user.click(toggleButton);

        // Hamburger button label changes
        expect(screen.getByLabelText('Close menu')).toHaveAttribute('aria-expanded', 'true');

        // All non-home items should now be visible in dropdown
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Profile Options')).toBeInTheDocument();

        // Click again to close
        await user.click(screen.getByLabelText('Close menu'));

        await waitFor(() => {
            expect(screen.queryByText('Profile Options')).not.toBeInTheDocument();
        });
    });

    it('calls onClick and closes menu when Home button is clicked', async () => {
        const user = userEvent.setup();
        render(<MobileMenu items={mockItems} currentRouteId="home" />);

        // Open menu to verify it closes on click
        await user.click(screen.getByLabelText('Open menu'));
        expect(screen.getByText('Profile Options')).toBeInTheDocument();

        // Click the Home button
        await user.click(screen.getByLabelText('Home'));

        expect(mockOnClickA).toHaveBeenCalledTimes(1);

        // Menu should be closed
        await waitFor(() => {
            expect(screen.queryByText('Profile Options')).not.toBeInTheDocument();
        });
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
