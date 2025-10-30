import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import verifyUser from "@/app/lib/authorize";
export async function middleware(req: NextRequest) {
  try {
    
    const { pathname } = req.nextUrl;
     if (pathname.startsWith("/api/jobs") && req.method === "GET") {
     return NextResponse.next();
    }
  // Verify user req
    const user= await verifyUser(req) as {userID:string ,role:string}
     console.log(pathname ,user,req.url)

    if (pathname.startsWith("/admin/login")) {
        if(user.role==='superadmin')
        return NextResponse.redirect(new URL("/admin", req.url));
          if(user.role==='subadmin')
        return NextResponse.redirect(new URL("/admin/add-employee", req.url));
        else
       return NextResponse.next()
    }

    if(user.role==='superadmin')
    return NextResponse.next();

    if (user.role==='subadmin' &&( pathname.startsWith("/admin/add-employee") || pathname.startsWith("/api/employees"))) {
      return NextResponse.next();
    } else if(user.role==='subadmin')
      return NextResponse.json({error:"You are not an admin"}, { status: 403 })

  } catch(e) {
    console.log("FAiled at middleware", e)
    if(!req.nextUrl.pathname.startsWith("/admin/login"))
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

// ✅ Only run on API routes
export const config = {
  matcher: ['/admin',"/api/:path((?!login|upload|apply-jobs).*)",'/admin/:path*',],
};
