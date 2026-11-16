import { NextResponse } from 'next/server';
import { verifyToken, COOKIE } from '@/lib/auth';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // req.cookies সিঙ্ক্রোনাস, await প্রয়োজন নেই
  const token = req.cookies.get(COOKIE || 'fd_token')?.value;
  
  // verifyToken async ফাংশন, তাই await দিতে হবে
  const decoded = token ? await verifyToken(token) : null;

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isDashboard = pathname.startsWith('/dashboard') || pathname === '/';
  const isAdminPage = pathname.startsWith('/dashboard/admin');

  // ১. ড্যাশবোর্ডে অ্যাক্সেস করার চেষ্টা কিন্তু ইউজার লগইন নেই বা টোকেন ইনভ্যালিড
  if (isDashboard && !decoded) {
    if (pathname === '/login') return NextResponse.next();
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // ২. এডমিন পেজে অ্যাক্সেস করার চেষ্টা কিন্তু ইউজার এডমিন নয়
  if (isAdminPage && decoded?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // ৩. ইউজার লগইন থাকা অবস্থায় /login বা /register পেজে আসার চেষ্টা করলে ড্যাশবোর্ডে পাঠাবে
  if (isAuthPage && decoded) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/'],
};