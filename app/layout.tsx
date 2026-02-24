// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';
// import { AuthProvider } from '@/context/AuthContext';
// import { Toaster } from 'react-hot-toast';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Operations Management Portal',
//   description: 'Manage operational projects and track performance',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <AuthProvider>
//           {children}
//           <Toaster position="top-right" />
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }










import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Operations Management Portal',
  description: 'Manage operational projects and track performance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            {children}
            <Toaster position="top-right" />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}