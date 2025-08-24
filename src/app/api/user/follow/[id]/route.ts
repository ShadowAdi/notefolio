import { db } from "@/db/db";
import { Followers } from "@/schemas/Followers";
import { User } from "@/schemas/User";
import { verifyUser } from "@/services/VerifyUser";
import { and, eq } from "drizzle-orm";

export async function POST(
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
        JSON.stringify({ success: false, message: "User Id is needed." }),
        { status: 400 }
      );
    }

    if (id === safeUser.id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You cannot follow yourself.",
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
      .insert(Followers)
      .values({ followerId: safeUser.id, followingId: id })
      .onConflictDoNothing();

    return new Response(
      JSON.stringify({ success: true, message: "User Followed Successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error(`Failed to follow user`, error);
    return new Response(
      JSON.stringify({
        success: false,
        error,
        message: `Failed to follow user. INTERNAL SERVER ERROR`,
      }),
      { status: 500 }
    );
  }
}