'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { UserRole } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  UserCog,
  CalendarDays,
  Activity,
  ClipboardList,
  FileText,
  X,
  Heart,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
}

export default function DashboardSidebar({ isOpen, onClose, userRole }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const adminNavItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'Doctors',
      href: '/admin/doctors',
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      title: 'Patients',
      href: '/admin/patients',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Appointments',
      href: '/admin/appointments',
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      title: 'Predictions',
      href: '/admin/predictions',
      icon: <Activity className="h-5 w-5" />,
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const doctorNavItems = [
    {
      title: 'Dashboard',
      href: '/doctor/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'My Patients',
      href: '/doctor/patients',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Appointments',
      href: '/doctor/appointments',
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      title: 'Cancer Detection',
      href: '/doctor/cancer-detection',
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: 'Prediction History',
      href: '/doctor/predictions',
      icon: <Activity className="h-5 w-5" />,
    },
    {
      title: 'Settings',
      href: '/doctor/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const patientNavItems = [
    {
      title: 'Dashboard',
      href: '/patient/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'My Doctor',
      href: '/patient/doctor',
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      title: 'Appointments',
      href: '/patient/appointments',
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      title: 'Medical History',
      href: '/patient/medical-history',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Test Results',
      href: '/patient/test-results',
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: 'Settings',
      href: '/patient/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const navItems = userRole === 'admin' 
    ? adminNavItems 
    : userRole === 'doctor' 
      ? doctorNavItems 
      : patientNavItems;

  const sidebar = (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4">
        <Link href={`/${userRole}/dashboard`} className="flex items-center gap-2 font-semibold">
          <Heart className="h-6 w-6 text-blue-600" />
          <span>Hospital Pro</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-3 lg:hidden"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent',
                pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground">
          <HelpCircle className="h-5 w-5" />
          <span>Help & Support</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 hidden transform transition-transform duration-200 ease-in-out lg:block",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full bg-background border-r">
          {sidebar}
        </div>
      </aside>

      {/* For mobile view - Slide-over */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-64">
          {sidebar}
        </SheetContent>
      </Sheet>
    </>
  );
}