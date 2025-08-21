import { db } from "@/db/db";
import { TokenExtract } from "@/lib/TokenExtract";
import { BlogSchema } from "@/schemas/Blog";
import { BlogDownvote } from "@/schemas/BlogDownvote";
import { BlogUpvote } from "@/schemas/BlogUpvote";
import { Followers } from "@/schemas/Followers";
import { tagTable } from "@/schemas/Tag";
import { User } from "@/schemas/User";
import { desc, eq, sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isBlogs = searchParams.get("isBlogs")?.trim() || "true";
    const sortBy = searchParams.get("sortBy")?.trim() || "createdAt";
    const decoded: any = await TokenExtract(request);
    if (!decoded.success) {
      return new Response(
        JSON.stringify({ success: false, error: decoded.error })
      );
    }

    const users = await db
      .select()
      .from(User)
      .where(eq(User.email, decoded.decoded.email));
    const user = users[0];
    if (!user) throw new Error("User not found");

    const followers = await db
      .select({
        id: User.id,
        username: User.username,
        profileUrl: User.profileUrl,
      })
      .from(Followers)
      .innerJoin(User, eq(Followers.followerId, User.id))
      .where(eq(Followers.followingId, user.id));

    const followings = await db
      .select({
        id: User.id,
        username: User.username,
        profileUrl: User.profileUrl,
      })
      .from(Followers)
      .innerJoin(User, eq(Followers.followingId, User.id))
      .where(eq(Followers.followerId, User.id));

    const followersCount = followers.length;
    const followingsCount = followings.length;

    if (isBlogs === "false") {
      const { password, ...safeUser } = user;
      return new Response(JSON.stringify({ success: true, user: safeUser }), {
        status: 200,
      });
    }

    const sortMap: Record<string, any> = {
      createdAt: BlogSchema.createdAt,
      updatedAt: BlogSchema.updatedAt,
      upvotes: sql`COUNT(DISTINCT ${BlogUpvote.blogId})`,
      downvotes: sql`COUNT(DISTINCT ${BlogDownvote.blogId})`,
    };

    const userBlogs = await db
      .select({
        id: BlogSchema.id,
        title: BlogSchema.blogTitle,
        description: BlogSchema.blogDescription,
        cover: BlogSchema.blogCover,
        createdAt: BlogSchema.createdAt,
        updatedAt: BlogSchema.updatedAt,
        upvotes: sql<number>`COUNT(DISTINCT ${BlogUpvote.blogId})`,
        downvotes: sql<number>`COUNT(DISTINCT ${BlogDownvote.blogId})`,
        tags: sql<string[]>`array_agg(DISTINCT ${tagTable.tag})`,
        authorId: BlogSchema.authorId,
      })
      .from(BlogSchema)
      .where(eq(BlogSchema.authorId, user.id))
      .leftJoin(tagTable, eq(BlogSchema.id, tagTable.blogId))
      .leftJoin(BlogUpvote, eq(BlogUpvote.blogId, BlogSchema.id))
      .leftJoin(BlogDownvote, eq(BlogDownvote.blogId, BlogSchema.id))
      .groupBy(BlogSchema.id)
      .orderBy(desc(sortMap[sortBy] || BlogSchema.createdAt));
    const { password, ...safeUser } = user;
    return new Response(
      JSON.stringify({
        success: true,
        blogs: userBlogs,
        user: safeUser,
        followers,
        followersCount,
        followings,
        followingsCount,
      })
    );
  } catch (error) {
    console.error(`Failed in getting the data `, error);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 401,
    });
  }
}
