"use client";

import { addWidget } from "@/app/actions";
import { Widget } from "@/lib/store/types";
import { useState } from "react";
import { TextWidget } from "./TextWidget";

interface WidgetBoardProps {
  initialWidgets: Widget[];
}

export function WidgetBoard({ initialWidgets }: WidgetBoardProps) {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);

  async function handleAdd() {
    const newWidget = await addWidget();
    setWidgets((current) => [...current, newWidget]);
  }

  function handleDelete(id: string) {
    setWidgets((current) => current.filter((widget) => widget.id !== id));
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Text Widgets</h1>
      <div className="mb-8">
        <button
          onClick={handleAdd}
          className="rounded-md bg-black px-5 py-2.5 font-semibold text-white"
        >
          Add widget
        </button>
      </div>

      {widgets.length === 0 ? (
        <p className="text-gray-500">
          No widgets yet. Click "Add widget" to create one.
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {widgets.map((widget) => (
            <TextWidget
              key={widget.id}
              widget={widget}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </main>
  );
}
