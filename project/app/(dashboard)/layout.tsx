'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import DashboardSidebar from '@/components/dashboard/dashboard-sidebar';
import DashboardHeader from '@/components/dashboard/dashboard-header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  let userRole: 'admin' | 'doctor' | 'patient' = 'patient';
  
  if (pathname.includes('/admin')) {
    userRole = 'admin';
  } else if (pathname.includes('/doctor')) {
    userRole = 'doctor';
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        userRole={userRole}
      />
      
      <div className={cn("flex flex-col min-h-screen", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        <DashboardHeader 
          onMenuButtonClick={() => setSidebarOpen(!sidebarOpen)} 
          userRole={userRole}
        />
        <main className="flex-1 p-4 md:p-6 pt-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}