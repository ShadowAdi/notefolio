import { db } from "@/db/db";
import { BlogSchema } from "@/schemas/Blog";
import { BlogUpvote } from "@/schemas/BlogUpvote";
import { verifyUser } from "@/services/VerifyUser";
import { and, eq } from "drizzle-orm";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `You are not Authorized`,
        }),
        { status: 401 }
      );
    }
    const { id } = await context.params;
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: "Blog Id is needed." }),
        { status: 400 }
      );
    }
    const blogs = await db
      .select({
        id: BlogSchema.id,
        blogTitle: BlogSchema.blogTitle,
        authorId: BlogSchema.authorId,
        createdAt: BlogSchema.createdAt,
        updatedAt: BlogSchema.updatedAt,
      })
      .from(BlogSchema)
      .where(eq(BlogSchema.id, id));
    if (blogs.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: `Blog Do Not Exist` }),
        {
          status: 404,
        }
      );
    }

    const blogFound = blogs[0];
    const upvotedBlogExists = await db
      .select()
      .from(BlogUpvote)
      .where(
        and(eq(BlogUpvote.blogId, blogFound.id), eq(BlogUpvote.userId, user.id))
      );
    if (upvotedBlogExists.length !== 0) {
      await db
        .delete(BlogUpvote)
        .where(
          and(
            eq(BlogUpvote.blogId, blogFound.id),
            eq(BlogUpvote.userId, user.id)
          )
        );
      return new Response(
        JSON.stringify({ success: true, message: "Upvote has been removed" }),
        {
          status: 200,
        }
      );
    } else {
      await db.insert(BlogUpvote).values({
        blogId: blogFound.id,
        userId: user.id,
      });
      return new Response(
        JSON.stringify({ success: true, message: "Blog has been upvoted" }),
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error(`Failed to upvote blog `, error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500 }
    );
  }
}
