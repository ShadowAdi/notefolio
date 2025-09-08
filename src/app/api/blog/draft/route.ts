import { db } from "@/db/db";
import { BlogSchema } from "@/schemas/Blog";
import { verifyUser } from "@/services/VerifyUser";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `User Not Found. First Login  your account`,
        }),
        {
          status: 401,
        }
      );
    }
    const body = await request.json();
    const { blogTitle, blogDescription } = body;
    if (!blogTitle && !blogDescription) {
      return NextResponse.json(
        { success: false, error: "No content" },
        { status: 400 }
      );
    }
    const blogId = uuidv4();
     await db.insert(BlogSchema).values({
      id: blogId,
      blogTitle: blogTitle || "",
      blogDescription: blogDescription || "",
      authorId: user.id,
      status: "draft",
      blogCover: "",
      createdAt: new Date(),
    });
    return NextResponse.json({ success: true, blogId }, { status: 201 });
  } catch (error) {
    console.error(`Failed to create draft blog: ${error}`);
    return NextResponse.json(
      {
        success: false,
        error: error,
      },
      {
        status: 500,
      }
    );
  }
}
