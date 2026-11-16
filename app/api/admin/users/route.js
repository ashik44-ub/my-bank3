import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { requireAdmin } from '@/lib/apiAuth';

export async function GET(req) {
  const auth = await requireAdmin(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const items = await User.find({}, '-password').sort({ createdAt: -1 });
  return NextResponse.json({ items });
}
