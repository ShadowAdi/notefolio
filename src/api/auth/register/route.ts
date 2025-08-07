import { db } from "@/db/db";
import { User } from "@/schemas/User";
import bcrypt from "bcrypt";

export async function POST(request: Request, res: Response) {
  const body = await request.json();
  const { username, email, password, profileUrl, bio } = body;
  if (!username || !email || !password) {
    return new Response(JSON.stringify({ success: false }), {
      status: 400,
      statusText: `Necessary Details are not provided`,
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: crypto.randomUUID(),
      username,
      email,
      password: hashedPassword,
      profileUrl,
      bio,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.insert(User).values({ ...user });
    return new Response(
      JSON.stringify({ success: true, message: `User Created Successfully` }),
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
