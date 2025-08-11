import type { NextRequest } from 'next/server';

export function middleware(_req: NextRequest) {}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};


