'use client';
import { useRouter } from 'next/navigation';
import { Menu, LogOut, User } from 'lucide-react';

export default function Topbar({ user, onMenuClick }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 bg-[#edf2f7] border-b border-[#cbd5e0]/50 px-4 lg:px-8 py-4 flex items-center justify-between font-sans shadow-[0_4px_12px_#cbd5e0]">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={onMenuClick} 
        className="lg:hidden p-2.5 rounded-2xl bg-[#edf2f7] shadow-[4px_4px_8px_#cbd5e0,-4px_-4px_8px_#ffffff] hover:bg-white text-slate-500 hover:text-slate-700 transition-all active:shadow-[inset_2px_2px_4px_#cbd5e0,inset_-2px_-2px_4px_#ffffff]"
        title="Toggle Menu"
      >
        <Menu size={20} />
      </button>

      {/* Desktop Welcome Message */}
      <div className="hidden lg:block text-sm font-semibold text-slate-500 tracking-wide">
        Welcome back 👋
      </div>

      {/* User Info & Actions Section */}
      <div className="flex items-center gap-4">
        {/* User Name & Role */}
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-700 leading-tight">{user?.name}</p>
          <p className="text-xs font-semibold text-slate-400 leading-tight capitalize mt-0.5">{user?.role}</p>
        </div>

        {/* Neumorphic User Avatar */}
        <div className="w-10 h-10 rounded-2xl bg-[#edf2f7] text-blue-600 shadow-[4px_4px_8px_#cbd5e0,-4px_-4px_8px_#ffffff] flex items-center justify-center font-bold">
          <User size={18} />
        </div>

        {/* Neumorphic Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-rose-500 bg-[#edf2f7] rounded-2xl px-4 py-2.5 shadow-[4px_4px_8px_#cbd5e0,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#cbd5e0,inset_-2px_-2px_4px_#ffffff] transition-all"
          title="Logout"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}