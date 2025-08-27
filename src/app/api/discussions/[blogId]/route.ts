import { db } from "@/db/db";
import { BlogSchema } from "@/schemas/Blog";
import { Discussion } from "@/schemas/Disscussions";
import { User } from "@/schemas/User";
import { verifyUser } from "@/services/VerifyUser";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(
  request: Request,
  context: { params: Promise<{ blogId: string }> }
) {
  try {
    const { blogId } = await context.params;
    if (!blogId) {
      return new Response(
        JSON.stringify({ success: false, message: "Blog Id is needed." }),
        { status: 400 }
      );
    }

    const discussions = await db
      .select({
        description: Discussion.description,
        id: Discussion.id,
        blogId: Discussion.blogId,
        userId: Discussion.userId,
        createdAt: Discussion.createdAt,
        username: User.username,
        profileUrl: User.profileUrl,
      })
      .from(Discussion)
      .leftJoin(User, eq(Discussion.userId, User.id))
      .where(eq(Discussion.blogId, blogId));

    return new Response(
      JSON.stringify({
        success: true,
        discussions,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Failed in getting the discussions `, error);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
    });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ blogId: string }> }
) {
  try {
    const safeUser = await verifyUser(request);
    if (!safeUser.id) {
      return new Response(JSON.stringify({ success: false }), {
        status: 401,
        statusText: `User not authenticated`,
      });
    }

    const { blogId } = await context.params;
    if (!blogId) {
      return new Response(
        JSON.stringify({ success: false, message: "Blog Id is needed." }),
        { status: 400 }
      );
    }

    const blogFound = await db
      .select({
        id: BlogSchema.id,
        authorId: BlogSchema.authorId,
      })
      .from(BlogSchema)
      .where(eq(BlogSchema.id, blogId));

    if (blogFound.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: `Blog Does Not Exist` }),
        { status: 404 }
      );
    }
    const body = await request.json();
    const { description } = body;
    if (!description) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "discussion is not provided",
        }),
        {
          status: 400,
        }
      );
    }

    const discussionId = uuidv4();
    const createdDiscussion = await db
      .insert(Discussion)
      .values({
        blogId: blogFound[0].id,
        userId: safeUser.id,
        description,
        id: discussionId,
        createdAt: new Date(),
      })
      .returning();
    return NextResponse.json(
      {
        message: "Discussion created successfully",
        discussion: createdDiscussion,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(`Failed to create discussion`, error);
    return new Response(
      JSON.stringify({
        success: false,
        error,
        message: `Failed to create discussion. INTERNAL SERVER ERROR`,
      }),
      { status: 500 }
    );
  }
}
