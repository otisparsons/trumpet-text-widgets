"use client";

import { addWidget } from "@/app/actions";
import { Widget } from "@/lib/store/types";
import { useState } from "react";
import { TextWidget } from "./TextWidget";
import { Button } from "./ui/button";

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
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Text Widgets</h1>
        <p className="mt-2 text-muted-foreground">
          Add a widget, start typing, and your text saves automatically.
        </p>
      </header>
      <div className="mb-8">
        <Button onClick={handleAdd} className="gap-2">
          <span className="text-lg leading-none">+</span>
          Add Widget
        </Button>
      </div>

      {widgets.length === 0 ? (
        <div className="rounded-xl border border-dashed px-6 py-16 text-center text-muted-foreground">
          No widgets yet — click{" "}
          <span className="font-medium text-foreground">Add widget</span> to
          create your first one.
        </div>
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
