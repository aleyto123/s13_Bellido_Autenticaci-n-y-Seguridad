import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 usa proxy.ts en lugar del antiguo middleware.ts.
export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.redirect(new URL("/signIn", request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*", "/profile/:path*"] };
