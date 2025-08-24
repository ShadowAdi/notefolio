import { db } from "@/db/db";
import { User } from "@/schemas/User";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;
  if (!email || !password) {
    return new Response(JSON.stringify({ success: false }), {
      status: 400,
      statusText: `Necessary Details are not provided`,
    });
  }
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  if (!JWT_SECRET_KEY) {
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
      statusText: `Server Error`,
    });
  }
  try {
    const users = await db.select().from(User).where(eq(User.email, email.toLowerCase()));
    const user = users[0];

    if (!user) {
      return new Response(JSON.stringify({ success: false }), {
        status: 404,
        statusText: `User with email: ${email} not found`,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid password" }),
        {
          status: 401,
        }
      );
    }
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET_KEY,
      {
        algorithm: "HS256",
        expiresIn: "7d",
      }
    );
    return new Response(
      JSON.stringify({ success: true, token:jwtToken, message: `Login Successfull` }),
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error(`Failed to Login User ${error}`);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
      statusText: `Failed To Login User. Server Error`,
    });
  }
}
