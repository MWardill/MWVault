import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ConsolePortal } from "../ConsolePortal";
import React from "react";

describe("ConsolePortal", () => {
    let portalRoot: HTMLElement;

    beforeEach(() => {
        // Create a mock portal target in the document body
        portalRoot = document.createElement("div");
        portalRoot.setAttribute("id", "console-selector-portal");
        document.body.appendChild(portalRoot);
    });

    afterEach(() => {
        // Clean up the portal target if it still exists
        if (document.body.contains(portalRoot)) {
            document.body.removeChild(portalRoot);
        }
    });

    it("renders children into the portal target when it exists", () => {
        render(
            <ConsolePortal>
                <div data-testid="portal-content">Hello, Portal!</div>
            </ConsolePortal>
        );

        // Check that the content exists in the document
        const content = screen.getByTestId("portal-content");
        expect(content).toBeInTheDocument();
        expect(content).toHaveTextContent("Hello, Portal!");

        // Assert that the content was physically injected into the portal target div
        expect(portalRoot.contains(content)).toBe(true);
    });

    it("renders children inline as a fallback if the portal target does not exist", () => {
        // Remove the target to simulate a missing portal mount point
        document.body.removeChild(portalRoot);

        const { container } = render(
            <ConsolePortal>
                <div data-testid="fallback-content">Fallback render</div>
            </ConsolePortal>
        );

        const content = screen.getByTestId("fallback-content");
        expect(content).toBeInTheDocument();

        // It should render directly into the normal container root, not a portal
        expect(container.contains(content)).toBe(true);
    });
});
