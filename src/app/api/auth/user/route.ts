import { verifyUser } from "@/services/VerifyUser";

export async function GET(request: Request) {
  try {
    const safeUser = await verifyUser(request);
    return new Response(JSON.stringify({ success: true, user: safeUser }), {
      status: 200,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 401 }
    );
  }
}
