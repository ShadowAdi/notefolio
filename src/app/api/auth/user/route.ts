import { verifyUser } from "@/services/VerifyUser";

export async function GET(request: Request) {
  try {
    const safeUser = await verifyUser(request);
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
