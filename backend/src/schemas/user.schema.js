import { z } from "zod";

export const userId = z.object({
  id: z.string().uuid({ message: "Invalid user ID" }),
});

export const username = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Username is required" })
    .max(30, { message: "Username cannot exceed 30 characters" }),
});

export const session = z.object({
  id: z.string().uuid({ message: "Invalid session ID" }),
});

export const editProfile = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(30, { message: "Name cannot exceed 30 characters" }),
  bio: z
    .string()
    .trim()
    .max(50, { message: "Bio cannot exceed 50 characters" }),
});
