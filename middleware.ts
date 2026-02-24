import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken, decodeToken } from './lib/jwt';
import { getTokensFromCookies } from './lib/cookies';

export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
  
//   // Public paths that don't require authentication
//   const publicPaths = ['/login', '/api/auth/login', '/api/auth/register'];
//   if (publicPaths.includes(pathname)) {
//     return NextResponse.next();
//   }

//   // Get tokens from cookies
//   const cookieHeader = request.headers.get('cookie');
//   const { accessToken, refreshToken } = getTokensFromCookies(cookieHeader);

//   // If no access token, redirect to login
//   if (!accessToken) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   // Verify access token
//   const payload = verifyAccessToken(accessToken);
  
//   if (payload) {
//     // Token is valid, proceed
//     const requestHeaders = new Headers(request.headers);
//     requestHeaders.set('x-user-id', payload.id);
//     requestHeaders.set('x-user-role', payload.role);
//     requestHeaders.set('x-user-email', payload.email);
    
//     return NextResponse.next({
//       request: {
//         headers: requestHeaders,
//       },
//     });
//   }

//   // Access token is invalid, try to refresh
//   if (refreshToken) {
//     try {
//       const response = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ refreshToken }),
//       });

//       if (response.ok) {
//         const data = await response.json();
        
//         // Create new response with the new tokens
//         const newResponse = NextResponse.next();
        
//         // Set new cookies
//         newResponse.cookies.set({
//           name: 'accessToken',
//           value: data.accessToken,
//           httpOnly: true,
//           secure: process.env.NODE_ENV === 'production',
//           sameSite: 'lax',
//           path: '/',
//           maxAge: 15 * 60
//         });

//         // Decode the new token to get user info
//         const newPayload = decodeToken(data.accessToken);
//         if (newPayload) {
//           const requestHeaders = new Headers(request.headers);
//           requestHeaders.set('x-user-id', newPayload.id);
//           requestHeaders.set('x-user-role', newPayload.role);
//           requestHeaders.set('x-user-email', newPayload.email);
          
//           newResponse.headers.set('x-user-id', newPayload.id);
//           newResponse.headers.set('x-user-role', newPayload.role);
//         }

//         return newResponse;
//       }
//     } catch (error) {
//       console.error('Token refresh failed:', error);
//     }
//   }

//   // Refresh failed or no refresh token, redirect to login
//   return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/projects/:path*',
//     '/users/:path*',
//     '/api/projects/:path*',
//     '/api/users/:path*',
//     '/api/activities/:path*',
//   ],
};