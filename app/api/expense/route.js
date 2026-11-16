import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Expense from '@/models/Expense';
import Category from '@/models/Category'; // populate('category') needs this model registered, otherwise Mongoose throws MissingSchemaError and the whole list fails with 500
import { requireUser } from '@/lib/apiAuth';

export async function GET(req) {
  // await যুক্ত করা হয়েছে
  const auth = await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const items = await Expense.find({ user: auth.id }).populate('category', 'name').sort({ date: -1 });
  return NextResponse.json({ items });
}

export async function POST(req) {
  // await যুক্ত করা হয়েছে
  const auth = await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.title || !body.amount) return NextResponse.json({ error: 'সব ফিল্ড দিন' }, { status: 400 });

  await dbConnect();
  const item = await Expense.create({
    user: auth.id,
    title: body.title,
    category: body.category || null,
    amount: body.amount,
    date: body.date || Date.now(),
    note: body.note || '',
  });

  return NextResponse.json({ item });
}