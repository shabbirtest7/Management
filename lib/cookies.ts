import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export const setAuthCookies = (response: NextResponse, accessToken: string, refreshToken: string) => {
  response.cookies.set({
    name: 'accessToken',
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60 // 15 minutes
  });

  response.cookies.set({
    name: 'refreshToken',
    value: refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  });
};

export const clearAuthCookies = (response: NextResponse) => {
  response.cookies.set({
    name: 'accessToken',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });

  response.cookies.set({
    name: 'refreshToken',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
};

export const getTokensFromCookies = (cookieHeader: string | null) => {
  if (!cookieHeader) return { accessToken: null, refreshToken: null };

  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(cookie => {
      const [name, value] = cookie.split('=');
      return [name, value];
    })
  );

  return {
    accessToken: cookies.accessToken || null,
    refreshToken: cookies.refreshToken || null
  };
};