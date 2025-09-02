import { db } from "@/db/db";
import { BlogSchema } from "@/schemas/Blog";
import { SavedBlog } from "@/schemas/SavedBlog";
import { verifyUser } from "@/services/VerifyUser";
import { eq } from "drizzle-orm";

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
    await db
      .insert(SavedBlog)
      .values({ blogId: blogFound.id, userId: safeUser.id, savedAt: new Date() });
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