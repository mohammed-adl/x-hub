import { z } from "zod";

export const userIdSchema = z.object({
  id: z.string().uuid({ message: "Invalid user ID format" }),
});

export const userNameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Username is required" })
    .max(30, { message: "Username must be less than 30 characters" }),
});

export const sessionSchema = z.object({
  id: z.string().uuid({ message: "Invalid session ID format" }),
});

export const editProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(30, { message: "Name must be less than 30 characters" }),
  bio: z
    .string()
    .trim()
    .max(50, { message: "Bio must be less than 50 characters" }),
});
