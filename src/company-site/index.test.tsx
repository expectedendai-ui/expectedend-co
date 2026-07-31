import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CompanySite } from ".";

describe("Expected End company homepage", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    window.localStorage.clear();
  });

  it("renders the approved mission and compact project destinations", () => {
    render(<CompanySite leaving={false} onOpenArtWorld={vi.fn()} />);

    expect(screen.getByRole("heading", { level: 1, name: "Purpose, built beautifully." })).toBeInTheDocument();
    const approvedMission = "We create thoughtful software, productivity tools, digital experiences, and communities that bring people closer to God in exciting and easy ways!";
    expect(screen.getByText((_, element) => element?.tagName === "P" && element.textContent === approvedMission)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Visit MyBibleLens" })).toHaveAttribute("href", "https://mybiblelens.us/");
    expect(screen.getByRole("link", { name: "Visit The Water Check" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/thewatercheck/"
    );
    expect(screen.queryByText("JARVIS")).not.toBeInTheDocument();
    expect(screen.queryByText("THE MENU")).not.toBeInTheDocument();
  });

  it("opens an intentionally blank accessible Bio dialog and restores focus", async () => {
    const user = userEvent.setup();
    render(<CompanySite leaving={false} onOpenArtWorld={vi.fn()} />);
    const bioButton = screen.getByRole("button", { name: "Bio for MyBibleLens" });

    await user.click(bioButton);
    const dialog = screen.getByRole("dialog", { name: "MyBibleLens bio" });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).queryByText("Bio coming soon.")).not.toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Close bio" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(bioButton).toHaveFocus();
  });

  it("dismisses Bio with cancel or backdrop interaction and restores focus", async () => {
    const user = userEvent.setup();
    render(<CompanySite leaving={false} onOpenArtWorld={vi.fn()} />);
    const bioButton = screen.getByRole("button", { name: "Bio for MyBibleLens" });

    await user.click(bioButton);
    fireEvent(screen.getByRole("dialog", { name: "MyBibleLens bio" }), new Event("cancel", { cancelable: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(bioButton).toHaveFocus();

    await user.click(bioButton);
    fireEvent.mouseDown(screen.getByRole("dialog", { name: "MyBibleLens bio" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(bioButton).toHaveFocus();
  });

  it("navigates internally and updates route metadata on popstate", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    render(<CompanySite leaving={false} onOpenArtWorld={vi.fn()} />);

    const mainNavigation = screen.getByRole("navigation", { name: "Main navigation" });
    await user.click(within(mainNavigation).getByRole("link", { name: "Mission · About · Press" }));
    expect(window.location.pathname).toBe("/about");
    expect(screen.getByRole("heading", { level: 1, name: "Hi, my name is Denzel Rigaud." })).toBeInTheDocument();
    expect(document.title).toBe("About — Expected End");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://expectedend.co/about");

    act(() => {
      window.history.pushState({}, "", "/privacy");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(screen.getByRole("heading", { level: 1, name: "Privacy Statement" })).toBeInTheDocument();
    expect(document.title).toBe("Privacy Statement — Expected End");
  });

  it("switches and persists the scoped public theme", async () => {
    const user = userEvent.setup();
    const { container } = render(<CompanySite leaving={false} onOpenArtWorld={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "White" }));
    expect(container.firstElementChild).toHaveAttribute("data-site-theme", "white");
    expect(document.body).not.toHaveAttribute("data-theme", "white");
  });

  it("routes the footer Contact link to the guided About form", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    render(<CompanySite leaving={false} onOpenArtWorld={vi.fn()} />);

    const footerNavigation = screen.getByRole("navigation", { name: "Footer navigation" });
    await user.click(within(footerNavigation).getByRole("link", { name: "Contact" }));
    expect(window.location.pathname).toBe("/about");
    expect(window.location.hash).toBe("#contact");
    expect(screen.getByRole("heading", { level: 2, name: "Start with a little context." })).toBeInTheDocument();
  });
});
