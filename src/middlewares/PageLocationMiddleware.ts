import {NextRequest, NextResponse} from 'next/server';

export function pageLocationMiddleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  // requestHeaders.set(CURRENT_PATHNAME, request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}