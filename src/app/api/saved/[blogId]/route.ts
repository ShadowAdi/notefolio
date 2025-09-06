import { db } from "@/db/db";
import { BlogSchema } from "@/schemas/Blog";
import { SavedBlog } from "@/schemas/SavedBlog";
import { verifyUser } from "@/services/VerifyUser";
import { and, eq } from "drizzle-orm";

export async function POST(
  request: Request,
  context: { params: Promise<{ blogId: string }> }
) {
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
    const { blogId } = await context.params;
    if (!blogId) {
      return new Response(
        JSON.stringify({ success: false, message: "Blog Id is needed." }),
        { status: 400 }
      );
    }

    const blogs = await db
      .select()
      .from(BlogSchema)
      .where(eq(BlogSchema.id, blogId));
    if (blogs.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: `Blog Do Not Exist` }),
        {
          status: 404,
        }
      );
    }
    const blogFound = blogs[0];
    const isSavedBlog = await db
      .select()
      .from(SavedBlog)
      .where(
        and(
          eq(SavedBlog.blogId, blogFound.id),
          eq(SavedBlog.userId, safeUser.id)
        )
      );
    if (isSavedBlog.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Item Already Found`,
        }),
        { status: 409 } // conflict makes more sense than 401
      );
    }
    await db.insert(SavedBlog).values({
      blogId: blogFound.id,
      userId: safeUser.id,
      savedAt: new Date(),
    });
    return new Response(
      JSON.stringify({ success: true, message: `Blog has been saved` }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(`Failed to save blogs ${error}`);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ blogId: string }> }
) {
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
    const { blogId: id } = await context.params;
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
    const isSavedBlog = await db
      .select()
      .from(SavedBlog)
      .where(and(eq(SavedBlog.blogId, id), eq(SavedBlog.userId, safeUser.id)));
    if (isSavedBlog.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Saved Item Not Found`,
        }),
        {
          status: 401,
        }
      );
    }
    await db
      .delete(SavedBlog)
      .where(and(eq(SavedBlog.blogId, id), eq(SavedBlog.userId, safeUser.id)));
    return new Response(
      JSON.stringify({ success: true, message: `Saved Item has been removed` }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(`Failed to remove save item ${error}`);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500 }
    );
  }
}
