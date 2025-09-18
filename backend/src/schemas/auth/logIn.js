import { z } from "zod";

export const logIn = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .max(254, { message: "Email must be less than 255 characters" })
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(64, { message: "Password must be less than 65 characters" }),
});
