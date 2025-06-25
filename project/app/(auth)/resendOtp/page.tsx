'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

type UserRole = 'doctor' | 'patient' | 'admin';

export default function ResendOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const possibleRoles: UserRole[] = ['doctor', 'patient', 'admin'];
      let found = false;

      for (const r of possibleRoles) {
        const storedEmail = localStorage.getItem(`${r}Email`);
        if (storedEmail) {
          setEmail(storedEmail);
          setRole(r);
          found = true;
          break;
        }
      }

      if (!found) {
        alert('No login info found. Please login again.');
        router.push('/login');
      }

      setLoading(false);
    }
  }, [router]);

  const handleResendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let endpoint = '';
      switch (role) {
        case 'doctor':
          endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctor/resend-otp`;
          break;
        case 'patient':
          endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/resend-otp`;
          break;
        case 'admin':
          endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/resend-otp`;
          break;
        default:
          throw new Error('Invalid role for OTP resend');
      }

      await axios.post(endpoint, { email });

      router.push('/verifyOtp');
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to resend OTP');
    }
  };

  if (loading) return null; // Or you can show a spinner here

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4 shadow-md">
        <CardHeader>
          <CardTitle>Resend OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResendOtp} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={role}
                readOnly
                className="bg-gray-100 capitalize cursor-not-allowed"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <Button type="submit" className="mt-4 w-full">
              Resend OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
