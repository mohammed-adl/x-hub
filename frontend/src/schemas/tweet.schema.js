import { z } from "zod";

export const tweetPostSchema = z
  .string()
  .trim()
  .min(1, { message: "Tweet cannot be empty" })
  .max(164, { message: "Tweet cannot be longer than 164 characters" });

export const tweetParamsSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, { message: "Tweet ID is required" })
    .max(60, { message: "Tweet ID must be less than 60 characters" }),
});
