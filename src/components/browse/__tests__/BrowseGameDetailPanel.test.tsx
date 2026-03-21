import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowseGameDetailPanel } from "../BrowseGameDetailPanel";
import type { BrowseGame } from "@/lib/db/browse";
import { addGameToCollection, addGameToWishlist } from "@/app/(protected)/browse/actions";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
    useRouter: vi.fn(),
}));

vi.mock("@/app/(protected)/browse/actions", () => ({
    addGameToCollection: vi.fn(),
    addGameToWishlist: vi.fn(),
}));

vi.mock("@/hooks/useSpatialNavigation", () => ({
    useSpatialNavigation: () => ({ focusedElementId: null }),
    setFocusedElementId: vi.fn(),
}));

vi.mock("framer-motion", () => {
    return {
        AnimatePresence: ({ children }: any) => <>{children}</>,
        motion: {
            div: require("react").forwardRef((props: any, ref: any) => {
                const { initial, animate, exit, transition, ...rest } = props;
                return <div ref={ref} {...rest} />;
            }),
        }
    };
});

const mockRefresh = vi.fn();

describe("BrowseGameDetailPanel", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as Mock).mockReturnValue({ refresh: mockRefresh });
        (addGameToCollection as Mock).mockResolvedValue({ success: true });
        (addGameToWishlist as Mock).mockResolvedValue({ success: true });
    });

    const mockGame: BrowseGame = {
        id: 1,
        title: "Test Game 1",
        imageUrl: "http://example.com/art1.jpg",
        summary: "A great game",
        developer: "Dev Corp",
        releaseDate: "2020-01-01",
        currentPrice: "10.00",
        isWishlist: false,
        isInCollection: null,
        isOwned: false,
    };

    it("renders game details when a game is selected", () => {
        render(<BrowseGameDetailPanel game={mockGame} consoleShortCode="ps1" onClose={vi.fn()} />);
        expect(screen.getByText("Test Game 1")).toBeInTheDocument();
        expect(screen.getByText("Dev Corp")).toBeInTheDocument();
        expect(screen.getByText("A great game")).toBeInTheDocument();
    });

    it("does not render when game is null", () => {
        const { container } = render(<BrowseGameDetailPanel game={null} consoleShortCode="ps1" onClose={vi.fn()} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("calls addGameToCollection when add to collection button is clicked", async () => {
        const onCloseMock = vi.fn();
        render(<BrowseGameDetailPanel game={mockGame} consoleShortCode="ps1" onClose={onCloseMock} />);
        
        fireEvent.click(screen.getByText("Add to Collection"));
        
        expect(addGameToCollection).toHaveBeenCalledWith(1, "ps1");
        
        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalled();
            expect(onCloseMock).toHaveBeenCalled();
        });
    });

    it("calls addGameToWishlist when add to wishlist button is clicked", async () => {
        const onCloseMock = vi.fn();
        render(<BrowseGameDetailPanel game={mockGame} consoleShortCode="ps1" onClose={onCloseMock} />);
        
        fireEvent.click(screen.getByText("Add to Wishlist"));
        
        expect(addGameToWishlist).toHaveBeenCalledWith(1, "ps1");
        
        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalled();
            expect(onCloseMock).toHaveBeenCalled();
        });
    });

    it("disables buttons if game is already owned/wishlisted", () => {
        const ownedGame = { ...mockGame, isOwned: true, isInCollection: 1 };
        render(<BrowseGameDetailPanel game={ownedGame} consoleShortCode="ps1" onClose={vi.fn()} />);
        const collectionBtn = screen.getByText("✓ In Collection");
        expect(collectionBtn).toBeDisabled();
    });
});
