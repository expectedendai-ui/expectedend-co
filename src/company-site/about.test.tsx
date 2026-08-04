import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CompanySite } from ".";

describe("Expected End About page", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/about");
  });

  it("shows the tiny golden egg only on About and invokes the existing handoff", async () => {
    const user = userEvent.setup();
    const onOpenArtWorld = vi.fn();
    render(<CompanySite leaving={false} onOpenArtWorld={onOpenArtWorld} />);

    expect(screen.getByRole("heading", { level: 1, name: "Technology with purpose, built for real life." })).toBeInTheDocument();
    const egg = screen.getByRole("button", { name: "Enter the hidden art world" });
    const image = withinEgg(egg);
    expect(image).toHaveAttribute("width", "25");
    expect(image).toHaveAttribute("height", "25");
    await user.click(egg);
    expect(onOpenArtWorld).toHaveBeenCalledTimes(1);
  });

  it("leads with company information and expands the founder story in place", async () => {
    const user = userEvent.setup();
    render(<CompanySite leaving={false} onOpenArtWorld={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Technology should help you return to your life." })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Two ideas, one purpose." })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tell the story with us." })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Hi, my name is Denzel Rigaud." })).not.toBeInTheDocument();

    const storyToggle = screen.getByRole("button", { name: "The Founder Story" });
    expect(storyToggle).toHaveAttribute("aria-expanded", "false");
    await user.click(storyToggle);
    expect(screen.getByRole("heading", { name: "Hi, my name is Denzel Rigaud." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "“The Truth Behind the Code”" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Two" })).toHaveAttribute("href", "https://unicourt.com/case/fl-pal-rigaud-denzel-v-hall-aaron-914059");
    expect(screen.getByRole("link", { name: "father" })).toHaveAttribute("href", "https://www.google.com/search?q=clifford+rigaud");
    expect(screen.getByRole("link", { name: "chivalry" })).toHaveAttribute("href", "https://www.youtube.com/watch?v=SHVKb2j6rfc&list=RDSHVKb2j6rfc&start_radio=1");
    expect(screen.getByRole("button", { name: "Close Founder Story" })).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("button", { name: /Jeremiah 29:11/ }));
    expect(screen.getByRole("dialog", { name: "Jeremiah 29:11" })).toHaveTextContent("to give you an expected end");
    await user.click(screen.getByRole("button", { name: "Close Bible verse" }));
    expect(screen.queryByRole("dialog", { name: "Jeremiah 29:11" })).not.toBeInTheDocument();
  });

  it("opens the founder story when linked from MyBibleLens", () => {
    render(<CompanySite leaving={false} onOpenArtWorld={vi.fn()} />);

    act(() => {
      window.history.pushState({}, "", "/about#founder-story");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    expect(screen.getByRole("button", { name: "Close Founder Story" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("heading", { name: "“The Truth Behind the Code”" })).toBeInTheDocument();
  });

  it("does not show the egg on the homepage", () => {
    window.history.replaceState({}, "", "/");
    render(<CompanySite leaving={false} onOpenArtWorld={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Enter the hidden art world" })).not.toBeInTheDocument();
  });
});

const withinEgg = (button: HTMLElement) => {
  const image = button.querySelector("img");
  if (!image) throw new Error("Golden egg image missing");
  return image;
};
