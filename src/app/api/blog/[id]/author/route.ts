import { db } from "@/db/db";
import { BlogSchema } from "@/schemas/Blog";
import { BlogDownvote } from "@/schemas/BlogDownvote";
import { BlogUpvote } from "@/schemas/BlogUpvote";
import { tagTable } from "@/schemas/Tag";
import { eq, sql } from "drizzle-orm";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: "Blog Id is needed." }),
        { status: 400 }
      );
    }
    const blogs = await db
      .select()
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

    const authorBlogs=await db
      .select({
        blogTitle: BlogSchema.blogTitle,
        blogCover: BlogSchema.blogCover,
        id: BlogSchema.id,
        upvotes: sql<number>`COUNT(DISTINCT ${BlogUpvote.blogId})`,
        downvotes: sql<number>`COUNT(DISTINCT ${BlogDownvote.blogId})`,
        authorId: BlogSchema.authorId,
      })
      .from(BlogSchema)
      .leftJoin(BlogUpvote, eq(BlogUpvote.blogId, id))
      .leftJoin(BlogDownvote, eq(BlogDownvote.blogId, id))
      .where(eq(BlogSchema.authorId, blogFound.authorId));
    return new Response(JSON.stringify({
      success:true,
      authorBlogs
    }),{
      status:200
    })
  } catch (error) {
    console.log(`Failed to get blogs for author ${error}`);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500 }
    );
  }
}
