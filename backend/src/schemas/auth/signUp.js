import { z } from "zod";

export const signUp = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .max(254, { message: "Email must be less than 255 characters" })
    .email({ message: "Invalid email address" }),

  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be less than 51 characters" })
    .regex(/^[\p{L}\p{M}\s'-]+$/u, {
      message: "Name contains invalid characters",
    }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password must be less than 65 characters" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),

  confirmPassword: z
    .string()
    .min(1, { message: "Confirm password is required" }),
});
