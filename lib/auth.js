import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fd_secret_key_123456789';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'fd_token';

// Sign Token
export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedSecret);
}

// Verify Token (Edge / Middleware Friendly)
export async function verifyToken(token) {
  try {
    if (!token) return null;
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload;
  } catch (e) {
    return null;
  }
}

// Get Token from Request
export async function getTokenFromRequest(req) {
  const cookie = req.cookies.get(COOKIE_NAME);
  return cookie ? cookie.value : null;
}

// Get Current User
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export const COOKIE = COOKIE_NAME;