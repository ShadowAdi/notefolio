export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
  } catch (error) {
    console.log(`Failed to get blogs for author ${error}`);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500 }
    );
  }
}
