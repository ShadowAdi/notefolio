import { db } from "@/db/db";
import { BlogSchema } from "@/schemas/Blog";
import { SavedBlog } from "@/schemas/SavedBlog";
import { eq } from "drizzle-orm";

export async function DELETE(
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
    const isSavedBlog = await db
      .select()
      .from(SavedBlog)
      .where(eq(SavedBlog.id, id));
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
    await db.delete(SavedBlog).where(eq(SavedBlog.id,id))
    return new Response(JSON.stringify({success:true,message:`Saved Item has been removed`}),{
        status:200
    })
  } catch (error) {
    console.log(`Failed to remove save item ${error}`);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500 }
    );
  }
}
