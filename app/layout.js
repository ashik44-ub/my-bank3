import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Finance Dashboard',
  description: 'Personal finance & expense management dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Adsterra Popunder — my-bank3.vercel.app */}
        <script data-cfasync="false" src="https://abscloud.org/1/0c26bc2a7910e84bdffa12a5382361fa"></script>
      </head>
      <body suppressHydrationWarning className="bg-[#edf2f7] text-slate-700 min-h-screen font-sans">
        {children}
        <Toaster position="top-right" reverseOrder={false} />
        {/* Adsterra Social Bar — my-bank3.vercel.app */}
        <script data-cfasync="false" src="https://bauval.org/14/4c4c7656c5d2a62ef101011568adbbbb"></script>
      </body>
    </html>
  );
}