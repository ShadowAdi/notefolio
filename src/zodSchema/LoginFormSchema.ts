import { z } from "zod";

export const loginFomrSchema = z.object({
  email: z.string(),
  password: z.string(),
});