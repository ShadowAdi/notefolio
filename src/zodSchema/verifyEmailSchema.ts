import { z } from "zod";

export const verifyEmailFormSchema = z.object({
  otp: z.string(),
});
