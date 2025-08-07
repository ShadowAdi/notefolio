export async function POST(request: Request) {
  const body = await request.json();
  const {username,email,password,profileUrl,bio}=body
}
