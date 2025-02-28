import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  const hostname = url.hostname;

  if (hostname.endsWith('.vercel.app')) {
    return new NextResponse('User-agent: *\nDisallow: /', {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.next(); // Allow normal behavior for custom domain
}

export const config = {
  matcher: '/robots.txt', // Only apply middleware to robots.txt
}; 