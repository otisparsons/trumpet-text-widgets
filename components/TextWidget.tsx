"use client";

import { deleteWidget, saveWidget } from "@/app/actions";
import { useDebouncedSave } from "@/hooks/useDebouncedSave";
import { Widget } from "@/lib/store/types";

interface TextWidgetProps {
  widget: Widget;
  onDelete: (id: string) => void;
}

const STATUS_LABELS = {
  saving: "Saving...",
  saved: "Saved",
  idle: "",
} as const;

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
    <div className="rounded-md border border-gray-300 p-3">
      <textarea
        value={value}
        onChange={(e) => change(e.target.value)}
        rows={4}
        placeholder="Type your text..."
        className="w-full resize-y border-none p-2 text-base focus:outline-none"
        aria-label="Widget text"
      />
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span aria-live="polite">{STATUS_LABELS[status]}</span>
        <button onClick={handleDelete} aria-label="Delete widget">
          Delete
        </button>
      </div>
    </div>
  );
}
