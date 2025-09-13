import { db } from "@/db/db";
import { BlogSchema } from "@/schemas/Blog";
import { verifyUser } from "@/services/VerifyUser";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
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
    const blogId = uuidv4();
    const inserted = await db
      .insert(BlogSchema)
      .values({
        authorId: user.id,
        id: blogId,
        createdAt: new Date(),
        status: "draft",
        blogTitle: "",
        blogDescription: "",
        blogCover: "",
      })
      .returning({ id: BlogSchema.id });

    if (!inserted.length) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Draft could not be created",
        }),
        { status: 500 }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Draft created successfully",
        blogId: inserted[0].id,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error(`Error in createing a draft blog: ${error}`);
    return new Response(
      JSON.stringify({
        success: false,
        error,
      }),
      {
        status: 500,
      }
    );
  }
}


export async function GET(request: Request) {
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
    const blogs = await db
      .select()
      .from(BlogSchema)
      .where(eq(BlogSchema.authorId,user.id))

    return new Response(
      JSON.stringify({
        success: true,
        blogId: blogs,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error in getting draft blogs: ${error}`);
    return new Response(
      JSON.stringify({
        success: false,
        error,
      }),
      {
        status: 500,
      }
    );
  }
}

