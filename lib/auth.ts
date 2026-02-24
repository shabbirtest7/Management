// import { NextRequest } from 'next/server';
// import { verifyAccessToken } from './jwt';
// import { getTokensFromCookies } from './cookies';

// export interface AuthUser {
//   id: string;
//   email: string;
//   name: string;
//   role: string;
// }

// export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
//   const cookieHeader = request.headers.get('cookie');
//   const { accessToken } = getTokensFromCookies(cookieHeader);

//   if (!accessToken) {
//     return null;
//   }

//   const payload = verifyAccessToken(accessToken);
//   if (!payload) {
//     return null;
//   }

//   return payload;
// }

// export async function requireAuth(request: NextRequest): Promise<AuthUser> {
//   const user = await getAuthUser(request);
//   if (!user) {
//     throw new Error('Unauthorized');
//   }
//   return user;
// }

// export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
//   const user = await requireAuth(request);
//   if (user.role !== 'ADMIN') {
//     throw new Error('Forbidden: Admin access required');
//   }
//   return user;
// }







import { NextRequest } from 'next/server';
import { verifyAccessToken } from './jwt';
import { getTokensFromCookies } from './cookies';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const cookieHeader = request.headers.get('cookie');
  const { accessToken } = getTokensFromCookies(cookieHeader);

  if (!accessToken) {
    return null;
  }

  const payload = verifyAccessToken(accessToken);
  if (!payload) {
    return null;
  }

  return payload;
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await getAuthUser(request);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
  const user = await requireAuth(request);
  if (user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required');
  }
  return user;
}