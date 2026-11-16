import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Lending from '@/models/Lending';
import { requireUser } from '@/lib/apiAuth';

export async function GET(req) {
  // await যুক্ত করা হয়েছে
  const auth = await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const items = await Lending.find({ user: auth.id }).sort({ date: -1 });
  return NextResponse.json({ items });
}

export async function POST(req) {
  // await যুক্ত করা হয়েছে
  const auth = await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.personName || !body.amount || !body.type) {
    return NextResponse.json({ error: 'সব ফিল্ড দিন' }, { status: 400 });
  }

  await dbConnect();
  const item = await Lending.create({
    user: auth.id,
    type: body.type,
    personName: body.personName,
    amount: body.amount,
    date: body.date || Date.now(),
    status: body.status || 'pending',
    note: body.note || '',
  });

  return NextResponse.json({ item });
}