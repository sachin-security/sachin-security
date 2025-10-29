import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import verifyUser from "@/app/lib/authorize";
export async function middleware(req: NextRequest) {
  try {
    // Verify user req
    const { pathname } = req.nextUrl;
    const user= await verifyUser(req) ;
     console.log(pathname ,user)

    if (user && pathname.startsWith("/admin/login")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if(user)
    return NextResponse.next();
  } catch(e) {
    console.log("FAiled at middleware", e)
    if(!req.nextUrl.pathname.startsWith("/admin/login"))
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

// ✅ Only run on API routes
export const config = {
  matcher: ['/admin','/api/:path((?!login$).*)','/admin/:path*',],
};
