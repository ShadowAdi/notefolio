import { db } from "@/db/db";
import { User } from "@/schemas/User";
import { Verification } from "@/schemas/Verification";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { sendVerificationEmail } from "@/config/email-verification/email";
export async function POST(request: Request) {
  const body = await request.json();
  const { username, email, password, profileUrl } = body;
  if (!username || !email || !password) {
    return new Response(JSON.stringify({ success: false }), {
      status: 400,
      statusText: `Necessary Details are not provided`,
    });
  }
  try {
    const users = await db
      .select()
      .from(User)
      .where(eq(User.email, email.toLowerCase()));
    const isUserExist = users[0];
    if (isUserExist) {
      return new Response(JSON.stringify({ success: false }), {
        status: 404,
        statusText: `User with email: ${email} already exists`,
      });
    }

    const otp = String(crypto.randomInt(100000, 1000000));
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiresIn = new Date(Date.now() + 15 * 60 * 1000);
    const user = {
      id: crypto.randomUUID(),
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      profileUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.insert(User).values({ ...user });

    await db.insert(Verification).values({
      userId: user.id,
      otp: otp,
      expiresIn: expiresIn,
      createdAt: new Date(),
    });

    await sendVerificationEmail(user.email, otp);

    return new Response(
      JSON.stringify({
        success: true,
        message: `User Created Successfully. Please Check Your Mail`,
      }),
      {
        status: 201,
      }
    );
  } catch (error: unknown) {
    console.error(`Failed to Create User ${error}`);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
      statusText: `Failed To Create User. Server Error`,
    });
  }
}
