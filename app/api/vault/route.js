import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vault from '@/models/Vault';
import { requireUser } from '@/lib/apiAuth';
import { encrypt, decrypt } from '@/lib/crypto';

export async function GET(req) {
  // await যুক্ত করা হয়েছে
  const auth = await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const items = await Vault.find({ user: auth.id }).sort({ createdAt: -1 });
  // One entry with a wrong/old key must not break the whole list: if an
  // entry cannot be decrypted, return password: null for that row only.
  const decoded = items.map((it) => {
    let password = null;
    try {
      password = decrypt({ encrypted: it.encrypted, iv: it.iv, authTag: it.authTag });
    } catch (e) {
      password = null;
    }
    return {
      _id: it._id,
      siteName: it.siteName,
      username: it.username,
      password,
      note: it.note,
      createdAt: it.createdAt,
    };
  });

  return NextResponse.json({ items: decoded });
}

export async function POST(req) {
  // await যুক্ত করা হয়েছে
  const auth = await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.siteName || !body.username || !body.password) {
    return NextResponse.json({ error: 'সব ফিল্ড দিন' }, { status: 400 });
  }

  await dbConnect();
  const { encrypted, iv, authTag } = encrypt(body.password);
  const item = await Vault.create({
    user: auth.id,
    siteName: body.siteName,
    username: body.username,
    encrypted,
    iv,
    authTag,
    note: body.note || '',
  });

  return NextResponse.json({ ok: true, id: item._id });
}