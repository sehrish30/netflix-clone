// middleware.ts
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { verifyToken } from "./lib/utils";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  // check the token
  //access the token from cookie
  // const token = request?.cookies?.token;
  // const userId = verifyToken(token);

  try {
    const token = request ? request.cookies.get("token")?.value : null;

    const { pathname } = request.nextUrl.clone();
    console.log("RUN MIDDLEWARE", request.url);

    if (token) {
      // const userId = await jwtVerify(
      //   token,
      //   new TextEncoder().encode(process.env.NEXT_PUBLIC_HASURA_JWT_SECRET),
      //   {
      //     algorithm: ["HS256"],
      //   }
      // );
      const userId = await verifyToken(token);

      if (userId || pathname.includes("/api/login")) {
        return NextResponse.next();
      } else {
        // const url = request.nextUrl.clone();
        // url.pathname = "/login";
        // return NextResponse.rewrite(url);
        // return NextResponse.rewrite(new URL("/login", request.url));
        return NextResponse.rewrite(new URL("/login", request.url));
      }
    } else {
      // return NextResponse.rewrite(new URL("/login", request.url));
      // const url = request.nextUrl.clone();
      // url.pathname = "/login";
      // return NextResponse.rewrite(url);
      return NextResponse.rewrite(new URL("/login", request.url));
    }
  } catch (err) {
    console.error({ err });
    return null;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/",
    "/login",
    "/browse/mylist",
    "/((?!api|_next/static|_next/image|static|favicon.ico).*)",
    "/video/:videoId*",
  ],
};
