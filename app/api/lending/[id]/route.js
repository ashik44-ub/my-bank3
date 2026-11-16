import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Lending from '@/models/Lending';
import { requireUser } from '@/lib/apiAuth';

export async function PUT(req, { params }) {
  // ১. requireUser-এর সামনে await যোগ করা হয়েছে
  const auth = await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // ২. Next.js 15 অনুযায়ী params await করা হয়েছে
  const { id } = await params;
  const body = await req.json();

  await dbConnect();
  const item = await Lending.findOneAndUpdate(
    { _id: id, user: auth.id },
    {
      type: body.type,
      personName: body.personName,
      amount: body.amount,
      date: body.date,
      status: body.status,
      note: body.note,
    },
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
  const deletedItem = await Lending.findOneAndDelete({ _id: id, user: auth.id });

  if (!deletedItem) return NextResponse.json({ error: 'পাওয়া যায়নি' }, { status: 404 });
  return NextResponse.json({ ok: true });
}