import { NextRequest, NextResponse } from "next/server";

const collectionMiddleware = (req: NextRequest) => {
  return NextResponse.next();
};

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/collections')) {
    return collectionMiddleware(request);
  }
}