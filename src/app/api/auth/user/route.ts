import { db } from "@/db/db";
import { User } from "@/schemas/User";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
export async function GET(request: Request) {
  try {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!JWT_SECRET_KEY) {
      return new Response(
        JSON.stringify({ success: false, message: "Server error" }),
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, message: `No Token Provided` }),
        {
          status: 401,
        }
      );
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: `Invalia token format` }),
        {
          status: 401,
        }
      );
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET_KEY);
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or expired token" }),
        { status: 401 }
      );
    }

    const users = await db
      .select()
      .from(User)
      .where(eq(User.email, decoded.email));
    const user = users[0];
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }
    const { password, createdAt, updatedAt, bio, ...safeUser } = user;
    return new Response(JSON.stringify({ success: true, user: safeUser }), {
      status: 200,
    });
  } catch (error) {
    console.error(`Failed to get User ${error}`);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
      statusText: `Failed To get User. Server Error`,
    });
  }
}
