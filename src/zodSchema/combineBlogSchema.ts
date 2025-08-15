import z from "zod";

export const combineBlogSchema = z.object({
  blogCover: z.string(),
  tags: z.array(z.string()).max(10, "You can add up to 10 tags"),
  blogTitle: z.string(),
  blogDescription: z.string(),
});
