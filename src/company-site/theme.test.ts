import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SITE_THEME, SITE_THEME_STORAGE_KEY, readSiteTheme, writeSiteTheme } from "./theme";

describe("company-site theme", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults invalid or absent preferences to blue", () => {
    expect(readSiteTheme()).toBe(DEFAULT_SITE_THEME);
    window.localStorage.setItem(SITE_THEME_STORAGE_KEY, "brown");
    expect(readSiteTheme()).toBe("blue");
  });

  it("persists white and blue without changing the art theme", () => {
    document.body.dataset.theme = "brown";
    writeSiteTheme("white");
    expect(readSiteTheme()).toBe("white");
    expect(document.body.dataset.theme).toBe("brown");
  });

  it("survives unavailable storage", () => {
    const getter = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });
    expect(readSiteTheme()).toBe("blue");
    getter.mockRestore();
  });
});

