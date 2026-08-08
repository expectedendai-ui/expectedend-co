import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WaterCheckPage } from "./water-check-page";

const storageSnapshot = (storage: Storage) =>
  Array.from({ length: storage.length }, (_, index) => storage.key(index))
    .filter((key): key is string => key !== null)
    .sort()
    .map((key) => [key, storage.getItem(key)]);

const publicAssetDigest = (filename: string) =>
  createHash("sha256").update(readFileSync(resolve("public", filename))).digest("hex");

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

  it("keeps the supplied store artwork byte-for-byte", () => {
    expect(publicAssetDigest("appstore-coming-soon.png")).toBe(
      "2c521c2da2979da1c27af8b3192b1e1d603d3c7ff60c775a250e2e538fc286ab"
    );
    expect(publicAssetDigest("playstore-soon.webp")).toBe(
      "98edce161205c38bb73898be3c009a67ff98ac5306bac7d4f79cf43270e48cb5"
    );
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

    const suppliedBadges = [
      { alt: "App Store", src: "/appstore-coming-soon.png", width: "900", height: "275" },
      { alt: "Google Play", src: "/playstore-soon.webp", width: "536", height: "180" },
    ];

    for (const expected of suppliedBadges) {
      const badges = screen.getAllByAltText(expected.alt);
      expect(badges).toHaveLength(2);
      for (const badge of badges) {
        expect(badge).toHaveAttribute("src", expected.src);
        expect(badge).toHaveAttribute("width", expected.width);
        expect(badge).toHaveAttribute("height", expected.height);
      }
    }

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

    const instagramLinks = screen.getAllByRole("link", {
      name: "Join our community to help you stay hydrated!",
    });
    expect(instagramLinks).toHaveLength(2);
    for (const instagram of instagramLinks) {
      expect(instagram).toHaveAttribute("href", "https://www.instagram.com/thewatercheck/");
      expect(instagram).toHaveAttribute("target", "_blank");
      expect(instagram).toHaveAttribute("rel", expect.stringMatching(/noopener/));
      expect(instagram).toHaveAttribute("rel", expect.stringMatching(/noreferrer/));
      expect(within(instagram).getByRole("img", { name: "Instagram" })).toHaveAttribute(
        "src",
        "/instagram-logo.webp"
      );
    }
  });

  it("places Denzel's governed founder story before the product walkthrough", () => {
    const { container } = render(<WaterCheckPage onNavigate={vi.fn()} />);
    const founderStory = screen.getByRole("region", { name: "What we’re building, and why" });
    const walkthroughKicker = screen.getByText("One drink. One check-in. More context.");
    const founderText = founderStory.textContent ?? "";

    expect(within(founderStory).getByText("Aug 2026")).toBeInTheDocument();
    expect(within(founderStory).getByText("Denzel Rigaud, Founder of Expected End")).toBeInTheDocument();
    expect(within(founderStory).getByText(/household with 4 women.+my mom, her wife, and my 2 sisters/i)).toBeInTheDocument();
    expect(within(founderStory).getByText(/carried The Water Check with me for 6 years/i)).toBeInTheDocument();
    expect(within(founderStory).getByText(/hydration needs vary with the person/i)).toBeInTheDocument();
    expect(within(founderStory).getByText(/will not diagnose a condition or prove that one drink caused a symptom/i)).toBeInTheDocument();
    const linkedIn = within(founderStory).getByRole("link", { name: "Denzel Rigaud on LinkedIn" });
    const instagram = within(founderStory).getByRole("link", { name: "Denzel Rigaud on Instagram" });
    expect(linkedIn).toHaveAttribute("href", "https://www.linkedin.com/in/denzel-rigaud-2b0200210/");
    expect(instagram).toHaveAttribute("href", "https://www.instagram.com/smiledenzel/");
    expect(linkedIn.querySelector("img")).toHaveAttribute("src", "/linkedin-icon.webp");
    expect(instagram.querySelector("img")).toHaveAttribute("src", "/instagram-logo.webp");
    for (const social of [linkedIn, instagram]) {
      expect(social).toHaveAttribute("target", "_blank");
      expect(social).toHaveAttribute("rel", expect.stringMatching(/noopener/));
      expect(social).toHaveAttribute("rel", expect.stringMatching(/noreferrer/));
    }
    expect(founderStory.compareDocumentPosition(walkthroughKicker)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(founderStory.querySelector("time")).toHaveAttribute("datetime", "2026-08");
    expect(founderText).not.toMatch(/water (?:flushes|flushed).*vitamin/i);
    expect(founderText).not.toMatch(/everyone (?:needs|should drink) (?:a )?gallon/i);
    expect(container.querySelector("form, input, select, textarea")).not.toBeInTheDocument();
  });

  it.each([
    ["pointer", "App Store — Coming Soon"],
    ["keyboard", "Google Play — Coming Soon"],
  ])("opens a dismissible Coming Soon popup for %s store activation without side effects", async (method, accessibleName) => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const request = vi.fn();
    vi.stubGlobal("fetch", request);
    const xhrOpen = vi.spyOn(XMLHttpRequest.prototype, "open");
    const locationBefore = window.location.href;
    const localStorageBefore = storageSnapshot(window.localStorage);
    const sessionStorageBefore = storageSnapshot(window.sessionStorage);

    render(<WaterCheckPage onNavigate={vi.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    const control = screen.getAllByRole("button", { name: accessibleName })[0];
    control.focus();
    const activate = () => (method === "pointer" ? user.click(control) : user.keyboard("{Enter}"));

    await activate();

    const dialog = screen.getByRole("dialog", { name: "Coming Soon" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(within(dialog).getByText(accessibleName.replace(" — Coming Soon", ""))).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Close Coming Soon popup" })).toHaveFocus();

    fireEvent(dialog, new Event("cancel", { bubbles: false, cancelable: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(control).toHaveFocus();

    await activate();
    await user.click(screen.getByRole("button", { name: "Close Coming Soon popup" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(control).toHaveFocus();

    expect(window.location.href).toBe(locationBefore);
    expect(open).not.toHaveBeenCalled();
    expect(request).not.toHaveBeenCalled();
    expect(xhrOpen).not.toHaveBeenCalled();
    expect(storageSnapshot(window.localStorage)).toEqual(localStorageBefore);
    expect(storageSnapshot(window.sessionStorage)).toEqual(sessionStorageBefore);
  });
});
