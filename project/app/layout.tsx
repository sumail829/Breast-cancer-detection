import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AdminDataProvider } from './context/AdminDataContext';
// import { DoctorAuthProvider } from './context/DoctorDataContext';
import { AuthProvider } from './context/AuthContext';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HealthAsist Pro | Modern Healthcare Management',
  description: 'A comprehensive hospital management system for administrators, doctors, and patients',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
           {/* <DoctorAuthProvider> ✅ Wrap globally */}
            <AdminDataProvider>
              {children}
            </AdminDataProvider>
          {/* </DoctorAuthProvider> */}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}