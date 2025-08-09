import { db } from "@/db/db";
import { User } from "@/schemas/User";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function verifyUser(request: Request) {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  if (!JWT_SECRET_KEY) throw new Error("Server error: no JWT key");

  const authHeader = request.headers.get("authorization");
  if (!authHeader) throw new Error("No token provided");


  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("Invalid token format");

  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET_KEY);
  } catch {
    throw new Error("Invalid or expired token");
  }

  const users = await db
    .select()
    .from(User)
    .where(eq(User.email, decoded.email));
  const user = users[0];
  if (!user) throw new Error("User not found");

  const { password, createdAt, updatedAt, bio, ...safeUser } = user;
  return safeUser;
}
