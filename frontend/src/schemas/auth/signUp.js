import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Please type your email")
      .max(254, "Email is too long")
      .email("Invalid email address"),

    name: z
      .string()
      .trim()
      .min(1, "Name cannot be empty")
      .max(50, "Name is too long")
      .regex(/^[\p{L}\p{M}\s'-]+$/u, "Name contains invalid characters"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must be at most 64 characters")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
