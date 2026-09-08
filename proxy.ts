import { NextRequest, NextResponse } from 'next/server';
import { safeNext } from '@/lib/auth-next';

// Older authentication redirects may land at the site root instead of the callback.
export function proxy(request: NextRequest) {
  if (request.nextUrl.searchParams.has('code')) {
    const target = request.nextUrl.clone();
    target.pathname = '/auth/callback';
    target.searchParams.set('next', safeNext(target.searchParams.get('next'), '/progress'));
    return NextResponse.redirect(target);
  }
  return NextResponse.next();
}
export const config = { matcher: '/' };
