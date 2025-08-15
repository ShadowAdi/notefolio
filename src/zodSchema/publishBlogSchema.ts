import z from "zod";

export const publishBlogSchema = z.object({
  blogCover: z.string(),
  tags: z.string().array(),
});
