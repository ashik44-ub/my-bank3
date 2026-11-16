import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { requireAdmin } from '@/lib/apiAuth';

export async function PUT(req, { params }) {
  // ১. requireAdmin এর সামনে await যোগ করা হয়েছে
  const auth = await requireAdmin(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // ২. Next.js App Router-এর জন্য params await করা হয়েছে
  const { id } = await params;
  const body = await req.json();

  if (!body.role) {
    return NextResponse.json({ error: 'রোল সিলেক্ট করুন' }, { status: 400 });
  }

  await dbConnect();

  // ৩. .select('-password') দিয়ে পাসওয়ার্ড ফিল্ড বাদ দেওয়া হয়েছে
  const item = await User.findByIdAndUpdate(
    id,
    { role: body.role },
    { new: true }
  ).select('-password');

  if (!item) return NextResponse.json({ error: 'পাওয়া যায়নি' }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(req, { params }) {
  // ১. requireAdmin এর সামনে await যোগ করা হয়েছে
  const auth = await requireAdmin(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // ২. params await করা হয়েছে
  const { id } = await params;

  if (auth.id === id) {
    return NextResponse.json({ error: 'নিজের অ্যাকাউন্ট ডিলিট করা যাবে না' }, { status: 400 });
  }

  await dbConnect();
  await User.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}