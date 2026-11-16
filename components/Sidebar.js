'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ListTree,
  Wallet,
  ReceiptText,
  HandCoins,
  KeyRound,
  Users,
  X,
} from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/categories', label: 'Categories', icon: ListTree },
  { href: '/dashboard/salary', label: 'Salary', icon: Wallet },
  { href: '/dashboard/expense', label: 'Expense', icon: ReceiptText },
  { href: '/dashboard/lending', label: 'Lending', icon: HandCoins },
  { href: '/dashboard/vault', label: 'Passwords', icon: KeyRound },
];

export default function Sidebar({ role, open, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-30 lg:hidden transition-all" onClick={onClose} />
      )}
      <aside
        className={`fixed z-40 lg:z-0 top-0 left-0 h-full w-72 bg-[#edf2f7] border-r border-[#cbd5e0]/50 shadow-[6px_0px_16px_#cbd5e0] lg:shadow-none transform transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:translate-x-0 flex flex-col font-sans`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3 text-slate-700 font-extrabold text-lg">
            <div className="w-10 h-10 rounded-2xl bg-[#edf2f7] shadow-[4px_4px_8px_#cbd5e0,-4px_-4px_8px_#ffffff] flex items-center justify-center text-blue-500">
              <Wallet size={20} />
            </div>
            <span>My Finance</span>
          </div>
          <button 
            onClick={onClose} 
            className="lg:hidden p-2 rounded-xl bg-[#edf2f7] shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff] hover:bg-white text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="px-4 space-y-2 flex-1 overflow-y-auto py-2">
          <p className="text-[11px] uppercase text-slate-400 font-bold px-4 mb-2 tracking-wider">Menu</p>
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-[#edf2f7] text-blue-600 shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff]'
                    : 'text-slate-600 hover:text-slate-800 bg-[#edf2f7] shadow-[4px_4px_8px_#cbd5e0,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#cbd5e0,-2px_-2px_4px_#ffffff]'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${active ? 'text-blue-600 bg-[#edf2f7] shadow-[inset_2px_2px_4px_#cbd5e0,inset_-2px_-2px_4px_#ffffff]' : 'text-slate-500 bg-[#edf2f7] shadow-[2px_2px_4px_#cbd5e0,-2px_-2px_4px_#ffffff]'}`}>
                  <Icon size={16} />
                </div>
                <span>{label}</span>
              </Link>
            );
          })}

          {role === 'admin' && (
            <>
              <p className="text-[11px] uppercase text-slate-400 font-bold px-4 mb-2 mt-6 tracking-wider">Admin</p>
              <Link
                href="/dashboard/admin"
                onClick={onClose}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  pathname === '/dashboard/admin'
                    ? 'bg-[#edf2f7] text-blue-600 shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff]'
                    : 'text-slate-600 hover:text-slate-800 bg-[#edf2f7] shadow-[4px_4px_8px_#cbd5e0,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#cbd5e0,-2px_-2px_4px_#ffffff]'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${pathname === '/dashboard/admin' ? 'text-blue-600 bg-[#edf2f7] shadow-[inset_2px_2px_4px_#cbd5e0,inset_-2px_-2px_4px_#ffffff]' : 'text-slate-500 bg-[#edf2f7] shadow-[2px_2px_4px_#cbd5e0,-2px_-2px_4px_#ffffff]'}`}>
                  <Users size={16} />
                </div>
                <span>Manage Users</span>
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}