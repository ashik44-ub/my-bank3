'use client';
import { useEffect, useState } from 'react';
import { Trash2, ShieldCheck, Users, Search, RotateCcw, ChevronLeft, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ExportExcelButton from '@/components/ExportExcelButton';

export default function AdminUsersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);

  // Search & Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/users').then((r) => r.json()),
      fetch('/api/auth/me').then((r) => r.json()),
    ])
      .then(([u, m]) => {
        setItems(u.items || []);
        setMe(m.user);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error('ডাটা লোড করতে ব্যর্থ হয়েছে!');
      });
  };

  useEffect(load, []);

  // Filter Items based on Search Query (Searches in Name & Email)
  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = item.name?.toLowerCase().includes(query);
    const emailMatch = item.email?.toLowerCase().includes(query);
    return nameMatch || emailMatch;
  });

  // Calculate Pagination Data
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const changeRole = async (id, role) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        toast.success('ইউজারের রোল আপডেট করা হয়েছে!');
        load();
      } else {
        toast.error('রোল আপডেট করতে সমস্যা হয়েছে!');
      }
    } catch (err) {
      toast.error('সার্ভারে সমস্যা হয়েছে!');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('আপনি কি নিশ্চিত এই ইউজার ডিলিট করতে চান?')) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('ইউজার ডিলিট করা হয়েছে!');
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
        load();
      } else {
        const d = await res.json();
        toast.error(d.error || 'ডিলিট করতে ব্যর্থ হয়েছে!');
      }
    } catch (err) {
      toast.error('সার্ভারে সমস্যা হয়েছে!');
    }
  };

  return (
    <div className="space-y-6 font-sans bg-[#edf2f7] min-h-screen p-4 sm:p-6 rounded-3xl">
      {/* Neumorphic Top Welcome / Overview Banner */}
      <div className="bg-[#edf2f7] p-6 rounded-3xl shadow-[9px_9px_16px_#cbd5e0,-9px_-9px_16px_#ffffff] border border-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-700">Manage Users</h1>
          <p className="text-sm text-slate-500">সব রেজিস্টার করা ইউজারদের রোল ও অ্যাক্সেস ম্যানেজ করুন</p>
        </div>

        <div className="flex items-center gap-4 bg-[#edf2f7] px-5 py-3 rounded-2xl shadow-[inset_4px_4px_8px_#cbd5e0,inset_-4px_-4px_8px_#ffffff]">
          <div className="w-10 h-10 rounded-xl bg-[#edf2f7] shadow-[4px_4px_8px_#cbd5e0,-4px_-4px_8px_#ffffff] flex items-center justify-center text-blue-500">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Total Users</p>
            <h2 className="text-xl font-extrabold font-mono text-slate-700">{items.length}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ExportExcelButton resource="users" />
        </div>
      </div>

      {/* Neumorphic Search Section */}
      <div className="bg-[#edf2f7] p-5 rounded-3xl shadow-[9px_9px_16px_#cbd5e0,-9px_-9px_16px_#ffffff] space-y-4 border border-white/50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search name or email..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-11 pr-10 py-3.5 bg-[#edf2f7] rounded-2xl text-sm text-slate-700 focus:outline-none shadow-[inset_4px_4px_8px_#cbd5e0,inset_-4px_-4px_8px_#ffffff] border border-transparent focus:border-slate-300 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 bg-[#edf2f7] shadow-[2px_2px_4px_#cbd5e0,-2px_-2px_4px_#ffffff] transition-all"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {searchQuery && (
          <div className="flex justify-end pt-1">
            <button
              onClick={handleResetFilters}
              className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1.5 font-semibold transition-colors px-3 py-1.5 rounded-xl shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff]"
            >
              <RotateCcw size={13} /> Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Neumorphic Table Container */}
      <div className="bg-[#edf2f7] rounded-3xl shadow-[9px_9px_16px_#cbd5e0,-9px_-9px_16px_#ffffff] overflow-hidden border border-white/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#cbd5e0]/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cbd5e0]/30 text-sm">
              {loading && (
                <tr><td colSpan={4} className="text-center py-10 text-slate-400 font-medium">লোড হচ্ছে...</td></tr>
              )}
              {!loading && filteredItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400 font-medium">
                    {searchQuery ? 'কোনো ইউজার খুঁজে পাওয়া যায়নি' : 'কোনো ইউজার পাওয়া যায়নি'}
                  </td>
                </tr>
              )}
              {!loading && currentItems.map((u) => (
                <tr key={u._id} className="hover:bg-[#e2e8f0]/40 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-700 flex items-center gap-2">
                    {u.name}
                    {u.role === 'admin' && <ShieldCheck size={16} className="text-blue-500" />}
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-xs">{u.email}</td>
                  <td className="py-4 px-6">
                    <select
                      className="bg-[#edf2f7] rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none shadow-[inset_2px_2px_4px_#cbd5e0,inset_-2px_-2px_4px_#ffffff] border border-transparent disabled:opacity-50 transition-all cursor-pointer"
                      value={u.role}
                      disabled={u._id === me?.id}
                      onChange={(e) => changeRole(u._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(u._id)}
                      disabled={u._id === me?.id}
                      className="p-2 bg-[#edf2f7] hover:bg-rose-50 text-rose-500 rounded-xl shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#cbd5e0,inset_-2px_-2px_4px_#ffffff] disabled:opacity-30 disabled:cursor-not-allowed transition-all inline-flex"
                      title="Delete User"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination UI Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#cbd5e0]/50 bg-[#edf2f7]">
            <div className="text-xs text-slate-500 font-medium">
              মোট <span className="font-mono text-slate-700">{filteredItems.length}</span> জনের মধ্যে{' '}
              <span className="font-mono text-slate-700">{indexOfFirstItem + 1}</span>-
              <span className="font-mono text-slate-700">{Math.min(indexOfLastItem, filteredItems.length)}</span> দেখানো হচ্ছে
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-[#edf2f7] shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-slate-600 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[#edf2f7] text-slate-700 shadow-[inset_2px_2px_4px_#cbd5e0,inset_-2px_-2px_4px_#ffffff]">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-[#edf2f7] shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-slate-600 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}