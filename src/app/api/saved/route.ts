import { db } from "@/db/db";
import { BlogSchema } from "@/schemas/Blog";
import { SavedBlog } from "@/schemas/SavedBlog";
import { tagTable } from "@/schemas/Tag";
import { User } from "@/schemas/User";
import { verifyUser } from "@/services/VerifyUser";
import { eq, sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const safeUser = await verifyUser(request);
    if (!safeUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `You are not Authorized`,
        }),
        { status: 401 }
      );
    }

    const savedBlogs = await db
      .select({
        savedId: SavedBlog.id,
        savedAt: SavedBlog.savedAt,
        blogId: SavedBlog.blogId,
        userId: SavedBlog.userId,
        blogTitle: BlogSchema.blogTitle,
        blogDescription: BlogSchema.blogDescription,
        blogCover: BlogSchema.blogCover,
        authorId: BlogSchema.authorId,
        createdAt: BlogSchema.createdAt,
        updatedAt: BlogSchema.updatedAt,
        tags: sql<string[]>`array_agg(DISTINCT ${tagTable.tag})`,
        username: User.username,
        profileUrl: User.profileUrl,
      })
      .from(SavedBlog)
      .innerJoin(BlogSchema, eq(SavedBlog.blogId, BlogSchema.id))
      .leftJoin(tagTable, eq(tagTable.blogId, BlogSchema.id))
      .leftJoin(User, eq(BlogSchema.authorId, User.id))
      .where(eq(SavedBlog.userId, safeUser.id))
      .groupBy(SavedBlog.id, BlogSchema.id,User.id);

    return new Response(JSON.stringify({ success: true, savedBlogs }), {
      status: 200,
    });
  } catch (error) {
    console.log(`Failed to save blogs ${error}`);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500 }
    );
  }
}
