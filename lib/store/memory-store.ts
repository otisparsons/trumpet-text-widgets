import { randomUUID } from "crypto";
import type { Widget, WidgetStore } from "./types";

class MemoryWidgetStore implements WidgetStore {
  private widgets = new Map<string, Widget>();

  async getAll(): Promise<Widget[]> {
    return Array.from(this.widgets.values());
  }

  async create(): Promise<Widget> {
    const widget: Widget = { id: randomUUID(), text: "" };
    this.widgets.set(widget.id, widget);
    return widget;
  }

  async update(id: string, text: string): Promise<Widget | null> {
    const existingWidget = this.widgets.get(id);
    if (!existingWidget) return null;
    const updated: Widget = { ...existingWidget, text };
    this.widgets.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.widgets.delete(id);
  }
}

export { MemoryWidgetStore };
