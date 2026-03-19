import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ConsolePortal } from "../ConsolePortal";
import React from "react";

// JSDOM does not implement requestAnimationFrame in a way that fires callbacks
// during React's synchronous test rendering. Stub it to call the callback
// immediately so that the portal's useEffect resolves within act().
const rafSpy = vi.fn((cb: FrameRequestCallback) => {
    cb(0);
    return 0;
});
const cafSpy = vi.fn();

describe("ConsolePortal", () => {
    let portalRoot: HTMLElement;

    beforeEach(() => {
        vi.stubGlobal("requestAnimationFrame", rafSpy);
        vi.stubGlobal("cancelAnimationFrame", cafSpy);

        // Create a mock portal target in the document body
        portalRoot = document.createElement("div");
        portalRoot.setAttribute("id", "console-selector-portal");
        document.body.appendChild(portalRoot);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        // Clean up the portal target if it still exists
        if (document.body.contains(portalRoot)) {
            document.body.removeChild(portalRoot);
        }
    });

    it("renders children into the portal target when it exists", async () => {
        await act(async () => {
            render(
                <ConsolePortal>
                    <div data-testid="portal-content">Hello, Portal!</div>
                </ConsolePortal>
            );
        });

        // After the useEffect + rAF fires, the portal target should contain the content
        const content = screen.getByTestId("portal-content");
        expect(content).toBeInTheDocument();
        expect(content).toHaveTextContent("Hello, Portal!");

        // Assert that the content was physically injected into the portal target div
        expect(portalRoot.contains(content)).toBe(true);
    });

    it("renders nothing when the portal target does not exist", async () => {
        // Remove the target to simulate a missing portal mount point
        document.body.removeChild(portalRoot);

        const { container } = render(
            <ConsolePortal>
                <div data-testid="fallback-content">Should not render</div>
            </ConsolePortal>
        );

        // Nothing should be in the container — portal returns null when target is absent
        expect(container.firstChild).toBeNull();
        expect(screen.queryByTestId("fallback-content")).not.toBeInTheDocument();
    });
});
