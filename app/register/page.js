'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wallet, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('A server error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#edf2f7] px-4 font-sans">
      <div className="w-full max-w-md">
        {/* Brand Logo & Title */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#edf2f7] shadow-[5px_5px_10px_#cbd5e0,-5px_-5px_10px_#ffffff] flex items-center justify-center text-blue-500">
            <Wallet size={24} />
          </div>
          <span className="text-2xl font-extrabold text-slate-700 tracking-tight">Finance Dashboard</span>
        </div>

        {/* Neumorphic Card Box */}
        <div className="bg-[#edf2f7] p-8 sm:p-10 rounded-3xl shadow-[12px_12px_24px_#cbd5e0,-12px_-12px_24px_#ffffff] border border-white/50">
          <h1 className="text-xl font-extrabold text-slate-700 mb-1">Create a New Account</h1>
          <p className="text-xs font-semibold text-slate-400 mb-6">The first registered user will automatically become admin</p>

          {error && (
            <div className="mb-5 text-xs font-semibold bg-[#edf2f7] text-rose-500 px-4 py-3 rounded-2xl shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Name</label>
              <input
                required
                className="w-full bg-[#edf2f7] rounded-2xl px-4 py-3.5 text-sm text-slate-700 focus:outline-none shadow-[inset_4px_4px_8px_#cbd5e0,inset_-4px_-4px_8px_#ffffff] border border-transparent transition-all"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your Name"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full bg-[#edf2f7] rounded-2xl px-4 py-3.5 text-sm text-slate-700 focus:outline-none shadow-[inset_4px_4px_8px_#cbd5e0,inset_-4px_-4px_8px_#ffffff] border border-transparent transition-all"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={6}
                  className="w-full bg-[#edf2f7] rounded-2xl pl-4 pr-12 py-3.5 text-sm text-slate-700 focus:outline-none shadow-[inset_4px_4px_8px_#cbd5e0,inset_-4px_-4px_8px_#ffffff] border border-transparent transition-all"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 bg-[#edf2f7] shadow-[2px_2px_4px_#cbd5e0,-2px_-2px_4px_#ffffff] transition-all"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#edf2f7] hover:bg-white text-slate-700 font-bold py-3.5 rounded-2xl shadow-[6px_6px_12px_#cbd5e0,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-3 text-sm"
            >
              {loading ? 'Please wait...' : 'Register'}
            </button>
          </form>

          <p className="text-xs font-semibold text-slate-400 mt-8 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:text-blue-600 font-bold transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}