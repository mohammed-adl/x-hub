import { z } from "zod";

export const logInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please type your email" })
    .email({ message: "Please type valid email" })
    .max(64, { message: "Please type valid email" })
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(1, { message: "Please type your password" })
    .max(64, { message: "Please type valid password" }),
});
