import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import SelectorGrid from '../SelectorGrid';

// Mock the hook so we can control the focusedElementId state
vi.mock('@/hooks/useSpatialNavigation', () => ({
    useSpatialNavigation: vi.fn(),
}));

import { useSpatialNavigation } from '@/hooks/useSpatialNavigation';

describe('SelectorGrid', () => {
    const mockItems = [
        { id: '1', name: 'Item 1', value: 'Value 1' },
        { id: '2', name: 'Item 2', value: 'Value 2' },
        { id: '3', name: 'Item 3' },
    ];

    beforeEach(() => {
        // Default mock implementation
        vi.mocked(useSpatialNavigation).mockReturnValue({
            focusedElementId: null,
            setFocusedElementId: vi.fn(),
        } as any);
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('renders the title and all items', () => {
        render(<SelectorGrid title="Test Grid" items={mockItems} />);

        expect(screen.getByText('Test Grid')).toBeInTheDocument();
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Value 1')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('applies focus styles when spatial navigation focuses an item', () => {
        // Mock the hook to indicate 'grid-2' is focused
        vi.mocked(useSpatialNavigation).mockReturnValue({
            focusedElementId: 'grid-2',
            setFocusedElementId: vi.fn(),
        } as any);

        render(<SelectorGrid title="Test Grid" items={mockItems} />);

        const item1 = screen.getByText('Item 1');
        const item2 = screen.getByText('Item 2');

        // Item 1 is NOT focused, should have text-gray-300
        expect(item1).toHaveClass('text-gray-300');
        expect(item1).not.toHaveClass('text-white');

        // Item 2 IS focused, should have text-white
        expect(item2).toHaveClass('text-white');
        expect(item2).not.toHaveClass('text-gray-300');
    });

    it('calls onSelect when an item is clicked', async () => {
        const user = userEvent.setup();
        const onSelectMock = vi.fn();

        render(<SelectorGrid title="Test Grid" items={mockItems} onSelect={onSelectMock} />);

        // The container of the item is what has the onClick
        const itemContainer = document.getElementById('grid-2');
        if (!itemContainer) throw new Error("Item not found");

        await user.click(itemContainer);

        expect(onSelectMock).toHaveBeenCalledTimes(1);
        expect(onSelectMock).toHaveBeenCalledWith(mockItems[1]);
    });
});
