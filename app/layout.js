import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Finance Dashboard',
  description: 'Personal finance & expense management dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-[#edf2f7] text-slate-700 min-h-screen font-sans">
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}