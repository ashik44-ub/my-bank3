import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vault from '@/models/Vault';
import { requireUser } from '@/lib/apiAuth';
import { encrypt } from '@/lib/crypto';

export async function PUT(req, { params }) {
  // ১. requireUser-এর সামনে await যুক্ত করা হয়েছে
  const auth = await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // ২. Next.js 15 অনুযায়ী params await করা হয়েছে
  const { id } = await params;
  const body = await req.json();

  await dbConnect();

  const update = {
    siteName: body.siteName,
    username: body.username,
    note: body.note || '',
  };
  if (body.password) {
    const { encrypted, iv, authTag } = encrypt(body.password);
    update.encrypted = encrypted;
    update.iv = iv;
    update.authTag = authTag;
  }

  const item = await Vault.findOneAndUpdate({ _id: id, user: auth.id }, update, { new: true });
  if (!item) return NextResponse.json({ error: 'পাওয়া যায়নি' }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  // ১. requireUser-এর সামনে await যুক্ত করা হয়েছে
  const auth = await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // ২. params await করা হয়েছে
  const { id } = await params;

  await dbConnect();
  const deletedItem = await Vault.findOneAndDelete({ _id: id, user: auth.id });

  if (!deletedItem) return NextResponse.json({ error: 'পাওয়া যায়নি' }, { status: 404 });
  return NextResponse.json({ ok: true });
}