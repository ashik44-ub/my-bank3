import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Salary from '@/models/Salary';
import Expense from '@/models/Expense';
import Lending from '@/models/Lending';
import { requireUser } from '@/lib/apiAuth';

export async function GET(req) {
  // requireUser-এর সামনে await যোগ করা হয়েছে
  const auth = await requireUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  await dbConnect();

  const [salaries, expenses, lendings] = await Promise.all([
    Salary.find({ user: auth.id }),
    Expense.find({ user: auth.id }),
    Lending.find({ user: auth.id }),
  ]);

  const totalSalary = salaries.reduce((s, x) => s + (x.amount || 0), 0);
  const totalExpense = expenses.reduce((s, x) => s + (x.amount || 0), 0);
  const totalGiven = lendings
    .filter((l) => l.type === 'given' && l.status === 'pending')
    .reduce((s, x) => s + (x.amount || 0), 0);
  const totalTaken = lendings
    .filter((l) => l.type === 'taken' && l.status === 'pending')
    .reduce((s, x) => s + (x.amount || 0), 0);

  const balance = totalSalary - totalExpense - totalGiven + totalTaken;

  // Monthly breakdown (last 8 months) for chart
  const monthMap = {};
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString('en-US', { month: 'short' });
    monthMap[key] = { month: key, sales: 0, cost: 0 };
  }

  salaries.forEach((s) => {
    if (s.date) {
      const key = new Date(s.date).toLocaleString('en-US', { month: 'short' });
      if (monthMap[key]) monthMap[key].sales += s.amount || 0;
    }
  });

  expenses.forEach((e) => {
    if (e.date) {
      const key = new Date(e.date).toLocaleString('en-US', { month: 'short' });
      if (monthMap[key]) monthMap[key].cost += e.amount || 0;
    }
  });

  return NextResponse.json({
    totalSalary,
    totalExpense,
    totalGiven,
    totalTaken,
    balance,
    chart: Object.values(monthMap),
    counts: {
      salary: salaries.length,
      expense: expenses.length,
      lending: lendings.length,
    },
  });
}