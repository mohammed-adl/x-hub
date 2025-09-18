import { z } from "zod";

export const sendPasscodeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .max(254, { message: "Email must be less than 254 characters" })
    .email({ message: "Invalid email format" }),
});

export const verifyPasscodeSchema = z.object({
  passcode: z
    .string()
    .trim()
    .min(6, { message: "Passcode must be 6 digits" })
    .max(6, { message: "Passcode must be 6 digits" })
    .regex(/^[0-9]{6}$/, { message: "Passcode must contain only numbers" }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(64, { message: "Password must be less than 64 characters" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character",
      }),

    confirmPassword: z.string({
      required_error: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
