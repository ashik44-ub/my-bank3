'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Copy, Search, X, ChevronLeft, ChevronRight, KeyRound, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import ExportExcelButton from '@/components/ExportExcelButton';

export default function VaultPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [visible, setVisible] = useState({});
  const [form, setForm] = useState({ siteName: '', username: '', password: '', note: '' });

  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 10;

  const load = () => {
    setLoading(true);
    fetch('/api/vault')
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error('ডাটা লোড করতে ব্যর্থ হয়েছে');
      });
  };

  useEffect(load, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ siteName: '', username: '', password: '', note: '' });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ siteName: item.siteName, username: item.username, password: '', note: item.note || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editing ? `/api/vault/${editing._id}` : '/api/vault';
    const method = editing ? 'PUT' : 'POST';

    try {
      let res;
      if (editing && !form.password) {
        const { password, ...rest } = form;
        res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rest) });
      } else {
        res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      }

      if (res.ok) {
        toast.success(editing ? 'পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!' : 'নতুন পাসওয়ার্ড যোগ করা হয়েছে!');
        setModalOpen(false);
        load();
      } else {
        toast.error('সংরক্ষণে সমস্যা হয়েছে!');
      }
    } catch (err) {
      toast.error('সার্ভারে সমস্যা হয়েছে!');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('আপনি কি নিশ্চিত এটি ডিলিট করতে চান?')) return;
    
    try {
      const res = await fetch(`/api/vault/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('পাসওয়ার্ড সফলভাবে ডিলিট করা হয়েছে!');
        if (paginatedItems.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
        load();
      } else {
        toast.error('ডিলিট করা সম্ভব হয়নি!');
      }
    } catch (err) {
      toast.error('সার্ভারে সমস্যা হয়েছে!');
    }
  };

  const toggleVisible = (id) => setVisible((v) => ({ ...v, [id]: !v[id] }));

  const copy = (text, type = 'তথ্য') => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} কপি করা হয়েছে!`);
  };

  const filteredItems = items.filter((it) => {
    const q = searchQuery.toLowerCase();
    return (
      it.siteName?.toLowerCase().includes(q) ||
      it.username?.toLowerCase().includes(q) ||
      it.note?.toLowerCase().includes(q)
    );
  });

  // Pagination logic based on filtered items
  const totalPages = Math.ceil(filteredItems.length / limit) || 1;
  const paginatedItems = filteredItems.slice((page - 1) * limit, page * limit);

  const handleResetFilters = () => {
    setSearchQuery('');
    setPage(1);
  };

  return (
    <div className="space-y-6 font-sans bg-[#edf2f7] min-h-screen p-4 sm:p-6 rounded-3xl">
      {/* Neumorphic Top Welcome / Overview Banner */}
      <div className="bg-[#edf2f7] p-6 rounded-3xl shadow-[9px_9px_16px_#cbd5e0,-9px_-9px_16px_#ffffff] border border-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-700">Password Manager</h1>
          <p className="text-sm text-slate-500">সব পাসওয়ার্ড এনক্রিপ্টেড অবস্থায় সংরক্ষিত থাকে</p>
        </div>

        <div className="flex items-center gap-4 bg-[#edf2f7] px-5 py-3 rounded-2xl shadow-[inset_4px_4px_8px_#cbd5e0,inset_-4px_-4px_8px_#ffffff]">
          <div className="w-10 h-10 rounded-xl bg-[#edf2f7] shadow-[4px_4px_8px_#cbd5e0,-4px_-4px_8px_#ffffff] flex items-center justify-center text-blue-500">
            <KeyRound size={20} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Total Passwords</p>
            <h2 className="text-xl font-extrabold font-mono text-slate-700">{items.length}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={openAdd} 
            className="w-full sm:w-auto bg-[#edf2f7] hover:bg-white text-slate-700 font-semibold px-6 py-3.5 rounded-2xl shadow-[6px_6px_12px_#cbd5e0,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff] transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={18} className="text-blue-500" /> Add Password
          </button>
          <ExportExcelButton
            resource="vault"
            confirmMessage="সব পাসওয়ার্ড এক্সেল ফাইলে ডাউনলোড হবে — ফাইলটি নিরাপদ জায়গায় রাখবেন। চালিয়ে যাবেন?"
          />
        </div>
      </div>

      {/* Neumorphic Search Section */}
      <div className="bg-[#edf2f7] p-5 rounded-3xl shadow-[9px_9px_16px_#cbd5e0,-9px_-9px_16px_#ffffff] space-y-4 border border-white/50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search vault..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-11 pr-10 py-3.5 bg-[#edf2f7] rounded-2xl text-sm text-slate-700 focus:outline-none shadow-[inset_4px_4px_8px_#cbd5e0,inset_-4px_-4px_8px_#ffffff] border border-transparent focus:border-slate-300 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPage(1);
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
                <th className="py-4 px-6">Site / App</th>
                <th className="py-4 px-6">Username</th>
                <th className="py-4 px-6">Password</th>
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
                    {searchQuery ? 'কোনো পাসওয়ার্ড খুঁজে পাওয়া যায়নি' : 'কোনো পাসওয়ার্ড সংরক্ষিত নেই'}
                  </td>
                </tr>
              )}
              {!loading && paginatedItems.map((it) => (
                <tr key={it._id} className="hover:bg-[#e2e8f0]/40 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-700">{it.siteName}</td>
                  <td className="py-4 px-6 text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      {it.username}
                      <button 
                        onClick={() => copy(it.username, 'ইউজারনেম')} 
                        className="p-1.5 bg-[#edf2f7] hover:bg-white text-slate-400 hover:text-blue-500 rounded-lg shadow-[2px_2px_4px_#cbd5e0,-2px_-2px_4px_#ffffff] transition-all"
                        title="Copy Username"
                      >
                        <Copy size={13} />
                      </button>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <span className="inline-flex items-center gap-2 font-mono text-xs">
                      {visible[it._id] ? (it.password ?? 'ডিক্রিপ্ট করা যায়নি — ভুল key') : '••••••••'}
                      <button 
                        onClick={() => toggleVisible(it._id)} 
                        className="p-1.5 bg-[#edf2f7] hover:bg-white text-slate-400 hover:text-blue-500 rounded-lg shadow-[2px_2px_4px_#cbd5e0,-2px_-2px_4px_#ffffff] transition-all"
                        title={visible[it._id] ? 'Hide Password' : 'Show Password'}
                      >
                        {visible[it._id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button 
                        onClick={() => copy(it.password, 'পাসওয়ার্ড')} 
                        className="p-1.5 bg-[#edf2f7] hover:bg-white text-slate-400 hover:text-blue-500 rounded-lg shadow-[2px_2px_4px_#cbd5e0,-2px_-2px_4px_#ffffff] transition-all"
                        title="Copy Password"
                      >
                        <Copy size={13} />
                      </button>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button 
                      onClick={() => openEdit(it)} 
                      className="p-2 bg-[#edf2f7] hover:bg-white text-slate-600 rounded-xl shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#cbd5e0,inset_-2px_-2px_4px_#ffffff] transition-all inline-flex"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(it._id)} 
                      className="p-2 bg-[#edf2f7] hover:bg-rose-50 text-rose-500 rounded-xl shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#cbd5e0,inset_-2px_-2px_4px_#ffffff] transition-all inline-flex"
                      title="Delete"
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
              মোট <span className="font-mono text-slate-700">{filteredItems.length}</span> টির মধ্যে{' '}
              <span className="font-mono text-slate-700">{(page - 1) * limit + 1}</span>-
              <span className="font-mono text-slate-700">{Math.min(page * limit, filteredItems.length)}</span> দেখানো হচ্ছে
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-[#edf2f7] shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-slate-600 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[#edf2f7] text-slate-700 shadow-[inset_2px_2px_4px_#cbd5e0,inset_-2px_-2px_4px_#ffffff]">
                {page} / {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 rounded-xl bg-[#edf2f7] shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-slate-600 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Neumorphic Modal Container */}
      {modalOpen && (
        <Modal title={editing ? 'Edit Password' : 'Add Password'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">সাইট / অ্যাপের নাম</label>
              <input 
                required 
                className="mt-1.5 w-full bg-[#edf2f7] rounded-2xl px-4 py-3.5 text-sm text-slate-700 focus:outline-none shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff] border border-transparent transition-all" 
                value={form.siteName} 
                onChange={(e) => setForm({ ...form, siteName: e.target.value })} 
                placeholder="Site or App name..."
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">ইউজারনেম / ইমেইল</label>
              <input 
                required 
                className="mt-1.5 w-full bg-[#edf2f7] rounded-2xl px-4 py-3.5 text-sm text-slate-700 focus:outline-none shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff] border border-transparent transition-all" 
                value={form.username} 
                onChange={(e) => setForm({ ...form, username: e.target.value })} 
                placeholder="Username or Email..."
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                পাসওয়ার্ড {editing && <span className="text-slate-400 font-normal normal-case">(খালি রাখলে আগেরটাই থাকবে)</span>}
              </label>
              <input 
                type="text" 
                className="mt-1.5 w-full bg-[#edf2f7] rounded-2xl px-4 py-3.5 text-sm text-slate-700 focus:outline-none shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff] border border-transparent transition-all" 
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                placeholder={editing ? '••••••••' : 'Enter password...'} 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">নোট (ঐচ্ছিক)</label>
              <input 
                className="mt-1.5 w-full bg-[#edf2f7] rounded-2xl px-4 py-3.5 text-sm text-slate-700 focus:outline-none shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff] border border-transparent transition-all" 
                value={form.note} 
                onChange={(e) => setForm({ ...form, note: e.target.value })} 
                placeholder="Add note..."
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#edf2f7] hover:bg-white text-slate-700 font-semibold py-3.5 rounded-2xl shadow-[5px_5px_10px_#cbd5e0,-5px_-5px_10px_#ffffff] active:shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff] transition-all mt-2 text-sm"
            >
              Save
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}