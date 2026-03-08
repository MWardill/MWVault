import { renderHook, act } from '@testing-library/react';
import { useSpatialNavigation, setFocusedElementId, SELECTABLE_CLASS } from '../useSpatialNavigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useSpatialNavigation', () => {
    let container: HTMLElement;

    beforeEach(() => {
        // Reset the DOM
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);

        // Reset focused element ID explicitly using the exposed setter
        act(() => {
            setFocusedElementId(null);
        });

        // Mock scrollIntoView which isn't implemented in jsdom
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
    });

    const createSelectableItem = (id: string, top: number, left: number, width = 100, height = 50) => {
        const el = document.createElement('div');
        el.id = id;
        el.className = SELECTABLE_CLASS;
        // Mock getBoundingClientRect
        el.getBoundingClientRect = () => ({
            top, left, width, height,
            right: left + width,
            bottom: top + height,
            x: left, y: top,
            toJSON: () => { }
        });
        container.appendChild(el);
        return el;
    };

    it('initializes with null focusedElementId', () => {
        const { result } = renderHook(() => useSpatialNavigation());
        expect(result.current.focusedElementId).toBeNull();
    });

    it('updates focused item when clicked outside of keyboard flow', () => {
        const { result } = renderHook(() => useSpatialNavigation());
        const el = createSelectableItem('item-1', 0, 0);

        act(() => {
            el.click(); // Trigger document click listener
        });

        expect(result.current.focusedElementId).toBe('item-1');
    });

    it('focuses the first item on ArrowDown if nothing is focused', () => {
        const { result } = renderHook(() => useSpatialNavigation());
        createSelectableItem('item-1', 0, 0);
        createSelectableItem('item-2', 60, 0);

        act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        });

        expect(result.current.focusedElementId).toBe('item-1');
    });

    it('navigates to nearest item visually below on ArrowDown', () => {
        const { result } = renderHook(() => useSpatialNavigation());
        createSelectableItem('item-1', 0, 0); // Top
        createSelectableItem('item-2', 100, 0); // Bottom

        act(() => {
            // Set initial focus
            setFocusedElementId('item-1');
        });

        act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        });

        expect(result.current.focusedElementId).toBe('item-2');
    });

    it('ignores disabled elements during navigation', () => {
        const { result } = renderHook(() => useSpatialNavigation());
        createSelectableItem('item-1', 0, 0);
        const item2 = createSelectableItem('item-2', 100, 0);
        item2.dataset.disabled = "true";
        createSelectableItem('item-3', 200, 0);

        act(() => {
            setFocusedElementId('item-1');
        });

        act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        });

        // Should skip item-2 and go directly to item-3
        expect(result.current.focusedElementId).toBe('item-3');
    });
});
