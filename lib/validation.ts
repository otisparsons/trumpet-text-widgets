import { z } from "zod";

export const MAX_WIDGET_LENGTH = 1500;

export const widgetSchema = z.object({
  text: z.string().max(MAX_WIDGET_LENGTH, {
    message: `Text cannot exceed ${MAX_WIDGET_LENGTH} characters`,
  }),
});
