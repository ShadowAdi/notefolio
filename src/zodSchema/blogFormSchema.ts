import { z } from "zod";

export const blogFormSchema = z.object({
  blogTitle: z.string(),
  blogDescription: z.string(),
  blogCover:z.string()
});