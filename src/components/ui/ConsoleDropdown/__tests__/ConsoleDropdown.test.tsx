import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { ConsoleDropdown } from '../ConsoleDropdown';

// Mock the Navigation Context instead of next-view-transitions directly
const navigateMock = vi.fn();
vi.mock('@/contexts/NavigationContext', () => ({
    useNavigation: () => ({
        isNavigating: false,
        transitionType: 'slide',
        navigate: navigateMock,
    }),
}));

// Mock next/navigation params
vi.mock('next/navigation', () => ({
    useParams: () => ({
        consoleId: 'snes',
    })
}));

// Mock spatial navigation hook
vi.mock('@/hooks/useSpatialNavigation', () => ({
    useSpatialNavigation: vi.fn(),
}));
import { useSpatialNavigation } from '@/hooks/useSpatialNavigation';

describe('ConsoleDropdown (Compound)', () => {
    const mockConsoles = [
        { id: 1, shortCode: 'snes', name: 'Super Nintendo', iconPath: '/mock/snes.png' },
        { id: 2, shortCode: 'megadrive', name: 'Sega Mega Drive', iconPath: '/mock/md.png' },
    ];

    beforeEach(() => {
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
        window.scrollTo = vi.fn();
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

    it('renders closed by default and shows selected console based on params', () => {
        render(<ConsoleDropdown consoles={mockConsoles} />);

        // The trigger should show the selected console's name
        expect(screen.getByText('Super Nintendo')).toBeInTheDocument();

        // The menu content shouldn't be visible (it unmounts via AnimatePresence, but even without timers the items aren't rendered until open)
        expect(screen.queryByText('Sega Mega Drive')).not.toBeInTheDocument();
    });

    it('toggles open when the trigger is clicked', async () => {
        const user = userEvent.setup();
        render(<ConsoleDropdown consoles={mockConsoles} />);

        const trigger = document.getElementById('console-dropdown-toggle');
        if (!trigger) throw new Error("Trigger not found");

        await user.click(trigger);

        // Content items should now be in the document
        expect(document.getElementById('dropdown-1')).toBeInTheDocument();
        expect(document.getElementById('dropdown-2')).toBeInTheDocument();

        // Clicking again closes it
        await user.click(trigger);
        await waitFor(() => {
            expect(screen.queryByText('Sega Mega Drive')).not.toBeInTheDocument();
        });
    });

    it('applies spatial navigation focus styles correctly to items', async () => {
        const user = userEvent.setup();

        // Mock that the megadrive is focused
        vi.mocked(useSpatialNavigation).mockReturnValue({
            focusedElementId: 'dropdown-2',
            setFocusedElementId: vi.fn(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        render(<ConsoleDropdown consoles={mockConsoles} />);

        // Open it
        await user.click(document.getElementById('console-dropdown-toggle') as HTMLElement);

        const focusedItem = document.getElementById('dropdown-2');
        const unfocusedItem = document.getElementById('dropdown-1');

        if (!focusedItem || !unfocusedItem) throw new Error("Items not found");

        expect(focusedItem).toHaveClass('focus-visible:ring-2');

        // Item 1 is selected by the route, Item 2 is focused. 
        // Expect text content styling based on Item.tsx rendering logic
        const focusedText = focusedItem.querySelector('span.truncate');
        expect(focusedText).toHaveClass('text-white'); // Focused text
    });

    it('calls router push and closes dropdown when an item is clicked', async () => {
        const user = userEvent.setup();
        render(<ConsoleDropdown consoles={mockConsoles} />);

        // Open it
        await user.click(document.getElementById('console-dropdown-toggle') as HTMLElement);

        const targetItem = document.getElementById('dropdown-2');
        if (!targetItem) throw new Error("Target item not found");

        await user.click(targetItem);

        await new Promise(resolve => setTimeout(resolve, 250));
        expect(navigateMock).toHaveBeenCalledWith('/collection/megadrive');

        // Should be closed after click, and since we use optimistic UI, the trigger will show "Sega Mega Drive".
        // We verify closure by checking the item ID is gone.
        await waitFor(() => {
            expect(document.getElementById('dropdown-2')).not.toBeInTheDocument();
        });
    });
});
