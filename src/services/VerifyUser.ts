import { db } from "@/db/db";
import { TokenExtract } from "@/lib/TokenExtract";
import { User } from "@/schemas/User";
import { eq } from "drizzle-orm";

export async function verifyUser(request: Request) {
  const decoded: any = await TokenExtract(request);
  if (!decoded.success) {
    throw new Error("Unauthorized");
  }

  const users = await db
    .select()
    .from(User)
    .where(eq(User.email, decoded.decoded.email));

  const user = users[0];
  if (!user) throw new Error("User not found");

  const { password, createdAt, updatedAt, bio, ...safeUser } = user;
  return safeUser; // always return user object
}
