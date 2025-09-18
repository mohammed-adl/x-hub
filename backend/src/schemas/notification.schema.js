import { z } from "zod";

export const notificationParams = z.object({
  id: z.string().uuid({ message: "Invalid notification ID" }),
});
