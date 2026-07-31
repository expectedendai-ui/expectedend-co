import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "./contact-form";

describe("Expected End contact composer", () => {
  afterEach(() => vi.restoreAllMocks());

  it("requires structured context and prepares an email without displaying the private inbox", async () => {
    const user = userEvent.setup();
    let preparedHref = "";
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function capturePreparedEmail(this: HTMLAnchorElement) {
      preparedHref = this.href;
    });
    window.history.replaceState({}, "", "/about?utm_source=instagram#contact");

    render(<ContactForm />);

    expect(screen.queryByText("expectedendai@gmail.com")).not.toBeInTheDocument();
    await user.type(screen.getByLabelText("Your name"), "A Visitor");
    await user.type(screen.getByLabelText("Your email"), "visitor@example.com");
    await user.selectOptions(screen.getByLabelText("What is this about?"), "Building an app or software idea");
    await user.selectOptions(screen.getByLabelText("Which project?"), "Expected End");
    await user.selectOptions(screen.getByLabelText("Ideal timeline"), "Within three months");
    await user.selectOptions(screen.getByLabelText("How did you find us?"), "Instagram");
    await user.click(screen.getByRole("button", { name: /Prepare email/ }));

    const preparedEmail = decodeURIComponent(preparedHref);
    expect(preparedEmail).toContain("mailto:info@expectedend.co");
    expect(preparedEmail).toContain("Expected End inquiry — Building an app or software idea");
    expect(preparedEmail).toContain("Reply email: visitor@example.com");
    expect(preparedEmail).toContain("Found Expected End through: Instagram");
    expect(preparedEmail).toContain("utm_source=instagram");
  });
});
