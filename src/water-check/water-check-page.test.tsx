import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WaterCheckPage } from "./water-check-page";

const storageSnapshot = (storage: Storage) =>
  Array.from({ length: storage.length }, (_, index) => storage.key(index))
    .filter((key): key is string => key !== null)
    .sort()
    .map((key) => [key, storage.getItem(key)]);

describe("Water Check Coming Soon page", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/thewatercheck?from=focused-test#story");
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.localStorage.setItem("existing-preference", "preserved");
    window.sessionStorage.setItem("existing-session", "preserved");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("pairs the fixed hook with an immediate limitation and an honest planned product story", () => {
    const { container } = render(<WaterCheckPage onNavigate={vi.fn()} />);

    expect(screen.getByRole("main", { name: "The Water Check Coming Soon" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "The Water Check" })).toBeInTheDocument();

    const hero = screen.getByRole("region", { name: "Water Check introduction" });
    expect(within(hero).getByText("You’re not fat, just bloated.")).toBeInTheDocument();
    expect(within(hero).getByText("Snap. Track. Debloat.")).toBeInTheDocument();
    expect(within(hero).getByText(/bloating can have many causes/i)).toHaveTextContent(
      /explores possible patterns.*not body composition or a diagnosis/i
    );
    expect(within(hero).getByText("Coming Soon")).toBeInTheDocument();
    expect(within(hero).getByText("For adults 18+")).toBeInTheDocument();

    const googlePlayBadges = screen.getAllByAltText("Google Play");
    expect(googlePlayBadges).toHaveLength(2);
    for (const badge of googlePlayBadges) {
      expect(badge).toHaveAttribute("src", "/googleplay.png");
      expect(badge).toHaveAttribute("width", "170");
      expect(badge).toHaveAttribute("height", "60");
    }
    expect(
      container.querySelectorAll(
        'path[d="M0 5.90771C0 3.14629 2.23858 0.907715 5 0.907715H130C132.761 0.907715 135 3.14629 135 5.90771V35.9077C135 38.6691 132.761 40.9077 130 40.9077H5C2.23857 40.9077 0 38.6691 0 35.9077V5.90771Z"]'
      )
    ).toHaveLength(2);

    const timeline = screen.getByRole("region", { name: "A fictional drink journal" });
    expect(within(timeline).getByText("Fictional example")).toBeInTheDocument();
    expect(within(timeline).getByText(/drink logged/i)).toBeInTheDocument();
    expect(within(timeline).getByText(/later bloat check-in/i)).toBeInTheDocument();
    expect(within(timeline).getByText("Qualified possible pattern")).toBeInTheDocument();

    expect(screen.getByText(/planned scan or described-drink logging/i)).toBeInTheDocument();
    expect(screen.getByText(/planned hydration and nutrient tracking/i)).toBeInTheDocument();
    expect(screen.getByText(/planned bloat check-ins/i)).toBeInTheDocument();
    expect(screen.getByText(/educational, approximate AI/i)).toBeInTheDocument();
    expect(screen.getByText(/may be incomplete and cannot diagnose/i)).toBeInTheDocument();
    expect(screen.getByText(/asks for no health information or email/i)).toBeInTheDocument();

    expect(container.querySelector("form, input, select, textarea, video, track")).not.toBeInTheDocument();
    expect(container.querySelector("[src*='water-check-demo'], [srcset*='water-check-demo'], [poster]")).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(/testimonial|five-star|5-star|clinically proven|certified|real users/i);

    const instagram = screen.getByRole("link", { name: "Follow on Instagram for launch updates" });
    expect(instagram).toHaveAttribute("href", "https://www.instagram.com/thewatercheck/");
    expect(instagram).toHaveAttribute("target", "_blank");
    expect(instagram).toHaveAttribute("rel", expect.stringMatching(/noopener/));
    expect(instagram).toHaveAttribute("rel", expect.stringMatching(/noreferrer/));
  });

  it.each([
    ["pointer", "App Store — Coming Soon"],
    ["keyboard", "Google Play — Coming Soon"],
  ])("keeps %s store activation inline, stable, and side-effect free", async (method, accessibleName) => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const request = vi.fn();
    vi.stubGlobal("fetch", request);
    const xhrOpen = vi.spyOn(XMLHttpRequest.prototype, "open");
    const locationBefore = window.location.href;
    const localStorageBefore = storageSnapshot(window.localStorage);
    const sessionStorageBefore = storageSnapshot(window.sessionStorage);

    render(<WaterCheckPage onNavigate={vi.fn()} />);
    const control = screen.getAllByRole("button", { name: accessibleName })[0];
    control.focus();
    const activate = () => (method === "pointer" ? user.click(control) : user.keyboard("{Enter}"));

    await activate();

    const storeGroup = screen.getAllByRole("group", { name: "Future app availability" }).find((group) => group.contains(control));
    expect(storeGroup).toBeInTheDocument();
    const storeArea = storeGroup?.parentElement;
    expect(storeArea).toBeInTheDocument();
    const status = within(storeArea as HTMLElement).getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent(/still coming soon/i);
    expect(status).not.toHaveTextContent(/availability checked again/i);
    expect(control).toHaveFocus();
    expect(control).not.toHaveAttribute("aria-pressed");
    expect(control).not.toHaveAttribute("aria-expanded");
    const firstStatus = status.textContent;

    await activate();
    expect(status).toHaveTextContent("Availability checked again (2).");
    expect(control).toHaveFocus();
    const secondStatus = status.textContent;

    await activate();
    expect(status).toHaveTextContent("Availability checked again (3).");
    expect(control).toHaveFocus();
    const thirdStatus = status.textContent;

    expect(new Set([firstStatus, secondStatus, thirdStatus])).toHaveProperty("size", 3);
    expect(window.location.href).toBe(locationBefore);
    expect(open).not.toHaveBeenCalled();
    expect(request).not.toHaveBeenCalled();
    expect(xhrOpen).not.toHaveBeenCalled();
    expect(storageSnapshot(window.localStorage)).toEqual(localStorageBefore);
    expect(storageSnapshot(window.sessionStorage)).toEqual(sessionStorageBefore);
  });
});
