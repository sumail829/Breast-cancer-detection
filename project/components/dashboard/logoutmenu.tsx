'use client';

import { LogOut } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function LogoutMenuItem() {
  const { logout, role } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout(); // clear context + localStorage

    // redirect to login
    switch (role) {
      case 'admin':
        router.push('/login');
        break;
      case 'doctor':
        router.push('/login');
        break;
      case 'patient':
        router.push('/login');
        break;
      default:
        router.push('/login');
    }
  };

  return (
    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  );
}
