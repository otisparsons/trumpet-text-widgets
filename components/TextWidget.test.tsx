import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TextWidget } from "./TextWidget";
import type { Widget } from "@/lib/store/types";
import { MAX_WIDGET_LENGTH } from "@/lib/validation";

vi.mock("@/app/actions", () => ({
  saveWidget: vi.fn().mockResolvedValue(undefined),
  deleteWidget: vi.fn().mockResolvedValue(true),
}));

import { saveWidget, deleteWidget } from "@/app/actions";

const widget: Widget = { id: "widget-1", text: "initial text" };

describe("TextWidget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with the widget's initial text", () => {
    render(<TextWidget widget={widget} onDelete={vi.fn()} />);

    expect(screen.getByLabelText("Widget text")).toHaveValue("initial text");
  });

  it("shows the character count", () => {
    render(<TextWidget widget={widget} onDelete={vi.fn()} />);

    // "initial text" is 12 characters.
    expect(screen.getByText(`12/${MAX_WIDGET_LENGTH}`)).toBeInTheDocument();
  });

  it("updates the textarea and count as the user types", async () => {
    const user = userEvent.setup();
    render(<TextWidget widget={{ id: "w", text: "" }} onDelete={vi.fn()} />);

    const textarea = screen.getByLabelText("Widget text");
    await user.type(textarea, "hello");

    expect(textarea).toHaveValue("hello");
    expect(screen.getByText(`5/${MAX_WIDGET_LENGTH}`)).toBeInTheDocument();
  });

  it("saves valid text after the debounce delay", async () => {
    const user = userEvent.setup();
    render(<TextWidget widget={{ id: "w", text: "" }} onDelete={vi.fn()} />);

    await user.type(screen.getByLabelText("Widget text"), "hello");

    await vi.waitFor(() => {
      expect(saveWidget).toHaveBeenCalledWith("w", "hello");
    });
  });

  it("shows an error and does not save when text exceeds the max length", async () => {
    const user = userEvent.setup();
    render(<TextWidget widget={{ id: "w", text: "" }} onDelete={vi.fn()} />);

    const overLimit = "a".repeat(MAX_WIDGET_LENGTH + 1);
    const textarea = screen.getByLabelText("Widget text");

    await user.click(textarea);
    await user.paste(overLimit);

    // The error message is shown.
    expect(screen.getByRole("alert")).toHaveTextContent(/exceed/i);

    // And the over-limit value is never saved.
    // Wait past the debounce window to be sure no save fires.
    await new Promise((r) => setTimeout(r, 700));
    expect(saveWidget).not.toHaveBeenCalled();
  });

  it("calls deleteWidget and onDelete when delete is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<TextWidget widget={widget} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: "Delete widget" }));

    expect(deleteWidget).toHaveBeenCalledWith("widget-1");
    expect(onDelete).toHaveBeenCalledWith("widget-1");
  });

  it("handles a large (1000-character) string", async () => {
    const user = userEvent.setup();
    render(<TextWidget widget={{ id: "w", text: "" }} onDelete={vi.fn()} />);

    const maxText = "a".repeat(MAX_WIDGET_LENGTH);
    const textarea = screen.getByLabelText("Widget text");

    await user.click(textarea);
    await user.paste(maxText);

    expect(textarea).toHaveValue(maxText);
    await vi.waitFor(() => {
      expect(saveWidget).toHaveBeenCalledWith("w", maxText);
    });
  });
});
