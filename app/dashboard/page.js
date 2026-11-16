'use client';
import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Wallet,
  HandCoins,
  ListTree,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import StatCard from '@/components/StatCard';

function fmt(n) {
  return new Intl.NumberFormat('en-US').format(Math.round(n || 0));
}

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard/summary')
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="space-y-6 font-sans bg-[#edf2f7] min-h-screen p-4 sm:p-6 rounded-3xl">
      {/* Neumorphic Hero Section */}
      <div className="rounded-3xl bg-[#edf2f7] text-slate-700 p-6 lg:p-8 relative overflow-hidden shadow-[9px_9px_16px_#cbd5e0,-9px_-9px_16px_#ffffff] border border-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-700">Hello! 👋</h1>
          <p className="text-slate-500 max-w-md text-sm lg:text-base">
            Manage your personal finances, expenses, and debts all in one place.
          </p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-[#edf2f7] shadow-[5px_5px_10px_#cbd5e0,-5px_-5px_10px_#ffffff] flex items-center justify-center text-blue-500 flex-shrink-0">
          <TrendingUp size={28} />
        </div>
      </div>

      {/* Neumorphic Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#edf2f7] p-5 rounded-3xl shadow-[9px_9px_16px_#cbd5e0,-9px_-9px_16px_#ffffff] border border-white/50 flex items-center gap-4 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#edf2f7] shadow-[4px_4px_8px_#cbd5e0,-4px_-4px_8px_#ffffff] flex items-center justify-center text-emerald-500 flex-shrink-0">
            <ArrowUpRight size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Salary</p>
            <h3 className="text-lg font-extrabold font-mono text-slate-700 mt-0.5">৳{fmt(data?.totalSalary)}</h3>
          </div>
        </div>

        <div className="bg-[#edf2f7] p-5 rounded-3xl shadow-[9px_9px_16px_#cbd5e0,-9px_-9px_16px_#ffffff] border border-white/50 flex items-center gap-4 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#edf2f7] shadow-[4px_4px_8px_#cbd5e0,-4px_-4px_8px_#ffffff] flex items-center justify-center text-rose-500 flex-shrink-0">
            <ArrowDownRight size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Expense</p>
            <h3 className="text-lg font-extrabold font-mono text-slate-700 mt-0.5">৳{fmt(data?.totalExpense)}</h3>
          </div>
        </div>

        <div className="bg-[#edf2f7] p-5 rounded-3xl shadow-[9px_9px_16px_#cbd5e0,-9px_-9px_16px_#ffffff] border border-white/50 flex items-center gap-4 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#edf2f7] shadow-[4px_4px_8px_#cbd5e0,-4px_-4px_8px_#ffffff] flex items-center justify-center text-amber-500 flex-shrink-0">
            <HandCoins size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Lending Given</p>
            <h3 className="text-lg font-extrabold font-mono text-slate-700 mt-0.5">৳{fmt(data?.totalGiven)}</h3>
          </div>
        </div>

        <div className="bg-[#edf2f7] p-5 rounded-3xl shadow-[9px_9px_16px_#cbd5e0,-9px_-9px_16px_#ffffff] border border-white/50 flex items-center gap-4 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#edf2f7] shadow-[4px_4px_8px_#cbd5e0,-4px_-4px_8px_#ffffff] flex items-center justify-center text-blue-500 flex-shrink-0">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Balance</p>
            <h3 className="text-lg font-extrabold font-mono text-slate-700 mt-0.5">৳{fmt(data?.balance)}</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Neumorphic Chart Section */}
        <div className="lg:col-span-2 bg-[#edf2f7] p-6 rounded-3xl shadow-[9px_9px_16px_#cbd5e0,-9px_-9px_16px_#ffffff] border border-white/50 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <p className="text-2xl font-black font-mono text-slate-700">৳{fmt(data?.totalSalary)}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">Income vs Expense (৳)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 bg-[#edf2f7] px-4 py-2 rounded-2xl shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Salary</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" /> Expense</span>
            </div>
          </div>
          <div className="bg-[#edf2f7] p-4 rounded-2xl shadow-[inset_4px_4px_8px_#cbd5e0,inset_-4px_-4px_8px_#ffffff]">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data?.chart || []}>
                <defs>
                  <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e0" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#edf2f7', borderRadius: '16px', boxShadow: '5px 5px 10px #cbd5e0, -5px -5px 10px #ffffff', border: 'none' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="url(#sales)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="cost" stroke="#2dd4bf" fill="url(#cost)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Neumorphic Right Panel */}
        <div className="bg-[#edf2f7] p-6 rounded-3xl shadow-[9px_9px_16px_#cbd5e0,-9px_-9px_16px_#ffffff] border border-white/50 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-700 text-lg">Lending & Borrowing Summary</h3>
              <p className="text-xs text-slate-400 font-medium">Lending Overview</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-[#edf2f7] rounded-2xl px-4 py-3.5 shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff]">
                <span className="text-xs font-semibold text-slate-500">আপনি ধার দিয়েছেন</span>
                <span className="font-bold font-mono text-rose-500">৳{fmt(data?.totalGiven)}</span>
              </div>
              <div className="flex justify-between items-center bg-[#edf2f7] rounded-2xl px-4 py-3.5 shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff]">
                <span className="text-xs font-semibold text-slate-500">আপনি ধার নিয়েছেন</span>
                <span className="font-bold font-mono text-emerald-600">৳{fmt(data?.totalTaken)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-[#edf2f7] rounded-2xl p-4 flex flex-col items-center justify-center shadow-[5px_5px_10px_#cbd5e0,-5px_-5px_10px_#ffffff] border border-white/40">
              <div className="w-10 h-10 rounded-xl bg-[#edf2f7] shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff] flex items-center justify-center text-blue-500 mb-2">
                <ListTree size={20} />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Expenses</p>
              <p className="font-extrabold font-mono text-slate-700 text-lg mt-0.5">{data?.counts?.expense ?? 0}</p>
            </div>

            <div className="bg-[#edf2f7] rounded-2xl p-4 flex flex-col items-center justify-center shadow-[5px_5px_10px_#cbd5e0,-5px_-5px_10px_#ffffff] border border-white/40">
              <div className="w-10 h-10 rounded-xl bg-[#edf2f7] shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff] flex items-center justify-center text-blue-500 mb-2">
                <Wallet size={20} />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Salary Entries</p>
              <p className="font-extrabold font-mono text-slate-700 text-lg mt-0.5">{data?.counts?.salary ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}