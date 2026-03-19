import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HomeClient from "../home-client";

// Mock the router
vi.mock("next-view-transitions", () => ({
    useTransitionRouter: () => ({
        push: vi.fn(),
    }),
}));

describe("HomeClient", () => {
    it("renders the consoles correctly", () => {
        const mockItems = [
            { id: "supernintendo", name: "Super Nintendo", value: 5, icon: "" },
            { id: "psone", name: "PlayStation", value: 10, icon: "" },
        ];

        render(<HomeClient initialItems={mockItems} />);

        expect(screen.getByText("Super Nintendo")).toBeInTheDocument();
        expect(screen.getByText("PlayStation")).toBeInTheDocument();

        // Check game counts (value)
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();
    });
});
