'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, RotateCcw, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import ExportExcelButton from '@/components/ExportExcelButton';

// Date Format: 27/Aug/2026
function fmtDate(d) {
  if (!d) return '-';
  const dateObj = new Date(d);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = dateObj.toLocaleString('en-US', { month: 'short' });
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function ExpensePage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', category: '', amount: '', date: '', note: '' });

  // Search, Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/expense').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ])
      .then(([e, c]) => {
        setItems(e.items || []);
        setCategories((c.items || []).filter((x) => x.type === 'expense'));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error('ডাটা লোড করতে ব্যর্থ হয়েছে!');
      });
  };

  useEffect(load, []);

  // Reset Filters logic
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Filter Items Based on Search, Category, and Date Range
  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = item.title?.toLowerCase().includes(query);
    const noteMatch = item.note?.toLowerCase().includes(query);
    const matchesSearch = titleMatch || noteMatch;

    const matchesCategory = selectedCategory ? item.category?._id === selectedCategory : true;

    const itemDate = new Date(item.date).toISOString().slice(0, 10);
    const matchesStartDate = startDate ? itemDate >= startDate : true;
    const matchesEndDate = endDate ? itemDate <= endDate : true;

    return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
  });

  // Calculate Pagination Data based on Filtered Items
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Smart Pagination Generator (shows ... when total pages > 3 or many pages)
  const getPaginationPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage, '...', totalPages);
    }
    return pages;
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', category: '', amount: '', date: new Date().toISOString().slice(0, 10), note: '' });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      category: item.category?._id || '',
      amount: item.amount,
      date: new Date(item.date).toISOString().slice(0, 10),
      note: item.note || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editing ? `/api/expense/${editing._id}` : '/api/expense';
    const method = editing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });

      if (res.ok) {
        toast.success(editing ? 'খরচ আপডেট করা হয়েছে!' : 'নতুন খরচ যোগ করা হয়েছে!');
        setModalOpen(false);
        load();
      } else {
        toast.error('সেভ করতে সমস্যা হয়েছে!');
      }
    } catch (err) {
      toast.error('সার্ভারে সমস্যা হয়েছে!');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('আপনি কি নিশ্চিত এটি ডিলিট করতে চান?')) return;

    try {
      const res = await fetch(`/api/expense/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('খরচের এন্ট্রি ডিলিট করা হয়েছে!');
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
        load();
      } else {
        toast.error('ডিলিট করতে ব্যর্থ হয়েছে!');
      }
    } catch (err) {
      toast.error('সার্ভারে সমস্যা হয়েছে!');
    }
  };

  // Filtered Items Total Amount
  const total = filteredItems.reduce((s, x) => s + x.amount, 0);

  return (
    <div className="space-y-6 font-sans bg-[#edf2f7] min-h-screen p-4 sm:p-6 rounded-3xl">
      {/* Neumorphic Top Welcome / Overview Banner */}
      <div className="bg-[#edf2f7] p-6 rounded-3xl shadow-[9px_9px_16px_#cbd5e0,-9px_-9px_16px_#ffffff] border border-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-700">Expense Dashboard</h1>
          <p className="text-sm text-slate-500">Track, manage and analyze your daily expenses with ease.</p>
        </div>
        <div className="flex items-center gap-4 bg-[#edf2f7] px-5 py-3 rounded-2xl shadow-[inset_4px_4px_8px_#cbd5e0,inset_-4px_-4px_8px_#ffffff]">
          <div className="w-10 h-10 rounded-xl bg-[#edf2f7] shadow-[4px_4px_8px_#cbd5e0,-4px_-4px_8px_#ffffff] flex items-center justify-center text-rose-500">
            <TrendingDown size={20} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Total Expenses</p>
            <h2 className="text-xl font-extrabold font-mono text-slate-700">
              ৳{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(total)}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={openAdd} 
            className="bg-[#edf2f7] hover:bg-white text-slate-700 font-semibold px-6 py-3 rounded-2xl shadow-[6px_6px_12px_#cbd5e0,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff] transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={18} className="text-rose-500" /> Add Expense
          </button>
          <ExportExcelButton resource="expense" />
        </div>
      </div>

      {/* Neumorphic Search & Filter Section */}
      <div className="bg-[#edf2f7] p-5 rounded-3xl shadow-[9px_9px_16px_#cbd5e0,-9px_-9px_16px_#ffffff] space-y-4 border border-white/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search title or note..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-3 bg-[#edf2f7] rounded-2xl text-sm text-slate-700 focus:outline-none shadow-[inset_4px_4px_8px_#cbd5e0,inset_-4px_-4px_8px_#ffffff] border border-transparent focus:border-slate-300 transition-all"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-3 bg-[#edf2f7] rounded-2xl text-sm text-slate-700 focus:outline-none shadow-[inset_4px_4px_8px_#cbd5e0,inset_-4px_-4px_8px_#ffffff] border border-transparent focus:border-slate-300 transition-all"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          {/* Start Date Filter */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-3 bg-[#edf2f7] rounded-2xl text-sm text-slate-700 focus:outline-none shadow-[inset_4px_4px_8px_#cbd5e0,inset_-4px_-4px_8px_#ffffff] border border-transparent focus:border-slate-300 transition-all"
          />

          {/* End Date Filter */}
          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-3 bg-[#edf2f7] rounded-2xl text-sm text-slate-700 focus:outline-none shadow-[inset_4px_4px_8px_#cbd5e0,inset_-4px_-4px_8px_#ffffff] border border-transparent focus:border-slate-300 transition-all"
          />
        </div>

        {/* Reset Filter Button */}
        {(searchQuery || selectedCategory || startDate || endDate) && (
          <div className="flex justify-end pt-1">
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1.5 font-semibold transition-colors px-3 py-1.5 rounded-xl shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff]"
            >
              <RotateCcw size={13} /> Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Neumorphic Expense Table Container */}
      <div className="bg-[#edf2f7] rounded-3xl shadow-[9px_9px_16px_#cbd5e0,-9px_-9px_16px_#ffffff] overflow-hidden border border-white/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#cbd5e0]/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cbd5e0]/30 text-sm">
              {loading && (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400 font-medium">লোড হচ্ছে...</td></tr>
              )}
              {!loading && filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                    {searchQuery || selectedCategory || startDate || endDate ? 'কোনো খরচ পাওয়া যায়নি' : 'কোনো খরচ নেই'}
                  </td>
                </tr>
              )}
              {!loading && currentItems.map((it) => (
                <tr key={it._id} className="hover:bg-[#e2e8f0]/40 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-700">{it.title}</td>
                  <td className="py-4 px-6 text-slate-500">
                    <span className="px-3 py-1 bg-[#edf2f7] shadow-[2px_2px_5px_#cbd5e0,-2px_-2px_5px_#ffffff] text-slate-600 rounded-lg text-xs font-medium">
                      {it.category?.name || '-'}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-rose-500">
                    -৳{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(it.amount)}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-500">{fmtDate(it.date)}</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button 
                      onClick={() => openEdit(it)} 
                      className="p-2 bg-[#edf2f7] hover:bg-white text-slate-600 rounded-xl shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#cbd5e0,inset_-2px_-2px_4px_#ffffff] transition-all inline-flex"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(it._id)} 
                      className="p-2 bg-[#edf2f7] hover:bg-rose-50 text-rose-500 rounded-xl shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#cbd5e0,inset_-2px_-2px_4px_#ffffff] transition-all inline-flex"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls with Smart Ellipsis (...) */}
        {!loading && filteredItems.length > itemsPerPage && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#cbd5e0]/50 bg-[#edf2f7]">
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-mono text-slate-700">{indexOfFirstItem + 1}</span> to <span className="font-mono text-slate-700">{Math.min(indexOfLastItem, filteredItems.length)}</span> of <span className="font-mono text-slate-700">{filteredItems.length}</span> entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-[#edf2f7] shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-slate-600 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              
              {getPaginationPages().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-slate-400 font-mono text-xs">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 text-xs font-mono rounded-xl transition-all ${
                      currentPage === page 
                        ? 'bg-[#edf2f7] text-rose-500 font-bold shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff]' 
                        : 'bg-[#edf2f7] text-slate-600 shadow-[3px_3px_6px_#cbd5e0,-3px_-3px_6px_#ffffff] hover:bg-white'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}

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

      {/* Modal Container */}
      {modalOpen && (
        <Modal title={editing ? 'Edit Expense' : 'Add Expense'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">শিরোনাম</label>
              <input required className="mt-1.5 w-full bg-[#edf2f7] rounded-2xl px-4 py-3 text-sm text-slate-700 focus:outline-none shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff] border border-transparent transition-all" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">ক্যাটাগরি</label>
              <select className="mt-1.5 w-full bg-[#edf2f7] rounded-2xl px-4 py-3 text-sm text-slate-700 focus:outline-none shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff] border border-transparent transition-all" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">-- নির্বাচন করুন --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">পরিমাণ (৳)</label>
              <input required type="number" min="0" step="0.01" className="mt-1.5 w-full bg-[#edf2f7] rounded-2xl px-4 py-3 text-sm font-mono text-slate-700 focus:outline-none shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff] border border-transparent transition-all" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">তারিখ</label>
              <input required type="date" className="mt-1.5 w-full bg-[#edf2f7] rounded-2xl px-4 py-3 text-sm font-mono text-slate-700 focus:outline-none shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff] border border-transparent transition-all" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">নোট (ঐচ্ছিক)</label>
              <input className="mt-1.5 w-full bg-[#edf2f7] rounded-2xl px-4 py-3 text-sm text-slate-700 focus:outline-none shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff] border border-transparent transition-all" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </div>
            <button type="submit" className="w-full bg-[#edf2f7] hover:bg-white text-slate-700 font-semibold py-3.5 rounded-2xl shadow-[5px_5px_10px_#cbd5e0,-5px_-5px_10px_#ffffff] active:shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff] transition-all mt-2 text-sm">Save Expense</button>
          </form>
        </Modal>
      )}
    </div>
  );
}