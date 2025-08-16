import { db } from "@/db/db";
import { BlogSchema } from "@/schemas/Blog";
import { BlogDownvote } from "@/schemas/BlogDownvote";
import { BlogUpvote } from "@/schemas/BlogUpvote";
import { Discussion } from "@/schemas/Disscussions";
import { Followers } from "@/schemas/Followers";
import { tagTable } from "@/schemas/Tag";
import { User } from "@/schemas/User";
import { verifyUser } from "@/services/VerifyUser";
import { eq, sql } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const blogFound = await db
      .select({
        id: BlogSchema.id,
        blogTitle: BlogSchema.blogTitle,
        blogDescription: BlogSchema.blogDescription,
        blogCover: BlogSchema.blogCover,
        authorId: BlogSchema.authorId,
      })
      .from(BlogSchema)
      .where(eq(BlogSchema.id, id));
    if (!blogFound) {
      return new Response(
        JSON.stringify({ success: false, message: `Blog Do Not Exist` }),
        {
          status: 404,
        }
      );
    }

    const blogTagsFoundRaw = await db
      .select({
        tag: tagTable.tag,
      })
      .from(tagTable)
      .where(eq(tagTable.blogId, id));

    const blogTagsFound = blogTagsFoundRaw.map((tag) => tag.tag);

    const blogAuthor = await db
      .select({
        id: User.id,
        profileUrl: User.profileUrl,
        email: User.email,
        username: User.username,
      })
      .from(User)
      .where(eq(User.id, blogFound[0].authorId));

    if (!blogAuthor) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `INTERNAL SERVER ERROR: Author Id Not Found:${User.id}`,
        })
      );
    }

    const blogUpvotes = await db
      .select({ count: sql<number>`count(*)` })
      .from(BlogUpvote)
      .where(eq(BlogUpvote.blogId, id));

    const blogDownvotes = await db
      .select({ count: sql<number>`count(*)` })
      .from(BlogDownvote)
      .where(eq(BlogDownvote.blogId, id));

    const discussions = await db
      .select({
        description: Discussion.description,
        blogId: Discussion.blogId,
        id: Discussion.id,
        userId: Discussion.userId,
        createdAt: Discussion.createdAt,
      })
      .from(Discussion)
      .where(eq(Discussion.blogId, id));

    const followersRaw = await db
      .select({
        id: Followers.followerId,
      })
      .from(Followers)
      .where(eq(Followers.followingId, blogAuthor[0].id));
    const followers = followersRaw.map((follower) => follower.id);

    const user = {
      ...blogAuthor[0],
      followers,
    };

    return new Response(
      JSON.stringify({
        discussions,
        blogDownvotes,
        blogUpvotes,
        user,
        blogTagsFound,
        blogFound,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Failed to get single blog `, error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      console.error(`Authenticated User Not Found`);
      return new Response(
        JSON.stringify({
          success: false,
          message: `You are not Authorized`,
        })
      );
    }
    const id = params.id;
    const blogFound = await db
      .select({
        id: BlogSchema.id,
        authorId: BlogSchema.authorId,
      })
      .from(BlogSchema)
      .where(eq(BlogSchema.id, id));
    if (!blogFound) {
      return new Response(
        JSON.stringify({ success: false, message: `Blog Do Not Exist` }),
        {
          status: 404,
        }
      );
    }

    if (user.id !== blogFound[0].authorId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Blog can be only deleted by Author`,
        }),
        {
          status: 404,
        }
      );
    }

    await db.delete(BlogSchema).where(eq(BlogSchema.id, id));

    return new Response(
      JSON.stringify({
        success: true,
        message: `Blog Deleted Successfully`,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Failed to delete blog `, error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      console.error(`Authenticated User Not Found`);
      return new Response(
        JSON.stringify({
          success: false,
          message: `You are not Authorized`,
        })
      );
    }
    const body = await request.json();
    const { blogTitle, blogDescription, blogCover, tags } = body;

    const id = params.id;
    const blogFound = await db
      .select({
        id: BlogSchema.id,
        authorId: BlogSchema.authorId,
      })
      .from(BlogSchema)
      .where(eq(BlogSchema.id, id));

    if (blogFound.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: `Blog Does Not Exist` }),
        { status: 404 }
      );
    }

    if (user.id !== blogFound[0].authorId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Blog can be only deleted by Author`,
        }),
        {
          status: 404,
        }
      );
    }

    const updatedBlog: any = {};
    if (blogTitle) {
      updatedBlog[blogTitle] = blogTitle;
    }
    if (blogCover) {
      updatedBlog[blogCover] = blogCover;
    }
    if (blogDescription) {
      updatedBlog[blogDescription] = blogDescription;
    }

    await db.update(BlogSchema).set(updatedBlog).where(eq(BlogSchema.id, id));

    if (tags && Array.isArray(tags)) {
      await db.delete(tagTable).where(eq(tagTable.blogId, id));
      for (const tag of tags) {
        await db.insert(tagTable).values({ blogId: id, tag });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Blog Updated Successfully`,
        blodId: id,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Failed to update blog `, error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500 }
    );
  }
}
