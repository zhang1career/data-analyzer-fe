import {NextRequest, NextResponse} from 'next/server';

export function loggingMiddleware(request: NextRequest) {
  console.log('[mw][request]: ', request.url);
  return NextResponse.next();
}