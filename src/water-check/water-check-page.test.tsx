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

    if (method === "pointer") {
      await user.click(control);
    } else {
      await user.keyboard("{Enter}");
    }

    const storeGroup = screen.getAllByRole("group", { name: "Future app availability" }).find((group) => group.contains(control));
    expect(storeGroup).toBeInTheDocument();
    const storeArea = storeGroup?.parentElement;
    expect(storeArea).toBeInTheDocument();
    const status = within(storeArea as HTMLElement).getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent(/still coming soon/i);
    expect(control).toHaveFocus();
    expect(control).not.toHaveAttribute("aria-pressed");
    expect(control).not.toHaveAttribute("aria-expanded");

    await user.click(control);
    expect(status).toHaveTextContent(/still coming soon/i);
    expect(control).toHaveFocus();
    expect(window.location.href).toBe(locationBefore);
    expect(open).not.toHaveBeenCalled();
    expect(request).not.toHaveBeenCalled();
    expect(xhrOpen).not.toHaveBeenCalled();
    expect(storageSnapshot(window.localStorage)).toEqual(localStorageBefore);
    expect(storageSnapshot(window.sessionStorage)).toEqual(sessionStorageBefore);
  });
});
