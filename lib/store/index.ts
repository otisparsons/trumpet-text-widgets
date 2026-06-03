import { MemoryWidgetStore } from "./memory-store";
import { WidgetStore } from "./types";

// Module level singleton, will persist across requests / page refresehes
// If peristence needed on server restart, swap for a durable store e.g Neon

export const store: WidgetStore = new MemoryWidgetStore();
