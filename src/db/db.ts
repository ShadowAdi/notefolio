import { BlogSchema } from "@/schemas/Blog";
import { BlogDownvote } from "@/schemas/BlogDownvote";
import { BlogUpvote } from "@/schemas/BlogUpvote";
import { Discussion } from "@/schemas/Disscussions";
import { Followers } from "@/schemas/Followers";
import { SavedBlog } from "@/schemas/SavedBlog";
import { tagTable } from "@/schemas/Tag";
import { User } from "@/schemas/User";
import { Verification } from "@/schemas/Verification";
import { drizzle } from "drizzle-orm/neon-http";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error(`Failed to Connect Database`);
  throw new Error(`Database URL Is Not Provided`);
}

export const db = drizzle(DATABASE_URL, {
  schema: {
    User,
    BlogSchema,
    Discussion,
    BlogUpvote,
    BlogDownvote,
    tagTable,
    Followers,
    SavedBlog,
    Verification
  },
});
