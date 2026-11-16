'use client';
import { useState } from 'react';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

// Shared Excel download button for every list page.
// resource: vault | categories | salary | expense | lending | users
// confirmMessage (optional): shown in a confirm() first — used on the
// vault page only, because it downloads all passwords to a file.
export default function ExportExcelButton({ resource, confirmMessage }) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (confirmMessage && !confirm(confirmMessage)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/export?resource=${resource}`);
      if (!res.ok) {
        let msg = 'এক্সেল ডাউনলোড করতে সমস্যা হয়েছে!';
        try {
          const d = await res.json();
          if (d?.error) msg = d.error;
        } catch (e) {}
        toast.error(msg);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Filename comes from the server's Content-Disposition header.
      const cd = res.headers.get('Content-Disposition') || '';
      const m = /filename="([^"]+)"/.exec(cd);
      a.download = m ? m[1] : `${resource}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('এক্সেল ফাইল ডাউনলোড হয়েছে!');
    } catch (err) {
      toast.error('সার্ভারে সমস্যা হয়েছে!');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className="w-full sm:w-auto bg-[#edf2f7] hover:bg-white text-slate-700 font-semibold px-6 py-3.5 rounded-2xl shadow-[6px_6px_12px_#cbd5e0,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_#cbd5e0,inset_-3px_-3px_6px_#ffffff] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download size={18} className="text-emerald-600" />{' '}
      {busy ? 'ডাউনলোড হচ্ছে...' : 'Download Excel'}
    </button>
  );
}
