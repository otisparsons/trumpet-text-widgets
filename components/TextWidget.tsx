"use client";

import { deleteWidget, saveWidget } from "@/app/actions";
import { useDebouncedSave } from "@/hooks/useDebouncedSave";
import { Widget } from "@/lib/store/types";

interface TextWidgetProps {
  widget: Widget;
  onDelete: (id: string) => void;
}

export function TextWidget({ widget, onDelete }: TextWidgetProps) {
  const { value, status, change, cancelPending } = useDebouncedSave({
    initialValue: widget.text,
    onSave: (text) => saveWidget(widget.id, text).then(() => undefined),
  });

  async function handleDelete() {
    cancelPending();
    await deleteWidget(widget.id);
    onDelete(widget.id);
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 6,
        padding: 12,
        marginBottom: 12,
      }}
    >
      <textarea
        value={value}
        onChange={(e) => change(e.target.value)}
        rows={4}
        placeholder="Type your text..."
        style={{ width: "100%", resize: "vertical", boxSizing: "border-box" }}
        aria-label="Widget text"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 8,
          fontSize: 12,
          color: "666",
        }}
      >
        <span aria-live="polite">
          {status === "saving"
            ? "Saving..."
            : status === "saved"
              ? "Saved"
              : ""}
        </span>
        <button onClick={handleDelete} aria-label="Delete Widget">
          Delete
        </button>
      </div>
    </div>
  );
}
