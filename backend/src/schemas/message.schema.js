import { z } from "zod";

export const paramsSchema = z.object({
  id: z.string().uuid({ message: "Invalid receiver ID" }),
});

export const messageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Message content is required" })
    .max(280, { message: "Message content cannot exceed 280 characters" }),
});

export const chatSchema = z.object({
  limit: z
    .preprocess(
      (val) => Number(val),
      z.number().min(1, { message: "Limit must be greater than 0" })
    )
    .optional(),
  cursor: z.string().uuid({ message: "Invalid cursor" }).optional(),
});
