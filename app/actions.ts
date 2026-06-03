"use server";

import { store } from "@/lib/store";
import { Widget } from "@/lib/store/types";

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
  return store.update(id, text);
}

export async function deleteWidget(id: string): Promise<boolean> {
  return store.delete(id);
}
