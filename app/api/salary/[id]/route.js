import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Salary from '@/models/Salary';
import { requireUser } from '@/lib/apiAuth';

export async function PUT(req, { params }) {
  // ১. requireUser-এর সামনে await যোগ করা হয়েছে
  const auth = await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // ২. Next.js 15 অনুযায়ী params await করা হয়েছে
  const { id } = await params;
  const body = await req.json();

  await dbConnect();
  const item = await Salary.findOneAndUpdate(
    { _id: id, user: auth.id },
    { source: body.source, amount: body.amount, date: body.date, note: body.note },
    { new: true }
  );

  if (!item) return NextResponse.json({ error: 'পাওয়া যায়নি' }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(req, { params }) {
  // ১. requireUser-এর সামনে await যোগ করা হয়েছে
  const auth = await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // ২. params await করা হয়েছে
  const { id } = await params;

  await dbConnect();
  const deletedItem = await Salary.findOneAndDelete({ _id: id, user: auth.id });

  if (!deletedItem) return NextResponse.json({ error: 'পাওয়া যায়নি' }, { status: 404 });
  return NextResponse.json({ ok: true });
}