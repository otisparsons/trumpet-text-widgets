"use client";

import { deleteWidget, saveWidget } from "@/app/actions";
import { useDebouncedSave } from "@/hooks/useDebouncedSave";
import { Widget } from "@/lib/store/types";
import { MAX_WIDGET_LENGTH, widgetSchema } from "@/lib/validation";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

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
    onSave: (text) =>
      widgetSchema.safeParse({ text }).success
        ? saveWidget(widget.id, text).then(() => undefined)
        : Promise.resolve(),
  });

  const result = widgetSchema.safeParse({ text: value });
  const error = result.success ? null : result.error.issues[0]?.message;
  const overLimit = value.length > MAX_WIDGET_LENGTH;

  async function handleDelete() {
    cancelPending();
    await deleteWidget(widget.id);
    onDelete(widget.id);
  }

  return (
    <div className="flex flex-col rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md focus-within:border-primary focus-within:shadow-md">
      <Textarea
        value={value}
        onChange={(e) => change(e.target.value)}
        rows={6}
        placeholder="Type your text..."
        className="resize-y border-none bg-transparent p-0 text-[15px] leading-relaxed shadow-none focus-visible:ring-0"
        aria-label="Widget text"
        aria-invalid={!!error}
      />

      <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs">
        <span aria-live="polite" className="font-medium text-green-600">
          {status === "saving" ? (
            <span className="text-muted-foreground">
              {STATUS_LABELS.saving}
            </span>
          ) : (
            STATUS_LABELS[status]
          )}
        </span>

        <div className="flex items-center gap-3">
          <span
            className={overLimit ? "text-destructive" : "text-muted-foreground"}
          >
            {value.length}/{MAX_WIDGET_LENGTH}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            aria-label="Delete widget"
            className="h-auto px-2 py-1 text-muted-foreground hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
