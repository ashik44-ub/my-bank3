import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vault from '@/models/Vault';
import Category from '@/models/Category'; // expense populate('category') needs this registered
import Salary from '@/models/Salary';
import Expense from '@/models/Expense';
import Lending from '@/models/Lending';
import User from '@/models/User';
import { requireUser, requireAdmin } from '@/lib/apiAuth';
import { decrypt } from '@/lib/crypto';
import { buildExcelBuffer } from '@/lib/exportExcel';

// Shown in the vault password column when the row cannot be decrypted
// (same wording as the vault page). Never a fake password, never the blob.
const UNDECRYPTABLE = 'ডিক্রিপ্ট করা যায়নি — ভুল key';

function toDate(v) {
  return v ? new Date(v) : '';
}

// Each definition mirrors its list endpoint's auth + scoping exactly:
// vault/categories/salary/expense/lending = the logged-in user's own records,
// users = admin only (same requireAdmin check as /api/admin/users).
const DEFINITIONS = {
  vault: {
    sheetName: 'Passwords',
    columns: [
      { key: 'site', header: 'Site / App' },
      { key: 'username', header: 'Username' },
      { key: 'password', header: 'Password' },
    ],
    fetch: async (userId) => {
      const items = await Vault.find({ user: userId }).sort({ createdAt: -1 });
      return items.map((it) => {
        let password = UNDECRYPTABLE;
        try {
          password = decrypt({ encrypted: it.encrypted, iv: it.iv, authTag: it.authTag });
        } catch (e) {
          password = UNDECRYPTABLE;
        }
        return { site: it.siteName, username: it.username, password };
      });
    },
  },
  categories: {
    sheetName: 'Categories',
    columns: [
      { key: 'name', header: 'Name' },
      { key: 'type', header: 'Type' },
    ],
    fetch: async (userId) => {
      const items = await Category.find({ user: userId }).sort({ createdAt: -1 });
      return items.map((it) => ({ name: it.name, type: it.type }));
    },
  },
  salary: {
    sheetName: 'Salary',
    columns: [
      { key: 'source', header: 'Source' },
      { key: 'amount', header: 'Amount' },
      { key: 'date', header: 'Date' },
      { key: 'note', header: 'Note' },
    ],
    fetch: async (userId) => {
      const items = await Salary.find({ user: userId }).sort({ date: -1 });
      return items.map((it) => ({
        source: it.source,
        amount: it.amount,
        date: toDate(it.date),
        note: it.note || '',
      }));
    },
  },
  expense: {
    sheetName: 'Expense',
    columns: [
      { key: 'title', header: 'Title' },
      { key: 'category', header: 'Category' },
      { key: 'amount', header: 'Amount' },
      { key: 'date', header: 'Date' },
      { key: 'note', header: 'Note' },
    ],
    fetch: async (userId) => {
      const items = await Expense.find({ user: userId })
        .populate('category', 'name')
        .sort({ date: -1 });
      return items.map((it) => ({
        title: it.title,
        category: it.category?.name || '',
        amount: it.amount,
        date: toDate(it.date),
        note: it.note || '',
      }));
    },
  },
  lending: {
    sheetName: 'Lending',
    columns: [
      { key: 'person', header: 'Person' },
      { key: 'type', header: 'Type' },
      { key: 'amount', header: 'Amount' },
      { key: 'date', header: 'Date' },
      { key: 'status', header: 'Status' },
      { key: 'note', header: 'Note' },
    ],
    fetch: async (userId) => {
      const items = await Lending.find({ user: userId }).sort({ date: -1 });
      return items.map((it) => ({
        person: it.personName,
        type: it.type,
        amount: it.amount,
        date: toDate(it.date),
        status: it.status,
        note: it.note || '',
      }));
    },
  },
  users: {
    sheetName: 'Users',
    columns: [
      { key: 'name', header: 'Name' },
      { key: 'email', header: 'Email' },
      { key: 'role', header: 'Role' },
      { key: 'createdAt', header: 'Created Date' },
    ],
    fetch: async () => {
      const items = await User.find({}, '-password').sort({ createdAt: -1 });
      return items.map((it) => ({
        name: it.name,
        email: it.email,
        role: it.role,
        createdAt: toDate(it.createdAt),
      }));
    },
  },
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const resource = searchParams.get('resource');
  const def = DEFINITIONS[resource];
  if (!def) return NextResponse.json({ error: 'অজানা রিসোর্স' }, { status: 400 });

  const auth =
    resource === 'users' ? await requireAdmin(req) : await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const rows = await def.fetch(auth.id);
  const buffer = buildExcelBuffer({
    columns: def.columns,
    rows,
    sheetName: def.sheetName,
  });
  const date = new Date().toISOString().slice(0, 10);
  return new Response(buffer, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${resource}-${date}.xlsx"`,
    },
  });
}
