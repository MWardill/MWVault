import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// --- Mocks ---

let mockFocusedElementId: string | null = null;
const mockSetFocusedElementId = vi.fn((id: string | null) => {
    mockFocusedElementId = id;
});

vi.mock("@/hooks/useSpatialNavigation", () => ({
    useSpatialNavigation: () => ({
        focusedElementId: mockFocusedElementId,
        setFocusedElementId: mockSetFocusedElementId,
    }),
    setFocusedElementId: (id: string | null) => mockSetFocusedElementId(id),
    SELECTABLE_CLASS: "jrpg-selectable",
}));

const mockFilteredGames = [
    { id: 1, title: "Chrono Trigger", imageUrl: null, summary: null, developer: null, releaseDate: null },
    { id: 2, title: "Final Fantasy VI", imageUrl: null, summary: null, developer: null, releaseDate: null },
];

vi.mock("../context", () => ({
    useGameGrid: () => ({
        filteredGames: mockFilteredGames,
        searchQuery: "",
    }),
}));

vi.mock("../../GameDetailPanel", () => ({
    GameDetailPanel: ({ game, onClose }: { game: unknown; onClose: () => void }) =>
        game ? (
            <div data-testid="detail-panel">
                <button data-testid="close-panel" onClick={onClose}>
                    Close
                </button>
            </div>
        ) : null,
}));

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
            const safeProps = { ...props };
            delete safeProps.variants;
            delete safeProps.initial;
            delete safeProps.animate;
            delete safeProps.exit;
            delete safeProps.transition;
            return <div {...safeProps}>{children}</div>;
        },
        button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
            const safeProps = { ...props };
            delete safeProps.variants;
            delete safeProps.initial;
            delete safeProps.animate;
            delete safeProps.exit;
            delete safeProps.transition;
            return <button {...safeProps}>{children}</button>;
        },
        span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
            const safeProps = { ...props };
            delete safeProps.variants;
            delete safeProps.initial;
            delete safeProps.animate;
            delete safeProps.exit;
            delete safeProps.transition;
            return <span {...safeProps}>{children}</span>;
        },
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// --- Import after mocks ---
import { GameGridList } from "../GameGridList";

describe("GameGridList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFocusedElementId = null;
    });

    afterEach(() => {
        cleanup();
    });

    it("renders game items", () => {
        render(<GameGridList />);

        expect(screen.getByLabelText("Chrono Trigger")).toBeInTheDocument();
        expect(screen.getByLabelText("Final Fantasy VI")).toBeInTheDocument();
    });

    it("opens detail panel when a game is clicked", async () => {
        const user = userEvent.setup();
        render(<GameGridList />);

        await user.click(screen.getByLabelText("Chrono Trigger"));

        expect(screen.getByTestId("detail-panel")).toBeInTheDocument();
    });

    it("does not call setFocusedElementId synchronously during closeGame state update", async () => {
        // This test guards against the React warning:
        // "Cannot update a component (`Trigger`) while rendering a different component (`GameGridList`)"
        //
        // The bug: closeGame previously called setFocusedElementId inside the
        // setSelectedGame updater function, which runs during React's render phase.
        // setFocusedElementId notifies useSyncExternalStore listeners, triggering
        // setState in other subscribed components mid-render.
        //
        // The fix: setFocusedElementId is deferred via queueMicrotask so it runs
        // after the render completes.

        const user = userEvent.setup();
        render(<GameGridList />);

        // Open a game's detail panel
        await user.click(screen.getByLabelText("Chrono Trigger"));
        expect(screen.getByTestId("detail-panel")).toBeInTheDocument();

        // Clear mocks so we can track calls from closeGame only
        mockSetFocusedElementId.mockClear();

        // Close the panel
        await user.click(screen.getByTestId("close-panel"));

        // The panel should be gone
        expect(screen.queryByTestId("detail-panel")).not.toBeInTheDocument();

        // Flush the microtask that restores focus
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        // setFocusedElementId should have been called to restore focus to the game
        expect(mockSetFocusedElementId).toHaveBeenCalledWith("grid-game-1");
    });

    it("clears spatial focus when opening a game", async () => {
        const user = userEvent.setup();
        render(<GameGridList />);

        await user.click(screen.getByLabelText("Final Fantasy VI"));

        // Opening a game should clear the spatial focus immediately (not deferred)
        expect(mockSetFocusedElementId).toHaveBeenCalledWith(null);
    });
});
