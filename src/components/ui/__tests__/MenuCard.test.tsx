import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MenuCard } from '../MenuCard';

describe('MenuCard', () => {
    it('renders title and description', () => {
        render(<MenuCard title="Test Menu" description="A test description" />);
        expect(screen.getByText('Test Menu')).toBeInTheDocument();
        expect(screen.getByText('A test description')).toBeInTheDocument();
    });

    it('renders an optional label', () => {
        render(<MenuCard title="Test" description="Test desc" label="NEW!" />);
        expect(screen.getByText('NEW!')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<MenuCard title="Click Me" description="Desc" onClick={handleClick} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
        const handleClick = vi.fn();
        render(<MenuCard title="Disabled" description="Desc" onClick={handleClick} disabled={true} />);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();

        fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies the appropriate color mapping', () => {
        render(<MenuCard title="Amber Card" description="Desc" color="amber" label="Warning" />);

        const label = screen.getByText('Warning');
        expect(label).toHaveClass('bg-[#ffb000]'); // amber mapping
    });
});
