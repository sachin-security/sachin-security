// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SignJWT } from "jose";

interface Users{userID:string ,userName:string, role:string, password:string}

const SECRET = new TextEncoder().encode("@45##chinssecker54rtfygvhb");

export async function POST(req: NextRequest) {
  try {
    const users:Users[]= JSON.parse(process.env.ADMIN_USERS!)
    const body = await req.json();
    const { userID, password ,logOut} = body;

    if (logOut){
    console.log('loggingout')
    const res = NextResponse.json({message:"Logout Successfully"});
    res.cookies.delete({name: "authToken"});
    return res;
    }

    // Validate input
    if (!userID || !password) {
      return NextResponse.json(
        { error: "UserID and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = users.find(u => u.userID === userID && u.password === password);
    console.log(user)
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT
    const token = await new SignJWT({ userID: user.userID, userName: user.userName ,role:user.role})
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(SECRET);

    // Set HttpOnly cookie
    const res = NextResponse.json({
      userID: user.userID,
      userName: user.userName,
      isAuthenticated: true,
    });
    res.cookies.set({
      name: "authToken",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60*12, // 1 day
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Something went wrong during login"+err },
      { status: 500 }
    );
  }
}
