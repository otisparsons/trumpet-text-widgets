import { deleteWidget, saveWidget } from "@/app/actions";
import { Widget } from "@/lib/store/types";
import { vi } from "vitest";
import { TextWidget } from "./TextWidget";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/app/actions", () => ({
  saveWidget: vi.fn().mockResolvedValue(undefined),
  deleteWidget: vi.fn().mockResolvedValue(true),
}));

const widget: Widget = { id: "widget-1", text: "initial text" };

describe("TextWidget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with the widget's initial text", () => {
    render(<TextWidget widget={widget} onDelete={vi.fn()} />);

    expect(screen.getByLabelText("Widget text")).toHaveValue("initial text");
  });

  it("updates the textarea as the user types", async () => {
    const user = userEvent.setup();
    render(<TextWidget widget={{ id: "w", text: "" }} onDelete={vi.fn()} />);

    const textarea = screen.getByLabelText("Widget text");
    await user.type(textarea, "hello");

    expect(textarea).toHaveValue("hello");
  });

  it("saves the typed text after the debounce delay", async () => {
    const user = userEvent.setup();
    render(<TextWidget widget={{ id: "w", text: "" }} onDelete={vi.fn()} />);

    await user.type(screen.getByLabelText("Widget text"), "hello");

    // wait fof the debounced save to fire
    await vi.waitFor(() => {
      expect(saveWidget).toHaveBeenCalledWith("w", "hello");
    });
  });

  it("calls deleteWidget and onDelete when the delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<TextWidget widget={widget} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: "Delete widget" }));

    expect(deleteWidget).toHaveBeenCalledWith("widget-1");
    expect(onDelete).toHaveBeenCalledWith("widget-1");
  });

  it("handles a large string of text (1000+ characters)", async () => {
    const user = userEvent.setup();
    render(<TextWidget widget={{ id: "w", text: "" }} onDelete={vi.fn()} />);

    const longText = "a".repeat(1000);
    const textarea = screen.getByLabelText("Widget text");

    await user.clear(textarea);
    await user.click(textarea);
    await user.paste(longText);

    expect(textarea).toHaveValue(longText);
    await vi.waitFor(() => {
      expect(saveWidget).toHaveBeenCalledWith("w", longText);
    });
  });
});
