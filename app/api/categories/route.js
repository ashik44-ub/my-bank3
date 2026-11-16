import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import { requireUser } from '@/lib/apiAuth';

export async function GET(req) {
  const auth = await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const items = await Category.find({ user: auth.id }).sort({ createdAt: -1 });
  return NextResponse.json({ items });
}

export async function POST(req) {
  const auth = await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  
  // ১. নাম এবং টাইপ ফিল্ডের ভ্যালিডেশন
  if (!body.name || !body.type) {
    return NextResponse.json({ error: 'নাম এবং টাইপ দুটোই আবশ্যক' }, { status: 400 });
  }

  // ২. টাইপ যেন শুধু 'income' অথবা 'expense' হয় তা নিশ্চিত করা
  const categoryType = body.type.toLowerCase();
  if (!['income', 'expense'].includes(categoryType)) {
    return NextResponse.json({ error: 'টাইপ অবশ্যই income বা expense হতে হবে' }, { status: 400 });
  }

  await dbConnect();
  const item = await Category.create({ 
    user: auth.id, 
    name: body.name.trim(), 
    type: categoryType 
  });

  return NextResponse.json({ item }, { status: 201 });
}