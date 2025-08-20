import jwt from "jsonwebtoken";
export const TokenExtract = async (request: Request) => {
  try {
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
    return { decoded, success: true };
  } catch (error) {
    console.error(`Failed to extract the jwt payload: ${error}`);
    return { success: false, error };
  }
};
