import { db } from "@/db/db";
import { User } from "@/schemas/User";
import { Verification } from "@/schemas/Verification";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const body = await request.json();
  const { otp } = body;
 if (!otp) {
    return new Response(JSON.stringify({ success: false }), {
      status: 400,
      statusText: `Necessary Details are not provided`,
    });
  }

  try {
    const currentTime = new Date();

    const verificationEmail = await db
      .select()
      .from(Verification)
      .where(eq(Verification.otp, otp));
    if (verificationEmail.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `OTP Not Correct. Please enter correct or generate a new email`,
        }),
        {
          status: 404,
        }
      );
    }
    const verifiedUser = verificationEmail[0];

       if (new Date(verifiedUser.expiresIn) < currentTime) {
      return new Response(
        JSON.stringify({ success: false, message: `OTP Expired` }),
        { status: 410 }
      );
    }


    const verifiedUserExist = await db
      .select()
      .from(User)
      .where(eq(User.id, verifiedUser.userId));

    if (verifiedUserExist.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `User Not Found.`,
        }),
        {
          status: 404,
        }
      );
    }

    await db
      .update(User)
      .set({ isEmailVerified: true })
      .where(eq(User.id, verifiedUser.userId));

    return new Response(
      JSON.stringify({
        success: true,
        message: `User verified Successfully.`,
      }),
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error(`Failed to Verify User:`, error);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
      statusText: `Server Error`,
    });
  }
}
