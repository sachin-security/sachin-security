//this is middelw ware function which runn on every rewuet and return userID from valid token
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
const SECRET = new TextEncoder().encode("supersecretkey");

export default async function verifyUser(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  if (!token) {
    throw new Error("No token found")
  }

  try {
    // Verify JWT
    const user= await jwtVerify(token, SECRET);
    console.log("user verified by verifyuser" ,user)
    return user.payload
  } catch(e) {
    console.log("Failed at verifyuser", e)
    return e
  }
}
