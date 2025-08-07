import { z } from "zod";

export const registerFormSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string(),
  password: z.string(),
  profileUrl: z.string().optional(),
  bio: z.string(),
});