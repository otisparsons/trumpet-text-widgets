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
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Text Widgets</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <button
          onClick={handleAdd}
          style={{
            padding: "10px 20px",
            fontSize: 16,
            fontWeight: 600,
            color: "#fff",
            background: "#000",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Add widget
        </button>
      </div>

      {widgets.length === 0 ? (
        <p style={{ color: "#666", textAlign: "center" }}>
          No widgets yet. Click "Add widget" to create one.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
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
