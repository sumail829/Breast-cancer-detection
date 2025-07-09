'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, Bell, Search, LogOut, Settings, User } from 'lucide-react';
import { ModeToggle } from '@/components/theme-toggle';
import { UserRole } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';

interface DashboardHeaderProps {
  onMenuButtonClick: () => void;
  userRole: UserRole;
}

type Notification = {
  _id: string;
  message: string;
  createdAt: string;
  // any other fields you expect
};


export default function DashboardHeader({ onMenuButtonClick, userRole }: DashboardHeaderProps) {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  if (!user || !user._id || !user.role) return;

  const fetchNotifications = async () => {
    try {
      let url = "";

      if (user.role === 'doctor') {
        url = `http://localhost:4000/api/notification/${user._id}`;
      } else if (user.role === 'patient') {
        url = `http://localhost:4000/api/notification/patient/${user._id}`;
      } else {
        return; // ⛔ Admin has no notifications (for now)
      }

      const res = await axios.get(url);
      setNotifications(res.data.notifications);
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  };

  fetchNotifications();
}, []);

  const handleLogout = () => {
    // In a real app, you would handle actual logout logic here
    logout(); // clear context + localStorage

    // redirect to login
    switch (role) {
      case 'admin':
        router.push('/admin/login');
        break;
      case 'doctor':
        router.push('/doctor/login');
        break;
      case 'patient':
        router.push('/patient/login');
        break;
      default:
        router.push('/login');
    }
    router.push('/login');
  };

  const userName = userRole === 'admin'
    ? 'Admin User'
    : userRole === 'doctor'
      ? 'Dr. Johnson'
      : 'Patient Smith';

  return (
    <header className="sticky top-0 z-30 bg-background border-b">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onMenuButtonClick} className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <div className="hidden md:flex ml-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <ModeToggle />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification._id} className="cursor-pointer py-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-center text-sm text-blue-600">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 rounded-full" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="@user" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}