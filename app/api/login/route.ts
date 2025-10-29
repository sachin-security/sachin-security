// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode("supersecretkey");

export async function POST(req: NextRequest) {
  try {
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
    const users= [{userID:'sss', password:'12345' ,userName:'Aniket'}]
    console.log(users)
    const user = users.find(u => u.userID === userID && u.password === password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT
    const token = await new SignJWT({ userID: user.userID, userName: user.userName })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
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
