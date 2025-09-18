import { z } from "zod";

export const tweetPost = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Tweet cannot be empty" })
    .max(164, { message: "Tweet cannot exceed 164 characters" }),
});

export const tweetParams = z.object({
  id: z
    .string()
    .trim()
    .min(1, { message: "Tweet ID is required" })
    .max(60, { message: "Tweet ID cannot exceed 60 characters" }),
});
