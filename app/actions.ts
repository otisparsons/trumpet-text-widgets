"use server";

import { store } from "@/lib/store";
import { Widget } from "@/lib/store/types";
import { widgetSchema } from "@/lib/validation";

export async function getWidgets(): Promise<Widget[]> {
  return store.getAll();
}

export async function addWidget(): Promise<Widget> {
  return store.create();
}

export async function saveWidget(
  id: string,
  text: string,
): Promise<Widget | null> {
  const result = widgetSchema.safeParse({ text });
  if (!result.success) return null;
  return store.update(id, text);
}

export async function deleteWidget(id: string): Promise<boolean> {
  return store.delete(id);
}
