import { db } from "@/db/db";
import { Followers } from "@/schemas/Followers";
import { User } from "@/schemas/User";
import { verifyUser } from "@/services/VerifyUser";
import { and, eq } from "drizzle-orm";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const safeUser = await verifyUser(request);
    if (!safeUser.id) {
      return new Response(JSON.stringify({ success: false }), {
        status: 401,
        statusText: `User not authenticated`,
      });
    }
    const id = params.id;
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: `User Id is needed.` }),
        {
          status: 400,
        }
      );
    }
    if (id === safeUser.id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You cannot unfollow yourself.",
        }),
        { status: 400 }
      );
    }
    const isUserExist = await db.select().from(User).where(eq(User.id, id));
    if (!isUserExist || isUserExist.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `User Not Found with the given id.`,
        }),
        {
          status: 404,
        }
      );
    }

    await db
      .delete(Followers)
      .where(
        and(
          eq(Followers.followerId, safeUser.id),
          eq(Followers.followingId, id)
        )
      );
    return new Response(
      JSON.stringify({
        success: true,
        message: `User Unfollowed Successfully`,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Failed to unfollow user`, error);
    return new Response(
      JSON.stringify({
        success: false,
        error,
        message: `Failed to unfollow user. INTERNAL SERVER ERROR`,
      }),
      { status: 500 }
    );
  }
}
