import { db } from "@/db/db";
import { BlogSchema } from "@/schemas/Blog";
import { BlogDownvote } from "@/schemas/BlogDownvote";
import { BlogUpvote } from "@/schemas/BlogUpvote";
import { Discussion } from "@/schemas/Disscussions";
import { Followers } from "@/schemas/Followers";
import { SavedBlog } from "@/schemas/SavedBlog";
import { tagTable } from "@/schemas/Tag";
import { User } from "@/schemas/User";
import { Verification } from "@/schemas/Verification";
import { verifyUser } from "@/services/VerifyUser";
import { eq, inArray } from "drizzle-orm";

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
    return new Response(JSON.stringify({ success: true, user: safeUser }), {
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, message: err }), {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const safeUser = await verifyUser(request);
    if (!safeUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You are not Authorized",
        }),
        { status: 401 }
      );
    }

    const userBlogs = await db
      .select()
      .from(User)
      .where(eq(User.id, safeUser.id));
    const blogIds = userBlogs.map((userBlog) => userBlog.id);

    if (blogIds.length > 0) {
      await db
        .delete(BlogDownvote)
        .where(inArray(BlogDownvote.blogId, blogIds));
      await db.delete(BlogUpvote).where(inArray(BlogUpvote.blogId, blogIds));
      await db.delete(SavedBlog).where(inArray(SavedBlog.blogId, blogIds));
      await db.delete(tagTable).where(inArray(tagTable.blogId, blogIds));
      await db.delete(Discussion).where(inArray(Discussion.blogId, blogIds));

      await db.delete(BlogSchema).where(inArray(BlogSchema.id, blogIds));
    }

    await db.delete(Verification).where(eq(Verification.userId, safeUser.id));
    await db.delete(Followers).where(eq(Followers.followerId, safeUser.id));
    await db.delete(Followers).where(eq(Followers.followingId, safeUser.id));

    await db.delete(User).where(eq(User.id, safeUser.id));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: unknown) {
    console.error("Failed to delete user:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
}
