import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from ".";

const { useScareTriggersMock } = vi.hoisted(() => ({ useScareTriggersMock: vi.fn() }));

vi.mock("~/src/company-site", () => ({
  CompanySite: ({ onOpenArtWorld }: { onOpenArtWorld: () => void }) => (
    <button type="button" onClick={onOpenArtWorld}>Open art world</button>
  ),
}));
vi.mock("~/src/frame", () => ({ Frame: () => <div data-testid="frame" /> }));
vi.mock("~/src/infinite-canvas", () => ({ InfiniteCanvas: () => <div data-testid="infinite-canvas" /> }));
vi.mock("~/src/loader", () => ({
  MatrixLoader: ({ onDone }: { onDone: () => void }) => <button type="button" onClick={onDone}>Finish loader</button>,
}));
vi.mock("~/src/song-dashboard", () => ({
  TRACKS: [{ name: "Test", artist: "Expected End", src: "/test.mp4", noBass: true }],
  SongGate: ({ onPick }: { onPick: (index: number) => void }) => <button type="button" onClick={() => onPick(0)}>Pick song</button>,
  SongSwitcher: () => <div data-testid="song-switcher" />,
}));
vi.mock("~/src/color-switcher", () => ({
  THEMES: [{ key: "black", label: "Black", swatch: "#000", fog: "#000" }],
  ColorSwitcher: () => <div data-testid="color-switcher" />,
}));
vi.mock("~/src/scare", () => ({
  useScareTriggers: useScareTriggersMock,
  ScareModal: () => <div data-testid="scare-modal" />,
  AiNotice: () => <div data-testid="ai-notice" />,
}));

describe("public-to-art lifecycle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useScareTriggersMock.mockClear();
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.removeAttribute("data-theme");
  });

  it("keeps art-only features asleep until the egg handoff", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: "Open art world" })).toBeInTheDocument();
    expect(screen.queryByTestId("frame")).not.toBeInTheDocument();
    expect(screen.queryByTestId("infinite-canvas")).not.toBeInTheDocument();
    expect(screen.queryByTestId("ai-notice")).not.toBeInTheDocument();
    expect(useScareTriggersMock).toHaveBeenLastCalledWith(expect.any(Function), false);

    fireEvent.click(screen.getByRole("button", { name: "Open art world" }));
    expect(screen.getByTestId("frame")).toBeInTheDocument();
    expect(screen.getByTestId("infinite-canvas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Finish loader" })).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(400));
    expect(screen.queryByRole("button", { name: "Open art world" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pick song" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Finish loader" }));
    fireEvent.click(screen.getByRole("button", { name: "Pick song" }));
    expect(screen.getByTestId("ai-notice")).toBeInTheDocument();
    expect(screen.getByTestId("scare-modal")).toBeInTheDocument();
    expect(screen.getByTestId("song-switcher")).toBeInTheDocument();
    expect(screen.getByTestId("color-switcher")).toBeInTheDocument();
    expect(useScareTriggersMock).toHaveBeenLastCalledWith(expect.any(Function), true);
  });
});
