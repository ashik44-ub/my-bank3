import { verifyToken, COOKIE } from './auth';

// Use inside API route handlers (NextRequest available)
export async function requireUser(req) {
  try {
    const token = req.cookies.get(COOKIE)?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch (error) {
    return null;
  }
}

export async function requireAdmin(req) {
  try {
    const user = await requireUser(req);
    if (!user || user.role !== 'admin') return null;
    return user;
  } catch (error) {
    return null;
  }
}