import { NextRequest, NextResponse } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup'];
const authRoutes = ['/login', '/signup'];

// Function to check if a token is valid (simplified)
function isValidToken(token: string | null): boolean {
  if (!token) {
    return false;
  }

  try {
    // In a real app, you'd verify the JWT token properly
    // For now, we'll just check if it exists and has a reasonable length
    return token.length > 10;
  } catch (error) {
    return false;
  }
}

export function middleware(request: NextRequest) {
  // Get the token from cookies or headers
  // For client-side auth, the token is typically in localStorage and sent via Authorization header
  const authCookie = request.cookies.get('auth_token');
  const accessCookie = request.cookies.get('access_token');
  const token = authCookie?.value ||
                accessCookie?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '') ||
                null;

  const isAuthenticated = isValidToken(token);
  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname === route ||
    request.nextUrl.pathname.startsWith(`${route}/`)
  );

  const isAuthRoute = authRoutes.some(route =>
    request.nextUrl.pathname === route ||
    request.nextUrl.pathname.startsWith(`${route}/`)
  );

  // If user is authenticated and trying to access auth routes, redirect to tasks
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/tasks', request.url));
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Continue with the request
  return NextResponse.next();
}

// Apply middleware to all routes except static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' }
      ]
    }
  ]
};