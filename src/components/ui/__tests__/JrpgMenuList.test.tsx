import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { JrpgMenuList } from '../JrpgMenuList';

// Mock the hook
vi.mock('@/hooks/useSpatialNavigation', () => ({
    useSpatialNavigation: vi.fn(),
}));

import { useSpatialNavigation } from '@/hooks/useSpatialNavigation';

describe('JrpgMenuList', () => {
    const mockItems = [
        { id: 'opt1', label: 'Option 1' },
        { id: 'opt2', label: 'Option 2', disabled: true },
        { id: 'opt3', label: 'Option 3' },
    ];

    beforeEach(() => {
        vi.mocked(useSpatialNavigation).mockReturnValue({
            focusedElementId: null,
            setFocusedElementId: vi.fn(),
        } as any);
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('renders all menu items', () => {
        render(<JrpgMenuList items={mockItems} />);

        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('applies disabled styles and attributes correctly', () => {
        render(<JrpgMenuList items={mockItems} />);

        const disabledItem = document.getElementById('menu-opt2');
        expect(disabledItem).toHaveAttribute('data-disabled', 'true');
        expect(disabledItem).toHaveClass('opacity-50');
    });

    it('applies focus styles correctly via spatial navigation hook', () => {
        // Mock that opt3 is focused
        vi.mocked(useSpatialNavigation).mockReturnValue({
            focusedElementId: 'menu-opt3',
            setFocusedElementId: vi.fn(),
        } as any);

        render(<JrpgMenuList items={mockItems} />);

        const focusedItem = document.getElementById('menu-opt3');
        const unfocusedItem = document.getElementById('menu-opt1');

        expect(focusedItem).toHaveClass('text-white');
        expect(unfocusedItem).not.toHaveClass('text-white');
        expect(unfocusedItem).toHaveClass('hover:text-[#ffffff]');
    });

    it('calls onClick when an enabled item is clicked', async () => {
        const user = userEvent.setup();
        const onClick1 = vi.fn();
        const onClick2 = vi.fn();

        const items = [
            { id: '1', label: 'Enabled', onClick: onClick1 },
            { id: '2', label: 'Disabled', disabled: true, onClick: onClick2 },
        ];

        render(<JrpgMenuList items={items} />);

        await user.click(document.getElementById('menu-1') as HTMLElement);
        expect(onClick1).toHaveBeenCalledTimes(1);

        // Clicking a disabled item should not trigger onClick
        await user.click(document.getElementById('menu-2') as HTMLElement);
        expect(onClick2).not.toHaveBeenCalled();
    });
});
