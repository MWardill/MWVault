import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowseGameGrid } from "../BrowseGameGrid";
import type { BrowseGame } from "@/lib/db/browse";

// Mock the panel since we test it separately
vi.mock("../BrowseGameDetailPanel", () => ({
    BrowseGameDetailPanel: ({ game, onClose }: any) => {
        if (!game) return null;
        return (
            <div data-testid="mock-panel">
                <button data-testid="close-panel" onClick={onClose}>Close</button>
                <span>Panel for {game.title}</span>
            </div>
        );
    }
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => {
    return {
        AnimatePresence: ({ children }: any) => <>{children}</>,
        motion: {
            div: require("react").forwardRef((props: any, ref: any) => {
                const { variants, initial, animate, exit, transition, ...rest } = props;
                return <div ref={ref} {...rest} />;
            }),
            button: require("react").forwardRef((props: any, ref: any) => {
                const { variants, initial, animate, exit, transition, ...rest } = props;
                return <button ref={ref} {...rest} />;
            }),
            span: require("react").forwardRef((props: any, ref: any) => {
                const { variants, initial, animate, exit, transition, ...rest } = props;
                return <span ref={ref} {...rest} />;
            }),
        }
    };
});

// Mock the spatial navigation hook
vi.mock("@/hooks/useSpatialNavigation", () => ({
    useSpatialNavigation: () => ({ focusedElementId: null }),
    setFocusedElementId: vi.fn(),
}));

const mockGames: BrowseGame[] = [
    {
        id: 1,
        title: "Test Game 1",
        imageUrl: "http://example.com/art1.jpg",
        summary: "A great game",
        developer: "Dev Corp",
        releaseDate: "2020-01-01",
        currentPrice: "10.00",
        isWishlist: false,
        isInCollection: 1,
        isOwned: true,
    },
    {
        id: 2,
        title: "Test Game 2",
        imageUrl: null,
        summary: null,
        developer: null,
        releaseDate: null,
        currentPrice: null,
        isWishlist: true,
        isInCollection: 2,
        isOwned: false,
    }
];

describe("BrowseGameGrid", () => {
    it("renders games correctly", () => {
        render(<BrowseGameGrid games={mockGames} consoleShortCode="ps1" />);
        expect(screen.getByLabelText("Test Game 1")).toBeInTheDocument();
        expect(screen.getByLabelText("Test Game 2")).toBeInTheDocument();
    });

    it("opens detail panel on game click", () => {
        render(<BrowseGameGrid games={mockGames} consoleShortCode="ps1" />);
        fireEvent.click(screen.getByLabelText("Test Game 1"));
        
        expect(screen.getByTestId("mock-panel")).toBeInTheDocument();
        expect(screen.getByText("Panel for Test Game 1")).toBeInTheDocument();
    });

    it("closes detail panel on close button click", () => {
        render(<BrowseGameGrid games={mockGames} consoleShortCode="ps1" />);
        fireEvent.click(screen.getByLabelText("Test Game 1"));
        
        const closeBtn = screen.getByTestId("close-panel");
        fireEvent.click(closeBtn);
        
        expect(screen.queryByTestId("mock-panel")).not.toBeInTheDocument();
    });
});
