import { z } from "zod";

export const sendPasscode = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .max(254, { message: "Email must be less than 255 characters" })
    .email({ message: "Invalid email address" }),
});

export const verifyPasscode = z.object({
  email: z.string().email({ message: "Valid email required" }),
  passcode: z
    .string()
    .trim()
    .length(6, { message: "Passcode must be 6 digits" })
    .regex(/^[0-9]{6}$/, { message: "Passcode must contain only numbers" }),
});

export const resetPassword = z
  .object({
    password: z
      .string()
      .trim()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(64, { message: "Password must be less than 65 characters" })
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

    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
