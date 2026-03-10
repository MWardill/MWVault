import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import CollectionLayout from '../layout';
import { getAllConsoles } from '../actions';
import { ConsoleDropdown } from '@/components/ui/ConsoleDropdown';

// Mock the server action
vi.mock('../actions', () => ({
    getAllConsoles: vi.fn(),
}));

// Mock the ConsoleDropdown compound component to isolate layout logic
vi.mock('@/components/ui/ConsoleDropdown', () => ({
    ConsoleDropdown: vi.fn(({ consoles }) => (
        <div data-testid="mock-console-dropdown" data-console-count={consoles.length}>
            Mock Console Dropdown
        </div>
    )),
}));

describe('CollectionLayout Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches consoles and passes them to the ConsoleDropdown component', async () => {
        const mockConsoles = [
            { id: 1, shortCode: 'snes', name: 'Super Nintendo', iconPath: null },
            { id: 2, shortCode: 'n64', name: 'Nintendo 64', iconPath: null },
        ];

        vi.mocked(getAllConsoles).mockResolvedValueOnce(mockConsoles);

        // Call the async server component directly
        const LayoutComponent = await CollectionLayout({
            children: <div data-testid="child-content">Child Content</div>
        });

        render(LayoutComponent);

        // Verify the child content renders
        expect(screen.getByTestId('child-content')).toBeInTheDocument();

        // Verify the dropdown receives the correct consoles
        const dropdowns = screen.getAllByTestId('mock-console-dropdown');
        expect(dropdowns).toHaveLength(2);
        expect(dropdowns[0]).toHaveAttribute('data-console-count', '2');
        expect(dropdowns[1]).toHaveAttribute('data-console-count', '2');

        // Ensure action was called
        expect(getAllConsoles).toHaveBeenCalledTimes(1);
        expect(ConsoleDropdown).toHaveBeenCalledWith(
            expect.objectContaining({ consoles: mockConsoles }),
            undefined
        );
        expect(ConsoleDropdown).toHaveBeenCalledTimes(2);
    });
});
