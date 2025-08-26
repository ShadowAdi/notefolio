import { db } from "@/db/db";
import { Discussion } from "@/schemas/Disscussions";
import { verifyUser } from "@/services/VerifyUser";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { description } = body;
    if (!description) {
      return new Response(JSON.stringify({ success: false }), {
        status: 400,
        statusText: `discussion is not provided`,
      });
    }

    const safeUser = await verifyUser(request);
    if (!safeUser.id) {
      return new Response(JSON.stringify({ success: false }), {
        status: 401,
        statusText: `User not authenticated`,
      });
    }
    const { id } = await context.params;
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: "Blog Id is needed." }),
        { status: 400 }
      );
    }

    const discussions = await db
      .select()
      .from(Discussion)
      .where(eq(Discussion.id, id));

    if (discussions.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `discussions does not Exist`,
        }),
        { status: 404 }
      );
    }

    if (discussions[0].userId !== safeUser.id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Can only be edited by who created it`,
        }),
        { status: 401 }
      );
    }

    const updatedDiscussionData: any = {};
    if (description) {
      updatedDiscussionData.description = description;
    }
    const updatedDiscussion = await db
      .update(Discussion)
      .set(updatedDiscussionData)
      .where(eq(Discussion.blogId, id))
      .returning();
    return new Response(
      JSON.stringify({
        success: true,
        message: `Discussion Updated Successfully`,
        updatedDiscussion,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(`Failed in updating the discussions `, error);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
    });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const safeUser = await verifyUser(request);
    if (!safeUser.id) {
      return new Response(JSON.stringify({ success: false }), {
        status: 401,
        statusText: `User not authenticated`,
      });
    }
    const { id } = await context.params;
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: "Blog Id is needed." }),
        { status: 400 }
      );
    }

    const discussions = await db
      .select()
      .from(Discussion)
      .where(eq(Discussion.id, id));

    if (discussions.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `discussions does not Exist`,
        }),
        { status: 404 }
      );
    }

    if (discussions[0].userId !== safeUser.id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Can only be deleted by who created it`,
        }),
        { status: 401 }
      );
    }

    await db.delete(Discussion).where(eq(Discussion.blogId, id));
    return new Response(
      JSON.stringify({
        success: true,
        message: `Discussion deleted Successfully`,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(`Failed in delete the discussions `, error);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
    });
  }
}
