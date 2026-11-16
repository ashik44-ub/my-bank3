'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Wallet, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [isForgot, setIsForgot] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [forgotForm, setForgotForm] = useState({ email: '', newPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.message || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }
      window.location.href = '/dashboard';
    } catch (err) {
      setError('A server error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forgotForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.message || 'Failed to update password.');
        setLoading(false);
        return;
      }
      setSuccess('Password updated successfully! Please login with your new password.');
      setLoading(false);
      setTimeout(() => {
        setIsForgot(false);
        setSuccess('');
        setForgotForm({ email: '', newPassword: '' });
      }, 2500);
    } catch (err) {
      setError('A server error occurred. Please try again.');
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
          {!isForgot ? (
            <>
              <h1 className="text-xl font-extrabold text-slate-700 mb-1">Login to Your Account</h1>
              <p className="text-xs font-semibold text-slate-400 mb-6">Manage your income, expenses, and personal data</p>

              {error && (
                <div className="mb-5 text-xs font-semibold bg-[#edf2f7] text-rose-500 px-4 py-3 rounded-2xl shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff]">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Email Address</label>
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgot(true);
                        setError('');
                      }}
                      className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      className="w-full bg-[#edf2f7] rounded-2xl pl-4 pr-12 py-3.5 text-sm text-slate-700 focus:outline-none shadow-[inset_4px_4px_8px_#cbd5e0,inset_-4px_-4px_8px_#ffffff] border border-transparent transition-all"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••"
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
                  {loading ? 'Please wait...' : 'Login'}
                </button>
              </form>

              <p className="text-xs font-semibold text-slate-400 mt-8 text-center">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-500 hover:text-blue-600 font-bold transition-colors">
                  Register now
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgot(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="p-2 rounded-xl bg-[#edf2f7] shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff] hover:bg-white text-slate-500 transition-all"
                >
                  <ArrowLeft size={16} />
                </button>
                <h1 className="text-xl font-extrabold text-slate-700">Reset Password</h1>
              </div>
              <p className="text-xs font-semibold text-slate-400 mb-6">Enter your email and set a new password</p>

              {error && (
                <div className="mb-5 text-xs font-semibold bg-[#edf2f7] text-rose-500 px-4 py-3 rounded-2xl shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff]">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-5 text-xs font-semibold bg-[#edf2f7] text-emerald-600 px-4 py-3 rounded-2xl shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff]">
                  {success}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-[#edf2f7] rounded-2xl px-4 py-3.5 text-sm text-slate-700 focus:outline-none shadow-[inset_4px_4px_8px_#cbd5e0,inset_-4px_-4px_8px_#ffffff] border border-transparent transition-all"
                    value={forgotForm.email}
                    onChange={(e) => setForgotForm({ ...forgotForm, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      minLength={6}
                      className="w-full bg-[#edf2f7] rounded-2xl pl-4 pr-12 py-3.5 text-sm text-slate-700 focus:outline-none shadow-[inset_4px_4px_8px_#cbd5e0,inset_-4px_-4px_8px_#ffffff] border border-transparent transition-all"
                      value={forgotForm.newPassword}
                      onChange={(e) => setForgotForm({ ...forgotForm, newPassword: e.target.value })}
                      placeholder="At least 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 bg-[#edf2f7] shadow-[2px_2px_4px_#cbd5e0,-2px_-2px_4px_#ffffff] transition-all"
                    >
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-[#edf2f7] hover:bg-white text-slate-700 font-bold py-3.5 rounded-2xl shadow-[6px_6px_12px_#cbd5e0,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-3 text-sm flex items-center justify-center gap-2"
                >
                  <KeyRound size={16} />
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}