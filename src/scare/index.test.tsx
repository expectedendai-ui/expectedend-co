import { fireEvent, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useScareTriggers } from ".";

describe("useScareTriggers", () => {
  it("stays detached while disabled and cleans up after enabled use", () => {
    const trigger = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ enabled }) => useScareTriggers(trigger, enabled),
      { initialProps: { enabled: false } }
    );

    fireEvent.contextMenu(document);
    expect(trigger).not.toHaveBeenCalled();

    rerender({ enabled: true });
    fireEvent.contextMenu(document);
    expect(trigger).toHaveBeenCalledTimes(1);

    unmount();
    fireEvent.contextMenu(document);
    expect(trigger).toHaveBeenCalledTimes(1);
  });
});
