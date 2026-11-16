import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Salary from '@/models/Salary';
import { requireUser } from '@/lib/apiAuth';

export async function GET(req) {
  // requireUser-এর সামনে await যোগ করা হয়েছে
  const auth = await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const items = await Salary.find({ user: auth.id }).sort({ date: -1 });
  return NextResponse.json({ items });
}

export async function POST(req) {
  // requireUser-এর সামনে await যোগ করা হয়েছে
  const auth = await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.source || !body.amount) return NextResponse.json({ error: 'সব ফিল্ড দিন' }, { status: 400 });

  await dbConnect();
  const item = await Salary.create({
    user: auth.id,
    source: body.source,
    amount: body.amount,
    date: body.date || Date.now(),
    note: body.note || '',
  });

  return NextResponse.json({ item });
}