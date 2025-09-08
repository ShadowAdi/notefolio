import { db } from "@/db/db";
import { BlogSchema } from "@/schemas/Blog";
import { tagTable } from "@/schemas/Tag";
import { verifyUser } from "@/services/VerifyUser";
import { eq } from "drizzle-orm";

export async function PATCH(
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

    const body = await request.json();
    const {
      blogTitle,
      blogDescription,
      blogCover,
      tags,
      status: statusBody,
    } = body;
    const { id } = await context.params;

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
          message: `Blog can only be edited by Author`,
        }),
        { status: 403 }
      );
    }

    const updatedBlog: any = {};
    if (blogTitle) updatedBlog.blogTitle = blogTitle;
    if (blogCover) updatedBlog.blogCover = blogCover;
    if (blogDescription) updatedBlog.blogDescription = blogDescription;
    if (statusBody) {
      updatedBlog.status = statusBody;
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
        message: `Blog Published Successfully`,
        blogId: id,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(`Failed to Published blog `, error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500 }
    );
  }
}
