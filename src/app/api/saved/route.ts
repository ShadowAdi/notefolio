import { db } from "@/db/db";
import { SavedBlog } from "@/schemas/SavedBlog";
import { verifyUser } from "@/services/VerifyUser";
import { eq } from "drizzle-orm";


export async function GET(request: Request) {
  try {
    const safeUser = await verifyUser(request);
    if (safeUser instanceof Response) {
      return safeUser;
    }

    const savedBlogs = await db
      .select()
      .from(SavedBlog)
      .where(eq(SavedBlog.userId, safeUser.id));
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
